import * as React from 'react';
import './ContactInfoAndPaymentCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelInput from '../../../components/labelInput/LabelInput';
import Paper from '../../../components/paper/Paper';
import { useEffect, useState } from 'react';

type ContactInfoForm = { firstName: string; lastName: string; phone: string; details: string };
type CreditCardForm = { name: string; cardNumber: string; expDate: string };
interface ContactInfoAndPaymentCardProps {
	onContactChange: (value: ContactInfoForm) => void;
	onCreditCardChange: (value: CreditCardForm) => void;
}

const ContactInfoAndPaymentCard: React.FC<ContactInfoAndPaymentCardProps> = (props) => {
	const [creditCardObj, setCreditCardObj] = useState<CreditCardForm>();
	const [contactInfoForm, setContactInfoForm] = useState<ContactInfoForm>();

	useEffect(() => {
		console.log('Credit Card', creditCardObj);
		console.log('Contact Form', contactInfoForm);
	}, [creditCardObj, contactInfoForm]);

	function updateCreditCardObj(key: 'fullName' | 'cardNumber' | 'expDate', value: any) {
		setCreditCardObj((prev) => {
			let createCreditCardObj: any = { ...prev };
			createCreditCardObj[key] = value;
			return createCreditCardObj;
		});
	}

	function updateContactInfoForm(key: 'firstName' | 'lastName' | 'phone' | 'data', value: any) {
		setContactInfoForm((prev) => {
			let createCreditCardObj: any = { ...prev };
			createCreditCardObj[key] = value;
			return createCreditCardObj;
		});
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
					onChange={(value) => {
						updateContactInfoForm('firstName', value);
					}}
				/>
				<LabelInput
					title={'Last Name'}
					inputType={'text'}
					onChange={(value) => {
						updateContactInfoForm('lastName', value);
					}}
				/>
				<LabelInput
					title={'Phone'}
					inputType={'tel'}
					maxLength={10}
					isPhoneInput
					iconImage={'icon-phone'}
					onChange={(value) => {
						updateContactInfoForm('phone', value);
					}}
				/>
			</Box>
			<hr />
			<Label variant={'h2'} marginBottom={'10px'}>
				Additional Details and Preferences
			</Label>
			<LabelInput
				title={''}
				inputType={'textarea'}
				onChange={(value) => {
					updateContactInfoForm('data', value);
				}}
			/>
			<hr />
			<Box>
				<Label variant={'h2'} mb={'10px'}>
					Payment Information
				</Label>

				<Box display={'flex'} justifyContent={'space-between'}>
					<LabelInput
						title={'Name on Card'}
						inputType={'text'}
						onChange={(value) => {
							updateCreditCardObj('fullName', value);
						}}
					/>
					<LabelInput
						title={'Card Number'}
						inputType={'text'}
						onChange={(value) => {
							updateCreditCardObj('cardNumber', value);
						}}
					/>

					<LabelInput
						className={'creditCardExpInput'}
						maxLength={4}
						title={'Expiration Date'}
						inputType={'text'}
						onChange={(value) => {
							let newValue = value.slice(0, 2) + '/' + value.slice(2, 4);
							updateCreditCardObj('expDate', newValue);
						}}
						placeholder={'MM/YY'}
					/>
				</Box>
			</Box>
		</Paper>
	);
};

export default ContactInfoAndPaymentCard;
