import * as React from 'react';
import './ExistingReservationPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import ReservationCard from '../../components/reservationCard/ReservationCard';

interface ReservationPageProps {}

const ExistingReservationPage: React.FC<ReservationPageProps> = (props) => {
	return (
		<Page className={'rsExistingReservationPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box mt={140}>
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
