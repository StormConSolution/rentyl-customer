import * as React from 'react';
import './ContactInfoAndPaymentCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box, Link } from '@bit/redsky.framework.rs.996';
import LabelInput from '../../../components/labelInput/LabelInput';
import Paper from '../../../components/paper/Paper';
import { useEffect, useState } from 'react';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { useRecoilValue } from 'recoil';
import globalState from '../../../models/globalState';
import serviceFactory from '../../../services/serviceFactory';
import PaymentService from '../../../services/payment/payment.service';
import rsToasts from '@bit/redsky.framework.toast';
import LabelCheckbox from '../../../components/labelCheckbox/LabelCheckbox';
import Select from '../../../components/Select/Select';

type ContactInfoForm = { firstName: string; lastName: string; phone: string; details: string };
type CreditCardForm = { full_name: string; expDate: string };

interface ContactInfoAndPaymentCardProps {
	onContactChange: (value: ContactInfoForm) => void;
	onCreditCardChange: (value: CreditCardForm) => void;
	isValidForm: (isValid: boolean) => void;
}

let phoneNumber = '';

const ContactInfoAndPaymentCard: React.FC<ContactInfoAndPaymentCardProps> = (props) => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const [isValid, setIsValid] = useState<boolean>(false);
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [useExistingCreditCard, setUseExistingCreditCard] = useState<boolean>(false);
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
	const [contactInfoForm, setContactInfoForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('firstName', user?.firstName || '', [
				new RsValidator(RsValidatorEnum.REQ, 'First name is required')
			]),
			new RsFormControl('lastName', user?.lastName || '', [
				new RsValidator(RsValidatorEnum.REQ, 'Last name is required')
			]),
			new RsFormControl('data', '', [])
		])
	);

	useEffect(() => {
		if (!user) return;
		phoneNumber = user.phone;
	}, [user]);

	useEffect(() => {
		props.isValidForm(isValid && isAuthorized);
	}, [isValid, isAuthorized]);

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
		props.onCreditCardChange(creditCardObj.toModel());
		setIsValid(isFormFilledOut() && isFormValid);
		setCreditCardObj(creditCardObj.clone());
	}

	async function updateContactInfoForm(control: RsFormControl) {
		contactInfoForm.update(control);
		let isFormValid = await contactInfoForm.isValid();
		props.onContactChange(contactInfoForm.toModel());
		setIsValid(isFormFilledOut() && isFormValid);
		setContactInfoForm(contactInfoForm.clone());
	}

	function isFormFilledOut(): boolean {
		return (
			!!contactInfoForm.get('firstName').value.toString().length &&
			!!contactInfoForm.get('lastName').value.toString().length &&
			!!creditCardObj.get('full_name').value.toString().length &&
			!!creditCardObj.get('expDate').value.toString().length &&
			!!phoneNumber.length
		);
	}

	return (
		<Paper className={'rsContactInfoAndPaymentCard'} borderRadius={'4px'} boxShadow padding={'16px'}>
			<Label variant={'h2'} marginBottom={'10px'}>
				Contact Info
			</Label>
			<Box className={'contactInfo'}>
				<LabelInput
					title={'First Name'}
					inputType={'text'}
					control={contactInfoForm.get('firstName')}
					updateControl={updateContactInfoForm}
				/>
				<LabelInput
					title={'Last Name'}
					inputType={'text'}
					control={contactInfoForm.get('lastName')}
					updateControl={updateContactInfoForm}
				/>
				<LabelInput
					inputType={'tel'}
					title={'Phone'}
					isPhoneInput
					onChange={(value) => {
						phoneNumber = value;
					}}
					initialValue={user?.phone}
				/>
			</Box>
			<hr />
			<Label variant={'h2'} marginBottom={'10px'}>
				Additional Details and Preferences
			</Label>
			<LabelInput
				title={''}
				inputType={'textarea'}
				control={contactInfoForm.get('data')}
				updateControl={updateContactInfoForm}
			/>
			<hr />
			<form id={'payment-form'} action={'/card-payment'}>
				<Box display={'flex'}>
					<Label variant={'h2'} mb={'10px'}>
						Payment Information
					</Label>
					<LabelCheckbox
						className={'useExistingCreditCard'}
						value={1}
						text={'Use Credit Card on file'}
						onSelect={() => setUseExistingCreditCard(true)}
						onDeselect={() => setUseExistingCreditCard(false)}
					/>
				</Box>

				<Select
					className={!useExistingCreditCard ? 'hide' : ''}
					options={[{ selected: false, text: '****1234', value: 1 }]}
					onChange={(value) => {
						console.log(value);
					}}
				/>
				<Box className={'creditCardInfo'} display={useExistingCreditCard ? 'none' : 'grid'}>
					<LabelInput
						title={'Name on Card'}
						inputType={'text'}
						control={creditCardObj.get('full_name')}
						updateControl={updateCreditCardObj}
					/>
					<div id={'spreedly-number'}>
						<Label variant={'caption'} mb={10}>
							Credit Card
						</Label>
					</div>
					<div id={'spreedly-cvv'}>
						<Label variant={'caption'} mb={10}>
							CVV
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
				</Box>
				<LabelCheckbox
					value={1}
					text={
						<>
							* By checking this box, you authorize your credit card network to monitor and share
							transaction data with Fidel (our service provider) to earn points for your offline
							purchases. You also acknowledge and agree that Fidel may share certain details of your
							qualifying transactions with Spire Loyalty in accordance with the{' '}
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
							. You may opt-out of this optional service at any time by removing this card from your Spire
							Loyalty account.
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
			</form>
		</Paper>
	);
};

export default ContactInfoAndPaymentCard;
