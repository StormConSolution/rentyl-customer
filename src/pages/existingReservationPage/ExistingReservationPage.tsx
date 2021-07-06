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
import WhatToEditPopup, { WhatToEditPopupProps } from './whatToEditPopup/WhatToEditPopup';
import { DateUtils } from '../../utils/utils';

interface ReservationPageProps {}

const ExistingReservationPage: React.FC<ReservationPageProps> = (props) => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [reservations, setReservations] = useState<Api.Reservation.Res.Get[]>([]);
	const [upComingReservations, setUpComingReservations] = useState<Api.Reservation.Res.Get[]>([]);
	const [upcomingItineraries, setUpcomingItineraries] = useState<Api.Reservation.Res.Itinerary.Get[]>([]);
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

				let tempReservationList: Api.Reservation.Res.Get[] = res.data;
				// console.log(res.data, tempReservationList);
				let itineraryList: Api.Reservation.Res.Itinerary.Get[] = [];
				tempReservationList.forEach((reservation: Api.Reservation.Res.Get) => {
					// let stays: Api.Reservation.Res.Itinerary.Stay[] = tempReservationList.map(
					// 	(item: Api.Reservation.Res.Get) => {
					// 		if (reservation.itineraryNumber === item.itineraryNumber)
					// 			return {
					// 				reservationId: item.id,
					// 				accommodation: item.accommodation,
					// 				arrivalDate: item.arrivalDate,
					// 				departureDate: item.departureDate,
					// 				status: item.status,
					// 				canceledOn: item.canceledOn,
					// 				externalReservationNumber: item.externalReservationNumber,
					// 				externalCancelNumber: item.externalCancelNumber,
					// 				adultCount: item.adultCount,
					// 				childCount: item.childCount,
					// 				externalConfirmationId: item.externalConfirmationId,
					// 				confirmationDate: item.confirmationDate,
					// 				priceDetail: item.priceDetail,
					// 				cancellationPermitted: item.cancellationPermitted
					// 			};
				});
				// 	const itinerary: Api.Reservation.Res.Itinerary.Get = {
				// 		parentReservationId: reservation.id,
				// 		itineraryNumber: reservation.itineraryNumber,
				// 		billingAddress: reservation.billingAddress,
				// 		paymentMethod: reservation.paymentMethod,
				// 		destination: reservation.destination,
				// 		stays
				// 	};
				// 	itineraryList.push(itinerary);
				// 	tempReservationList = tempReservationList.filter(
				// 		(item: Api.Reservation.Res.Get) => item.itineraryNumber !== reservation.itineraryNumber
				// 	);
				// });
				// setUpcomingItineraries(itineraryList);
				// tempReservationList.filter(reservation => reservation.itineraryNumber)
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

		return upComingReservations.map((item, index) => {
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
						item.destination.policies[item.destination.policies.findIndex((p) => p.type === 'Cancellation')]
							.value
					}
					edit={() =>
						popupController.open<WhatToEditPopupProps>(WhatToEditPopup, {
							cancel: () => {
								reservationService.cancel(item.id);
							},
							changeRoom: () => {
								let data = {
									reservationNumber: item.externalConfirmationId,
									destinationId: item.destination.id,
									accommodationId: item.accommodation.id,
									arrivalDate: DateUtils.displayDate(item.arrivalDate),
									departureDate: DateUtils.displayDate(item.departureDate),
									adults: item.adultCount,
									children: item.childCount
								};
								router.navigate(`/reservations/edit-room?data=${JSON.stringify(data)}`);
							},
							editInfo: () => {
								let data = {
									payment: item.paymentMethod,
									address: item.billingAddress
								};
								router.navigate(`/reservations/payment?data=${JSON.stringify(data)}`);
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
