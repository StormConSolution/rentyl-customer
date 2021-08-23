import * as React from 'react';
import './BookingFlowCheckoutPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import rsToasts from '@bit/redsky.framework.toast';
import serviceFactory from '../../services/serviceFactory';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import BookingCartTotalsCard from './bookingCartTotalsCard/BookingCartTotalsCard';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import LabelButton from '../../components/labelButton/LabelButton';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ReservationsService from '../../services/reservations/reservations.service';
import LoadingPage from '../loadingPage/LoadingPage';
import { convertTwentyFourHourTime, DateUtils, NumberUtils, ObjectUtils } from '../../utils/utils';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import PaymentService from '../../services/payment/payment.service';
import EditAccommodationPopup, {
	EditAccommodationPopupProps
} from '../../popups/editAccommodationPopup/EditAccommodationPopup';
import ConfirmOptionPopup, { ConfirmOptionPopupProps } from '../../popups/confirmOptionPopup/ConfirmOptionPopup';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import AccommodationOptionsPopup from '../../popups/accommodationOptionsPopup/AccommodationOptionsPopup';
import ContactInfoAndPaymentCard from '../../components/contactInfoAndPaymentCard/ContactInfoAndPaymentCard';
import DestinationService from '../../services/destination/destination.service';

export interface StayParams {
	adults: number;
	children: number;
	accommodationId: number;
	arrivalDate: string;
	departureDate: string;
	packages: number[];
	rateCode?: string;
}

let existingCardId = 0;

const BookingFlowCheckoutPage = () => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const destinationId = params.data.destinationId;
	const [usePoints, setUsePoints] = useState<boolean>(!!company.allowPointBooking);
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [hasEnoughPoints, setHasEnoughPoints] = useState<boolean>(true);
	const [verifiedAccommodations, setVerifiedAccommodations] = useState<Api.Reservation.Res.Verification[]>([]);
	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();
	const [accommodations, setAccommodations] = useState<StayParams[]>([]);
	const [guestInfo, setGuestInfo] = useState<Api.Reservation.Guest>({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		phone: user?.phone || '',
		email: user?.primaryEmail || ''
	});
	const [additionalDetails, setAdditionalDetails] = useState<string>('');
	const [creditCardForm, setCreditCardForm] = useState<{
		full_name: string;
		month: number;
		year: number;
		cardId: number;
	}>();

	useEffect(() => {
		if (!params) return;
		if (!params.data.destinationId || !params.data.stays)
			router.navigate('/reservation/availability').catch(console.error);
		async function getDestinationDetails() {
			try {
				let destination = await destinationService.getDestinationDetails(params.data.destinationId);
				setDestinationDetails(destination);
			} catch (e) {
				rsToasts.error('Unable to get destination information', 'Server Error');
				router.navigate('/reservation/availability').catch(console.error);
			}
		}
		getDestinationDetails().catch(console.error);
		setAccommodations(params.data.stays);
	}, []);

	useEffect(() => {
		let subscribeId = paymentService.subscribeToSpreedlyError(() => {});
		let paymentMethodId = paymentService.subscribeToSpreedlyPaymentMethod(
			async (token: string, pmData: Api.Payment.PmData) => {
				let data = {
					paymentMethodId: 0,
					destinationId: destinationId,
					stays: verifiedAccommodations.map((accommodation, index) => {
						return {
							accommodationId: accommodations[index].accommodationId,
							numberOfAccommodations: 1,
							arrivalDate: accommodation.checkInDate,
							departureDate: accommodation.checkoutDate,
							adultCount: accommodation.adults,
							childCount: accommodation.children,
							rateCode: accommodation.rateCode,
							upsellPackages: accommodation.upsellPackages.map((item) => {
								return {
									id: item.id
								};
							}),
							guest: guestInfo,
							additionalDetails: additionalDetails
						};
					})
				};
				try {
					const result = await paymentService.addPaymentMethod({
						cardToken: token,
						pmData,
						offsiteLoyaltyEnrollment: isAuthorized ? 1 : 0
					});
					data.paymentMethodId = result.id;
					let res = await reservationService.createItinerary(data);
					popupController.close(SpinningLoaderPopup);
					let newData = {
						itineraryNumber: res.itineraryId,
						destinationName: res.destination.name
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

	useEffect(() => {
		if (usePoints) {
			let updateHasEnoughPoints: boolean = true;
			if (user) {
				updateHasEnoughPoints = 0 < user.availablePoints;
				setHasEnoughPoints(updateHasEnoughPoints);
			}
			setIsDisabled(!hasAgreedToTerms || !updateHasEnoughPoints);
		} else {
			setIsDisabled(!hasAgreedToTerms || !isFormValid);
		}
	}, [hasAgreedToTerms, isFormValid, usePoints]);

	function totalAccommodations(): number {
		let value = verifiedAccommodations.reduce((total, accommodation) => {
			if (usePoints)
				return (
					total +
					NumberUtils.roundPointsToThousand(
						NumberUtils.convertCentsToPoints(accommodation.prices.accommodationTotalInCents, 10)
					) *
						10 +
					accommodation.upsellPackages.reduce((sum, item) => {
						return item.priceDetail.amountAfterTax;
					}, 0)
				);
			return total + accommodation.prices.grandTotalCents;
		}, 0);
		return value;
	}

	function addAccommodation(accommodation: Api.Reservation.Res.Verification) {
		setVerifiedAccommodations([...verifiedAccommodations, accommodation]);
	}

	async function removeAccommodation(
		accommodationId: number,
		checkInDate: string | Date,
		checkoutDate: string | Date
	): Promise<void> {
		let newAccommodationList = accommodations.filter((accommodation) => {
			return (
				accommodation.accommodationId !== accommodationId ||
				checkInDate !== accommodation.arrivalDate ||
				checkoutDate !== accommodation.departureDate
			);
		});
		setAccommodations(newAccommodationList);
		let data = {
			destinationId,
			stays: newAccommodationList.map((accommodation) => {
				return {
					...accommodation,
					packages: accommodation.packages
				};
			})
		};
		if (!newAccommodationList.length) {
			await router.navigate('/reservation/availability').catch(console.error);
		} else router.updateUrlParams({ data: JSON.stringify(data) });
	}

	function changeRoom(accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) {
		router
			.navigate(
				`/booking/add-room?data=${JSON.stringify({
					...params.data,
					edit: { id: accommodation, startDate: checkInDate, endDate: checkoutDate }
				})}`
			)
			.catch(console.error);
	}

	async function editRoom(
		adults: number,
		children: number,
		checkinDate: string | Date,
		checkoutDate: string | Date,
		originalStartDate: string | Date,
		originalEndDate: string | Date,
		accommodationId: number,
		rateCode?: string
	) {
		popupController.close(EditAccommodationPopup);
		try {
			let newParams = params.data.stays;
			const editedRoom: StayParams = {
				adults,
				children,
				accommodationId,
				arrivalDate: DateUtils.displayUserDate(checkinDate),
				departureDate: DateUtils.displayUserDate(checkoutDate),
				packages: [],
				rateCode: rateCode || ''
			};
			newParams = [
				...newParams.filter((stay: StayParams) => {
					return (
						stay.arrivalDate !== originalStartDate ||
						stay.departureDate !== originalEndDate ||
						stay.accommodationId !== accommodationId
					);
				}),
				editedRoom
			];
			setAccommodations(newParams);
			router.updateUrlParams({ data: JSON.stringify({ destinationId: destinationId, stays: newParams }) });
		} catch (e) {
			rsToasts.error('Unable to change room details');
		}
	}

	async function completeBooking() {
		popupController.open(SpinningLoaderPopup);
		if (!existingCardId && creditCardForm && !usePoints) {
			let paymentObj = {
				full_name: creditCardForm.full_name,
				month: creditCardForm.month,
				year: creditCardForm.year
			};
			window.Spreedly.tokenizeCreditCard(paymentObj);
		} else {
			if (!usePoints) {
				if (!accommodations || !existingCardId)
					throw new Error('Missing proper data or existing card is invalid');
			}
			let data = {
				paymentMethodId: !usePoints ? existingCardId : undefined,
				destinationId: destinationId,
				stays: verifiedAccommodations.map(
					(accommodation, index): Api.Reservation.Req.Itinerary.Stay => {
						return {
							accommodationId: accommodations[index].accommodationId,
							numberOfAccommodations: 1,
							arrivalDate: accommodation.checkInDate,
							departureDate: accommodation.checkoutDate,
							adultCount: accommodation.adults,
							childCount: accommodation.children,
							rateCode: accommodation.rateCode,
							upsellPackages: accommodation.upsellPackages,
							guest: guestInfo,
							additionalDetails: additionalDetails
						};
					}
				)
			};
			try {
				let res = await reservationService.createItinerary(data);
				if (res) popupController.close(SpinningLoaderPopup);
				let newData = {
					itineraryNumber: res.itineraryId,
					destinationName: res.destination.name
				};

				router
					.navigate(`/success?data=${JSON.stringify(newData)}`, { clearPreviousHistory: true })
					.catch(console.error);
			} catch (e) {
				popupController.close(SpinningLoaderPopup);
			}
		}
	}

	function renderPolicies() {
		if (!destinationDetails?.policies) return;
		return destinationDetails.policies.map((item) => {
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

	function renderAccommodationDetails() {
		return (
			<Paper
				className={'cart'}
				borderRadius={'4px'}
				boxShadow
				padding={'16px'}
				width={size === 'small' ? '100%' : '410px'}
			>
				<Label variant={'h2'}>Your Stay</Label>
				<hr />
				{accommodations &&
					accommodations.map((accommodation, index) => {
						return (
							<BookingCartTotalsCard
								adults={accommodation.adults}
								children={accommodation.children}
								accommodationId={accommodation.accommodationId}
								arrivalDate={accommodation.arrivalDate}
								departureDate={accommodation.departureDate}
								upsellPackages={accommodation.packages}
								destinationId={params.data.destinationId}
								rateCode={accommodation.rateCode}
								addAccommodation={addAccommodation}
								remove={() => {
									popupController.open<ConfirmOptionPopupProps>(ConfirmOptionPopup, {
										bodyText: 'Are you sure you want to remove this?',
										cancelText: 'Do not remove',
										confirm(): void {
											removeAccommodation(
												accommodation.accommodationId,
												accommodation.arrivalDate,
												accommodation.departureDate
											).catch(console.error);
										},
										confirmText: 'Remove',
										title: 'Remove accommodation'
									});
								}}
								editPackages={() => {
									const stays: StayParams = params.data.stays.filter(
										(stay: StayParams) => stay.accommodationId !== accommodation.accommodationId
									);
									let newRoom = {
										adults: accommodation.adults,
										children: accommodation.children,
										accommodationId: accommodation.accommodationId,
										arrivalDate: accommodation.arrivalDate,
										departureDate: accommodation.departureDate,
										packages: accommodation.packages
									};
									let data = JSON.stringify({
										destinationId: params.data.destinationId,
										stays,
										newRoom
									});
									router.navigate(`/booking/packages?data=${data}`).catch(console.error);
								}}
								edit={(id, checkInDate, checkoutDate) => {
									popupController.open<EditAccommodationPopupProps>(EditAccommodationPopup, {
										accommodationId: id,
										adults: accommodation.adults,
										children: accommodation.children,
										destinationId: destinationId,
										rateCode: accommodation.rateCode,
										endDate: checkoutDate,
										onApplyChanges(
											adults: number,
											children: number,
											rateCode: string,
											checkinDate: string | Date,
											checkoutDate: string | Date,
											originalStartDate: string | Date,
											originalEndDate: string | Date
										): void {
											popupController.close(AccommodationOptionsPopup);
											editRoom(
												adults,
												children,
												checkinDate,
												checkoutDate,
												originalStartDate,
												originalEndDate,
												id,
												rateCode
											).catch(console.error);
										},
										startDate: checkInDate
									});
								}}
								changeRoom={changeRoom}
								cancellable={true}
								usePoints={usePoints}
							/>
						);
					})}
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'Add Room'}
					onClick={() => {
						router.navigate(`/booking/add-room?data=${JSON.stringify(params.data)}`).catch(console.error);
					}}
				/>
				<Box display={'flex'} className={'grandTotal'}>
					<Label variant={'h2'}>Grand Total:</Label>
					<Label variant={'h2'}>
						{NumberUtils.displayPointsOrCash(totalAccommodations(), usePoints ? 'points' : 'cash')}
					</Label>
				</Box>
			</Paper>
		);
	}

	return !ObjectUtils.isArrayWithData(accommodations) ? (
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
						<ContactInfoAndPaymentCard
							onContactChange={(value) => {
								setAdditionalDetails(value.details || '');
								delete value['details'];
								setGuestInfo(value);
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
							isAuthorized={(isAuthorized) => setIsAuthorized(isAuthorized)}
							onExistingCardSelect={(value) => {
								existingCardId = value;
							}}
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
									<Label variant={'body1'}>After {convertTwentyFourHourTime(1600)}</Label>
								</Box>
								<Box>
									<Label variant={'h4'}>Check-out</Label>
									<Label variant={'body1'}>Before {convertTwentyFourHourTime(1000)}</Label>
								</Box>
							</Box>
							<Label variant={'body1'} mb={10}>
								{destinationDetails?.name}
							</Label>
							{renderPolicies()}
						</Paper>
						{size === 'small' && renderAccommodationDetails()}

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
							label={usePoints && !hasEnoughPoints ? 'Not Enough Points' : 'complete booking'}
							onClick={() => {
								completeBooking().catch(console.error);
							}}
							disabled={isDisabled}
						/>
					</Box>
					{size !== 'small' && renderAccommodationDetails()}
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default BookingFlowCheckoutPage;
