import { Box, popupController } from '@bit/redsky.framework.rs.996';
import React, { useEffect, useState } from 'react';
import DestinationPackageTile from '../destinationPackageTile/DestinationPackageTile';
import ContactInfoAndPaymentCard from '../contactInfoAndPaymentCard/ContactInfoAndPaymentCard';
import Label from '@bit/redsky.framework.rs.label';
import { convertTwentyFourHourTime } from '../../../utils/utils';
import LabelCheckbox from '../../../components/labelCheckbox/LabelCheckbox';
import { Booking } from '../fakeBookingData';
import LabelButton from '../../../components/labelButton/LabelButton';
import SpinningLoaderPopup from '../../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import router from '../../../utils/router';
import serviceFactory from '../../../services/serviceFactory';
import PaymentService from '../../../services/payment/payment.service';
import ReservationsService from '../../../services/reservations/reservations.service';

interface Stay extends Omit<Api.Reservation.Req.Itinerary.Stay, 'numberOfAccommodations'> {
	accommodationName: string;
}
interface BookingCheckoutProps {
	accommodations: Stay[];
	destinationId: number;
	policies: { type: Model.DestinationPolicyType; value: string }[];
	destinationName: string;
}
const BookingCheckout: React.FC<BookingCheckoutProps> = (props) => {
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [addedPackages, setAddedPackages] = useState<Booking.BookingPackageDetails[]>([]);
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
		let subscribeId = paymentService.subscribeToSpreedlyError(() => {});
		let paymentMethodId = paymentService.subscribeToSpreedlyPaymentMethod(
			async (token: string, pmData: Api.Payment.PmData) => {
				let data = {
					paymentMethodId: 0,
					destinationId: props.destinationId,
					stays: props.accommodations.map((accommodation) => {
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
						destinationName: props.destinationName
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
			if (!props.accommodations || !existingCardId)
				throw new Error('Missing proper data or existing card is invalid');
			let data = {
				paymentMethodId: existingCardId,
				destinationId: props.destinationId,
				stays: props.accommodations.map((accommodation) => {
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

	function renderPackages() {
		// if (!props.reservationData) return;
		// return props.reservationData.destinationPackages.map((item, index) => {
		// 	let defaultImage = item.media.find((value) => value.isPrimary);
		// 	let isAdded = addedPackages.find((value) => value.id === item.id);
		// 	if (isAdded) return false;
		//
		// 	return (
		// 		<DestinationPackageTile
		// 			title={item.title}
		// 			description={item.description}
		// 			priceCents={item.priceCents}
		// 			imgUrl={defaultImage?.urls.large || ''}
		// 			onAddPackage={() => {
		// 				let newPackages = [...addedPackages, item];
		// 				setAddedPackages(newPackages);
		// 			}}
		// 		/>
		// 	);
		// });
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
		// if (!props.reservationData) return;
		return (
			<Box>
				<Box display={'flex'}>
					<div className={'labelGroup'}>
						<Label variant={'h4'}>
							{props.policies[props.policies.findIndex((p) => p.type === 'CheckIn')]?.type}
						</Label>
						<Label variant={'body1'}>
							{convertTwentyFourHourTime(
								props.policies[props.policies.findIndex((p) => p.type === 'CheckIn')]?.value
							)}
						</Label>
					</div>
					<div className={'labelGroup'}>
						<Label variant={'h4'}>
							{props.policies[props.policies.findIndex((p) => p.type === 'CheckOut')]?.type}
						</Label>
						<Label variant={'body1'}>
							{convertTwentyFourHourTime(
								props.policies[props.policies.findIndex((p) => p.type === 'CheckOut')]?.value
							)}
						</Label>
					</div>
				</Box>
				<Label variant={'body1'} mb={10}>
					{props.destinationName}
				</Label>
				<div className={'labelGroup'}>
					<Label variant={'h4'}>
						{props.policies[props.policies.findIndex((p) => p.type === 'Cancellation')]?.type}
					</Label>
					<Label variant={'body1'}>
						{props.policies[props.policies.findIndex((p) => p.type === 'Cancellation')]?.value}
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
	return (
		<Box>
			{renderPackages()}
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
	);
};

export default BookingCheckout;
