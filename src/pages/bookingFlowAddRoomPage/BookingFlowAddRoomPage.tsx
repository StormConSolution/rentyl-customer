import React, { useEffect, useRef, useState } from 'react';
import './BookingFlowAddRoomPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import moment from 'moment';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import serviceFactory from '../../services/serviceFactory';
import { formatFilterDateForServer, ObjectUtils, WebUtils } from '../../utils/utils';
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
import { FooterLinks } from '../../components/footer/FooterLinks';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import BookingParams = Misc.BookingParams;
import RsPagedResponseData = RedSky.RsPagedResponseData;

const BookingFlowAddRoomPage = () => {
	const filterRef = useRef<HTMLElement>(null);
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: BookingParams }>([
		{ key: 'data', default: 0, type: 'string', alias: 'data' }
	]);
	params.data = ObjectUtils.smartParse(params.data);
	const editStayDetails = params.data.stays.find((item) => {
		return item.uuid === params.data.editUuid;
	});

	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const perPage = 5;
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(5);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [accommodations, setAccommodations] = useState<Api.Accommodation.Res.Availability[]>([]);

	const initialStartDate = editStayDetails?.arrivalDate ? moment(editStayDetails?.arrivalDate) : moment(new Date());
	const initialEndDate = editStayDetails?.departureDate
		? moment(editStayDetails?.departureDate)
		: moment(editStayDetails?.departureDate).add(2, 'days');

	const [searchQueryObj, setSearchQueryObj] = useState<Api.Accommodation.Req.Availability>({
		startDate: initialStartDate.format('YYYY-MM-DD'),
		endDate: initialEndDate.format('YYYY-MM-DD'),
		adults: editStayDetails?.adults || 1,
		children: editStayDetails?.children || 0,
		pagination: { page: 1, perPage: 5 },
		destinationId: params.data.destinationId,
		propertyType: 0,
		rateCode: editStayDetails?.rateCode || params.data.stays[0].rateCode || ''
	});

	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(initialStartDate);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(initialEndDate);

	const [rateCode, setRateCode] = useState<string | undefined>(params.data.stays[0].rateCode);
	const [validCode, setValidCode] = useState<boolean>(true);
	const [editingAccommodation, setEditingAccommodation] = useState<Api.Accommodation.Res.Details>();

	useEffect(() => {
		async function checkForEdit() {
			if (editStayDetails) {
				let result = await accommodationService.getAccommodationDetails(editStayDetails.accommodationId);
				setEditingAccommodation(result);
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
				let res = await accommodationService.searchAvailableAccommodationsByDestination(newSearchQueryObj);
				if (newSearchQueryObj.propertyType && newSearchQueryObj.propertyType !== 0) {
					handlePropertyTypeFilter(res, newSearchQueryObj);
				} else {
					setAvailabilityTotal(res.total || 0);
					setAccommodations(res.data);
					setValidCode(rateCode === '' || res.data.length > 0);
				}

				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get a list of accommodations.'),
					'Server Error'
				);
				setValidCode(rateCode === '' || rateCode === undefined);
				popupController.close(SpinningLoaderPopup);
			}
		}
		getReservations().catch(console.error);
	}, [searchQueryObj]);

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDateControl(startDate);
		setEndDateControl(endDate);
		updateSearchQueryObj('startDate', formatFilterDateForServer(startDate, 'start'));
		updateSearchQueryObj('endDate', formatFilterDateForServer(endDate, 'end'));
	}

	function handlePropertyTypeFilter(
		res: RsPagedResponseData<Api.Accommodation.Req.Availability>,
		newSearchQueryObj: Api.Accommodation.Req.Availability
	) {
		if (newSearchQueryObj.propertyType && newSearchQueryObj.propertyType !== 0) {
			let filteredAccommodations: Api.Accommodation.Res.Availability[] = [];
			res.data.map((accommodation: Api.Accommodation.Res.Availability) => {
				if (newSearchQueryObj.propertyType === accommodation.propertyTypeId) {
					filteredAccommodations.push(accommodation);
				}
			});
			setAvailabilityTotal(filteredAccommodations.length);
			setAccommodations(filteredAccommodations);
			setValidCode(rateCode === '' || res.data.length > 0);
		}
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
			| 'rateCode'
			| 'propertyType',
		value: any
	) {
		if (key === 'adults' && value === 0)
			throw rsToastify.error('There must be at least one adult.', 'Information Required');
		if (key === 'adults' && isNaN(value))
			throw rsToastify.error('# of adults must be a number', 'Incorrect or Missing Information');
		if (key === 'children' && isNaN(value))
			throw rsToastify.error('# of children must be a number', 'Incorrect or Missing Information');
		if (key === 'priceRangeMin' && isNaN(value))
			throw rsToastify.error('Price min must be a number', 'Incorrect or Missing Information');
		if (key === 'priceRangeMax' && isNaN(value))
			throw rsToastify.error('Price max must be a number', 'Incorrect or Missing Information');
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
		propertyType: number,
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
			if (propertyType !== 0) {
				createSearchQueryObj['propertyType'] = propertyType;
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
				return urlObj.urls.imageKit?.toString() || '';
			});
		}
		return [];
	}

	function bookNow(accommodationId: number) {
		let stays = params.data.stays;
		if (editStayDetails) {
			stays = params.data.stays.filter((stay) => {
				return stay.uuid !== editStayDetails.uuid;
			});
		}

		let newRoom: Misc.StayParams = {
			uuid: editStayDetails?.uuid || Date.now(),
			accommodationId,
			adults: searchQueryObj.adults,
			children: searchQueryObj.children,
			rateCode: searchQueryObj.rateCode,
			arrivalDate: searchQueryObj.startDate as string,
			departureDate: searchQueryObj.endDate as string,
			packages: editStayDetails?.packages || []
		};

		let bookingParams: Misc.BookingParams = {
			destinationId: params.data.destinationId,
			stays,
			newRoom
		};
		router.navigate(`/booking/packages?data=${JSON.stringify(bookingParams)}`).catch(console.error);
	}

	function renderDestinationSearchResultCards() {
		return accommodations.map((accommodation, index) => {
			let urls: string[] = getImageUrls(accommodation);
			return (
				<AccommodationSearchResultCard
					key={index}
					id={accommodation.id}
					name={accommodation.name}
					maxSleeps={accommodation.maxSleeps}
					squareFeet={2500}
					description={accommodation.longDescription}
					ratePerNightInCents={accommodation.costPerNightCents}
					pointsRatePerNight={accommodation.pointsPerNight}
					amenityIconNames={accommodation.featureIcons}
					pointsEarnable={accommodation.pointsEarned}
					hideButtons={true}
					roomStats={[
						{
							label: 'Sleeps',
							datum: accommodation.maxSleeps
						},
						{
							label: 'Max Occupancy',
							datum: accommodation.maxOccupantCount
						},
						{
							label: 'ADA Compliant',
							datum: accommodation.adaCompliant ? 'Yes' : 'No'
						},
						{
							label: 'Extra Bed',
							datum: accommodation.extraBeds ? 'Yes' : 'No'
						}
					]}
					onBookNowClick={() => {
						bookNow(accommodation.id);
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
				{editStayDetails && !!editingAccommodation && (
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
						carouselImagePaths={editingAccommodation.media.map((media) => media.urls.imageKit || '')}
						amenityIconNames={editingAccommodation.features.map((feature) => feature.title)}
						onBookNowClick={() => {
							bookNow(editStayDetails.accommodationId);
						}}
						pointsEarnable={0}
						hideButtons={true}
					/>
				)}
				<div ref={filterRef} />
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
									propertyType: number,
									rateCode: string
								) => {
									popupSearch(
										startDate,
										endDate,
										adults,
										children,
										priceRangeMin,
										priceRangeMax,
										propertyType,
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
							startDate={startDateControl}
							endDate={endDateControl}
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
							onChangePropertyType={(control) => {
								updateSearchQueryObj('propertyType', control.value);
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
						let filterSection = filterRef.current!.offsetTop;
						window.scrollTo({ top: filterSection, behavior: 'smooth' });
					}}
					total={availabilityTotal}
				/>
			</div>
			<Footer links={FooterLinks} />
		</Page>
	);
};

export default BookingFlowAddRoomPage;
