import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './ContactInfoAndPaymentCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box, Link } from '@bit/redsky.framework.rs.996';
import LabelInput from '../labelInput/LabelInput';
import Paper from '../paper/Paper';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import serviceFactory from '../../services/serviceFactory';
import PaymentService from '../../services/payment/payment.service';
import LabelCheckbox from '../labelCheckbox/LabelCheckbox';
import debounce from 'lodash.debounce';
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import LabelSelect from '../labelSelect/LabelSelect';
import { WebUtils } from '../../utils/utils';
import CountryService from '../../services/country/country.service';

type CreditCardForm = { full_name: string; expDate: string };
interface ContactInfoForm extends Api.Reservation.Guest {
	details?: string;
}

interface ContactInfo extends ContactInfoForm {
	phone: string;
}

type AddressObj = {
	id: number;
	address1: string;
	address2: string;
	city: string;
	country: string;
	isDefault: 1 | 0;
	name: string;
	state: string;
	type: string;
	zip: number;
};

interface ContactInfoAndPaymentCardProps {
	onContactChange: (value: ContactInfo) => void;
	onCreditCardChange: (value: CreditCardForm) => void;
	onExistingCardSelect?: (value: number) => void;
	onAddressChange: (
		value:
			| Omit<Api.UserAddress.Req.Create, 'id' | 'address2' | 'isDefault' | 'name' | 'type'>
			| { addressId: number }
	) => void;
	isValidForm: (isValid: boolean) => void;
	isAuthorized: (isAuthorized: boolean) => void;
	existingCardId?: number;
	contactInfo?: Api.Reservation.Guest;
	usePoints: boolean;
	setUsePoints: (value: boolean) => void;
}

const ContactInfoAndPaymentCard: React.FC<ContactInfoAndPaymentCardProps> = (props) => {
	const numberRef = useRef<HTMLElement>(null);
	const cvvRef = useRef<HTMLElement>(null);
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');
	const countryService = serviceFactory.get<CountryService>('CountryService');
	const [isValidCard, setIsValidCard] = useState<boolean>(false);
	const [isValidCvv, setIsValidCvv] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(false);
	const [existingCardId, setExistingCardId] = useState<number>(props.existingCardId || 0);
	const [stateList, setStateList] = useState<Misc.OptionType[]>([]);
	const [countryList, setCountryList] = useState<Misc.OptionType[]>([]);
	const [showAddressSelect, setShowAddressSelect] = useState<boolean>(false);
	const [existingAddressList, setExistingAddressList] = useState<Misc.OptionType[]>([]);
	const [useExistingCreditCard, setUseExistingCreditCard] = useState<boolean>(
		props.existingCardId ? props.existingCardId > 0 : false
	);
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
			new RsFormControl('firstName', props.contactInfo?.firstName || user?.firstName || '', [
				new RsValidator(RsValidatorEnum.REQ, 'First name is required')
			]),
			new RsFormControl('lastName', props.contactInfo?.lastName || user?.lastName || '', [
				new RsValidator(RsValidatorEnum.REQ, 'Last name is required')
			]),
			new RsFormControl('email', props.contactInfo?.email || user?.primaryEmail || '', [
				new RsValidator(RsValidatorEnum.EMAIL, 'Enter a valid Email')
			]),
			new RsFormControl('phone', props.contactInfo?.phone || user?.phone || '', [
				new RsValidator(RsValidatorEnum.REQ, 'A phone number is required')
			]),
			new RsFormControl('details', '', [
				new RsValidator(RsValidatorEnum.MAX, 'Must be less than 500 characters', 500)
			])
		])
	);

	const [addressForm, setAddressForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('address1', '', [new RsValidator(RsValidatorEnum.REQ, 'Address is required')]),
			new RsFormControl('city', '', [new RsValidator(RsValidatorEnum.REQ, 'City is required')]),
			new RsFormControl('zip', '', [new RsValidator(RsValidatorEnum.REQ, 'Zip is required')]),
			new RsFormControl('state', '', [new RsValidator(RsValidatorEnum.REQ, 'State is required')]),
			new RsFormControl('country', 'US', [new RsValidator(RsValidatorEnum.REQ, 'Country is required')])
		])
	);

	const [existingAddressSelectForm, setExistingAddressSelectForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('addressId', 0, [new RsValidator(RsValidatorEnum.REQ, 'Must Select an existing address')])
		])
	);

	const [existingCreditCardForm, setExistingCreditCardForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('id', existingCardId, [
				new RsValidator(RsValidatorEnum.REQ, 'Must Select an existing address')
			])
		])
	);

	useEffect(() => {
		if (!user) return;
		if (user.address.length > 0) {
			setShowAddressSelect(true);
			let defaultAddress = user.address.find((item) => item.isDefault);
			if (defaultAddress) {
				let updatedPhone = existingAddressSelectForm.getClone('addressId');
				updatedPhone.value = defaultAddress.id;
				existingAddressSelectForm.update(updatedPhone);
				props.onAddressChange(existingAddressSelectForm.toModel());
				setExistingAddressSelectForm(existingAddressSelectForm.clone());
			}
			setExistingAddressList(formatAddressListForSelect(user.address));
		}
	}, [user]);

	useEffect(() => {
		async function getCountries() {
			try {
				let countries = await countryService.getAllCountries();
				setCountryList(formatStateOrCountryListForSelect(countries.countries));
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Unable to get a list of countries.'), 'Server Error');
			}
		}
		getCountries().catch(console.error);
	}, []);

	useEffect(() => {
		async function getStates() {
			let selectedCountry = addressForm.get('country');
			if (!selectedCountry) return;
			try {
				let response = await countryService.getStates(`${selectedCountry.value}`);
				if (response.states) {
					setStateList(formatStateOrCountryListForSelect(response.states));
				}
				let stateValue = addressForm.get('state');
				stateValue.value = '';
				setAddressForm(addressForm.clone().update(stateValue));
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get states for the selected country.'),
					'Server Error'
				);
			}
		}
		getStates().catch(console.error);
	}, [addressForm.get('country').value]);

	useEffect(() => {
		let _isAddressFilledOut = isAddressFilledOut();
		props.isValidForm((isValid && _isAddressFilledOut) || (!!existingCardId && _isAddressFilledOut));
	}, [isValid, existingCardId, showAddressSelect]);

	useEffect(() => {
		if (props.usePoints) return;
		async function init() {
			const gatewayDetails: Api.Payment.Res.PublicData = await paymentService.getGateway();
			window.Spreedly.init(gatewayDetails.publicData.token, {
				numberEl: 'spreedly-number',
				cvvEl: 'spreedly-cvv'
			});
		}
		init().catch(console.error);
	}, [props.usePoints]);

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
						debounceCvvCardError('Number');
					} else if (type === 'input' && inputProperties.validNumber) {
						setIsValidCard(true);
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
						setIsValidCvv(false);
						debounceCvvCardError('Cvv');
					} else if (type === 'input' && inputProperties.validCvv) {
						setIsValidCvv(true);
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

	let debounceCvvCardError = debounce(async (element: 'Number' | 'Cvv') => {
		let htmlBlock: HTMLElement | null = document.querySelector(`#${element}`);
		if (!!htmlBlock) htmlBlock.style.color = 'red';
	}, 1000);
	let debounceCvvCardSuccess = debounce(async (element: 'Number' | 'Cvv') => {
		let htmlBlock: HTMLElement | null = document.querySelector(`#${element}`);
		if (!!htmlBlock) htmlBlock.style.color = '#001933';
	}, 1000);

	function formatStateOrCountryListForSelect(statesOrCountries: any[]) {
		return statesOrCountries.map((item) => {
			return { value: item.isoCode, label: item.name };
		});
	}

	function formatAddressListForSelect(address: AddressObj[]) {
		return address.map((item) => {
			return {
				value: item.id,
				label: `${item.address1} ${item.city}, ${item.state} ${item.zip}, ${item.country}`
			};
		});
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

	async function updateAddressForm(control: RsFormControl) {
		addressForm.update(control);
		let isFormValid = await addressForm.isValid();
		props.onAddressChange(addressForm.toModel());
		let _isFormFilledOut = isFormFilledOut();
		setIsValid(isFormValid && _isFormFilledOut);
		setAddressForm(addressForm.clone());
	}

	async function updateExistingAddressSelectForm(control: RsFormControl) {
		existingAddressSelectForm.update(control);
		let isFormValid = await existingAddressSelectForm.isValid();
		let _isFormFilledOut = isFormFilledOut();
		setIsValid(isFormValid && _isFormFilledOut);
		props.onAddressChange(existingAddressSelectForm.toModel());
		setExistingAddressSelectForm(existingAddressSelectForm.clone());
	}

	async function updateExistingCreditCardForm(control: RsFormControl) {
		if (!Array.isArray(control.value)) {
			if (typeof control.value === 'number') {
				setExistingCardId(control.value);
				if (props.onExistingCardSelect) props.onExistingCardSelect(control.value);
			}
		}
		setExistingCreditCardForm(existingCreditCardForm.clone().update(control));
	}

	function isFormFilledOut(): boolean {
		return (
			!!contactInfoForm.get('firstName').value.toString().length &&
			!!contactInfoForm.get('lastName').value.toString().length &&
			!!contactInfoForm.get('phone').value.toString().length &&
			isAddressFilledOut() &&
			isCreditCardFormFilledOut()
		);
	}

	function isCreditCardFormFilledOut(): boolean {
		if (!!existingCardId) return true;
		return (
			!!creditCardObj.get('full_name').value.toString().length &&
			!!creditCardObj.get('expDate').value.toString().length
		);
	}

	function isAddressFilledOut(): boolean {
		let isAddressValid: boolean;
		if (showAddressSelect) {
			isAddressValid = !!existingAddressSelectForm.get('addressId').value.toString().length;
		} else {
			isAddressValid =
				!!addressForm.get('address1').value.toString().length &&
				!!addressForm.get('city').value.toString().length &&
				!!addressForm.get('state').value.toString().length &&
				!!addressForm.get('zip').value.toString().length &&
				!!addressForm.get('country').value.toString().length;
		}
		return isAddressValid;
	}

	function renderExistingPaymentSelectOptions(): Misc.OptionType[] {
		if (!user) return [];

		return user.paymentMethods.map((item) => {
			return {
				label: `${item.nameOnCard} | Exp: ${item.expirationMonth}/${item.expirationYear} | ${item.cardNumber}`,
				value: item.id
			};
		});
	}

	return (
		<Paper className={'rsContactInfoAndPaymentCard'} borderRadius={'4px'} boxShadow padding={'16px'}>
			<Label variant={'h2'} marginBottom={'10px'}>
				Guest Info
			</Label>
			<Box className={'contactInfo'} display={'grid'}>
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
					title={'Email'}
					inputType={'text'}
					control={contactInfoForm.get('email')}
					updateControl={updateContactInfoForm}
				/>
				<LabelInput
					inputType={'tel'}
					title={'Phone'}
					isPhoneInput
					onChange={(value) => {
						let updatedPhone = contactInfoForm.getClone('phone');
						updatedPhone.value = value;
						updateContactInfoForm(updatedPhone);
					}}
					initialValue={user?.phone}
				/>
			</Box>
			<hr />
			<Label variant={'h2'} marginBottom={'10px'}>
				Billing Address
			</Label>

			{showAddressSelect ? (
				<LabelSelect
					className={'stretchedInput'}
					title={'Select an Existing Address'}
					options={existingAddressList}
					control={existingAddressSelectForm.get('addressId')}
					updateControl={updateExistingAddressSelectForm}
				/>
			) : (
				<Box className={'contactInfo'} display={'grid'}>
					<LabelInput
						className={'stretchedInput'}
						title={'Address'}
						inputType={'text'}
						control={addressForm.get('address1')}
						updateControl={updateAddressForm}
					/>
					<LabelInput
						title={'City'}
						inputType={'text'}
						control={addressForm.get('city')}
						updateControl={updateAddressForm}
					/>
					<LabelSelect
						title={'State'}
						options={stateList}
						control={addressForm.get('state')}
						updateControl={updateAddressForm}
					/>
					<LabelInput
						title={'Zip'}
						inputType={'text'}
						control={addressForm.get('zip')}
						updateControl={updateAddressForm}
					/>
					<LabelSelect
						title={'Country'}
						options={countryList}
						control={addressForm.get('country')}
						updateControl={updateAddressForm}
					/>
				</Box>
			)}
			{!!user?.address.length && (
				<Label className={'useDifferentAddressText'} variant={'caption'} mt={15}>
					{showAddressSelect ? 'Want to use a different address?' : 'Use an existing address'}{' '}
					<span
						onClick={() => {
							setShowAddressSelect(!showAddressSelect);
						}}
					>
						Click here
					</span>
				</Label>
			)}
			<hr />
			<Label variant={'h2'} marginBottom={'10px'}>
				Additional Details and Preferences
			</Label>
			<LabelInput
				title={''}
				inputType={'textarea'}
				control={contactInfoForm.get('details')}
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
						onSelect={() => {
							setUseExistingCreditCard(true);
							props.setUsePoints(false);
						}}
						onDeselect={() => {
							setExistingCardId(0);
							setUseExistingCreditCard(false);
							if (props.onExistingCardSelect) props.onExistingCardSelect(0);
						}}
						isChecked={useExistingCreditCard}
					/>
					{!!company.allowPointBooking && (
						<LabelCheckbox
							value={props.usePoints ? 1 : 0}
							text={'Use Points'}
							onSelect={() => {
								props.setUsePoints(true);
								setUseExistingCreditCard(false);
								if (props.onExistingCardSelect) props.onExistingCardSelect(0);
							}}
							onDeselect={() => props.setUsePoints(false)}
							isChecked={props.usePoints}
						/>
					)}
				</Box>
				{company.allowCashBooking && !props.usePoints && (
					<>
						<LabelSelect
							className={!useExistingCreditCard ? 'hide' : ''}
							title={'Select an existing Card'}
							control={existingCreditCardForm.get('id')}
							options={renderExistingPaymentSelectOptions()}
							updateControl={updateExistingCreditCardForm}
						/>
						<Box className={'creditCardInfo'} display={useExistingCreditCard ? 'none' : 'grid'}>
							<LabelInput
								title={'Name on Card'}
								inputType={'text'}
								control={creditCardObj.get('full_name')}
								updateControl={updateCreditCardObj}
							/>
							<div ref={numberRef} id={'spreedly-number'}>
								<Label id={'Number'} variant={'caption'} mb={10}>
									Credit Card
								</Label>
							</div>
							<div ref={cvvRef} id={'spreedly-cvv'}>
								<Label id={'Cvv'} variant={'caption'} mb={10}>
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
									purchases. You also acknowledge and agree that Fidel may share certain details of
									your qualifying transactions with Spire Loyalty in accordance with the{' '}
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
									</Link>{' '}
									You may opt-out of this optional service at any time by removing this card from your
									Spire Loyalty account.
								</>
							}
							lineClamp={10}
							isChecked={false}
							onSelect={() => {
								props.isAuthorized(true);
							}}
							onDeselect={() => {
								props.isAuthorized(false);
							}}
						/>
					</>
				)}
			</form>
		</Paper>
	);
};

export default ContactInfoAndPaymentCard;
