import * as React from 'react';
import './SuccessPage.scss';
import { Box, Link, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import router from '../../utils/router';
import Footer from '../../components/footer/Footer';
import { useEffect, useState } from 'react';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import LabelLink from '../../components/labelLink/LabelLink';
import { FooterLinks } from '../../components/footer/FooterLinks';

interface SuccessPageProps {}
type SuccessData = {
	itineraryNumber: string;
	destinationName: string;
};

const SuccessPage: React.FC<SuccessPageProps> = (props) => {
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	let successData: SuccessData = JSON.parse(params.data);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');

	const [reservationNumbers, setReservationNumbers] = useState<{ reservationId: number; confirmationId: string }[]>(
		[]
	);
	useEffect(() => {
		async function getReservationNumbers() {
			let itinerary = await reservationService.getItinerary({ itineraryId: successData.itineraryNumber });
			setReservationNumbers(
				itinerary.stays.map((reservation) => {
					return {
						reservationId: reservation.reservationId,
						confirmationId: reservation.reservationId + '-' + reservation.externalReservationId
					};
				})
			);
		}
		getReservationNumbers().catch(console.error);
	}, []);

	return (
		<Page className={'rsSuccessPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box className={'contentWrapper'}>
					<img src={require('../../images/FullLogo-StandardBlack.png')} alt={'Spire Logo'} />
					<Label variant={'h1'} mt={20}>
						Thank you for your reservation at
						<br /> <span>{successData.destinationName}</span>
						<br /> Your itinerary number is: <span>{successData.itineraryNumber}</span>.
						<br /> Access all your reservations <Link path={'/reservations'}>here</Link>.
					</Label>
					<Box>
						<hr />
						<Label variant={'h3'}>Your Reservations</Label>

						{reservationNumbers.map((reservationNumber) => (
							<LabelLink
								variant={'h4'}
								path={`/reservations/itinerary/reservation/details?ri=${reservationNumber.reservationId}`}
								label={reservationNumber.confirmationId}
							/>
						))}
					</Box>
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default SuccessPage;
