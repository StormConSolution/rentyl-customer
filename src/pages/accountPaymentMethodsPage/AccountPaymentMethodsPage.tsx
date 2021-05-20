import * as React from 'react';
import './AccountPaymentMethodsPage.scss';
import AccountHeader from '../../components/accountHeader/AccountHeader';
import { Link, Page } from '@bit/redsky.framework.rs.996';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../../components/paper/Paper';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import LabelButton from '../../components/labelButton/LabelButton';
import { useEffect, useRef, useState } from 'react';
import LoadingPage from '../loadingPage/LoadingPage';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import rsToasts from '@bit/redsky.framework.toast';
import serviceFactory from '../../services/serviceFactory';
import PaymentService from '../../services/payment/payment.service';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import OtherPaymentCard from '../../components/otherPaymentsCard/OtherPaymentCard';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';

interface AccountPaymentMethodsPageProps {}

let isPrimary = false;

const AccountPaymentMethodsPage: React.FC<AccountPaymentMethodsPageProps> = (props) => {
	const numberRef = useRef<HTMLElement>(null);
	const cvvRef = useRef<HTMLElement>(null);
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [primaryCard, setPrimaryCard] = useState<Api.User.PaymentMethod>();
	const [isValidCard, setIsValidCard] = useState<boolean>(false);
	const [isValidCvv, setIsValidCvv] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(false);
	const [isFormComplete, setIsFormComplete] = useState<boolean>(false);
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
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
		setIsFormComplete(isValidCvv && isValidCard && isAuthorized);
	}, [isValid, isValidCard, isValidCvv, isAuthorized]);

	useEffect(() => {
		async function init() {
			const gatewayDetails: Api.Payment.Res.PublicData = await paymentService.getGateway();
			window.Spreedly.init(gatewayDetails.publicData.token, {
				numberEl: 'spreedly-number',
				cvvEl: 'spreedly-cvv'
			});
			window.Spreedly.on('ready', function (frame: any) {
				console.log('Spreedly is loaded');
				window.Spreedly.setStyle(
					'number',
					'width:200px;font-size: 16px;height: 40px;padding: 0 10px;box-sizing: border-box;border-radius: 0;border: 1px solid #dedede; color: #001933; background-color: #ffffff '
				);
				window.Spreedly.setStyle(
					'cvv',
					'width:200px;font-size: 16px;height: 40px;padding: 0 10px;box-sizing: border-box;border-radius: 0;border: 1px solid #dedede; color: #001933; background-color: #ffffff; text-align: center; '
				);
				window.Spreedly.setFieldType('number', 'text');
				window.Spreedly.setNumberFormat('prettyFormat');
			});

			window.Spreedly.on('fieldEvent', function (
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
			) {
				if (name === 'number') {
					let numberParent = numberRef.current;
					if (type === 'focus') {
						numberParent!.className = 'highlighted';
					}
					if (type === 'input' && !inputProperties.validNumber) {
						setIsValidCard(false);
					} else if (type === 'input' && inputProperties.validNumber) {
						setIsValidCard(true);
					}
				}
				if (name === 'cvv') {
					let cvvParent = cvvRef.current;
					if (type === 'focus') {
						cvvParent!.className = 'highlighted';
					}
					if (type === 'input' && !inputProperties.validCvv) {
						setIsValidCvv(false);
					} else if (type === 'input' && inputProperties.validCvv) {
						setIsValidCvv(true);
					}
				}
			});

			// Error response codes
			// https://docs.spreedly.com/reference/api/v1/#response-codes
			window.Spreedly.on('errors', function (errors: any) {
				for (let error of errors) {
					console.log(error);
					rsToasts.error(error.message);
				}
			});
			window.Spreedly.on('paymentMethod', async function (token: string, pmData: Api.Payment.PmData) {
				console.log(token);
				console.log(pmData);

				try {
					const result = await paymentService.addPaymentMethod(token, pmData);
					console.log('result', result);
					rsToasts.success('BOOOOOM! Tokenized and updated');
				} catch (e) {
					console.error(e);
				}
			});
		}
		init().catch(console.error);
	}, []);

	useEffect(() => {
		function getUserPrimaryCard() {
			if (!user) return;
			let primaryCard = user.paymentMethods.find((item) => item.isPrimary);
			if (!primaryCard) primaryCard = user.paymentMethods[0];
			setPrimaryCard(primaryCard);
		}
		getUserPrimaryCard();
	}, [user]);

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
			let newValue = control.value.toString().slice(0, 2) + '/' + control.value.toString().slice(2, 4);
			control.value = newValue;
		}
		creditCardObj.update(control);
		let isFormValid = await creditCardObj.isValid();
		// props.onCreditCardChange(creditCardObj.toModel());
		setIsValid(isFormFilledOut() && isFormValid);
		setCreditCardObj(creditCardObj.clone());
	}

	function renderOtherPaymentCards() {
		if (!user) return;
		let nonPrimaryCards = user.paymentMethods.filter((item) => !item.isPrimary && item.systemProvider === 'adyen');
		return nonPrimaryCards.map((item, index) => {
			return (
				<OtherPaymentCard
					key={index}
					name={item.nameOnCard}
					cardNumber={item.cardNumber}
					expDate={`${item.expirationMonth}/${item.expirationYear}`}
					onDelete={() => {
						console.log('delete');
					}}
					onSetPrimary={() => {
						console.log('set primary');
					}}
				/>
			);
		});
	}

	async function save() {
		let newCreditCardObj: any = creditCardObj.toModel();
		newCreditCardObj.month = parseInt(newCreditCardObj.expDate.split('/')[0]);
		newCreditCardObj.year = parseInt(newCreditCardObj.expDate.split('/')[1]);
		newCreditCardObj.isPrimary = isPrimary ? 1 : 0;
		delete newCreditCardObj.expDate;
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
					<img src={require('../../images/card-chip.png')} width={38} height={30} />
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
							onSelect={(value, text) => {
								isPrimary = true;
							}}
							onDeselect={(value, text) => {
								isPrimary = false;
							}}
						/>
						<LabelButton
							look={isFormComplete ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Add New Address'}
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
