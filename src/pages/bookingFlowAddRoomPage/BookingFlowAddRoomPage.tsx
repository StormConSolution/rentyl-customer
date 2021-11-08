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
import { useRecoilState, useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';

const BookingFlowAddRoomPage = () => {
	const filterRef = useRef<HTMLElement>(null);
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: Misc.BookingParams }>([
		{ key: 'data', default: 0, type: 'string', alias: 'data' }
	]);
	params.data = ObjectUtils.smartParse(params.data);
	const editStayDetails = params.data.stays.find((item) => {
		return item.uuid === params.data.editUuid;
	});

	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const rateCode = useRecoilValue<string>(globalState.userRateCode);
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(5);
	const [accommodations, setAccommodations] = useState<Api.Accommodation.Res.Availability[]>([]);
	const initialStartDate = editStayDetails?.arrivalDate
		? moment(editStayDetails?.arrivalDate)
		: moment(params.data.stays[0].arrivalDate);
	const initialEndDate = editStayDetails?.departureDate
		? moment(editStayDetails?.departureDate)
		: moment(params.data.stays[0].departureDate);
	const [searchQueryObj, setSearchQueryObj] = useState<Api.Accommodation.Req.Availability>({
		startDate: initialStartDate.format('YYYY-MM-DD'),
		endDate: initialEndDate.format('YYYY-MM-DD'),
		adults: editStayDetails?.adults || 1,
		children: editStayDetails?.children || 0,
		pagination: { page: 1, perPage: 5 },
		destinationId: params.data.destinationId
	});

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
			if (!rateCode) {
				delete newSearchQueryObj.rateCode;
			} else {
				newSearchQueryObj.rateCode = rateCode;
			}
			try {
				popupController.open(SpinningLoaderPopup);
				let res = await accommodationService.availability(newSearchQueryObj);
				setAvailabilityTotal(res.total || 0);
				setAccommodations(res.data);
				setValidCode(rateCode === '' || res.data.length > 0);
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

	function popupSearch(
		checkinDate: moment.Moment | null,
		checkoutDate: moment.Moment | null,
		adults: number,
		children: number,
		priceRangeMin: string,
		priceRangeMax: string,
		propertyTypeIds: number[],
		rateCode: string
	) {
		setSearchQueryObj((prev) => {
			let createSearchQueryObj: any = { ...prev };
			createSearchQueryObj['startDate'] = formatFilterDateForServer(checkinDate, 'start');
			createSearchQueryObj['endDate'] = formatFilterDateForServer(checkoutDate, 'end');
			createSearchQueryObj['adults'] = adults;
			createSearchQueryObj['children'] = children;
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMin'] = parseInt(priceRangeMin);
			}
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMax'] = parseInt(priceRangeMax);
			}
			if (ObjectUtils.isArrayWithData(propertyTypeIds)) {
				createSearchQueryObj['propertyTypeIds'] = [propertyTypeIds];
			}
			if (rateCode !== '') {
				createSearchQueryObj['rateCode'] = rateCode;
			}
			return createSearchQueryObj;
		});
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
			arrivalDate: searchQueryObj.startDate as string,
			departureDate: searchQueryObj.endDate as string,
			packages: editStayDetails?.packages || []
		};
		if (rateCode) newRoom.rateCode = rateCode;

		let bookingParams: Misc.BookingParams = {
			destinationId: params.data.destinationId,
			stays,
			newRoom
		};
		router.navigate(`/booking/packages?data=${JSON.stringify(bookingParams)}`).catch(console.error);
	}

	function renderDestinationSearchResultCards() {
		return accommodations.map((accommodation, index) => {
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
							label: 'Accessible',
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
					carouselImagePaths={accommodation.media}
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
								label: 'Accessible',
								datum: editingAccommodation.adaCompliant ? 'Yes' : 'No'
							},
							{
								label: 'Extra Bed',
								datum: editingAccommodation.extraBeds ? 'Yes' : 'No'
							}
						]}
						carouselImagePaths={editingAccommodation.media}
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
									adults: number,
									children: number,
									priceRangeMin: string,
									priceRangeMax: string,
									propertyTypeIds: number[],
									rateCode: string,
									regionIds
								) => {
									popupSearch(
										startDate,
										endDate,
										adults,
										children,
										priceRangeMin,
										priceRangeMax,
										propertyTypeIds,
										rateCode
									);
								},
								className: 'filterPopup'
							});
						}}
					/>
				) : (
					<>
						<FilterBar />
						<Accordion
							hideHoverEffect
							children={<RateCodeSelect code={rateCode} valid={!validCode} />}
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
					{accommodations.length <= 0 ? (
						<Label variant={'h2'}>No available options.</Label>
					) : (
						renderDestinationSearchResultCards()
					)}
				</Box>
				<PaginationButtons
					selectedRowsPerPage={5}
					currentPageNumber={page}
					setSelectedPage={(newPage) => {
						setPage(newPage);
						let newSearchQueryObj = { ...searchQueryObj };
						newSearchQueryObj.pagination = { page: newPage, perPage: 5 };
						setSearchQueryObj(newSearchQueryObj);
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
