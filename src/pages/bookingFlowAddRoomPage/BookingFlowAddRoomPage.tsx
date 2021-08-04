import React, { useEffect, useState } from 'react';
import './BookingFlowAddRoomPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import moment from 'moment';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import DestinationService from '../../services/destination/destination.service';
import serviceFactory from '../../services/serviceFactory';
import rsToasts from '@bit/redsky.framework.toast';
import { formatFilterDateForServer } from '../../utils/utils';
import FilterBar from '../../components/filterBar/FilterBar';
import RateCodeSelect from '../../components/rateCodeSelect/RateCodeSelect';
import Accordion from '@bit/redsky.framework.rs.accordion';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import AccommodationSearchResultCard from '../../components/accommodationSearchResultCard/AccommodationSearchResultCard';
import FilterReservationPopup, {
	FilterReservationPopupProps
} from '../../popups/filterReservationPopup/FilterReservationPopup';
import IconLabel from '../../components/iconLabel/IconLabel';
import AccommodationService from '../../services/accommodation/accommodation.service';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';

const BookingFlowAddRoomPage = () => {
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);

	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const perPage = 5;
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(5);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [destinations, setDestinations] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [searchQueryObj, setSearchQueryObj] = useState<Api.Accommodation.Req.Availability>({
		startDate: moment(params.data.stays[0].arrivalDate).format('YYYY-MM-DD'),
		endDate: moment(params.data.stays[0].departureDate).format('YYYY-MM-DD'),
		adults: params.data.stays[0].adults,
		children: params.data.stays[0].children,
		pagination: { page: 1, perPage: 5 },
		destinationId: params.data.destinationId,
		rateCode: params.data.stays[0].rateCode
	});
	const [rateCode, setRateCode] = useState<string>(params.data.stays[0].rateCode);
	const [validCode, setValidCode] = useState<boolean>(true);
	const [editingAccommodation, setEditingAccommodation] = useState<Api.Accommodation.Res.Details>();

	useEffect(() => {
		async function checkForEdit() {
			if (params.data.edit) {
				let result = await accommodationService.getAccommodationDetails(params.data.edit.id);
				setEditingAccommodation(result.data.data);
			}
		}
		checkForEdit().catch(console.error);
	}, []);

	useEffect(() => {
		async function getReservations() {
			let newSearchQueryObj = { ...searchQueryObj };
			if (
				(!!newSearchQueryObj.priceRangeMin || newSearchQueryObj.priceRangeMin === 0) &&
				(!!newSearchQueryObj.priceRangeMax || newSearchQueryObj.priceRangeMax === 0)
			) {
				newSearchQueryObj.priceRangeMax *= 100;
				newSearchQueryObj.priceRangeMin *= 100;
			}

			try {
				popupController.open(SpinningLoaderPopup);
				if (newSearchQueryObj.rateCode === '' || newSearchQueryObj.rateCode === undefined)
					delete newSearchQueryObj.rateCode;
				let res = await destinationService.searchAvailableAccommodationsByDestination(newSearchQueryObj);
				setAvailabilityTotal(res.total || 0);
				setDestinations(res.data);
				setValidCode(rateCode === '' || res.data.length > 0);
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToasts.error('An unexpected error has occurred on the server.');
				setValidCode(rateCode === '' || rateCode === undefined);
				popupController.close(SpinningLoaderPopup);
			}
		}
		getReservations().catch(console.error);
	}, [searchQueryObj]);

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		updateSearchQueryObj('startDate', formatFilterDateForServer(startDate, 'start'));
		updateSearchQueryObj('endDate', formatFilterDateForServer(endDate, 'end'));
	}

	function updateSearchQueryObj(
		key:
			| 'startDate'
			| 'endDate'
			| 'adults'
			| 'children'
			| 'priceRangeMin'
			| 'priceRangeMax'
			| 'pagination'
			| 'rateCode',
		value: any
	) {
		if (key === 'adults' && value === 0) throw rsToasts.error('There must be at least one adult.');
		if (key === 'adults' && isNaN(value)) throw rsToasts.error('# of adults must be a number');
		if (key === 'children' && isNaN(value)) throw rsToasts.error('# of children must be a number');
		if (key === 'priceRangeMin' && isNaN(value)) throw rsToasts.error('Price min must be a number');
		if (key === 'priceRangeMax' && isNaN(value)) throw rsToasts.error('Price max must be a number');
		setSearchQueryObj((prev) => {
			let createSearchQueryObj: any = { ...prev };
			if (value === '' || value === undefined) delete createSearchQueryObj[key];
			else createSearchQueryObj[key] = value;
			return createSearchQueryObj;
		});
	}

	function popupSearch(
		checkinDate: moment.Moment | null,
		checkoutDate: moment.Moment | null,
		adults: string,
		children: string,
		priceRangeMin: string,
		priceRangeMax: string,
		rateCode: string
	) {
		setSearchQueryObj((prev) => {
			let createSearchQueryObj: any = { ...prev };
			createSearchQueryObj['startDate'] = formatFilterDateForServer(checkinDate, 'start');
			createSearchQueryObj['endDate'] = formatFilterDateForServer(checkoutDate, 'end');
			createSearchQueryObj['adults'] = parseInt(adults);
			if (children !== '') {
				createSearchQueryObj['children'] = parseInt(children);
			}
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMin'] = parseInt(priceRangeMin);
			}
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMax'] = parseInt(priceRangeMax);
			}
			if (rateCode !== '') {
				createSearchQueryObj['rateCode'] = rateCode;
			}
			return createSearchQueryObj;
		});
	}

	function getImageUrls(destination: Api.Accommodation.Res.Availability): string[] {
		if (destination.media) {
			return destination.media.map((urlObj) => {
				return urlObj.urls.large?.toString() || '';
			});
		}
		return [];
	}

	function bookNow(id: number) {
		const edited: { id: number; startDate: string; endDate: string; packages: any } = params.data.edit;
		let stays = params.data.stays;
		if (edited) {
			stays = params.data.stays.filter(
				(stay: {
					adults: number;
					children: number;
					accommodationId: number;
					arrivalDate: string;
					departureDate: string;
				}) => {
					return (
						stay.accommodationId !== edited.id ||
						stay.arrivalDate !== edited.startDate ||
						stay.departureDate !== edited.endDate
					);
				}
			);
		}

		let data = JSON.stringify({
			destinationId: params.data.destinationId,
			stays,
			newRoom: {
				adults: searchQueryObj.adults,
				children: searchQueryObj.children,
				rateCode: searchQueryObj.rateCode,
				accommodationId: id,
				arrivalDate: searchQueryObj.startDate,
				departureDate: searchQueryObj.endDate,
				packages: edited?.packages ? edited.packages : []
			}
		});
		router.navigate(`/booking/packages?data=${data}`).catch(console.error);
	}

	function renderDestinationSearchResultCards() {
		if (!destinations) return;
		return destinations.map((destination, index) => {
			let urls: string[] = getImageUrls(destination);
			return (
				<AccommodationSearchResultCard
					key={index}
					id={destination.id}
					name={destination.name}
					maxSleeps={destination.maxSleeps}
					squareFeet={2500}
					description={destination.longDescription}
					ratePerNightInCents={destination.costPerNightCents}
					pointsRatePerNight={destination.pointsPerNight}
					amenityIconNames={destination.featureIcons}
					pointsEarnable={destination.pointsEarned}
					hideButtons={true}
					roomStats={[
						{
							label: 'Sleeps',
							datum: destination.maxSleeps
						},
						{
							label: 'Max Occupancy',
							datum: destination.maxOccupancyCount
						},
						{
							label: 'ADA Compliant',
							datum: destination.adaCompliant ? 'Yes' : 'No'
						},
						{
							label: 'Extra Bed',
							datum: destination.extraBeds ? 'Yes' : 'No'
						}
					]}
					onBookNowClick={() => {
						bookNow(destination.id);
					}}
					carouselImagePaths={urls}
				/>
			);
		});
	}

	return (
		<Page className={'rsBookingFlowAddRoomPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Label onClick={() => router.back()} variant={'caption'} className={'backLink'}>
					{'<'} Back
				</Label>
				{params.data.edit && !!editingAccommodation && (
					<AccommodationSearchResultCard
						currentRoom={true}
						id={editingAccommodation.id}
						name={editingAccommodation.name}
						maxSleeps={editingAccommodation.maxSleeps}
						squareFeet={2500}
						description={editingAccommodation.longDescription}
						ratePerNightInCents={editingAccommodation.priceCents}
						pointsRatePerNight={0}
						roomStats={[
							{
								label: 'Sleeps',
								datum: editingAccommodation.maxSleeps
							},
							{
								label: 'Max Occupancy',
								datum: editingAccommodation.maxOccupantCount
							},
							{
								label: 'ADA Compliant',
								datum: editingAccommodation.adaCompliant ? 'Yes' : 'No'
							},
							{
								label: 'Extra Bed',
								datum: editingAccommodation.extraBeds ? 'Yes' : 'No'
							}
						]}
						carouselImagePaths={editingAccommodation.media.map((media) => media.urls.large || '')}
						amenityIconNames={editingAccommodation.features.map((feature) => feature.title)}
						onBookNowClick={() => {
							let data = params.data;
							data.newRoom = data.stays.splice(
								data.stays.findIndex(
									(room: {
										adults: number;
										children: number;
										accommodationId: number;
										arrivalDate: string;
										departureDate: string;
									}) =>
										room.accommodationId === data.edit.id &&
										room.arrivalDate === data.edit.startDate &&
										room.departureDate === data.edit.endDate
								),
								1
							)[0];
							delete data.edit;
							router.navigate(`/booking/packages?data=${JSON.stringify(data)}`);
						}}
						pointsEarnable={0}
					/>
				)}
				<Label className={'filterLabel'} variant={'h1'}>
					Filter by
				</Label>

				{size === 'small' ? (
					<IconLabel
						className={'moreFiltersLink'}
						labelName={'More Filters'}
						iconImg={'icon-chevron-right'}
						iconPosition={'right'}
						iconSize={8}
						labelVariant={'caption'}
						onClick={() => {
							popupController.open<FilterReservationPopupProps>(FilterReservationPopup, {
								onClickApply: (
									startDate: moment.Moment | null,
									endDate: moment.Moment | null,
									adults: string,
									children: string,
									priceRangeMin: string,
									priceRangeMax: string,
									rateCode: string
								) => {
									popupSearch(
										startDate,
										endDate,
										adults,
										children,
										priceRangeMin,
										priceRangeMax,
										rateCode
									);
								},
								className: 'filterPopup'
							});
						}}
					/>
				) : (
					<>
						<FilterBar
							className={'filterBar'}
							startDate={moment(searchQueryObj.startDate)}
							endDate={moment(searchQueryObj.endDate)}
							onDatesChange={onDatesChange}
							focusedInput={focusedInput}
							onFocusChange={setFocusedInput}
							monthsToShow={2}
							onChangeAdults={(value) => {
								if (value === '') value = 0;
								updateSearchQueryObj('adults', parseInt(value));
							}}
							onChangeChildren={(value) => {
								if (value !== '') updateSearchQueryObj('children', parseInt(value));
							}}
							onChangePriceMin={(value) => {
								if (value !== '') {
									updateSearchQueryObj('priceRangeMin', value);
								}
							}}
							onChangePriceMax={(value) => {
								if (value !== '') {
									updateSearchQueryObj('priceRangeMax', value);
								}
							}}
							adultsInitialInput={searchQueryObj.adults.toString()}
							childrenInitialInput={searchQueryObj.children.toString()}
							initialPriceMax={
								!!searchQueryObj.priceRangeMax ? searchQueryObj.priceRangeMax.toString() : ''
							}
							initialPriceMin={
								!!searchQueryObj.priceRangeMin ? searchQueryObj.priceRangeMin.toString() : ''
							}
						/>
						<Accordion
							hideHoverEffect
							children={
								<RateCodeSelect
									apply={(value) => {
										setRateCode(value);
										updateSearchQueryObj('rateCode', value);
									}}
									code={rateCode}
									valid={!validCode}
								/>
							}
							titleReact={<Label variant={'button'}>toggle rate code</Label>}
						/>
					</>
				)}
				<Box
					className={'filterResultsWrapper'}
					bgcolor={'#ffffff'}
					width={size === 'small' ? '100%' : '1165px'}
					margin={'85px auto'}
					boxSizing={'border-box'}
				>
					{renderDestinationSearchResultCards()}
				</Box>
				<PaginationButtons
					selectedRowsPerPage={perPage}
					currentPageNumber={page}
					setSelectedPage={(newPage) => {
						updateSearchQueryObj('pagination', { page: newPage, perPage: perPage });
						setPage(newPage);
					}}
					total={availabilityTotal}
				/>
			</div>
			<Footer links={FooterLinkTestData} />
		</Page>
	);
};

export default BookingFlowAddRoomPage;
