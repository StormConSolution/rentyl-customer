import * as React from 'react';
import './AccountPaymentMethodsPage.scss';
import AccountHeader from '../../components/accountHeader/AccountHeader';
import { Link, Page, popupController } from '@bit/redsky.framework.rs.996';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../../components/paper/Paper';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import LabelButton from '../../components/labelButton/LabelButton';
import { useEffect, useRef, useState } from 'react';
import LoadingPage from '../loadingPage/LoadingPage';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import rsToasts from '@bit/redsky.framework.toast';
import serviceFactory from '../../services/serviceFactory';
import PaymentService from '../../services/payment/payment.service';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import OtherPaymentCard from '../../components/otherPaymentsCard/OtherPaymentCard';
import Footer from '../../components/footer/Footer';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';

let isPrimary: 1 | 0 = 0;

const AccountPaymentMethodsPage: React.FC = () => {
	const numberRef = useRef<HTMLElement>(null);
	const cvvRef = useRef<HTMLElement>(null);
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [primaryCard, setPrimaryCard] = useState<Api.User.PaymentMethod>();
	const [nonPrimaryCardList, setNonPrimaryCardList] = useState<Api.User.PaymentMethod[]>([]);
	const [isValidCard, setIsValidCard] = useState<boolean>(false);
	const [isValidCvv, setIsValidCvv] = useState<boolean>(false);
	const [isValidForm, setIsValidForm] = useState<boolean>(false);
	const [isFormComplete, setIsFormComplete] = useState<boolean>(false);
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [existingCardList, setExistingCardList] = useState<Api.User.PaymentMethod[]>([]);
	const [creditCardObj, setCreditCardObj] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('full_name', '', [new RsValidator(RsValidatorEnum.REQ, 'Full name is required')]),
			new RsFormControl('expDate', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Expiration required'),
				new RsValidator(RsValidatorEnum.MIN, 'Expiration too short', 7),
				new RsValidator(RsValidatorEnum.MAX, 'Expiration too long', 7),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Invalid Expiration Date', (control) => {
					let month = parseInt(control.value.toString().slice(0, 2));
					let year = parseInt(control.value.toString().slice(3, 7));
					let currentYear = new Date().getFullYear();
					let currentMonth = new Date().getMonth() + 1;
					if (month > 12) return false;
					if (year === currentYear) return month >= currentMonth;
					else return year > currentYear;
				})
			])
		])
	);

	useEffect(() => {
		setIsFormComplete(isValidCvv && isValidCard);
	}, [isValidForm, isValidCard, isValidCvv]);

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
		let readyId = paymentService.subscribeToSpreedlyReady(() => {
			window.Spreedly.setStyle(
				'number',
				'width:200px;font-size: 16px;height: 40px;padding: 0 10px;box-sizing: border-box;border-radius: 0;border: 1px solid #dedede; color: #001933; background-color: #ffffff; transition: border-color 300ms; '
			);
			window.Spreedly.setStyle(
				'cvv',
				'width:200px;font-size: 16px;height: 40px;padding: 0 10px;box-sizing: border-box;border-radius: 0;border: 1px solid #dedede; color: #001933; background-color: #ffffff; text-align: center; transition: border-color 300ms; '
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
						setIsValidCard(false);
					} else if (type === 'input' && inputProperties.validNumber) {
						setIsValidCard(true);
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
						setIsValidCvv(false);
					} else if (type === 'input' && inputProperties.validCvv) {
						setIsValidCvv(true);
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
			return rsToasts.error(errorMessages.join(' '), '', 8000);
		});

		let paymentMethodId = paymentService.subscribeToSpreedlyPaymentMethod(
			async (token: string, pmData: Api.Payment.PmData) => {
				let data: Api.Payment.Req.Create = {
					cardToken: token,
					pmData: pmData,
					isPrimary: isPrimary,
					offsiteLoyaltyEnrollment: isAuthorized ? 1 : 0
				};

				try {
					const result = await paymentService.addPaymentMethod(data);
					if (result) rsToasts.success('Card Added!');
					let newExistingCardList = [
						...existingCardList,
						{
							id: result.id,
							userAddressId: result.userAddressId,
							nameOnCard: result.nameOnCard,
							type: result.type,
							last4: result.last4,
							expirationMonth: result.expirationMonth,
							expirationYear: result.expirationYear,
							cardNumber: result.cardNumber,
							isPrimary: result.isPrimary,
							createdOn: result.createdOn,
							systemProvider: result.systemProvider
						}
					];
					if (result.isPrimary) {
						newExistingCardList = newExistingCardList.map((item) => {
							return { ...item, isPrimary: item.id === result.id ? 1 : 0 };
						});
					}
					setExistingCardList(newExistingCardList);
					popupController.close(SpinningLoaderPopup);
				} catch (e) {
					console.error(e);
					popupController.close(SpinningLoaderPopup);
				}
			}
		);

		return () => {
			paymentService.unsubscribeToSpreedlyPaymentMethod(paymentMethodId);
			paymentService.unsubscribeToSpreedlyReady(readyId);
			paymentService.unsubscribeToSpreedlyFieldEvent(fieldEventId);
			paymentService.unsubscribeToSpreedlyError(errorId);
		};
	}, [existingCardList, isAuthorized]);

	useEffect(() => {
		if (!user) return;
		setExistingCardList(user.paymentMethods);
	}, [user]);

	useEffect(() => {
		if (!existingCardList) return;
		let primaryCard = existingCardList.find((item) => item.isPrimary);
		if (!primaryCard) primaryCard = existingCardList[0];

		let nonPrimaryCards = existingCardList.filter((item) => !item.isPrimary);
		setPrimaryCard(primaryCard);
		setNonPrimaryCardList(nonPrimaryCards);
	}, [existingCardList]);

	function isFormFilledOut(): boolean {
		return (
			!!creditCardObj.get('full_name').value.toString().length &&
			!!creditCardObj.get('expDate').value.toString().length
		);
	}

	async function updateCreditCardObj(control: RsFormControl) {
		if (
			control.key === 'expDate' &&
			!control.value.toString().includes('/') &&
			control.value.toString().length === 4
		) {
			control.value = control.value.toString().slice(0, 2) + '/' + control.value.toString().slice(2, 4);
		}
		creditCardObj.update(control);
		let isFormValid = await creditCardObj.isValid();
		setIsValidForm(isFormFilledOut() && isFormValid);
		setCreditCardObj(creditCardObj.clone());
	}

	async function deletePaymentCard(id: number) {
		if (!user) return;
		popupController.open(SpinningLoaderPopup);
		try {
			await paymentService.delete(id);
			let newExistingCardList = [...existingCardList];
			newExistingCardList = newExistingCardList.filter((item) => item.id !== id);
			setExistingCardList(newExistingCardList);
			popupController.close(SpinningLoaderPopup);
		} catch (e) {
			popupController.close(SpinningLoaderPopup);
			console.error(e.message);
		}
	}

	async function setCardToPrimary(data: Api.Payment.Req.Update) {
		popupController.open(SpinningLoaderPopup);
		try {
			let res = await paymentService.update(data);
			let newExistingCardList = [...existingCardList];
			newExistingCardList = newExistingCardList.map((item) => {
				return { ...item, isPrimary: item.id === res.id ? 1 : 0 };
			});
			setExistingCardList(newExistingCardList);
			popupController.close(SpinningLoaderPopup);
		} catch (e) {
			popupController.close(SpinningLoaderPopup);
		}
	}

	function renderOtherPaymentCards() {
		if (!nonPrimaryCardList) return;
		return nonPrimaryCardList.map((item, index) => {
			return (
				<OtherPaymentCard
					key={index}
					name={item.nameOnCard}
					cardNumber={item.cardNumber}
					expDate={`${item.expirationMonth}/${item.expirationYear}`}
					onDelete={() => {
						deletePaymentCard(item.id).catch(console.error);
					}}
					onSetPrimary={() => {
						setCardToPrimary({ id: item.id, isPrimary: 1 }).catch(console.error);
					}}
				/>
			);
		});
	}

	async function save() {
		let newCreditCardObj: any = creditCardObj.toModel();
		newCreditCardObj.month = parseInt(newCreditCardObj.expDate.split('/')[0]);
		newCreditCardObj.year = parseInt(newCreditCardObj.expDate.split('/')[1]);
		delete newCreditCardObj.expDate;
		popupController.open(SpinningLoaderPopup);
		window.Spreedly.tokenizeCreditCard(newCreditCardObj);
	}

	function renderPrimaryCard() {
		if (!primaryCard) return;
		return (
			<Paper
				className={'fakeCreditCard'}
				borderRadius={'4px'}
				boxShadow
				padding={'25px 30px 16px'}
				position={'relative'}
				height={'206px'}
				width={'390px'}
			>
				<Box>
					<img src={require('../../images/card-chip.png')} width={38} height={30} alt={'card chip'} />
				</Box>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Box>
						<Label variant={'caption'}>Card Number</Label>
						<Label variant={'h3'}>{primaryCard.cardNumber}</Label>
					</Box>
					<Box>
						<Label variant={'caption'}>Exp Date</Label>
						<Label
							variant={'body1'}
						>{`${primaryCard.expirationMonth}/${primaryCard.expirationYear}`}</Label>
					</Box>
				</Box>
				<Box className={'bottomStrip'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
					<Box>
						<Label variant={'caption'}>Name on card</Label>
						<Label variant={'body1'}>{primaryCard.nameOnCard}</Label>
					</Box>
					<Label variant={'h3'}>{primaryCard.type.toUpperCase()}</Label>
				</Box>
			</Paper>
		);
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountPaymentMethodsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<AccountHeader selected={'PAYMENT_METHODS'} />
				<Box width={'921px'} margin={'60px auto'} display={'flex'} justifyContent={'space-between'}>
					<Box width={'420px'}>
						<Label variant={'h2'}>Primary payment method</Label>
						{renderPrimaryCard()}
					</Box>
					<Box width={'420px'}>
						<Label variant={'h2'}>Add new payment method</Label>
						<form id={'payment-form'} action={'/card-payment'}>
							<LabelInput
								title={'Name on Card'}
								inputType={'text'}
								control={creditCardObj.get('full_name')}
								updateControl={updateCreditCardObj}
							/>
							<div ref={numberRef} id={'spreedly-number'}>
								<Label variant={'caption'} mb={10}>
									Card Number
								</Label>
							</div>
							<LabelInput
								className={'creditCardExpInput'}
								maxLength={7}
								title={'Expiration Date'}
								inputType={'text'}
								control={creditCardObj.get('expDate')}
								updateControl={updateCreditCardObj}
								placeholder={'MM/YYYY'}
							/>
							<div ref={cvvRef} id={'spreedly-cvv'}>
								<Label variant={'caption'} mb={10}>
									CVV
								</Label>
							</div>
						</form>

						<LabelCheckbox
							value={1}
							text={
								<>
									* By checking this box, you authorize your credit card network to monitor and share
									transaction data with Fidel (our service provider) to earn points for your offline
									purchases. You also acknowledge and agree that Fidel may share certain details of
									your qualifying transactions with Spire Loyalty in accordance with the{' '}
									<Link path={'/'}>
										<span>Terms and Conditions</span>
									</Link>
									,{' '}
									<Link path={'/'}>
										<span>Privacy Policy</span>
									</Link>{' '}
									and{' '}
									<Link path={'/'}>
										<span>Fidel Privacy Policy</span>
									</Link>
									. You may opt-out of this optional service at any time by removing this card from
									your Spire Loyalty account.
								</>
							}
							isChecked={false}
							onSelect={() => {
								setIsAuthorized(true);
							}}
							onDeselect={() => {
								setIsAuthorized(false);
							}}
						/>

						<LabelCheckbox
							value={'isPrimary'}
							text={'Set as primary'}
							isChecked={false}
							onSelect={() => {
								isPrimary = 1;
							}}
							onDeselect={() => {
								isPrimary = 0;
							}}
						/>
						<LabelButton
							look={isFormComplete ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Add New Payment'}
							disabled={!isFormComplete}
							onClick={() => {
								save();
							}}
						/>
					</Box>
				</Box>
				<hr />
				<Box className={'otherCardContainer'} m={'60px 0'}>
					<Label variant={'h4'}>Other payment methods</Label>
					<Box className={'otherPaymentCardWrapper'}>{renderOtherPaymentCards()}</Box>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default AccountPaymentMethodsPage;
