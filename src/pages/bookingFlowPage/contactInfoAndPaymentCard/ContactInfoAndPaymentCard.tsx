import * as React from 'react';
import './ContactInfoAndPaymentCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelInput from '../../../components/labelInput/LabelInput';
import Paper from '../../../components/paper/Paper';
import { useEffect, useState } from 'react';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import luhn from 'luhn';
import { formatPhoneNumber, removeAllExceptNumbers } from '../../../utils/utils';

type ContactInfoForm = { firstName: string; lastName: string; phone: string; details: string };
type CreditCardForm = { name: string; cardNumber: string; expDate: string };
interface ContactInfoAndPaymentCardProps {
	onContactChange: (value: ContactInfoForm) => void;
	onCreditCardChange: (value: CreditCardForm) => void;
	isValidForm: (isValid: boolean) => void;
}

const ContactInfoAndPaymentCard: React.FC<ContactInfoAndPaymentCardProps> = (props) => {
	const [isValid, setIsValid] = useState<boolean>(false);
	const [creditCardObj, setCreditCardObj] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('fullName', '', [new RsValidator(RsValidatorEnum.REQ, 'Full name is required')]),
			new RsFormControl('creditCard', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Credit Card is required'),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Invalid Credit Card', (control) => {
					return luhn.validate(control.value.toString());
				})
			]),

			new RsFormControl('expDate', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Expiration required'),
				new RsValidator(RsValidatorEnum.MIN, 'Expiration too short', 5),
				new RsValidator(RsValidatorEnum.MAX, 'Expiration too long', 5),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Invalid Expiration Date', (control) => {
					let month = parseInt(control.value.toString().slice(0, 2));
					let year = parseInt(control.value.toString().slice(3, 5)) + 2000;
					let currentYear = new Date().getFullYear();
					let currentMonth = new Date().getMonth() + 1;

					if (year === currentYear) return month >= currentMonth;
					else return year > currentYear;
				})
			])
		])
	);
	const [contactInfoForm, setContactInfoForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('firstName', '', [new RsValidator(RsValidatorEnum.REQ, 'First name is required')]),
			new RsFormControl('lastName', '', [new RsValidator(RsValidatorEnum.REQ, 'Last name is required')]),
			new RsFormControl('phone', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Phone number required'),
				new RsValidator(RsValidatorEnum.MIN, 'Phone number too short', 10)
			]),
			new RsFormControl('data', '', [])
		])
	);

	useEffect(() => {
		props.isValidForm(isValid);
	}, [isValid]);

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
		if (control.key === 'phone' && control.value.toString().length === 10) {
			let newValue = formatPhoneNumber(control.value.toString());
			control.value = newValue;
		} else if (control.key === 'phone' && control.value.toString().length > 10) {
			let newValue = removeAllExceptNumbers(control.value.toString());
			control.value = newValue;
		}
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
			!!contactInfoForm.get('phone').value.toString().length &&
			!!creditCardObj.get('fullName').value.toString().length &&
			!!creditCardObj.get('creditCard').value.toString().length &&
			!!creditCardObj.get('expDate').value.toString().length
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
					title={'Phone'}
					inputType={'tel'}
					maxLength={10}
					isPhoneInput
					iconImage={'icon-phone'}
					control={contactInfoForm.get('phone')}
					updateControl={updateContactInfoForm}
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
			<Box>
				<Label variant={'h2'} mb={'10px'}>
					Payment Information
				</Label>

				<Box className={'creditCardInfo'} display={'flex'} justifyContent={'space-between'}>
					<LabelInput
						title={'Name on Card'}
						inputType={'text'}
						control={creditCardObj.get('fullName')}
						updateControl={updateCreditCardObj}
					/>
					<LabelInput
						title={'Card Number'}
						inputType={'text'}
						control={creditCardObj.get('creditCard')}
						updateControl={updateCreditCardObj}
					/>

					<LabelInput
						className={'creditCardExpInput'}
						maxLength={5}
						title={'Expiration Date'}
						inputType={'text'}
						control={creditCardObj.get('expDate')}
						updateControl={updateCreditCardObj}
						placeholder={'MM/YY'}
					/>
				</Box>
			</Box>
		</Paper>
	);
};

export default ContactInfoAndPaymentCard;
