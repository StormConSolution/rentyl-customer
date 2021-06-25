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

interface BookingCheckoutProps {
	reservationData?: Api.Reservation.Res.Verification;
	destinationId: number;
	accommodationId: number;
}
const BookingCheckout: React.FC<BookingCheckoutProps> = (props) => {
	let existingCardId = 0;
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [addedPackages, setAddedPackages] = useState<Booking.BookingPackageDetails[]>([]);
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
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
				let data: any = await getReservationData();
				if (!data) return;
				try {
					const result = await paymentService.addPaymentMethod({ cardToken: token, pmData });
					data.paymentMethodId = result.id;
					data.destinationId = props.destinationId;
					let res = await reservationService.create(data);
					popupController.close(SpinningLoaderPopup);
					setIsDisabled(false);
					let newData = {
						confirmationCode: res.confirmationCode,
						destinationName: props.reservationData!.destinationName
					};

					router
						.navigate(`/success?data=${JSON.stringify(newData)}`, { clearPreviousHistory: true })
						.catch(console.error);
				} catch (e) {
					setIsDisabled(false);
					popupController.close(SpinningLoaderPopup);
				}
			}
		);
		return () => {
			paymentService.unsubscribeToSpreedlyError(subscribeId);
			paymentService.unsubscribeToSpreedlyPaymentMethod(paymentMethodId);
		};
	}, [props.reservationData, creditCardForm]);

	function getReservationData() {
		if (!props.reservationData) return;
		return {
			accommodationId: props.accommodationId,
			adults: props.reservationData.adults,
			children: props.reservationData.children,
			arrivalDate: props.reservationData.checkInDate,
			departureDate: props.reservationData.checkoutDate,
			rateCode: props.reservationData.rateCode,
			numberOfAccommodations: 1
		};
	}

	function renderPackages() {
		if (!props.reservationData) return;
		return props.reservationData.destinationPackages.map((item, index) => {
			let defaultImage = item.media.find((value) => value.isPrimary);
			let isAdded = addedPackages.find((value) => value.id === item.id);
			if (isAdded) return false;

			return (
				<DestinationPackageTile
					title={item.title}
					description={item.description}
					priceCents={item.priceCents}
					imgUrl={defaultImage?.urls.large || ''}
					onAddPackage={() => {
						let newPackages = [...addedPackages, item];
						setAddedPackages(newPackages);
					}}
				/>
			);
		});
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
					existingCardId = value;
				}}
			/>
		);
	}

	function renderPolicies() {
		if (!props.reservationData) return;
		return (
			<Box>
				<Box display={'flex'}>
					<div className={'labelGroup'}>
						<Label variant={'h4'}>
							{
								props.reservationData.policies[
									props.reservationData.policies.findIndex((p) => p.type === 'CheckIn')
								].type
							}
						</Label>
						<Label variant={'body1'}>
							{convertTwentyFourHourTime(
								props.reservationData.policies[
									props.reservationData.policies.findIndex((p) => p.type === 'CheckIn')
								].value
							)}
						</Label>
					</div>
					<div className={'labelGroup'}>
						<Label variant={'h4'}>
							{
								props.reservationData.policies[
									props.reservationData.policies.findIndex((p) => p.type === 'CheckOut')
								].type
							}
						</Label>
						<Label variant={'body1'}>
							{convertTwentyFourHourTime(
								props.reservationData.policies[
									props.reservationData.policies.findIndex((p) => p.type === 'CheckOut')
								].value
							)}
						</Label>
					</div>
				</Box>
				<Label variant={'body1'} mb={10}>
					{props.reservationData.accommodationName}
				</Label>
				<div className={'labelGroup'}>
					<Label variant={'h4'}>
						{
							props.reservationData.policies[
								props.reservationData.policies.findIndex((p) => p.type === 'Cancellation')
							].type
						}
					</Label>
					<Label variant={'body1'}>
						{
							props.reservationData.policies[
								props.reservationData.policies.findIndex((p) => p.type === 'Cancellation')
							].value
						}
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
				disabled={isDisabled}
				onClick={() => {}}
			/>
		</Box>
	);
};

export default BookingCheckout;
