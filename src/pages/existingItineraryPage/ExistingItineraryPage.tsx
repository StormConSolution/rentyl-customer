import * as React from 'react';
import './ExistingItineraryPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import ItineraryCard from '../../components/itineraryCard/ItineraryCard';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import LoadingPage from '../loadingPage/LoadingPage';
import { useEffect, useState } from 'react';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../../utils/utils';

const ExistingItineraryPage: React.FC = () => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [loading, setLoading] = useState<boolean>(true);
	const [itineraries, setItineraries] = useState<Api.Reservation.Res.Itinerary.Get[]>([]);
	const [upcomingItineraries, setUpcomingItineraries] = useState<Api.Reservation.Res.Itinerary.Get[]>([]);
	const [previousItineraries, setPreviousItineraries] = useState<Api.Reservation.Res.Itinerary.Get[]>([]);

	useEffect(() => {
		if (!user) return;

		async function getReservationsForUser() {
			let pageQuery: RedSky.PageQuery = {
				filter: {
					matchType: 'exact',
					searchTerm: [
						{
							column: 'userId',
							value: user!.id
						}
					]
				},
				pagination: {
					page: 1,
					perPage: 500
				},
				sort: {
					field: 'userId',
					order: 'ASC'
				}
			};
			try {
				let res = await reservationService.getByPage(pageQuery);
				setItineraries(res.data);
			} catch (e) {
				console.error(e);
			}
		}
		getReservationsForUser().catch(console.error);
	}, []);

	useEffect(() => {
		try {
			if (!ObjectUtils.isArrayWithData(itineraries)) return;
			let prevItineraries = itineraries.filter((itinerary) => {
				let sortedStays = itinerary.stays;
				sortedStays.sort(
					(stay1, stay2) => new Date(stay2.departureDate).getTime() - new Date(stay1.departureDate).getTime()
				);
				let date = new Date(sortedStays[0].departureDate);
				return date.getTime() < Date.now();
			});

			let currentItineraries = itineraries.filter((itinerary) => {
				let sortedStays = itinerary.stays;
				sortedStays.sort(
					(stay1, stay2) => new Date(stay2.departureDate).getTime() - new Date(stay1.departureDate).getTime()
				);
				let date = new Date(sortedStays[0].departureDate);
				return date.getTime() >= Date.now();
			});

			setUpcomingItineraries(currentItineraries);
			setPreviousItineraries(prevItineraries);
			setLoading(false);
		} catch (e) {
			rsToastify.error(
				WebUtils.getRsErrorMessage(e, 'There was a problem getting your reservations'),
				"Can't Get Reservations"
			);
		}
	}, [itineraries]);

	function renderUpcomingReservations() {
		if (!ObjectUtils.isArrayWithData(upcomingItineraries)) return;

		return itineraries.map((itinerary) => {
			return (
				<ItineraryCard
					key={itinerary.stays[0].reservationId}
					itineraryId={itinerary.itineraryId}
					imgPaths={itinerary.destination.media.map((item) => item.urls.imageKit)}
					logo={itinerary.destination.logoUrl}
					title={'Itinerary-' + itinerary.destination.name}
					address={`${itinerary.destination.address1}, ${itinerary.destination.city}, ${itinerary.destination.state} ${itinerary.destination.zip}`}
					reservationDates={{
						startDate: itinerary.stays[0].arrivalDate,
						endDate: itinerary.stays[0].departureDate
					}}
					propertyType={'VIP Suite'}
					maxOccupancy={itinerary.stays[0].accommodation.maxOccupantCount}
					amenities={itinerary.stays[0].accommodation.featureIcons}
					totalPoints={itinerary.stays[0].priceDetail.grandTotalPoints}
					linkPath={'/itineraries/itinerary/details?ii=' + itinerary.itineraryId}
					cancelPermitted={itinerary.stays[0].cancellationPermitted}
					itineraryTotal={itinerary.stays.reduce((total, reservation) => {
						return total + reservation.priceDetail.grandTotalCents;
					}, 0)}
					paidWithPoints={!itinerary.paymentMethod}
				/>
			);
		});
	}

	function renderPrevReservations() {
		if (!ObjectUtils.isArrayWithData(previousItineraries)) return;

		return itineraries.map((itinerary) => {
			let pointTotal = itinerary.stays.reduce((total, reservation) => {
				return total + reservation.priceDetail.grandTotalPoints;
			}, 0);
			let cashTotal = itinerary.stays.reduce((total, reservation) => {
				return total + reservation.priceDetail.grandTotalCents;
			}, 0);
			return (
				<ItineraryCard
					key={itinerary.stays[0].reservationId}
					itineraryId={itinerary.itineraryId}
					imgPaths={itinerary.destination.media.map((item) => item.urls.imageKit)}
					logo={itinerary.destination.logoUrl}
					title={itinerary.destination.name}
					address={`${itinerary.destination.address1}, ${itinerary.destination.city}, ${itinerary.destination.state} ${itinerary.destination.zip}`}
					reservationDates={{
						startDate: itinerary.stays[0].arrivalDate,
						endDate: itinerary.stays[0].departureDate
					}}
					propertyType={'VIP Suite'}
					maxOccupancy={itinerary.stays[0].accommodation.maxOccupantCount}
					amenities={itinerary.stays[0].accommodation.featureIcons}
					totalPoints={pointTotal}
					linkPath={'/itineraries/itinerary/details?ii=' + itinerary.itineraryId}
					cancelPermitted={0}
					itineraryTotal={cashTotal}
					paidWithPoints={!itinerary.paymentMethod}
				/>
			);
		});
	}

	return loading ? (
		<LoadingPage />
	) : (
		<Page className={'rsExistingItineraryPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box m={'140px auto'} maxWidth={1160}>
					<h1>Your Upcoming Reservations</h1>
					{renderUpcomingReservations()?.reverse()}
					<h1 className={'pastStays'}>Past Stays</h1>
					{renderPrevReservations()}
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default ExistingItineraryPage;
