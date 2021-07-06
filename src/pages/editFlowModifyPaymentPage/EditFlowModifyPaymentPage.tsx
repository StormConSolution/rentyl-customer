import React, { useState } from 'react';
import ContactInfoAndPaymentCard from '../../components/contactInfoAndPaymentCard/ContactInfoAndPaymentCard';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import LoadingPage from '../loadingPage/LoadingPage';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../../components/labelButton/LabelButton';
import BookingCartTotalsCard from '../bookingFlowCheckoutPage/bookingCartTotalsCard/BookingCartTotalsCard';

const EditFlowModifyPaymentPage = () => {
	const size = useWindowResizeChange();
	let existingCardId = 0;
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [policies, setPolicies] = useState<{ type: Model.DestinationPolicyType; value: string }[]>([]);
	const [creditCardForm, setCreditCardForm] = useState<{
		full_name: string;
		month: number;
		year: number;
		cardId: number;
	}>();
	const [reservation, setReservation] = useState();

	//userService.getCurrentUser()???
	//has PaymentMethods and
	async function updateInformation() {}

	return !!reservation ? (
		<LoadingPage />
	) : (
		<Page className={'rsEditFlowModifyPaymentPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box display={'flex'}>
					<Label variant={'h4'}>You are editing your reservation</Label>
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Dismiss Edits'}
						onClick={() => {}}
					/>
				</Box>
				<hr />
				<Box
					padding={size === 'small' ? '0 15px' : '0 25px'}
					boxSizing={'border-box'}
					display={'flex'}
					width={'100%'}
					justifyContent={'space-evenly'}
					alignItems={'flex-start'}
					position={'relative'}
					height={'fit-content'}
				>
					<Box>
						<ContactInfoAndPaymentCard
							onContactChange={(value) => {}}
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
						<LabelButton
							className={'completeBookingBtn'}
							look={isDisabled ? 'containedSecondary' : 'containedPrimary'}
							variant={'button'}
							label={'Update Information'}
							onClick={() => {
								updateInformation().catch(console.error);
							}}
							disabled={isDisabled}
						/>
					</Box>
					<Box>
						<BookingCartTotalsCard
							checkInTime={'1600'}
							checkoutTime={'1000'}
							checkInDate={'2021-07-03'}
							checkoutDate={'2021-07-05'}
							accommodationName={'test test'}
							feeTotalsInCents={[{ name: 'money', amount: 1555 }]}
							taxTotalsInCents={[{ name: 'money', amount: 100 }]}
							costPerNight={{ '2021-06-05': 345 }}
							grandTotalCents={2000}
							taxAndFeeTotalInCent={999}
							accommodationTotalInCents={234}
							adults={2}
							onDeletePackage={() => {}}
							children={0}
						/>
					</Box>
				</Box>
			</div>
		</Page>
	);
};

export default EditFlowModifyPaymentPage;
