import * as React from 'react';
import './BookingFlowCheckoutPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import serviceFactory from '../../services/serviceFactory';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import moment from 'moment';
import BookingCartTotalsCard from './bookingCartTotalsCard/BookingCartTotalsCard';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import LabelButton from '../../components/labelButton/LabelButton';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ReservationsService from '../../services/reservations/reservations.service';
import LoadingPage from '../loadingPage/LoadingPage';
import { formatFilterDateForServer, ObjectUtils, StringUtils, WebUtils } from '../../utils/utils';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import PaymentService from '../../services/payment/payment.service';
import EditAccommodationPopup, {
	EditAccommodationPopupProps
} from '../../popups/editAccommodationPopup/EditAccommodationPopup';
import ConfirmOptionPopup, { ConfirmOptionPopupProps } from '../../popups/confirmOptionPopup/ConfirmOptionPopup';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import ContactInfoAndPaymentCard from '../../components/contactInfoAndPaymentCard/ContactInfoAndPaymentCard';
import DestinationService from '../../services/destination/destination.service';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import LinkButton from '../../components/linkButton/LinkButton';

let existingCardId = 0;

const BookingFlowCheckoutPage = () => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: Misc.BookingParams }>([
		{ key: 'data', default: 0, type: 'string', alias: 'data' }
	]);
	params.data = ObjectUtils.smartParse((params.data as unknown) as string);
	const destinationId = params.data.destinationId;
	const stayParams = params.data.stays;
	const [usePoints, setUsePoints] = useState<boolean>(!company.allowCashBooking);
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [hasEnoughPoints, setHasEnoughPoints] = useState<boolean>(true);
	const [grandTotal, setGrandTotal] = useState<number>(0);

	const [verifiedAccommodations, setVerifiedAccommodations] = useRecoilState<{
		[uuid: number]: Api.Reservation.Res.Verification;
	}>(globalState.verifiedAccommodations);

	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();
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

	const [_, setRefreshPage] = useState<number>(0);

	useEffect(() => {
		setVerifiedAccommodations([]);
	}, []);

	useEffect(() => {
		if (!params) return;
		if (!destinationId || !stayParams) router.navigate('/reservation/availability').catch(console.error);
		async function getDestinationDetails() {
			try {
				let destination = await destinationService.getDestinationDetails(destinationId);
				setDestinationDetails(destination);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get destination information.'),
					'Server Error'
				);
				router.navigate('/reservation/availability').catch(console.error);
			}
		}
		getDestinationDetails().catch(console.error);
	}, []);

	useEffect(() => {
		let value = Object.values(verifiedAccommodations).reduce((total, accommodation) => {
			if (usePoints) return total + accommodation.prices.grandTotalPoints;
			return total + accommodation.prices.grandTotalCents;
		}, 0);
		setGrandTotal(value);
	}, [verifiedAccommodations, usePoints]);

	useEffect(() => {
		let subscribeId = paymentService.subscribeToSpreedlyError(() => {});
		let paymentMethodId = paymentService.subscribeToSpreedlyPaymentMethod(
			async (token: string, pmData: Api.Payment.PmData) => {
				let stays: Api.Reservation.Req.Itinerary.Stay[] = [];
				Object.values(verifiedAccommodations).forEach((verification) => {
					let accommodation = {
						accommodationId: verification.accommodationId,
						numberOfAccommodations: 1,
						arrivalDate: verification.arrivalDate,
						departureDate: verification.departureDate,
						adultCount: verification.adultCount,
						childCount: verification.childCount,
						rateCode: verification.rateCode,
						upsellPackages: verification.upsellPackages,
						guest: guestInfo,
						additionalDetails: additionalDetails
					};
					stays.push(accommodation);
				});
				let data = {
					paymentMethodId: 0,
					destinationId: destinationId,
					stays
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

	async function removeAccommodation(uuid: number): Promise<void> {
		const newStayList = stayParams.filter((stay) => stay.uuid !== uuid);
		if (!newStayList.length) {
			await router.navigate('/reservation/availability').catch(console.error);
			return;
		}

		let updatedVerifiedAccommodation = { ...verifiedAccommodations };
		delete updatedVerifiedAccommodation[uuid];
		setVerifiedAccommodations(updatedVerifiedAccommodation);

		let bookingParams: Misc.BookingParams = {
			destinationId,
			stays: newStayList
		};

		router.updateUrlParams({ data: JSON.stringify(bookingParams) });
		setRefreshPage((prev) => {
			return prev + 1;
		});
	}

	function editAccommodation(
		uuid: number,
		adults: number,
		children: number,
		checkinDate: string | Date,
		checkoutDate: string | Date,
		accommodationId: number,
		packages: number[],
		rateCode?: string
	) {
		popupController.close(EditAccommodationPopup);
		let newParams: Misc.StayParams[] = [...stayParams];

		let index = newParams.findIndex((param) => param.uuid === uuid);
		if (index === -1) {
			console.error('Could not find index?');
			return;
		}

		newParams[index] = {
			uuid,
			adults,
			children,
			accommodationId,
			arrivalDate: formatFilterDateForServer(moment(checkinDate), 'start'),
			departureDate: formatFilterDateForServer(moment(checkoutDate), 'end'),
			packages,
			rateCode: rateCode || ''
		};
		router.updateUrlParams({ data: JSON.stringify({ destinationId: destinationId, stays: newParams }) });
		setRefreshPage((prev) => {
			return prev + 1;
		});
	}

	function changeRoom(uuid: number) {
		let bookingParams: Misc.BookingParams = {
			...params.data,
			editUuid: uuid
		};
		router.navigate(`/booking/add-room?data=${JSON.stringify(bookingParams)}`).catch(console.error);
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
				if (!stayParams || !existingCardId) throw new Error('Missing proper data or existing card is invalid');
			}
			let stays: Api.Reservation.Req.Itinerary.Stay[] = [];
			Object.values(verifiedAccommodations).forEach((verification) => {
				let accommodation: Api.Reservation.Req.Itinerary.Stay = {
					accommodationId: verification.accommodationId,
					numberOfAccommodations: 1,
					arrivalDate: verification.arrivalDate,
					departureDate: verification.departureDate,
					adultCount: verification.adultCount,
					childCount: verification.childCount,
					rateCode: verification.rateCode,
					upsellPackages: verification.upsellPackages,
					guest: guestInfo,
					additionalDetails: additionalDetails
				};
				stays.push(accommodation);
			});
			let data: Api.Reservation.Req.Itinerary.Create = {
				paymentMethodId: !usePoints ? existingCardId : undefined,
				destinationId: destinationId,
				stays
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
		return destinationDetails.policies.map((item, index) => {
			if (item.type === 'CheckIn' || item.type === 'CheckOut') return false;
			return (
				<React.Fragment key={index}>
					<Label variant={'h4'}>{item.type}</Label>
					<Label variant={'body1'} mb={10}>
						{item.value}
					</Label>
				</React.Fragment>
			);
		});
	}

	function renderAccommodationCards() {
		return (
			stayParams &&
			stayParams.map((accommodation) => {
				return (
					<BookingCartTotalsCard
						key={accommodation.uuid}
						uuid={accommodation.uuid}
						adults={accommodation.adults}
						children={accommodation.children}
						accommodationId={accommodation.accommodationId}
						arrivalDate={accommodation.arrivalDate}
						departureDate={accommodation.departureDate}
						upsellPackages={accommodation.packages}
						destinationId={destinationId}
						rateCode={accommodation.rateCode}
						removeAccommodation={(needsConfirmation: boolean) => {
							if (!needsConfirmation) {
								removeAccommodation(accommodation.uuid).catch(console.error);
								return;
							}

							popupController.open<ConfirmOptionPopupProps>(ConfirmOptionPopup, {
								bodyText: 'Are you sure you want to remove this?',
								cancelText: 'Do not remove',
								confirm: () => {
									removeAccommodation(accommodation.uuid).catch(console.error);
								},
								confirmText: 'Remove',
								title: 'Remove accommodation'
							});
						}}
						editPackages={() => {
							const stays: Misc.StayParams[] = stayParams.filter(
								(stay: Misc.StayParams) => stay.uuid !== accommodation.uuid
							);
							let newRoom: Misc.StayParams = {
								...accommodation
							};
							let data = JSON.stringify({
								destinationId,
								stays,
								newRoom
							});
							router.navigate(`/booking/packages?data=${data}`).catch(console.error);
						}}
						editAccommodation={() => {
							popupController.open<EditAccommodationPopupProps>(EditAccommodationPopup, {
								uuid: accommodation.uuid,
								accommodationId: accommodation.accommodationId,
								adults: accommodation.adults,
								children: accommodation.children,
								destinationId: destinationId,
								rateCode: accommodation.rateCode,
								startDate: accommodation.arrivalDate,
								endDate: accommodation.departureDate,
								onApplyChanges(
									uuid: number,
									adults: number,
									children: number,
									rateCode: string,
									checkinDate: string | Date,
									checkoutDate: string | Date
								) {
									editAccommodation(
										uuid,
										adults,
										children,
										checkinDate,
										checkoutDate,
										accommodation.accommodationId,
										accommodation.packages,
										rateCode
									);
								}
							});
						}}
						changeRoom={() => {
							changeRoom(accommodation.uuid);
						}}
						cancellable={true}
						usePoints={usePoints}
					/>
				);
			})
		);
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
				{renderAccommodationCards()}
				<LinkButton
					label={'Add Room'}
					path={`/booking/add-room?data=${JSON.stringify(params.data)}`}
					look={'containedPrimary'}
				/>
				<Box display={'flex'} className={'grandTotal'}>
					<Label variant={'h2'}>Grand Total:</Label>
					<Label variant={'h2'}>
						{usePoints
							? `${StringUtils.addCommasToNumber(grandTotal)} Points`
							: `$${StringUtils.formatMoney(grandTotal)}`}
					</Label>
				</Box>
			</Paper>
		);
	}

	return !ObjectUtils.isArrayWithData(stayParams) ? (
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
									<Label variant={'body1'}>After {StringUtils.convertTwentyFourHourTime(1600)}</Label>
								</Box>
								<Box>
									<Label variant={'h4'}>Check-out</Label>
									<Label variant={'body1'}>
										Before {StringUtils.convertTwentyFourHourTime(1000)}
									</Label>
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
							variant={'caption'}
							label={usePoints && !hasEnoughPoints ? 'Not Enough Points' : 'Complete Booking'}
							onClick={() => {
								completeBooking().catch(console.error);
							}}
							disabled={isDisabled}
						/>
					</Box>
					{size !== 'small' && renderAccommodationDetails()}
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default BookingFlowCheckoutPage;
