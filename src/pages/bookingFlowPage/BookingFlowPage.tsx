import * as React from 'react';
import './BookingFlowPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import rsToasts from '@bit/redsky.framework.toast';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import { Booking, FakeBookingData } from './fakeBookingData';
import BookingCartTotalsCard from './bookingCartTotalsCard/BookingCartTotalsCard';
import ContactInfoAndPaymentCard from './contactInfoAndPaymentCard/ContactInfoAndPaymentCard';
import DestinationPackageTile from './destinationPackageTile/DestinationPackageTile';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import LabelButton from '../../components/labelButton/LabelButton';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ReservationsService from '../../services/reservations/reservations.service';
import LoadingPage from '../loadingPage/LoadingPage';
import { convertTwentyFourHourTime } from '../../utils/utils';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import PaymentService from '../../services/payment/payment.service';

interface BookingFlowPageProps {}

let existingCardId = 0;

const BookingFlowPage: React.FC<BookingFlowPageProps> = (props) => {
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [reservationData, setReservationData] = useState<Api.Reservation.Res.Verification>();
	const [addedPackages, setAddedPackages] = useState<Booking.BookingPackageDetails[]>([]);
	const [creditCardForm, setCreditCardForm] = useState<{
		full_name: string;
		month: number;
		year: number;
		cardId: number;
	}>();

	useEffect(() => {
		if (!params) return;
		async function getAccommodationDetails() {
			params.data.numberOfAccommodations = 1;
			try {
				console.log(params.data);
				let response = await reservationService.verifyAvailability(params.data);
				if (response.data.data) {
					console.log(response.data.data);
					setReservationData(response.data.data);
				}
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
				let data: any = await getReservationData();
				if (!data) return;
				try {
					const result = await paymentService.addPaymentMethod({ cardToken: token, pmData });
					data.paymentMethodId = result.id;
					data.destinationId = params.data.destinationId;
					let res = await reservationService.create(data);
					popupController.close(SpinningLoaderPopup);
					setIsDisabled(false);
					let newData = {
						confirmationCode: res.confirmationCode,
						destinationName: reservationData!.destinationName
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
	}, [reservationData, creditCardForm]);

	useEffect(() => {
		setIsDisabled(!hasAgreedToTerms || !isFormValid);
	}, [hasAgreedToTerms, isFormValid]);

	function getReservationData() {
		if (!reservationData) return;
		return {
			accommodationId: params.data.accommodationId,
			adults: reservationData.adults,
			children: reservationData.children,
			arrivalDate: reservationData.checkInDate,
			departureDate: reservationData.checkoutDate,
			rateCode: reservationData.rateCode,
			numberOfAccommodations: 1
		};
	}

	function renderDestinationPackages() {
		if (!reservationData) return;
		return reservationData.destinationPackages.map((item, index) => {
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

	function renderPolicies() {
		if (!reservationData) return '';
		return reservationData.policies.map((item) => {
			if (item.type === 'CheckIn' || item.type === 'CheckOut') return false;
			return (
				<>
					<Label variant={'h4'}>{item.type}</Label>
					<Label variant={'body1'} mb={10}>
						{item.value}
					</Label>
				</>
			);
		});
	}

	async function completeBooking() {
		if (!reservationData) return;
		if (!isDisabled && !isFormValid) return;
		popupController.open(SpinningLoaderPopup);
		if (!existingCardId && creditCardForm) {
			let paymentObj = {
				full_name: creditCardForm.full_name,
				month: creditCardForm.month,
				year: creditCardForm.year
			};
			window.Spreedly.tokenizeCreditCard(paymentObj);
		} else {
			let data: any = getReservationData();
			if (!data || !existingCardId) throw new Error('Missing proper data or existing card is invalid');
			else data.paymentMethodId = existingCardId;
			data.destinationId = params.data.destinationId;
			try {
				let res = await reservationService.create(data);
				if (res) popupController.close(SpinningLoaderPopup);
				setIsDisabled(false);
				let newData = {
					confirmationCode: res.confirmationCode,
					destinationName: reservationData.destinationName
				};

				router
					.navigate(`/success?data=${JSON.stringify(newData)}`, { clearPreviousHistory: true })
					.catch(console.error);
			} catch (e) {
				setIsDisabled(false);
				popupController.close(SpinningLoaderPopup);
			}
		}
	}

	return !reservationData ? (
		<LoadingPage />
	) : (
		<Page className={'rsBookingFlowPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Label marginTop={80} marginLeft={size === 'small' ? '15px' : ''} variant={'h1'}>
					Booking
				</Label>
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
					<Box width={size === 'small' ? '100%' : '50%'} className={'colOne'}>
						<Paper
							className={'packagesAccordion'}
							backgroundColor={'#f0f0f0'}
							boxShadow
							borderRadius={'4px'}
							padding={'16px'}
						>
							<Label variant={'h2'}>Packages</Label>
							{renderDestinationPackages()}
						</Paper>
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
						<Paper className={'policiesSection'} boxShadow borderRadius={'4px'} padding={'16px'}>
							<Label variant={'h2'} mb={10}>
								Policies:
							</Label>
							<Box display={'flex'} mb={10}>
								<Box marginRight={'50px'}>
									<Label variant={'h4'}>Check-in</Label>
									<Label variant={'body1'}>
										After {convertTwentyFourHourTime(reservationData.checkInTime)}
									</Label>
								</Box>
								<Box>
									<Label variant={'h4'}>Check-out</Label>
									<Label variant={'body1'}>
										Before {convertTwentyFourHourTime(reservationData.checkoutTime)}
									</Label>
								</Box>
							</Box>
							<Label variant={'body1'} mb={10}>
								{reservationData.accommodationName}
							</Label>
							{renderPolicies()}
						</Paper>
						{size === 'small' && (
							<BookingCartTotalsCard
								checkInTime={reservationData.checkInTime}
								checkoutTime={reservationData.checkoutTime}
								checkInDate={reservationData.checkInDate}
								checkoutDate={reservationData.checkoutDate}
								accommodationName={reservationData.accommodationName}
								accommodationTotalInCents={reservationData.prices.accommodationTotalInCents}
								taxAndFeeTotalInCent={reservationData.prices.taxAndFeeTotalInCents}
								feeTotalsInCents={reservationData.prices.feeTotalsInCents}
								taxTotalsInCents={reservationData.prices.taxTotalsInCents}
								costPerNight={reservationData.prices.accommodationDailyCostsInCents}
								adults={reservationData.adults}
								children={reservationData.children}
								grandTotalCents={reservationData.prices.accommodationTotalInCents}
								packages={addedPackages}
								onDeletePackage={(packageId) => {
									let newPackages = [...addedPackages];
									newPackages = newPackages.filter((item) => item.id !== packageId);
									setAddedPackages(newPackages);
								}}
							/>
						)}

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
							label={'complete booking'}
							onClick={() => {
								completeBooking().catch(console.error);
							}}
							disabled={isDisabled}
						/>
					</Box>
					{size !== 'small' && (
						<BookingCartTotalsCard
							checkInTime={reservationData.checkInTime}
							checkoutTime={reservationData.checkoutTime}
							checkInDate={reservationData.checkInDate}
							checkoutDate={reservationData.checkoutDate}
							accommodationName={reservationData.accommodationName}
							accommodationTotalInCents={reservationData.prices.accommodationTotalInCents}
							taxAndFeeTotalInCent={reservationData.prices.taxAndFeeTotalInCents}
							feeTotalsInCents={reservationData.prices.feeTotalsInCents}
							taxTotalsInCents={reservationData.prices.taxTotalsInCents}
							costPerNight={reservationData.prices.accommodationDailyCostsInCents}
							adults={reservationData.adults}
							children={reservationData.children}
							grandTotalCents={reservationData.prices.grandTotalCents}
							packages={addedPackages}
							onDeletePackage={(packageId) => {
								let newPackages = [...addedPackages];
								newPackages = newPackages.filter((item) => item.id !== packageId);
								setAddedPackages(newPackages);
							}}
						/>
					)}
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default BookingFlowPage;
