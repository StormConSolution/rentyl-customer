import * as React from 'react';
import './ExistingItineraryPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import ReservationCard from '../../components/reservationCard/ReservationCard';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import LoadingPage from '../loadingPage/LoadingPage';
import { useEffect, useRef, useState } from 'react';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import router from '../../utils/router';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';

const ExistingItineraryPage: React.FC = () => {
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
			return date.getTime() < Date.now() && !item.externalCancelNumber;
		});

		let currentRes = reservations.filter((item) => {
			let date = new Date(item.departureDate);
			return date.getTime() > Date.now() && !item.externalCancelNumber;
		});

		setUpComingReservations(currentRes);
		setPreviousReservations(prevReservations);
	}, [reservations]);

	function groupMatchingItineraries(
		reservationArray: Api.Reservation.Res.Get[]
	): { itineraryId: string; reservations: Api.Reservation.Res.Get[] }[] {
		let itineraries: { itineraryId: string; reservations: Api.Reservation.Res.Get[] }[] = [];
		reservationArray.forEach((item, index) => {
			let itineraryGroup = reservationArray.filter((reservation, reservationIndex) => {
				return item.itineraryId === reservation.itineraryId;
			});
			let itineraryExist = itineraries.find((itineraries) => itineraries.itineraryId === item.itineraryId);
			if (!itineraryExist) itineraries.push({ itineraryId: item.itineraryId, reservations: itineraryGroup });
		});
		return itineraries;
	}

	function renderUpcomingReservations() {
		if (!ObjectUtils.isArrayWithData(upComingReservations)) return;

		let itineraries = groupMatchingItineraries(upComingReservations);
		return itineraries.map((item, index) => {
			let reservation = item.reservations[0];
			return (
				<ReservationCard
					key={reservation.id}
					itineraryId={item.itineraryId}
					imgPath={reservation.destination.heroUrl}
					logo={reservation.destination.logoUrl}
					title={'Itinerary-' + reservation.destination.name}
					address={`${reservation.destination.address1}, ${reservation.destination.city}, ${reservation.destination.state} ${reservation.destination.zip}`}
					reservationDates={{ startDate: reservation.arrivalDate, endDate: reservation.departureDate }}
					propertyType={'VIP Suite'}
					maxOccupancy={reservation.accommodation.maxOccupantCount}
					amenities={reservation.accommodation.featureIcons}
					totalCostCents={reservation.priceDetail.grandTotalCents}
					totalPoints={1000} //This needs to be added to the endpoint.
					linkPath={'/reservations/itinerary/details?ii=' + reservation.itineraryId}
					cancelPermitted={reservation.cancellationPermitted}
					itineraryTotal={item.reservations.reduce(
						(total, reservation) => (total += reservation.priceDetail.grandTotalCents),
						0
					)}
				/>
			);
		});
	}

	function renderPrevReservations() {
		if (!ObjectUtils.isArrayWithData(previousReservations)) return;

		let itineraries = groupMatchingItineraries(previousReservations);

		return itineraries.map((item, index) => {
			let reservation = item.reservations[0];
			return (
				<ReservationCard
					key={reservation.id}
					itineraryId={item.itineraryId}
					imgPath={reservation.destination.heroUrl}
					logo={reservation.destination.logoUrl}
					title={reservation.destination.name}
					address={`${reservation.destination.address1}, ${reservation.destination.city}, ${reservation.destination.state} ${reservation.destination.zip}`}
					reservationDates={{ startDate: reservation.arrivalDate, endDate: reservation.departureDate }}
					propertyType={'VIP Suite'}
					maxOccupancy={reservation.accommodation.maxOccupantCount}
					amenities={reservation.accommodation.featureIcons}
					totalCostCents={reservation.priceDetail.grandTotalCents}
					totalPoints={1000} //This needs to be added to the endpoint.
					linkPath={'/reservations/itinerary/details?ii=' + reservation.itineraryId}
					cancelPermitted={0}
					itineraryTotal={item.reservations.reduce(
						(total, reservation) => (total += reservation.priceDetail.grandTotalCents),
						0
					)}
				/>
			);
		});
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsExistingItineraryPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box m={'140px auto'} maxWidth={1160}>
					<h1>Your Upcoming Reservations</h1>
					{renderUpcomingReservations()?.reverse()}
					<h1>Past Stays</h1>
					{renderPrevReservations()}
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default ExistingItineraryPage;