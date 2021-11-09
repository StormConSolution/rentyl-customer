import React, { useEffect, useState } from 'react';
import './EditFlowModifyRoomPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import moment from 'moment';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import serviceFactory from '../../services/serviceFactory';
import { DateUtils, formatFilterDateForServer, WebUtils } from '../../utils/utils';
import FilterBar from '../../components/filterBar/FilterBar';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import AccommodationSearchResultCard from '../../components/accommodationSearchResultCard/AccommodationSearchResultCard';
import FilterReservationPopup, {
	FilterReservationPopupProps
} from '../../popups/filterReservationPopup/FilterReservationPopup';
import IconLabel from '../../components/iconLabel/IconLabel';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import ReservationsService from '../../services/reservations/reservations.service';
import ConfirmChangeRoomPopup, {
	ConfirmChangeRoomPopupProps
} from '../../popups/confirmChangeRoomPopup/ConfirmChangeRoomPopup';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import AccommodationService from '../../services/accommodation/accommodation.service';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';

const EditFlowModifyRoomPage = () => {
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ reservationId: number; destinationId: number }>([
		{ key: 'ri', default: 0, type: 'integer', alias: 'reservationId' },
		{ key: 'di', default: 0, type: 'integer', alias: 'destinationId' }
	]);
	let reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const [rateCode, setRateCode] = useRecoilState<string>(globalState.userRateCode);
	const [searchQueryObj, setSearchQueryObj] = useRecoilState<Misc.ReservationFilters>(globalState.reservationFilters);
	const [page, setPage] = useState<number>(1);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(5);
	const [reservation, setReservation] = useState<Api.Reservation.Res.Get>();
	const [destinations, setDestinations] = useState<Api.Accommodation.Res.Availability[]>([]);

	useEffect(() => {
		async function getReservationData(id: number) {
			try {
				let res = await reservationsService.get(id);
				setReservation(res);
				const newSearchQueryObj = { ...searchQueryObj };
				newSearchQueryObj.rateCode = res.rateCode;
				newSearchQueryObj.startDate = res.arrivalDate;
				newSearchQueryObj.endDate = res.departureDate;
				setSearchQueryObj(newSearchQueryObj);
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find reservation.'), 'Server Error');
				router.navigate('/reservations').catch(console.error);
			}
		}
		getReservationData(params.reservationId).catch(console.error);
	}, [params.reservationId]);

	useEffect(() => {
		async function getReservations() {
			try {
				popupController.open(SpinningLoaderPopup);
				let res = await accommodationService.availability(params.destinationId, searchQueryObj);
				setAvailabilityTotal(res.total || 0);
				setDestinations(res.data);
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get available accommodations.'),
					'Server Error'
				);
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
			if (propertyTypeIds.length >= 1) {
				createSearchQueryObj['propertyTypeIds'] = propertyTypeIds;
			} else {
				delete createSearchQueryObj['propertyTypeIds'];
			}
			if (rateCode !== '' || rateCode !== undefined) {
				setRateCode(reservation?.rateCode || '');
				createSearchQueryObj['rateCode'] = reservation?.rateCode;
			}
			return createSearchQueryObj;
		});
	}

	async function bookNow(id: number) {
		if (reservation) {
			popupController.open(SpinningLoaderPopup);
			let stay: Api.Reservation.Req.Update = {
				id: reservation.id,
				paymentMethodId: reservation.paymentMethod?.id,
				guest: reservation.guest,
				accommodationId: id,
				adultCount: searchQueryObj.adultCount,
				childCount: searchQueryObj.childCount,
				arrivalDate: moment(searchQueryObj.startDate).format('YYYY-MM-DD'),
				departureDate: moment(searchQueryObj.endDate).format('YYYY-MM-DD'),
				numberOfAccommodations: 1,
				rateCode: rateCode || searchQueryObj.rateCode
			};
			try {
				await reservationsService.updateReservation(stay);
				router.navigate(`/reservations`).catch(console.error);
				popupController.closeAll();
			} catch (e) {
				popupController.closeAll();
				setErrorMessage(e.message);
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Cannot get details for this destination.'),
					'Server Error'
				);
			}
		}
	}

	function renderDestinationSearchResultCards() {
		if (!destinations) return;
		return destinations.map((destination, index) => {
			return (
				<>
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
								label: 'Accessible',
								datum: destination.adaCompliant ? 'Yes' : 'No'
							},
							{
								label: 'Extra Bed',
								datum: destination.extraBeds ? 'Yes' : 'No'
							}
						]}
						onBookNowClick={() => {
							popupController.open<ConfirmChangeRoomPopupProps>(ConfirmChangeRoomPopup, {
								onUpdateRoomClick: () => bookNow(destination.id)
							});
						}}
						carouselImagePaths={destination.media}
					/>
					<hr />
				</>
			);
		});
	}

	function getReservationCostPerNight(): number {
		if (!reservation) return 0;
		let costPerNightAvg: number = 0;
		Object.keys(reservation.priceDetail.accommodationDailyCostsInCents).forEach((item) => {
			costPerNightAvg += reservation.priceDetail.accommodationDailyCostsInCents[item];
		});
		return costPerNightAvg / Object.keys(reservation.priceDetail.accommodationDailyCostsInCents).length;
	}

	return (
		<Page className={'rsEditFlowModifyRoomPage'}>
			<div className={'rs-page-content-wrapper'}>
				{!!reservation && (
					<>
						<Label className={'filterLabel'} variant={'h1'} mb={20}>
							Current Room/Property
						</Label>
						<Label className={'error'} color={'red'} variant={'h4'}>
							{errorMessage}
						</Label>
						<hr />
						<AccommodationSearchResultCard
							currentRoom={true}
							id={reservation.destination.id}
							name={reservation.accommodation.name}
							maxSleeps={reservation.accommodation.maxSleeps}
							squareFeet={2500}
							description={reservation.accommodation.longDescription}
							ratePerNightInCents={getReservationCostPerNight()}
							pointsRatePerNight={0}
							hideButtons={true}
							roomStats={[
								{
									label: 'Sleeps',
									datum: reservation.accommodation.maxSleeps
								},
								{
									label: 'Max Occupancy',
									datum: reservation.accommodation.maxOccupantCount
								},
								{
									label: 'Accessible',
									datum: reservation.accommodation.adaCompliant === 1 ? 'Yes' : 'No'
								},
								{
									label: 'Extra Bed',
									datum: reservation.accommodation.extraBed ? 'Yes' : 'No'
								}
							]}
							carouselImagePaths={reservation.accommodation.media}
							amenityIconNames={reservation.accommodation.featureIcons}
							onBookNowClick={() => {
								router.navigate(
									`/reservations/itinerary/reservation/details?ri=${params.reservationId}`
								);
							}}
							pointsEarnable={0}
						/>
						<hr />
					</>
				)}
				<Label className={'filterLabel'} variant={'h1'} mb={20}>
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
									propertyTypeIds,
									rateCode
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
					</>
				)}
				<Box
					className={'filterResultsWrapper'}
					bgcolor={'#ffffff'}
					width={size === 'small' ? '100%' : '1165px'}
					margin={'85px auto'}
					boxSizing={'border-box'}
				>
					{destinations.length <= 0 ? (
						<Label variant={'h2'}>No available options.</Label>
					) : (
						renderDestinationSearchResultCards()
					)}
				</Box>
				<PaginationButtons
					selectedRowsPerPage={5}
					currentPageNumber={page}
					setSelectedPage={(newPage) => {
						let newSearchQueryObj = { ...searchQueryObj };
						newSearchQueryObj.pagination = { page: newPage, perPage: 5 };
						setSearchQueryObj(newSearchQueryObj);
						setPage(newPage);
					}}
					total={availabilityTotal}
				/>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default EditFlowModifyRoomPage;
