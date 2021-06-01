import * as React from 'react';
import './ExistingReservationPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import ReservationCard from '../../components/reservationCard/ReservationCard';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import LoadingPage from '../loadingPage/LoadingPage';
import { useEffect } from 'react';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';

interface ReservationPageProps {}

const ExistingReservationPage: React.FC<ReservationPageProps> = (props) => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');

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
			} catch (e) {
				console.error(e);
			}
		}
		getReservationsForUser().catch(console.error);
	}, []);

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsExistingReservationPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box m={'140px auto'} maxWidth={1160}>
					<h1>Your Upcoming Reservations</h1>
					<ReservationCard
						imgPath={require('../../images/aboutSpirePage/couple-beach.png')}
						logo={require('../../images/FullLogo-StandardBlack.png')}
						title={"Bear's Den"}
						address={'7635 Fairfax Dr, Reunion, FL 34747'}
						reservationDates={{ startDate: 'May 16 2020', endDate: 'May 22, 2020' }}
						propertyType={'VIP Suite'}
						sleeps={5}
						maxOccupancy={5}
						amenities={[]}
						totalCostCents={188334}
						totalPoints={1000}
						onViewDetailsClick={() => {
							console.log('clicked');
						}}
					/>
				</Box>
			</div>
		</Page>
	);
};

export default ExistingReservationPage;
