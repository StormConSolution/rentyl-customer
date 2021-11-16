import React, { useEffect, useRef, useState } from 'react';
import './BookingFlowAddRoomPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import serviceFactory from '../../services/serviceFactory';
import { ObjectUtils, WebUtils } from '../../utils/utils';
import FilterBar from '../../components/filterBar/FilterBar';
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
import { useRecoilState } from 'recoil';
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
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(5);
	const [accommodations, setAccommodations] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
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
			try {
				popupController.open(SpinningLoaderPopup);
				let res = await accommodationService.availability(params.data.destinationId, reservationFilters);
				setAvailabilityTotal(res.total || 0);
				setAccommodations(res.data);
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get a list of accommodations.'),
					'Server Error'
				);
				popupController.close(SpinningLoaderPopup);
			}
		}
		getReservations().catch(console.error);
	}, [reservationFilters]);

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
			adults: reservationFilters.adultCount,
			children: 0,
			arrivalDate: reservationFilters.startDate as string,
			departureDate: reservationFilters.endDate as string,
			packages: editStayDetails?.packages || []
		};
		let bookingParams: Misc.BookingParams = {
			destinationId: params.data.destinationId,
			stays,
			newRoom
		};
		router.navigate(`/booking/packages?data=${JSON.stringify(bookingParams)}`).catch(console.error);
	}

	function popupSearch(adults: number, priceRangeMin: string, priceRangeMax: string, propertyTypeIds: number[]) {
		setReservationFilters((prev) => {
			let createSearchQueryObj: any = { ...prev };
			createSearchQueryObj['adults'] = adults;
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMin'] = parseInt(priceRangeMin);
			}
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMax'] = parseInt(priceRangeMax);
			}
			if (ObjectUtils.isArrayWithData(propertyTypeIds)) {
				createSearchQueryObj['propertyTypeIds'] = [propertyTypeIds];
			}
			return createSearchQueryObj;
		});
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
									adults: number,
									priceRangeMin: string,
									priceRangeMax: string,
									propertyTypeIds: number[]
								) => {
									popupSearch(adults, priceRangeMin, priceRangeMax, propertyTypeIds);
								},
								className: 'filterPopup'
							});
						}}
					/>
				) : (
					<>
						<FilterBar destinationId={params.data.destinationId} />
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
						setReservationFilters({
							...reservationFilters,
							pagination: { page: newPage, perPage: 5 }
						});
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
