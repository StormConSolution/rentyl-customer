import React, { useEffect, useState } from 'react';
import './EditFlowModifyRoomPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import moment from 'moment';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import DestinationService from '../../services/destination/destination.service';
import serviceFactory from '../../services/serviceFactory';
import rsToasts from '@bit/redsky.framework.toast';
import { formatFilterDateForServer, StringUtils } from '../../utils/utils';
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

const EditFlowModifyRoomPage = () => {
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);

	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const perPage = 5;
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(5);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [accommodationDetails, setAccommodationDetails] = useState<Api.Accommodation.Res.Details>();
	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();
	const [destinations, setDestinations] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [searchQueryObj, setSearchQueryObj] = useState<Api.Accommodation.Req.Availability>({
		startDate: moment(params.data.arrivalDate).format('YYYY-MM-DD'),
		endDate: moment(params.data.departureDate).format('YYYY-MM-DD'),
		adults: params.data.adults,
		children: params.data.children,
		pagination: { page: 1, perPage: 5 },
		destinationId: params.data.destinationId
	});
	const [rateCode, setRateCode] = useState<string>('');
	const [validCode, setValidCode] = useState<boolean>(true);

	useEffect(() => {
		async function getReservationDetails() {
			const response = await accommodationService.getAccommodationDetails(params.data.accommodationId);
			setAccommodationDetails(response.data.data);
			const response2 = await destinationService.getDestinationDetails(params.data.destinationId);
			setDestinationDetails(response2.data.data);
		}
		getReservationDetails().catch(console.error);
	}, []);

	useEffect(() => {
		async function getReservations() {
			let newSearchQueryObj = { ...searchQueryObj };
			if (!!newSearchQueryObj.priceRangeMin && !!newSearchQueryObj.priceRangeMax) {
				newSearchQueryObj.priceRangeMax = newSearchQueryObj.priceRangeMax * 100;
				newSearchQueryObj.priceRangeMin = newSearchQueryObj.priceRangeMin * 100;
			}

			try {
				popupController.open(SpinningLoaderPopup);
				if (newSearchQueryObj.rate === '' || newSearchQueryObj.rate === undefined)
					delete newSearchQueryObj.rate;
				let res = await destinationService.searchAvailableAccommodationsByDestination(newSearchQueryObj);
				// we need totals, but it seems like the information needed for this page and the endpoint give the wrong data?
				//can't use getByPage as it doesn't return with the info needed for the cards.
				// setAvailabilityTotal(res.total)
				setDestinations(res);
				setValidCode(rateCode === '' || (!!res && res.length > 0));
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
			| 'rate',
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
				createSearchQueryObj['rate'] = rateCode;
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
		// const edited: { id: number; startDate: string; endDate: string; packages: any } = params.data.edit;
		// const stays = params.data.stays.filter(
		// 	(stay: {
		// 		adults: number;
		// 		children: number;
		// 		accommodationId: number;
		// 		arrivalDate: string;
		// 		departureDate: string;
		// 	}) => {
		// 		return (
		// 			stay.accommodationId !== edited.id ||
		// 			stay.arrivalDate !== edited.startDate ||
		// 			stay.departureDate !== edited.endDate
		// 		);
		// 	}
		// );
		//
		// let data = JSON.stringify({
		// 	destinationId: params.data.destinationId,
		// 	stays,
		// 	newRoom: {
		// 		adults: searchQueryObj.adults,
		// 		children: searchQueryObj.children,
		// 		rate: searchQueryObj.rate,
		// 		accommodationId: id,
		// 		arrivalDate: searchQueryObj.startDate,
		// 		departureDate: searchQueryObj.endDate,
		// 		packages: edited.packages ? edited.packages : []
		// 	}
		// });
		// router.navigate(`/booking/packages?data=${data}`).catch(console.error);
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
							datum: destination.maxOccupantCount
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
		<Page className={'rsEditFlowModifyRoomPage'}>
			<div className={'rs-page-content-wrapper'}>
				<AccommodationSearchResultCard
					currentRoom={true}
					id={params.data.destinationId}
					name={destinationDetails?.name || ''}
					maxSleeps={accommodationDetails?.maxSleeps || 0}
					squareFeet={parseInt(accommodationDetails?.size || '2500')}
					description={accommodationDetails?.longDescription || ''}
					//params.data.priceDetail.accommodationTotalInCents
					ratePerNightInCents={accommodationDetails?.priceCents || 0}
					pointsRatePerNight={0}
					hideButtons={true}
					roomStats={[
						{
							label: 'Sleeps',
							datum: accommodationDetails?.maxSleeps || 0
						},
						{
							label: 'Max Occupancy',
							datum: accommodationDetails?.maxOccupantCount || 0
						},
						{
							label: 'ADA Compliant',
							datum: accommodationDetails?.adaCompliant ? 'Yes' : 'No'
						},
						{
							label: 'Extra Bed',
							datum: accommodationDetails?.extraBeds ? 'Yes' : 'No'
						}
					]}
					carouselImagePaths={accommodationDetails?.media.map((image) => image.urls.large) || ['']}
					amenityIconNames={accommodationDetails?.features.map((feature) => feature.icon) || ['']}
					onBookNowClick={() => {}}
					pointsEarnable={0}
				/>
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
									startDate,
									endDate,
									adults,
									children,
									priceRangeMin,
									priceRangeMax,
									rateCode
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
								updateSearchQueryObj('adults', value);
							}}
							onChangeChildren={(value) => {
								if (value !== '') updateSearchQueryObj('children', value);
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
										updateSearchQueryObj('rate', value);
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

export default EditFlowModifyRoomPage;
