import * as React from 'react';
import './ExistingReservationPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import ReservationCard from '../../components/reservationCard/ReservationCard';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import LoadingPage from '../loadingPage/LoadingPage';
import { useEffect, useState } from 'react';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import router from '../../utils/router';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import WhatToEditPopup, { WhatToEditPopupProps } from '../../popups/whatToEditPopup/WhatToEditPopup';
import AccommodationOptionsPopup, {
	AccommodationOptionsPopupProps
} from '../../popups/accommodationOptionsPopup/AccommodationOptionsPopup';
import EditAccommodationPopup, {
	EditAccommodationPopupProps
} from '../../popups/editAccommodationPopup/EditAccommodationPopup';
import ConfirmOptionPopup, { ConfirmOptionPopupProps } from '../../popups/confirmOptionPopup/ConfirmOptionPopup';
import moment from 'moment';
import rsToasts from '@bit/redsky.framework.toast';

interface ReservationPageProps {}

const ExistingReservationPage: React.FC<ReservationPageProps> = (props) => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [reservations, setReservations] = useState<Api.Reservation.Res.Get[]>([]);
	const [upComingReservations, setUpComingReservations] = useState<Api.Reservation.Res.Get[]>([]);
	const [previousReservations, setPreviousReservations] = useState<Api.Reservation.Res.Get[]>([]);

	useEffect(() => {
		if (!user) return;

		async function getReservationsForUser() {
			try {
				let res = await reservationService.getByPage(1, 100, 'userId', 'ASC', 'exact', [
					{
						column: 'userId',
						value: user!.id
					}
				]);

				setReservations(res.data);
			} catch (e) {
				console.error(e);
			}
		}
		getReservationsForUser().catch(console.error);
	}, []);

	useEffect(() => {
		if (!ObjectUtils.isArrayWithData(reservations)) return;

		let prevReservations = reservations.filter((item) => {
			let date = new Date(item.departureDate);
			return date.getTime() < Date.now();
		});

		let currentRes = reservations.filter((item) => {
			let date = new Date(item.departureDate);
			return date.getTime() > Date.now();
		});

		setUpComingReservations(currentRes);
		setPreviousReservations(prevReservations);
	}, [reservations]);

	function renderUpcomingReservations() {
		if (!ObjectUtils.isArrayWithData(upComingReservations)) return;
		return upComingReservations
			.filter((reservation) => {
				return !reservation.externalCancellationId;
			})
			.map((item, index) => {
				return (
					<ReservationCard
						imgPath={item.destination.heroUrl}
						logo={item.destination.logoUrl}
						title={item.destination.name}
						address={`${item.destination.address1}, ${item.destination.city}, ${item.destination.state} ${item.destination.zip}`}
						reservationDates={{ startDate: item.arrivalDate, endDate: item.departureDate }}
						propertyType={'VIP Suite'}
						sleeps={item.accommodation.maxSleeps}
						maxOccupancy={item.accommodation.maxOccupantCount}
						amenities={item.accommodation.featureIcons}
						totalCostCents={item.priceDetail.grandTotalCents}
						totalPoints={1000} //This needs to be added to the endpoint.
						onViewDetailsClick={() => {
							router.navigate('/reservation/details?ri=' + item.id).catch(console.error);
						}}
						cancelPermitted={item.cancellationPermitted}
						cancelPolicy={
							item.destination.policies[
								item.destination.policies.findIndex((p) => p.type === 'Cancellation')
							].value
						}
						edit={() =>
							popupController.open<WhatToEditPopupProps>(WhatToEditPopup, {
								cancel: () => {
									popupController.closeAll();
									reservationService.cancel(item.id).catch(console.error);
								},
								changeRoom: () => {
									popupController.closeAll();
									router
										.navigate(`/reservations/edit-room?ri=${item.id}&&di=${item.destination.id}`)
										.catch(console.error);
								},
								editInfo: () => {
									popupController.closeAll();
									router.navigate(`/reservations/payment?ri=${item.id}`).catch(console.error);
								},
								editRoomInfo: () => {
									popupController.open<AccommodationOptionsPopupProps>(AccommodationOptionsPopup, {
										cancellable:
											item.cancellationPermitted === 1 &&
											moment(item.arrivalDate) > moment().add(15, 'days'),
										onRemove: () => {
											popupController.hide(AccommodationOptionsPopup);
											popupController.open<ConfirmOptionPopupProps>(ConfirmOptionPopup, {
												bodyText: 'Are you sure you want to remove this reservation?',
												cancelText: 'No',
												async confirm() {
													try {
														let res = await reservationService.cancel(item.id);
														rsToasts.success(`Cancel Confirmation: ${res.cancellationId}`);
														setUpComingReservations(
															upComingReservations.filter(
																(reservation, index2) => index2 !== index
															)
														);
													} catch {
														rsToasts.error('Failed to cancel reservation');
													}
												},
												confirmText: 'Yes',
												title: 'Cancel Reservation'
											});
										},
										onChangeRoom: () => {
											popupController.closeAll();
											router
												.navigate(
													`/reservations/edit-room?ri=${item.id}&&di=${item.destination.id}`
												)
												.catch(console.error);
										},
										onEditRoom: () => {
											popupController.open<EditAccommodationPopupProps>(EditAccommodationPopup, {
												adults: item.adultCount,
												children: item.childCount,
												startDate: item.arrivalDate,
												endDate: item.departureDate,
												packages: [],
												onApplyChanges: (
													adults: number,
													children: number,
													checkinDate: string | Date,
													checkoutDate: string | Date,
													packages: Api.Package.Res.Get[]
												) => {
													reservationService
														.updateReservation({
															itineraryId: item.itineraryId,
															stays: [
																{
																	accommodationId: item.accommodation.id,
																	numberOfAccommodations: 1,
																	arrivalDate: checkinDate,
																	departureDate: checkoutDate,
																	adultCount: adults,
																	childCount: children,
																	rateCode: '',
																	reservationId: item.id,
																	guest: item.guest
																}
															]
														})
														.catch(console.error);
													popupController.closeAll();
												},
												destinationId: item.destination.id,
												accommodationId: item.accommodation.id
											});
										}
									});
								}
							})
						}
					/>
				);
			});
	}

	function renderPrevReservations() {
		if (!ObjectUtils.isArrayWithData(previousReservations)) return;

		return previousReservations.map((item, index) => {
			return (
				<ReservationCard
					imgPath={item.destination.heroUrl}
					logo={item.destination.logoUrl}
					title={item.destination.name}
					address={`${item.destination.address1}, ${item.destination.city}, ${item.destination.state} ${item.destination.zip}`}
					reservationDates={{ startDate: item.arrivalDate, endDate: item.departureDate }}
					propertyType={'VIP Suite'}
					sleeps={item.accommodation.maxSleeps}
					maxOccupancy={item.accommodation.maxOccupantCount}
					amenities={item.accommodation.featureIcons}
					totalCostCents={item.priceDetail.grandTotalCents}
					totalPoints={1000} //This needs to be added to the endpoint.
					onViewDetailsClick={() => {
						router.navigate('/reservation/details?ri=' + item.id).catch(console.error);
					}}
					cancelPermitted={0}
					cancelPolicy={''}
				/>
			);
		});
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsExistingReservationPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box m={'140px auto'} maxWidth={1160}>
					<h1>Your Upcoming Reservations</h1>
					{renderUpcomingReservations()}
					<h1>Past Stays</h1>
					{renderPrevReservations()}
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default ExistingReservationPage;
