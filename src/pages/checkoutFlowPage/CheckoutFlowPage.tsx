import * as React from 'react';
import './CheckoutFlowPage.scss';
import { useEffect, useRef, useState } from 'react';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import ConfirmationImageSummary from '../../components/confirmationImageSummary/ConfirmationImageSummary';
import ThankYouCard from '../../components/thankYouCard/ThankYouCard';
import PersonalInformation from '../../components/personalInformation/PersonalInformation';
import PaymentMethod from '../../components/paymentMethod/PaymentMethod';
import Policies from '../../components/policies/Policies';
import CheckoutReservationSummary from '../../components/checkoutReservationSummary/CheckoutReservationSummary';
import CheckoutBreadcrumbs from '../../components/checkoutBreadcrumbs/CheckoutBreadcrumbs';
import PrintableQrCode from '../../components/printableQrCode/PrintableQrCode';
import BookingSummaryCard from '../../components/bookingSummaryCard/BookingSummaryCard';
import Button from '@bit/redsky.framework.rs.button';
import router from '../../utils/router';
import CheckOutPaymentCard from '../../components/checkoutPaymentCard/CheckOutPaymentCard';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import CheckOutInfoCard from '../../components/checkoutInfoCard/CheckOutInfoCard';
import { ObjectUtils, WebUtils } from '../../utils/utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import serviceFactory from '../../services/serviceFactory';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import PaymentService from '../../services/payment/payment.service';
import ReservationsService from '../../services/reservations/reservations.service';
import debounce from 'lodash.debounce';
import SigninPopup from '../../popups/signin/SigninPopup';
import PackageService from '../../services/package/package.service';

interface CheckoutFlowPageProps {}

const CheckoutFlowPage: React.FC<CheckoutFlowPageProps> = () => {
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const packageService = serviceFactory.get<PackageService>('PackageService');
	const params = router.getPageUrlParams<{ stage: number; data: Misc.BookingParams }>([
		{ key: 's', default: 0, type: 'integer', alias: 'stage' },
		{ key: 'data', default: 0, type: 'string', alias: 'data' }
	]);
	const paramsData = ObjectUtils.smartParse(params.data as unknown as string) as Misc.BookingParams;
	const destinationId = paramsData.destinationId;
	const stayParams = paramsData.stays[0];

	const [verifiedAccommodation, setVerifiedAccommodation] = useRecoilState<
		Api.Reservation.Res.Verification | undefined
	>(globalState.verifiedAccommodation);
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [userPrimaryAddress, setUserPrimaryAddress] = useState<Api.User.Address>();
	const [userPrimaryPaymentMethod, setUserPrimaryPaymentMethod] = useState<Api.User.PaymentMethod>();
	const checkoutUser = useRecoilValue<Api.User.Req.Checkout | undefined>(globalState.checkoutUser);
	const checkoutUserState = useState<Api.User.Req.Checkout>({
		personal: {
			firstName: user?.firstName || checkoutUser?.personal.firstName || '',
			lastName: user?.lastName || checkoutUser?.personal.lastName || '',
			address1: userPrimaryAddress?.address1 || checkoutUser?.personal.address1 || '',
			address2: userPrimaryAddress?.address2 || checkoutUser?.personal.address2 || '',
			zip: (userPrimaryAddress?.zip || checkoutUser?.personal.zip || '').toString(),
			city: userPrimaryAddress?.city || checkoutUser?.personal.city || '',
			state: userPrimaryAddress?.state || checkoutUser?.personal.state || '',
			country: userPrimaryAddress?.country || checkoutUser?.personal.country || 'US',
			email: user?.primaryEmail || checkoutUser?.personal.email || '',
			phone: user?.phone || checkoutUser?.personal.phone || ''
		},
		shouldCreateUser: checkoutUser?.shouldCreateUser || false,
		usePoints: checkoutUser?.usePoints || false
		// useExistingPaymentMethod: checkoutUser?.useExistingPaymentMethod || false
	});

	const [currentCheckoutUser, setCurrentCheckoutUser] = checkoutUserState;

	const printRef = useRef(null);

	useEffect(() => {
		if (!user) return;
		const primaryUserAddress = user.address.find((address) => address.isDefault === 1);
		const primaryPaymentMethod = user.paymentMethods.find((paymentMethod) => paymentMethod.isPrimary === 1);

		setCurrentCheckoutUser({
			personal: {
				firstName: user?.firstName || checkoutUser?.personal.firstName || '',
				lastName: user?.lastName || checkoutUser?.personal.lastName || '',
				address1: primaryUserAddress?.address1 || checkoutUser?.personal.address1 || '',
				address2: primaryUserAddress?.address2 || checkoutUser?.personal.address2 || '',
				zip: (primaryUserAddress?.zip || checkoutUser?.personal.zip || '').toString(),
				city: primaryUserAddress?.city || checkoutUser?.personal.city || '',
				state: primaryUserAddress?.state || checkoutUser?.personal.state || '',
				country: primaryUserAddress?.country || checkoutUser?.personal.country || 'US',
				email: user?.primaryEmail || checkoutUser?.personal.email || '',
				phone: user?.phone || checkoutUser?.personal.phone || ''
			},
			shouldCreateUser: checkoutUser?.shouldCreateUser || false,
			usePoints: checkoutUser?.usePoints || false
			// useExistingPaymentMethod: checkoutUser?.useExistingPaymentMethod || false
		});
		setUserPrimaryAddress(primaryUserAddress);
		setUserPrimaryPaymentMethod(primaryPaymentMethod);
	}, [user]);

	useEffect(() => {
		async function init() {
			const gatewayDetails: Api.Payment.Res.PublicData = await paymentService.getGateway();
			window.Spreedly.init(gatewayDetails.publicData.token, {
				numberEl: 'spreedly-number',
				cvvEl: 'spreedly-cvv'
			});
		}
		init().catch(console.error);
	}, []);

	useEffect(() => {
		async function verifyAvailability() {
			if (verifiedAccommodation) return;
			try {
				let verifyData: Api.Reservation.Req.Verification = {
					accommodationId: stayParams.accommodationId,
					destinationId: paramsData.destinationId,
					adultCount: stayParams.adults,
					childCount: 0,
					arrivalDate: stayParams.arrivalDate,
					departureDate: stayParams.departureDate,
					numberOfAccommodations: 1,
					upsellPackages: stayParams.packages.map((packageId) => {
						return { id: packageId };
					})
				};
				if (stayParams.rateCode) verifyData.rateCode = stayParams.rateCode;

				let response = await reservationService.verifyAvailability(verifyData);

				if (ObjectUtils.isArrayWithData(stayParams.packages) && params.data.newRoom) {
					const request: Api.UpsellPackage.Req.Availability = {
						destinationId: params.data.destinationId,
						packageIds: stayParams.packages,
						startDate: params.data.newRoom.arrivalDate,
						endDate: params.data.newRoom.departureDate
					};
					const packageResponse = await packageService.getPackagesByIds(request);
					response.upsellPackages = packageResponse.data;
				}
				setVerifiedAccommodation(response);
			} catch (e) {
				rsToastify.error(
					'Your selected accommodation is no longer available for these dates. Removed unavailable accommodation(s).',
					'No Longer Available'
				);
			}
		}
		verifyAvailability().catch(console.error);
	}, []);

	let debounceCvvCardError = debounce(async (element: 'Number' | 'Cvv') => {
		let htmlBlock: HTMLElement | null = document.querySelector(`#${element}`);
		if (!!htmlBlock) htmlBlock.style.color = 'red';
	}, 1000);
	let debounceCvvCardSuccess = debounce(async (element: 'Number' | 'Cvv') => {
		let htmlBlock: HTMLElement | null = document.querySelector(`#${element}`);
		if (!!htmlBlock) htmlBlock.style.color = '#001933';
	}, 1000);

	useEffect(() => {
		let readyId = paymentService.subscribeToSpreedlyReady(() => {
			window.Spreedly.setStyle(
				'number',
				'width:100%;font-size: 21px;height: 38px;padding: 0 10px;box-sizing: border-box;border-radius: 5px;border: 1px solid #dedede; color: #001933; background-color: #ffffff; transition: border-color 300ms; '
			);
			window.Spreedly.setStyle(
				'cvv',
				'width:100%;font-size: 21px;height: 38px;padding: 0 10px;box-sizing: border-box;border-radius: 5px;border: 1px solid #dedede; color: #001933; background-color: #ffffff; transition: border-color 300ms; '
			);
			window.Spreedly.setFieldType('number', 'text');
			window.Spreedly.setNumberFormat('prettyFormat');
		});

		let fieldEventId = paymentService.subscribeToSpreedlyFieldEvent(
			(
				name: 'number' | 'cvv',
				type: 'focus' | 'blur' | 'mouseover' | 'mouseout' | 'input' | 'enter' | 'escape' | 'tab' | 'shiftTab',
				activeEl: 'number' | 'cvv',
				inputProperties: {
					cardType?: string;
					validNumber?: boolean;
					validCvv?: boolean;
					numberLength?: number;
					cvvLength?: number;
				}
			) => {
				if (name === 'number') {
					if (type === 'focus') {
						window.Spreedly.setStyle('number', 'border: 1px solid #004b98;');
					}
					if (type === 'blur') {
						window.Spreedly.setStyle('number', 'border: 1px solid #dedede;');
					}
					if (type === 'mouseover') {
						window.Spreedly.setStyle('number', 'border: 1px solid #004b98;');
					}
					if (type === 'mouseout') {
						window.Spreedly.setStyle('number', 'border: 1px solid #dedede;');
					}

					if (type === 'input' && !inputProperties.validNumber) {
						debounceCvvCardError('Number');
					} else if (type === 'input' && inputProperties.validNumber) {
						debounceCvvCardSuccess('Number');
					}
				}
				if (name === 'cvv') {
					if (type === 'focus') {
						window.Spreedly.setStyle('cvv', 'border: 1px solid #004b98;');
					}
					if (type === 'blur') {
						window.Spreedly.setStyle('cvv', 'border: 1px solid #dedede;');
					}
					if (type === 'mouseover') {
						window.Spreedly.setStyle('cvv', 'border: 1px solid #004b98;');
					}
					if (type === 'mouseout') {
						window.Spreedly.setStyle('cvv', 'border: 1px solid #dedede;');
					}
					if (type === 'input' && !inputProperties.validCvv) {
						debounceCvvCardError('Cvv');
					} else if (type === 'input' && inputProperties.validCvv) {
						debounceCvvCardSuccess('Cvv');
					}
				}
			}
		);

		// Error response codes
		// https://docs.spreedly.com/reference/api/v1/#response-codes
		let errorId = paymentService.subscribeToSpreedlyError((errorMsg) => {
			let errorMessages = errorMsg.map((item) => {
				return item.message;
			});
			popupController.closeAll();
			return rsToastify.error(errorMessages.join(' '), "Can't Contact Payment Provider");
		});

		return () => {
			paymentService.unsubscribeToSpreedlyError(errorId);
			paymentService.unsubscribeToSpreedlyReady(readyId);
			paymentService.unsubscribeToSpreedlyFieldEvent(fieldEventId);
		};
	}, []);

	useEffect(() => {
		if (!verifiedAccommodation) return;
		let subscribeId = paymentService.subscribeToSpreedlyError(() => {});
		let paymentMethodId = paymentService.subscribeToSpreedlyPaymentMethod(
			async (token: string, pmData: Api.Payment.PmData) => {
				const stays: Api.Reservation.Req.Itinerary.Stay[] = [
					{
						accommodationId: verifiedAccommodation.accommodationId,
						numberOfAccommodations: 1,
						arrivalDate: verifiedAccommodation.arrivalDate,
						departureDate: verifiedAccommodation.departureDate,
						adultCount: verifiedAccommodation.adultCount,
						childCount: verifiedAccommodation.childCount,
						rateCode: verifiedAccommodation.rateCode,
						upsellPackages: verifiedAccommodation.upsellPackages,
						guest: {
							firstName: currentCheckoutUser.personal.firstName,
							lastName: currentCheckoutUser.personal.lastName,
							phone: currentCheckoutUser.personal.phone,
							email: currentCheckoutUser.personal.email
						},
						additionalDetails: ''
					}
				];
				const data: Api.Reservation.Req.Itinerary.Create = {
					destinationId: destinationId,
					stays
				};

				if (user) data.userId = user.id;
				if (!user) data.signUp = currentCheckoutUser.shouldCreateUser ? 1 : 0;
				if (userPrimaryAddress) {
					data.existingAddressId = userPrimaryAddress.id;
				} else {
					data.newAddress = {
						type: currentCheckoutUser.billing ? 'BILLING' : 'BOTH',
						address1: currentCheckoutUser.billing?.address1 || currentCheckoutUser.personal.address1,
						address2: currentCheckoutUser.billing?.address2 || currentCheckoutUser.personal.address2,
						city: currentCheckoutUser.billing?.city || currentCheckoutUser.personal.city,
						state: currentCheckoutUser.billing?.state || currentCheckoutUser.personal.state,
						zip: Number(currentCheckoutUser.billing?.zip || currentCheckoutUser.personal.zip),
						country: currentCheckoutUser.billing?.country || currentCheckoutUser.personal.country,
						isDefault: 1
					};
				}
				if (userPrimaryPaymentMethod) {
					data.paymentMethodId = userPrimaryPaymentMethod.id;
				} else {
					data.payment = {
						pmData: {
							...pmData,
							first_six_digits: Number(pmData.first_six_digits),
							last_four_digits: Number(pmData.last_four_digits)
						},
						isPrimary: 1,
						cardToken: token,
						offsiteLoyaltyEnrollment: 0
					};
				}

				try {
					await reservationService.createItinerary(data);
					popupController.close(SpinningLoaderPopup);

					// used because the router isn't working in this callback
					window.location.href = `/booking/checkout?s=3&data=${params.data}`;
				} catch (e) {
					rsToastify.error('Missing proper data or existing card is invalid', 'Error!');
					popupController.close(SpinningLoaderPopup);
				}
			}
		);

		return () => {
			paymentService.unsubscribeToSpreedlyError(subscribeId);
			paymentService.unsubscribeToSpreedlyPaymentMethod(paymentMethodId);
		};
	}, [currentCheckoutUser.paymentInfo, verifiedAccommodation]);

	function isMissingSubmissionData() {
		return (
			!stayParams ||
			!(
				(currentCheckoutUser.useExistingPaymentMethod && !!userPrimaryPaymentMethod) ||
				currentCheckoutUser.usePoints
			) ||
			!verifiedAccommodation
		);
	}

	function shouldTokenizePaymentInformation() {
		return (
			!currentCheckoutUser.usePoints &&
			!currentCheckoutUser.useExistingPaymentMethod &&
			currentCheckoutUser.paymentInfo
		);
	}

	async function completeBooking() {
		if (!verifiedAccommodation || params.stage !== 2) return;
		popupController.open(SpinningLoaderPopup);

		if (shouldTokenizePaymentInformation()) {
			let paymentObj = {
				full_name: currentCheckoutUser.paymentInfo!.nameOnCard,
				month: Number(currentCheckoutUser.paymentInfo!.expiration.split('/')[0]),
				year: Number(currentCheckoutUser.paymentInfo!.expiration.split('/')[1])
			};
			window.Spreedly.tokenizeCreditCard(paymentObj);
		} else {
			if (isMissingSubmissionData()) {
				rsToastify.error('Missing proper data or existing card is invalid', 'Error!');
				throw new Error('Missing proper data or existing card is invalid');
			}

			const stays: Api.Reservation.Req.Itinerary.Stay[] = [
				{
					accommodationId: verifiedAccommodation.accommodationId,
					numberOfAccommodations: 1,
					arrivalDate: verifiedAccommodation.arrivalDate,
					departureDate: verifiedAccommodation.departureDate,
					adultCount: verifiedAccommodation.adultCount,
					childCount: verifiedAccommodation.childCount,
					rateCode: verifiedAccommodation.rateCode,
					upsellPackages: verifiedAccommodation.upsellPackages,
					guest: {
						firstName: currentCheckoutUser.personal.firstName,
						lastName: currentCheckoutUser.personal.lastName,
						phone: currentCheckoutUser.personal.phone,
						email: currentCheckoutUser.personal.email
					},
					additionalDetails: ''
				}
			];
			let data: Api.Reservation.Req.Itinerary.Create = {
				destinationId: destinationId,
				stays
			};

			if (currentCheckoutUser.useExistingPaymentMethod && !!userPrimaryPaymentMethod) {
				data.paymentMethodId = userPrimaryPaymentMethod.id;
			}
			if (user) data.userId = user.id;
			if (!user) data.signUp = currentCheckoutUser.shouldCreateUser ? 1 : 0;
			if (userPrimaryAddress) {
				data.existingAddressId = userPrimaryAddress.id;
			} else {
				data.newAddress = {
					type: currentCheckoutUser.billing ? 'BILLING' : 'BOTH',
					address1: currentCheckoutUser.billing?.address1 || currentCheckoutUser.personal.address1,
					address2: currentCheckoutUser.billing?.address2 || currentCheckoutUser.personal.address2,
					city: currentCheckoutUser.billing?.city || currentCheckoutUser.personal.city,
					state: currentCheckoutUser.billing?.state || currentCheckoutUser.personal.state,
					zip: Number(currentCheckoutUser.billing?.zip || currentCheckoutUser.personal.zip),
					country: currentCheckoutUser.billing?.country || currentCheckoutUser.personal.country,
					isDefault: 1
				};
			}

			try {
				let res = await reservationService.createItinerary(data);
				if (res) popupController.close(SpinningLoaderPopup);
				return handleForwardButtonClick();
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'An error occurred, unable to book your reservation.'),
					'Server Error!',
					{ autoClose: false, position: 'top-center' }
				);
				popupController.close(SpinningLoaderPopup);
			}
		}
	}

	async function handleBackButtonClick() {
		if (params.stage === 0) {
			await router.navigate('/');
			return;
		}
		await router.navigate(`/booking/checkout?s=${params.stage - 1}&data=${params.data}`);
	}

	async function handleForwardButtonClick() {
		await router.navigate(`/booking/checkout?s=${params.stage + 1}&data=${params.data}`);
	}

	function renderInfoView() {
		return <CheckOutInfoCard checkoutUserState={checkoutUserState} onContinue={handleForwardButtonClick} />;
	}

	function renderViewsByStage() {
		const views = [renderInfoView, () => null, renderRemainingViews];
		if (params.stage > 1) {
			return views[2]();
		}

		return views[params.stage]();
	}

	function handleButtonText() {
		const buttons = ['Sign in for a faster checkout', 'Review & book', 'Book now', 'Print confirmation'];
		if (params.stage > 2) {
			return buttons[3];
		}

		return buttons[params.stage];
	}

	function renderRemainingViews() {
		return (
			<>
				{params.stage > 2 && (
					<>
						<ConfirmationImageSummary
							images={[
								'../../images/featureAndBenefits/house.png',
								'../../images/landingPage/travel2x.png',
								'../../images/rewardItemPage/house2x.jpg'
							]}
						/>
						<ThankYouCard reservationNumber={182547194578923} />
					</>
				)}
				<PersonalInformation
					personalInfo={currentCheckoutUser.personal}
					billingInfo={currentCheckoutUser.billing || currentCheckoutUser.personal}
					onEditClickCallback={
						params.stage === 2
							? async () => await router.navigate(`/booking/checkout?s=0&data=${params.data}`)
							: undefined
					}
				/>
				<PaymentMethod
					userCheckout={currentCheckoutUser}
					userPrimaryPaymentMethod={userPrimaryPaymentMethod}
					onEditClickCallback={
						params.stage === 2
							? async () => await router.navigate(`/booking/checkout?s=1&data=${params.data}`)
							: undefined
					}
				/>
				<Policies
					checkInTime={'4:00pm'}
					checkOutTime={'10:00am'}
					bookingDescription={'ROOM 1 4 BEDROOM HOME, 4 BEDROOM HOME EASTSIDE'}
					guaranteePolicy={
						'10% of the total price is required at the time of booking to guarantee the reservation.'
					}
					cancellationPolicy={
						'Reservations for 4 to 8-Bedroom Homes must be canceled at least 15 days prior to arrival ' +
						'and 9 to 13 Bedroom Homes at least 31 days prior to arrival or guest will be charged for ' +
						'all nights of the reservation. Changes may be permitted based on availability.'
					}
				/>
				{params.stage > 2 && (
					<CheckoutReservationSummary
						orders={[
							{
								image: '../../images/featureAndBenefits/house.png',
								title: 'VIP Suite',
								price: 982.34,
								dateBooked: '11-20-21'
							},
							{
								image: '../../images/featureAndBenefits/house.png',
								title: 'VIP Suite',
								price: 1002.34,
								dateBooked: '11-25-21'
							}
						]}
					/>
				)}
			</>
		);
	}

	function handleButtonClass() {
		switch (params.stage) {
			case 0:
				return !!user ? 'none' : 'blue';
			case 1:
				return 'none';
			default:
				return 'yellow';
		}
	}

	async function handleButtonClick() {
		switch (params.stage) {
			case 0:
				return popupController.open(SigninPopup);
			case 2:
				return await completeBooking();
			default:
				return handleForwardButtonClick();
		}
	}

	function handleButtonDisability() {
		switch (params.stage) {
			case 2:
				return isMissingSubmissionData() && !currentCheckoutUser.paymentInfo;
			default:
				return false;
		}
	}

	return (
		<Page className={'rsCheckoutFlowPage'}>
			{params.stage < 4 && (
				<CheckoutBreadcrumbs activeStage={params.stage} onBackButtonClick={handleBackButtonClick} />
			)}
			<div className={'printableContentWrapper'} ref={printRef}>
				<div className={'leftColumn'}>
					<CheckOutPaymentCard
						checkoutUserState={checkoutUserState}
						onContinue={handleForwardButtonClick}
						isDisplayed={params.stage === 1}
						userPrimaryPaymentMethod={userPrimaryPaymentMethod}
					/>
					{renderViewsByStage()}
				</div>
				<div className={'bookingSummaryColumn'}>
					{params.stage > 3 ? (
						<PrintableQrCode qrCode={'../../images/checkoutPage/rentylResortsQR.jpg'} />
					) : (
						<Button
							className={`printConfirmButton ${handleButtonClass()}`}
							look={'containedPrimary'}
							onClick={handleButtonClick}
							disabled={handleButtonDisability()}
						>
							{handleButtonText()}
						</Button>
					)}
					{!!verifiedAccommodation && (
						<BookingSummaryCard bookingData={verifiedAccommodation} canHide={false} />
					)}
				</div>
			</div>
		</Page>
	);
};

export default CheckoutFlowPage;
