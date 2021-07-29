import React, { useEffect, useState } from 'react';
import './EditFlowModifyPaymentPage.scss';
import ContactInfoAndPaymentCard from '../../components/contactInfoAndPaymentCard/ContactInfoAndPaymentCard';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import LoadingPage from '../loadingPage/LoadingPage';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../../components/labelButton/LabelButton';
import BookingCartTotalsCard from '../bookingFlowCheckoutPage/bookingCartTotalsCard/BookingCartTotalsCard';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import router from '../../utils/router';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import PaymentService from '../../services/payment/payment.service';
import { convertTwentyFourHourTime, DateUtils } from '../../utils/utils';
import Paper from '../../components/paper/Paper';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import rsToasts from '@bit/redsky.framework.toast';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import moment from 'moment';

const EditFlowModifyPaymentPage = () => {
	const params = router.getPageUrlParams<{ reservationId: number }>([
		{ key: 'ri', default: 0, type: 'integer', alias: 'reservationId' }
	]);
	const size = useWindowResizeChange();
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const [existingCardId, setExistingCardId] = useState<number>(0);
	const reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const [usePoints, setUsePoints] = useState<boolean>(false);
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [reservation, setReservation] = useState<Api.Reservation.Res.Get>();
	const [contactInfo, setContactInfo] = useState<Api.Reservation.Guest>({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		email: user?.primaryEmail || '',
		phone: user?.phone || ''
	});
	const [creditCardForm, setCreditCardForm] = useState<{
		full_name: string;
		month: number;
		year: number;
		cardId: number;
	}>();

	useEffect(() => {
		async function getReservationData(id: number) {
			try {
				let res = await reservationsService.get(id);
				setContactInfo(res.guest);
				setExistingCardId(res.paymentMethod?.id || 0);
				setReservation(res);
			} catch (e) {
				rsToasts.error('Something unexpected happened on the server.');
				router.navigate('/reservations').catch(console.error);
			}
		}
		getReservationData(params.reservationId).catch(console.error);
	}, []);

	useEffect(() => {
		let paymentMethodId = paymentService.subscribeToSpreedlyPaymentMethod(
			async (token: string, pmData: Api.Payment.PmData) => {
				let data = {
					paymentMethodId: 0,
					destinationId: reservation?.destination.id
				};
				try {
					const result = await paymentService.addPaymentMethod({ cardToken: token, pmData });
					data.paymentMethodId = result.id;
					setExistingCardId(result.id);
					if (reservation) {
						let res = await reservationsService.updateReservation({
							id: reservation.id,
							paymentMethodId: existingCardId
						});

						popupController.close(SpinningLoaderPopup);
						let stay: Api.Reservation.Req.Update = {
							id: reservation.id,
							rateCode: reservation.rateCode,
							paymentMethodId: result.id,
							guest: contactInfo,
							accommodationId: reservation.accommodation.id,
							adults: reservation.adultCount,
							children: reservation.childCount,
							arrivalDate: DateUtils.clientToServerDate(new Date(reservation.arrivalDate)),
							departureDate: DateUtils.clientToServerDate(new Date(reservation.departureDate)),
							numberOfAccommodations: 1
						};
						popupController.close(SpinningLoaderPopup);
						await reservationsService.updateReservation(stay);
						router.back();
					}
				} catch (e) {
					popupController.close(SpinningLoaderPopup);
				}
			}
		);
		return () => {
			paymentService.unsubscribeToSpreedlyPaymentMethod(paymentMethodId);
		};
	}, [creditCardForm]);

	useEffect(() => {
		setIsDisabled(!hasAgreedToTerms || !isFormValid);
	}, [hasAgreedToTerms, isFormValid]);

	async function updateInformation() {
		if (reservation) {
			try {
				let stay: Api.Reservation.Req.Update = {
					id: reservation.id,
					rateCode: '',
					paymentMethodId: existingCardId,
					guest: contactInfo,
					accommodationId: reservation.accommodation.id,
					adults: reservation.adultCount,
					children: reservation.childCount,
					arrivalDate: DateUtils.clientToServerDate(new Date(reservation.arrivalDate)),
					departureDate: DateUtils.clientToServerDate(new Date(reservation.departureDate)),
					numberOfAccommodations: 1
				};
				await reservationsService.updateReservation(stay);
				popupController.close(SpinningLoaderPopup);

				rsToasts.success('Successfully Updated');
				router.navigate('/reservations').catch(console.error);
			} catch {
				popupController.close(SpinningLoaderPopup);
				rsToasts.error('Something unexpected happened on the server.');
			}
		}
	}

	function renderPolicies() {
		if (reservation) {
			return reservation.destination.policies.map((item, index) => {
				if (item.type === 'CheckIn' || item.type === 'CheckOut') return false;
				return (
					<Box key={index}>
						<Label variant={'h4'}>{item.type}</Label>
						<Label variant={'body1'} mb={10}>
							{item.value}
						</Label>
					</Box>
				);
			});
		}
	}

	return !!!reservation ? (
		<LoadingPage />
	) : (
		<Page className={'rsEditFlowModifyPaymentPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box
					display={'flex'}
					className={'editingNotification'}
					alignItems={'center'}
					justifyContent={'space-around'}
				>
					<Label variant={'h2'}>You are editing your reservation</Label>
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Dismiss Edits'}
						onClick={() => {
							router.back();
						}}
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
					className={'editFlowContainer'}
				>
					<Box width={size === 'small' ? '100%' : '50%'} className={'colOne'}>
						<ContactInfoAndPaymentCard
							onContactChange={(value: Api.Reservation.Guest) => {
								setContactInfo(value);
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
							isAuthorized={(isAuthorized) => {}}
							onExistingCardSelect={(value) => {
								setExistingCardId(value);
							}}
							existingCardId={existingCardId}
							contactInfo={contactInfo}
							usePoints={usePoints}
							setUsePoints={(value: boolean) => setUsePoints(value)}
						/>
						<Paper className={'policiesSection'} boxShadow borderRadius={'4px'} padding={'16px'}>
							<Label variant={'h2'} mb={10}>
								Policies:
							</Label>
							<Box display={'flex'} mb={10}>
								<Box marginRight={'50px'}>
									<Label variant={'h4'}>Check-in</Label>
									<Label variant={'body1'}>
										After{' '}
										{convertTwentyFourHourTime(
											reservation.destination.policies[
												reservation.destination.policies.findIndex(
													(policy) => policy.type === 'CheckIn'
												)
											].value
										)}
									</Label>
								</Box>
								<Box>
									<Label variant={'h4'}>Check-out</Label>
									<Label variant={'body1'}>
										Before{' '}
										{convertTwentyFourHourTime(
											reservation.destination.policies[
												reservation.destination.policies.findIndex(
													(policy) => policy.type === 'CheckOut'
												)
											].value
										)}
									</Label>
								</Box>
							</Box>
							<Label variant={'body1'} mb={10}>
								{reservation.destination.name}
							</Label>
							{renderPolicies()}
						</Paper>
						<Paper className={'acknowledgementSection'} boxShadow borderRadius={'4px'} padding={'16px'}>
							<Label variant={'h2'}>Acknowledgement</Label>
							<LabelCheckbox
								value={1}
								text={'* I agree with the Privacy Terms.'}
								isChecked={false}
								onSelect={() => {
									setHasAgreedToTerms(true);
								}}
								onDeselect={() => {
									setHasAgreedToTerms(false);
								}}
							/>
							<Label variant={'h4'}>
								By completing this booking, I agree with the booking conditions
							</Label>
						</Paper>
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
						<Paper
							className={'cart'}
							borderRadius={'4px'}
							boxShadow
							padding={'16px'}
							width={size === 'small' ? '100%' : '410px'}
						>
							<Label variant={'h2'}>Your Stay</Label>
							<hr />
							<BookingCartTotalsCard
								checkInTime={
									reservation.destination.policies[
										reservation.destination.policies.findIndex(
											(policy) => policy.type === 'CheckIn'
										)
									].value
								}
								checkoutTime={
									reservation.destination.policies[
										reservation.destination.policies.findIndex(
											(policy) => policy.type === 'CheckOut'
										)
									].value
								}
								checkInDate={reservation.arrivalDate}
								checkoutDate={reservation.departureDate}
								accommodationName={reservation.accommodation.name}
								feeTotalsInCents={reservation.priceDetail.feeTotalsInCents}
								taxTotalsInCents={reservation.priceDetail.taxTotalsInCents}
								costPerNight={reservation.priceDetail.accommodationDailyCostsInCents}
								grandTotalCents={reservation.priceDetail.grandTotalCents}
								taxAndFeeTotalInCent={reservation.priceDetail.taxAndFeeTotalInCents}
								accommodationTotalInCents={reservation.priceDetail.accommodationTotalInCents}
								adults={reservation.adultCount}
								children={reservation.childCount}
								cancellable={
									reservation.cancellationPermitted === 1 &&
									moment(reservation.arrivalDate) > moment().add(15, 'days')
								}
								packages={[]}
								usePoints={false}
							/>
						</Paper>
					</Box>
				</Box>
			</div>
		</Page>
	);
};

export default EditFlowModifyPaymentPage;
