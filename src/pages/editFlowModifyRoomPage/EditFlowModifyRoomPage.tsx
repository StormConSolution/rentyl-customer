import React, { useEffect, useState } from 'react';
import './EditFlowModifyRoomPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import moment from 'moment';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import serviceFactory from '../../services/serviceFactory';
import { WebUtils } from '../../utils/utils';
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
import DestinationService from '../../services/destination/destination.service';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import PropertyType = Api.Destination.Res.PropertyType;

const EditFlowModifyRoomPage = () => {
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ reservationId: number; destinationId: number }>([
		{ key: 'ri', default: 0, type: 'integer', alias: 'reservationId' },
		{ key: 'di', default: 0, type: 'integer', alias: 'destinationId' }
	]);
	let reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const [page, setPage] = useState<number>(1);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(5);
	const [reservation, setReservation] = useState<Api.Reservation.Res.Get>();
	const [destinations, setDestinations] = useState<Api.Accommodation.Res.Availability[]>([]);

	const [propertyTypeOptions, setPropertyTypeOptions] = useState<PropertyType[]>([]);
	const [inUnitAmenities, setInUnitAmenities] = useState<OptionType[]>([]);
	const [resortExperiences, setResortExperiences] = useState<OptionType[]>([]);

	useEffect(() => {
		async function getResortExperiences() {
			let res = await destinationService.getExperienceTypes();
			setResortExperiences(
				res.map((experience) => {
					return {
						value: experience.id,
						label: experience.title
					};
				})
			);
		}
		getResortExperiences().catch(console.error);

		async function getInUnitAmenities() {
			let res = await destinationService.getInUnitAmenities();
			setInUnitAmenities(
				res.map((amenity) => {
					return {
						value: amenity.id,
						label: amenity.title
					};
				})
			);
		}
		getInUnitAmenities().catch(console.error);

		async function getAccommodations() {
			const list = await destinationService.getAllPropertyTypes();
			setPropertyTypeOptions(list);
		}
		getAccommodations().catch(console.error);
	}, []);

	useEffect(() => {
		async function getReservationData(id: number) {
			try {
				let res = await reservationsService.get(id);
				setReservation(res);
				const newSearchQueryObj = { ...reservationFilters };
				newSearchQueryObj.startDate = res.arrivalDate;
				newSearchQueryObj.endDate = res.departureDate;
				setReservationFilters(newSearchQueryObj);
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
				let res = await accommodationService.availability(params.destinationId, reservationFilters);
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
	}, [reservationFilters, params.destinationId]);

	async function bookNow(id: number) {
		if (reservation) {
			popupController.open(SpinningLoaderPopup);
			let stay: Api.Reservation.Req.Update = {
				id: reservation.id,
				paymentMethodId: reservation.paymentMethod?.id,
				guest: reservation.guest,
				accommodationId: id,
				adultCount: reservationFilters.adultCount,
				childCount: reservationFilters.childCount,
				arrivalDate: moment(reservationFilters.startDate).format('YYYY-MM-DD'),
				departureDate: moment(reservationFilters.endDate).format('YYYY-MM-DD'),
				numberOfAccommodations: 1
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
						amenityIconNames={destination.amenities.map((item) => item.title)}
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
								className: 'filterPopup',
								resortExperiencesOptions: resortExperiences,
								inUnitAmenitiesOptions: inUnitAmenities,
								accommodationOptions: propertyTypeOptions
							});
						}}
					/>
				) : (
					<>
						<FilterBar destinationId={params.destinationId} />
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
						setPage(newPage);
						setReservationFilters({
							...reservationFilters,
							pagination: { page: newPage, perPage: 5 }
						});
					}}
					total={availabilityTotal}
				/>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default EditFlowModifyRoomPage;
