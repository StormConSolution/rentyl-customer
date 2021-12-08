import * as React from 'react';
import './AccountPaymentMethodsMobilePage.scss';
import useWindowResizeChange from '../../../customHooks/useWindowResizeChange';
import { useEffect, useRef, useState } from 'react';
import serviceFactory from '../../../services/serviceFactory';
import PaymentService from '../../../services/payment/payment.service';
import { useRecoilValue } from 'recoil';
import globalState from '../../../state/globalState';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { Link, Page, popupController } from '@bit/redsky.framework.rs.996';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import SpinningLoaderPopup from '../../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import { ObjectUtils } from '../../../utils/utils';
import OtherPaymentCard from '../../../components/otherPaymentsCard/OtherPaymentCard';
import LoadingPage from '../../loadingPage/LoadingPage';
import SubNavMenu from '../../../components/subNavMenu/SubNavMenu';
import Paper from '../../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import LabelInput from '../../../components/labelInput/LabelInput';
import LabelCheckbox from '../../../components/labelCheckbox/LabelCheckbox';
import LabelButton from '../../../components/labelButton/LabelButton';

let isPrimary: 1 | 0 = 0;

const AccountPaymentMethodsMobilePage: React.FC = () => {
	const size = useWindowResizeChange();
	const numberRef = useRef<HTMLElement>(null);
	const cvvRef = useRef<HTMLElement>(null);
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [primaryCard, setPrimaryCard] = useState<Api.User.PaymentMethod | undefined>();
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!!primaryCard) return;

		isPrimary = 1;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let readyId = paymentService.subscribeToSpreedlyReady(() => {
			if (size === 'small') {
				window.Spreedly.setStyle(
					'number',
					'width:100%;font-size: 16px;height: 40px;padding: 0 10px;box-sizing: border-box;border-radius: 0;border: 1px solid #dedede; color: #001933; background-color: #ffffff; transition: border-color 300ms;border-radius: 5px;'
				);
				window.Spreedly.setStyle(
					'cvv',
					'width:100%;font-size: 16px;height: 40px;padding: 0 10px;box-sizing: border-box;border-radius: 0;border: 1px solid #dedede; color: #001933; background-color: #ffffff; text-align: center; transition: border-color 300ms;border-radius: 5px; '
				);
			} else {
				window.Spreedly.setStyle(
					'number',
					'width:100%;font-size: 16px;height: 40px;padding: 0 10px;box-sizing: border-box;border-radius: 0;border: 1px solid #dedede; color: #001933; background-color: #ffffff; transition: border-color 300ms;border-radius: 5px; '
				);
				window.Spreedly.setStyle(
					'cvv',
					'width:100%;font-size: 16px;height: 40px;padding: 0 10px;box-sizing: border-box;border-radius: 0;border: 1px solid #dedede; color: #001933; background-color: #ffffff; text-align: center; transition: border-color 300ms;border-radius: 5px; '
				);
			}
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
			return rsToastify.error(errorMessages.join(' '), 'Error!');
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
					if (result) rsToastify.success('Card successfully added.', 'Card Added!');
					window.Spreedly.reload();
					creditCardObj.resetToInitialValue();
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
		if (!ObjectUtils.isArrayWithData(existingCardList)) return;
		let primaryCard = existingCardList.find((item) => item.isPrimary);

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

	function renderPaymentMethods() {
		if (!ObjectUtils.isArrayWithData(nonPrimaryCardList) && !!primaryCard) {
			return (
				<OtherPaymentCard
					key={primaryCard.id}
					name={primaryCard.nameOnCard}
					id={primaryCard.id}
					last4={primaryCard.last4}
					cardType={primaryCard.type}
					isPrimary={primaryCard.isPrimary}
				/>
			);
		} else if (!ObjectUtils.isArrayWithData(nonPrimaryCardList) || !primaryCard) return;

		let cardList = nonPrimaryCardList.map((item, index) => {
			return (
				<OtherPaymentCard
					key={item.id}
					id={item.id}
					isPrimary={item.isPrimary}
					cardType={item.type}
					name={item.nameOnCard}
					last4={item.last4}
					onDelete={() => {
						deletePaymentCard(item.id).catch(console.error);
					}}
					onSetPrimary={() => {
						setCardToPrimary({ id: item.id, isPrimary: 1 }).catch(console.error);
					}}
				/>
			);
		});
		if (!!primaryCard) {
			cardList = [
				<OtherPaymentCard
					key={primaryCard.id}
					name={primaryCard.nameOnCard}
					id={primaryCard.id}
					last4={primaryCard.last4}
					cardType={primaryCard.type}
					isPrimary={primaryCard.isPrimary}
				/>,
				...cardList
			];
		}
		return cardList;
	}

	async function save() {
		let newCreditCardObj: any = creditCardObj.toModel();
		newCreditCardObj.month = parseInt(newCreditCardObj.expDate.split('/')[0]);
		newCreditCardObj.year = parseInt(newCreditCardObj.expDate.split('/')[1]);
		delete newCreditCardObj.expDate;
		popupController.open(SpinningLoaderPopup);
		window.Spreedly.tokenizeCreditCard(newCreditCardObj);
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountPaymentMethodsMobilePage'}>
			<SubNavMenu title={'Payment methods'} />
			<Paper boxShadow borderRadius={'20px'} className={'paymentMethods'}>
				<Label variant={'customEleven'} mb={size === 'small' ? 25 : 30}>
					Other payment methods
				</Label>
				<Box className={'otherPaymentCardWrapper'}>{renderPaymentMethods()}</Box>
			</Paper>
			<hr />
			<Paper boxShadow borderRadius={'20px'} className={'newPaymentForm'}>
				<Label variant={'customEleven'} mb={size === 'small' ? 25 : 30}>
					Add new payment method
				</Label>
				<form id={'payment-form'} action={'/card-payment'}>
					<LabelInput
						labelVariant={size === 'small' ? 'customSixteen' : 'body5'}
						title={'Name on Card'}
						inputType={'text'}
						control={creditCardObj.get('full_name')}
						updateControl={updateCreditCardObj}
					/>

					<div ref={numberRef} id={'spreedly-number'}>
						<Label variant={size === 'small' ? 'customSixteen' : 'body5'} mb={10}>
							Card Number
						</Label>
					</div>
					<div ref={cvvRef} id={'spreedly-cvv'}>
						<Label variant={size === 'small' ? 'customSixteen' : 'body5'} mb={10}>
							CVV
						</Label>
					</div>
					<LabelInput
						labelVariant={size === 'small' ? 'customSixteen' : 'body5'}
						className={'creditCardExpInput'}
						maxLength={7}
						title={'Expiration Date'}
						inputType={'text'}
						control={creditCardObj.get('expDate')}
						updateControl={updateCreditCardObj}
						placeholder={'MM/YYYY'}
					/>
				</form>

				<LabelCheckbox
					value={1}
					text={
						<React.Fragment>
							* By checking this box, you authorize your credit card network to monitor and share
							transaction data with Fidel (our service provider) to earn points for your offline
							purchases. You also acknowledge and agree that Fidel may share certain details of your
							qualifying transactions with Spire Loyalty in accordance with the{' '}
							<Link path={`/legal/terms-and-conditions`} external target={'blank'}>
								<span>Terms and Conditions</span>
							</Link>
							,{' '}
							<Link path={'/legal/privacy'} external target={'blank'}>
								<span>Privacy Policy</span>
							</Link>{' '}
							and{' '}
							<Link path={'https://fidel.uk/legal/privacy/'} external target={'blank'}>
								<span>Fidel Privacy Policy</span>
							</Link>
							. You may opt-out of this optional service at any time by removing this card from your Spire
							Loyalty account.
						</React.Fragment>
					}
					isChecked={false}
					onSelect={() => {
						setIsAuthorized(true);
					}}
					onDeselect={() => {
						setIsAuthorized(false);
					}}
					lineClamp={40}
				/>

				<LabelCheckbox
					className={`isPrimaryCheckbox ${!primaryCard ? 'disabled' : ''}`}
					value={'isPrimary'}
					text={'Set as primary'}
					isChecked={!primaryCard}
					isDisabled={!primaryCard}
					onSelect={() => {
						isPrimary = 1;
					}}
					onDeselect={() => {
						isPrimary = 0;
					}}
				/>
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'Add New Payment'}
					disabled={!isFormComplete}
					onClick={() => {
						save();
					}}
				/>
			</Paper>
		</Page>
	);
};

export default AccountPaymentMethodsMobilePage;
