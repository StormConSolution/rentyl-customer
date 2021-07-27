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
import { convertTwentyFourHourTime, ObjectUtils, StringUtils } from '../../utils/utils';
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

interface Stay extends Omit<Api.Reservation.Req.Itinerary.Stay, 'numberOfAccommodations'> {
	accommodationName: string;
	prices: Api.Reservation.PriceDetail;
	checkInTime: string;
	checkoutTime: string;
	packages: Api.Package.Res.Get[];
}

interface Verification extends Omit<Api.Reservation.Req.Verification, 'numberOfAccommodations'> {
	packages?: number[];
}

let existingCardId = 0;

const BookingFlowCheckoutPage = () => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const destinationId = params.data.destinationId;
	const [usePoints, setUsePoints] = useState<boolean>(!!company.allowPointBooking);
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [accommodations, setAccommodations] = useState<Stay[]>([]);
	const [guestInfo, setGuestInfo] = useState<Api.Reservation.Guest>({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		phone: user?.phone || '',
		email: user?.primaryEmail || ''
	});
	const [destinationName, setDestinationName] = useState<string>('');
	const [policies, setPolicies] = useState<{ type: Model.DestinationPolicyType; value: string }[]>([]);
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
				popupController.open(SpinningLoaderPopup);
				const rooms: Stay[] = await Promise.all(
					params.data.stays.map(async (accommodation: Verification) => {
						return await addAccommodation(accommodation);
					})
				);
				if (rooms) setAccommodations(rooms);
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToasts.error(e.message);
				router.navigate('/reservation/availability').catch(console.error);
				popupController.close(SpinningLoaderPopup);
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
							//@ts-ignore
							rateCode: accommodation.rateCode || accommodation.rate,
							upsellPackages: accommodation.packages.map((item) => {
								return {
									id: item.id
								};
							}),
							guest: guestInfo
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
			setIsDisabled(!usePoints || !hasAgreedToTerms);
		} else {
			setIsDisabled(!hasAgreedToTerms || !isFormValid);
		}
	}, [hasAgreedToTerms, isFormValid, usePoints]);

	async function addAccommodation(data: Verification): Promise<Stay | undefined> {
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
		let packageResponse;
		if (ObjectUtils.isArrayWithData(data.packages)) {
			packageResponse = await reservationService.getPackagesByIds({ ids: data.packages });
		}
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
			checkoutTime: res.checkoutTime,
			guest: guestInfo,
			packages: packageResponse?.data || []
		};
		setPolicies(res.policies);
		setDestinationName(res.destinationName);
		return stay;
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
			stays: newAccommodationList
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
		packages: Api.Package.Res.Get[],
		accommodationId: number
	) {
		popupController.close(EditAccommodationPopup);
		try {
			let newParams = params.data.stays;
			const editedRoom: Omit<Verification, 'destinationId'> = {
				adults,
				children,
				accommodationId,
				arrivalDate: checkinDate,
				departureDate: checkoutDate,
				packages: packages.map((item) => item.id)
			};
			newParams = [
				...newParams.filter((stay: Verification) => {
					return (
						stay.arrivalDate !== originalStartDate ||
						stay.departureDate !== originalEndDate ||
						stay.accommodationId !== accommodationId
					);
				}),
				editedRoom
			];
			router.updateUrlParams({ data: JSON.stringify({ destinationId: destinationId, stays: newParams }) });
			const stay = await addAccommodation({ ...editedRoom, destinationId });
			if (stay) {
				let copiedAccommodations = accommodations.filter((accommodation) => {
					return (
						accommodation.accommodationId !== accommodationId ||
						accommodation.arrivalDate !== originalStartDate ||
						accommodation.departureDate !== originalEndDate
					);
				});
				setAccommodations([...copiedAccommodations, stay]);
			}
		} catch (e) {
			rsToasts.error('Something unexpected happened.');
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
				stays: accommodations.map((accommodation) => {
					return {
						accommodationId: accommodation.accommodationId,
						numberOfAccommodations: 1,
						arrivalDate: accommodation.arrivalDate,
						departureDate: accommodation.departureDate,
						adultCount: accommodation.adultCount,
						childCount: accommodation.childCount,
						//@ts-ignore
						rateCode: accommodation.rateCode || accommodation.rate,
						upsellPackages: accommodation.packages.map((item) => {
							return {
								id: item.id
							};
						}),
						guest: guestInfo
					};
				})
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
		return policies.map((item) => {
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
							packages={accommodation.packages}
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
							edit={(id, checkInDate, checkoutDate) => {
								popupController.open<EditAccommodationPopupProps>(EditAccommodationPopup, {
									accommodationId: id,
									adults: accommodation.adultCount,
									children: accommodation.childCount,
									destinationId: destinationId,
									endDate: checkoutDate,
									onApplyChanges(
										adults: number,
										children: number,
										checkinDate: string | Date,
										checkoutDate: string | Date,
										originalStartDate: string | Date,
										originalEndDate: string | Date,
										packages: Api.Package.Res.Get[]
									): void {
										popupController.close(AccommodationOptionsPopup);
										editRoom(
											adults,
											children,
											checkinDate,
											checkoutDate,
											originalStartDate,
											originalEndDate,
											packages,
											id
										);
									},
									packages: accommodation.packages,
									startDate: checkInDate
								});
							}}
							changeRoom={changeRoom}
							accommodationId={accommodation.accommodationId}
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
					{!usePoints ? (
						<Label variant={'h2'}>
							$
							{StringUtils.formatMoney(
								accommodations.reduce(
									(total, accommodation) => (total += accommodation.prices.grandTotalCents),
									0
								)
							)}
						</Label>
					) : (
						<Label variant={'h2'}>
							{StringUtils.addCommasToNumber(
								accommodations.reduce(
									(total, accommodation) => (total += accommodation.prices.grandTotalCents),
									0
								)
							) + ' points'}
						</Label>
					)}
				</Box>
			</Paper>
		);
	}

	return !accommodations ? (
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
									<Label variant={'body1'}>
										After {convertTwentyFourHourTime(accommodations[0]?.checkInTime)}
									</Label>
								</Box>
								<Box>
									<Label variant={'h4'}>Check-out</Label>
									<Label variant={'body1'}>
										Before {convertTwentyFourHourTime(accommodations[0]?.checkoutTime)}
									</Label>
								</Box>
							</Box>
							<Label variant={'body1'} mb={10}>
								{destinationName}
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
							label={'complete booking'}
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
