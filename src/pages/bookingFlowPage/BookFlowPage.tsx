import React, { useEffect, useState } from 'react';
import './BookFlowPage.scss';
import Paper from '../../components/paper/Paper';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import rsToasts from '@bit/redsky.framework.toast';
import router from '../../utils/router';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import PaymentService from '../../services/payment/payment.service';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import BookingAvailability from './bookingAvailability/BookingAvailability';
import BookingCheckout from './bookingCheckout/BookingCheckout';
import AccommodationDetails from './accomodationDetails/AccommodationDetails';

const BookFlowPage = () => {
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [addRoom, setAddRoom] = useState<boolean>(false);

	const [creditCardForm, setCreditCardForm] = useState<{
		full_name: string;
		month: number;
		year: number;
		cardId: number;
	}>();

	const [reservationData, setReservationData] = useState<Api.Reservation.Res.Verification>();
	//what is this disabling?

	const [accomodations, setAccomodations] = useState<any[]>([1, 2]);

	useEffect(() => {
		if (!params) return;
		async function getAccommodationDetails() {
			params.data.numberOfAccommodations = 1;
			try {
				let response = await reservationService.verifyAvailability(params.data);
				//fix this line of code should be able to just set as response
				if (response.data.data) setReservationData(response.data.data);
			} catch (e) {
				//not sure i want this error message?
				rsToasts.error(e.message);
				router.back();
			}
		}

		getAccommodationDetails().catch(console.error);
	}, []);

	//not sure all this is doing, copied from other page

	function renderAccomodatonDetails() {
		return (
			<Box>
				{accomodations.map((accommodation, index) => {
					return (
						<AccommodationDetails
							key={index}
							room={index + 1}
							accommodationName={reservationData ? reservationData.accommodationName : ''}
						/>
					);
				})}
			</Box>
		);
	}

	function renderItenerary() {
		return (
			<Box>
				<Label variant={'h2'}>Your Stay</Label>
				{renderAccomodatonDetails()}
				<Label variant={'body1'} onClick={() => setAddRoom(!addRoom)}>
					Add Room +
				</Label>
				<Label variant={'h2'}>Total: </Label>
			</Box>
		);
	}

	return (
		<Paper className={'rsBookFlowPage'}>
			{addRoom ? (
				<BookingAvailability destinationId={params.data.destinationId} />
			) : (
				<BookingCheckout
					reservationData={reservationData}
					accommodationId={params.data.accommodationId}
					destinationId={params.data.destinationId}
				/>
			)}
			{renderItenerary()}
			<Footer links={FooterLinkTestData} />
		</Paper>
	);
};

export default BookFlowPage;
