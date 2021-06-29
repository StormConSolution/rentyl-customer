import './BookingFlowCheckoutPage.scss';
import PaymentService from '../../services/payment/payment.service';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import React, { useEffect, useState } from 'react';
import router from '../../utils/router';
import LabelButton from '../../components/labelButton/LabelButton';
import Box from '../../components/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import { convertTwentyFourHourTime, StringUtils } from '../../utils/utils';
import ContactInfoAndPaymentCard from './contactInfoAndPaymentCard/ContactInfoAndPaymentCard';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import BookingCartTotalsCard from '../bookingFlowPage/bookingCartTotalsCard/BookingCartTotalsCard';
import rsToasts from '@bit/redsky.framework.toast';
import Paper from '../../components/paper/Paper';

interface Stay extends Omit<Api.Reservation.Req.Itinerary.Stay, 'numberOfAccommodations'> {
	accommodationName: string;
	prices: Api.Reservation.PriceDetail;
	checkInTime: string;
	checkoutTime: string;
}

const BookingFlowCheckoutPage = () => {
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const destinationId = params.data.destinationId;
	const [accommodations, setAccommodations] = useState<Stay[]>([]);
	const [destinationName, setDestinationName] = useState<string>('');
	const [policies, setPolicies] = useState<{ type: Model.DestinationPolicyType; value: string }[]>([]);
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [existingCardId, setExistingCardId] = useState<number>(0);
	const [creditCardForm, setCreditCardForm] = useState<{
		full_name: string;
		month: number;
		year: number;
		cardId: number;
	}>();

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
		let subscribeId = paymentService.subscribeToSpreedlyError(() => {});
		let paymentMethodId = paymentService.subscribeToSpreedlyPaymentMethod(
			async (token: string, pmData: Api.Payment.PmData) => {
				let data = {
					paymentMethodId: 0,
					destinationId: destinationId,
					stays: accommodations.map((accommodation) => {
						return {
							accommodationId: accommodation.accommodationId,
							numberOfAccommodations: 1,
							arrivalDate: accommodation.arrivalDate,
							departureDate: accommodation.departureDate,
							adultCount: accommodation.adultCount,
							childCount: accommodation.childCount,
							rateCode: accommodation.rateCode
						};
					})
				};
				try {
					const result = await paymentService.addPaymentMethod({ cardToken: token, pmData });
					data.paymentMethodId = result.id;
					// don't create a reservation just because data changed?
					let res = await reservationService.createItenerary(data);
					popupController.close(SpinningLoaderPopup);
					let newData = {
						// confirmationCode: res.confirmationCode,
						destinationName: destinationName
					};

					router
						.navigate(`/success?data=${JSON.stringify(newData)}`, { clearPreviousHistory: true })
						.catch(console.error);
				} catch (e) {
					popupController.close(SpinningLoaderPopup);
				}
			}
		);
		return () => {
			paymentService.unsubscribeToSpreedlyError(subscribeId);
			paymentService.unsubscribeToSpreedlyPaymentMethod(paymentMethodId);
		};
	}, [creditCardForm]);

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

	async function completeBooking() {
		popupController.open(SpinningLoaderPopup);
		if (!existingCardId && creditCardForm) {
			let paymentObj = {
				full_name: creditCardForm.full_name,
				month: creditCardForm.month,
				year: creditCardForm.year
			};
			window.Spreedly.tokenizeCreditCard(paymentObj);
		} else {
			if (!accommodations || !existingCardId) throw new Error('Missing proper data or existing card is invalid');
			let data = {
				paymentMethodId: existingCardId,
				destinationId: destinationId,
				stays: accommodations.map((accommodation) => {
					return {
						accommodationId: accommodation.accommodationId,
						numberOfAccommodations: 1,
						arrivalDate: accommodation.arrivalDate,
						departureDate: accommodation.departureDate,
						adultCount: accommodation.adultCount,
						childCount: accommodation.childCount,
						rateCode: accommodation.rateCode
					};
				})
			};
			try {
				let res = await reservationService.createItenerary(data);
				if (res) popupController.close(SpinningLoaderPopup);
				let newData = {
					iteneraryNumber: res.itineraryNumber
				};

				router
					.navigate(`/success?data=${JSON.stringify(newData)}`, { clearPreviousHistory: true })
					.catch(console.error);
			} catch (e) {
				popupController.close(SpinningLoaderPopup);
			}
		}
	}

	function renderContactInfo() {
		return (
			<ContactInfoAndPaymentCard
				onContactChange={(value) => {
					console.log('Contact Form: ', value);
				}}
				onCreditCardChange={(value) => {
					let newValue: any = {
						full_name: value.full_name
					};
					newValue.month = parseInt(value.expDate.split('/')[0]);
					newValue.year = parseInt(value.expDate.split('/')[1]);

					setCreditCardForm(newValue);
				}}
				isValidForm={(isValid) => {
					setIsFormValid(isValid);
				}}
				onExistingCardSelect={(value) => {
					setExistingCardId(value);
				}}
			/>
		);
	}

	function renderPolicies() {
		// if (!reservationData) return;
		return (
			<Box>
				<Box display={'flex'}>
					<div className={'labelGroup'}>
						<Label variant={'h4'}>{policies[policies.findIndex((p) => p.type === 'CheckIn')]?.type}</Label>
						<Label variant={'body1'}>
							{convertTwentyFourHourTime(
								policies[policies.findIndex((p) => p.type === 'CheckIn')]?.value
							)}
						</Label>
					</div>
					<div className={'labelGroup'}>
						<Label variant={'h4'}>{policies[policies.findIndex((p) => p.type === 'CheckOut')]?.type}</Label>
						<Label variant={'body1'}>
							{convertTwentyFourHourTime(
								policies[policies.findIndex((p) => p.type === 'CheckOut')]?.value
							)}
						</Label>
					</div>
				</Box>
				<Label variant={'body1'} mb={10}>
					{destinationName}
				</Label>
				<div className={'labelGroup'}>
					<Label variant={'h4'}>{policies[policies.findIndex((p) => p.type === 'Cancellation')]?.type}</Label>
					<Label variant={'body1'}>
						{policies[policies.findIndex((p) => p.type === 'Cancellation')]?.value}
					</Label>
				</div>
			</Box>
		);
	}

	function renderAcknowledgement() {
		return (
			<Box>
				<Label variant={'h2'}>Acknowledgement</Label>
				<LabelCheckbox
					value={1}
					text={'* I agree with the Privacy Terms.'}
					isChecked={hasAgreedToTerms}
					onSelect={() => {
						setHasAgreedToTerms(true);
					}}
					onDeselect={() => {
						setHasAgreedToTerms(false);
					}}
				/>
				<Label variant={'h4'}>By completing this booking, I agree with the booking conditions</Label>
			</Box>
		);
	}

	function renderItinerary() {
		return (
			<Paper>
				<Label variant={'h2'}>Your Stay</Label>
				{renderAccommodationDetails()}
				<Label
					variant={'h1'}
					onClick={() => {
						router.navigate(`/booking/add-room?data=${JSON.stringify(params.data)}`);
					}}
				>
					Add Room +
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
			</Paper>
		);
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

	return (
		<Page className={'rsBookingFlowCheckoutPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box>
					{renderContactInfo()}
					{renderPolicies()}
					{renderAcknowledgement()}
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Complete Booking'}
						disabled={!isFormValid || !hasAgreedToTerms}
						onClick={() => {
							completeBooking().catch(console.error);
						}}
					/>
				</Box>
				{renderItinerary()}
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default BookingFlowCheckoutPage;
