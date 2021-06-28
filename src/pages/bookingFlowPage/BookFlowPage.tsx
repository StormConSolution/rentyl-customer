import React, { useEffect, useState } from 'react';
import './BookFlowPage.scss';
import Paper from '../../components/paper/Paper';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
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
import moment from 'moment';
import BookingCartTotalsCard from './bookingCartTotalsCard/BookingCartTotalsCard';
import { StringUtils } from '../../utils/utils';
import LoadingPage from '../loadingPage/LoadingPage';

interface Stay extends Omit<Api.Reservation.Req.Itinerary.Stay, 'numberOfAccommodations'> {
	accommodationName: string;
	prices: Api.Reservation.PriceDetail;
	checkInTime: string;
	checkoutTime: string;
}

const BookFlowPage = () => {
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const destinationId = params.data.destinationId;
	const [accommodations, setAccommodations] = useState<Stay[]>([]);
	const [addRoom, setAddRoom] = useState<boolean>(false);
	const [policies, setPolicies] = useState<{ type: Model.DestinationPolicyType; value: string }[]>([]);
	const [destinationName, setDestinationName] = useState<string>('');
	const [creditCardForm, setCreditCardForm] = useState<{
		full_name: string;
		month: number;
		year: number;
		cardId: number;
	}>();

	// const [reservationData, setReservationData] = useState<Api.Reservation.Res.Verification>();
	//// WHY ARE WE VERIFYING AVAILABILITY ON THE PAGE LOAD? I think it's valid to make sure the places are still valid just in case, but then I need to do it
	//// even with multiple stays so it should fire when the stays change?
	// useEffect(() => {
	// 	if (!params) return;
	// 	async function getAccommodationDetails() {
	// 		params.data.numberOfAccommodations = 1;
	// 		try {
	// 			let response = await reservationService.verifyAvailability(params.data);
	// 			//fix this line of code should be able to just set as response
	// 			if (response.data.data) setReservationData(response.data.data);
	// 		} catch (e) {
	// 			//not sure i want this error message?
	// 			rsToasts.error(e.message);
	// 			router.back();
	// 		}
	// 	}
	//
	// 	getAccommodationDetails().catch(console.error);
	// }, []);

	useEffect(() => {
		async function getAccommodationDetails() {
			try {
				const rooms: Stay[] = await Promise.all(
					params.data.stays.map(
						async (accommodation: Omit<Api.Reservation.Req.Verification, 'numberOfAccommodations'>) => {
							return addAccommodation(accommodation);
						}
					)
				);
				if (rooms) setAccommodations(rooms);
			} catch (e) {
				rsToasts.error(e.message);
				router.back();
			}
		}
		getAccommodationDetails().catch(console.error);
	}, []);

	useEffect(() => {
		let stays = accommodations.map((accommodation) => {
			return {
				adults: accommodation.adultCount,
				children: accommodation.childCount,
				rate: accommodation.rateCode,
				accommodationId: accommodation.accommodationId,
				arrivalDate: accommodation.arrivalDate,
				departureDate: accommodation.departureDate
			};
		});
		router.updateUrlParams({
			data: JSON.stringify({ destinationId: params.data.destinationId, stays })
		});
	}, [accommodations]);

	async function addAccommodation(
		data: Omit<Api.Reservation.Req.Verification, 'numberOfAccommodations'>
	): Promise<Stay | undefined> {
		let response = await reservationService.verifyAvailability({
			accommodationId: data.accommodationId,
			destinationId: destinationId,
			adults: data.adults,
			children: data.children,
			rateCode: data.rateCode,
			arrivalDate: data.arrivalDate,
			departureDate: data.departureDate,
			numberOfAccommodations: 1
		});
		if (response.data.data) {
			let res = response.data.data;
			let stay: Stay = {
				accommodationId: data.accommodationId,
				accommodationName: res.accommodationName,
				arrivalDate: res.checkInDate,
				departureDate: res.checkoutDate,
				adultCount: res.adults,
				childCount: res.children,
				rateCode: res.rateCode,
				prices: res.prices,
				checkInTime: res.checkInTime,
				checkoutTime: res.checkoutTime
			};
			setPolicies(res.policies);
			setDestinationName(res.destinationName);
			return stay;
		}
		return;
	}

	function renderAccommodationDetails() {
		return (
			<Box>
				{accommodations.map((accommodation, index) => {
					return (
						<BookingCartTotalsCard
							key={index}
							checkInTime={accommodation.checkInTime}
							checkoutTime={accommodation.checkoutTime}
							checkInDate={accommodation.arrivalDate}
							checkoutDate={accommodation.departureDate}
							accommodationName={accommodation.accommodationName}
							accommodationTotalInCents={accommodation.prices.accommodationTotalInCents}
							taxAndFeeTotalInCent={accommodation.prices.taxAndFeeTotalInCents}
							feeTotalsInCents={accommodation.prices.feeTotalsInCents}
							taxTotalsInCents={accommodation.prices.taxTotalsInCents}
							costPerNight={accommodation.prices.accommodationDailyCostsInCents}
							adults={accommodation.adultCount}
							children={accommodation.childCount}
							grandTotalCents={accommodation.prices.grandTotalCents}
							packages={[]}
							onDeletePackage={(packageId) => {
								// let newPackages = [...addedPackages];
								// newPackages = newPackages.filter((item) => item.id !== packageId);
								// setAddedPackages(newPackages);
							}}
						/>
					);
				})}
			</Box>
		);
	}

	function renderItinerary() {
		return (
			<Box>
				<Label variant={'h2'}>Your Stay</Label>
				{renderAccommodationDetails()}
				<Label variant={'h1'} onClick={() => setAddRoom(!addRoom)}>
					{!addRoom ? 'Add Room +' : 'Continue to checkout'}
				</Label>
				<Label variant={'h2'}>
					Total:{' '}
					{StringUtils.formatMoney(
						accommodations.reduce(
							(total, accommodation) => (total += accommodation.prices.grandTotalCents),
							0
						)
					)}
				</Label>
			</Box>
		);
	}

	return accommodations.length < 1 ? (
		<LoadingPage />
	) : (
		<Page className={'rsBookFlowPage'}>
			<div className={'rs-page-content-wrapper'}>
				{addRoom ? (
					<BookingAvailability
						destinationId={params.data.destinationId}
						adults={1}
						startDate={moment(accommodations[0].arrivalDate)}
						endDate={moment(accommodations[0].departureDate)}
						children={0}
						bookNow={async (data) => {
							let stay = await addAccommodation(data);
							if (stay) {
								setAccommodations([...accommodations, stay]);
								setAddRoom(false);
							}
						}}
						rateCode={accommodations[0].rateCode}
					/>
				) : (
					<BookingCheckout
						accommodations={accommodations}
						destinationId={params.data.destinationId}
						policies={policies}
						destinationName={destinationName}
					/>
				)}
				{renderItinerary()}
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default BookFlowPage;
