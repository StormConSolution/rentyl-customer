import * as React from 'react';
import { FormEvent, useEffect, useState } from 'react';
import './CheckOutInfoCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import LabelInput from '../labelInput/LabelInput';
import LabelSelect from '../labelSelect/LabelSelect';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../../utils/utils';
import serviceFactory from '../../services/serviceFactory';
import CountryService from '../../services/country/country.service';
import LabelButton from '../labelButton/LabelButton';
import LabelCheckboxFilterBar from '../labelCheckbox/LabelCheckboxFilterBar';
import UserService from '../../services/user/user.service';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

export interface CheckOutInfoCardProps {
	checkoutUserState: [Misc.Checkout, React.Dispatch<React.SetStateAction<Misc.Checkout>>];
	onContinue: VoidFunction;
}

const CheckOutInfoCard: React.FC<CheckOutInfoCardProps> = (props) => {
	const size = useWindowResizeChange();
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [checkoutUser, setCheckoutUser] = props.checkoutUserState;
	const countryService = serviceFactory.get<CountryService>('CountryService');
	const userService = serviceFactory.get<UserService>('UserService');
	const [signUp, setSignUp] = useState<boolean>(checkoutUser.shouldCreateUser);
	const [stateList, setStateList] = useState<Misc.OptionType[]>([]);
	const [countryList, setCountryList] = useState<OptionType[]>([]);
	const [selectedCountry, setSelectedCountry] = useState<string>();
	const [infoForm, setInfoForm] = useState<RsFormGroup>(getInfoForm);
	const [phoneError, setPhoneError] = useState<boolean>(false);

	function getInfoForm() {
		return new RsFormGroup([
			new RsFormControl('firstName', checkoutUser.personal.firstName, [
				new RsValidator(RsValidatorEnum.REQ, 'First name is required')
			]),
			new RsFormControl('lastName', checkoutUser.personal.lastName, [
				new RsValidator(RsValidatorEnum.REQ, 'Last name is required')
			]),
			new RsFormControl('email', checkoutUser.personal.email, [
				new RsValidator(RsValidatorEnum.EMAIL, 'Enter a valid Email')
			]),
			new RsFormControl('phone', checkoutUser.personal.phone, [
				new RsValidator(RsValidatorEnum.REQ, 'Enter a valid phone number'),
				new RsValidator(RsValidatorEnum.MIN, 'Enter a valid phone number', 4)
			]),
			new RsFormControl('address1', checkoutUser.personal.address1, [
				new RsValidator(RsValidatorEnum.REQ, 'Address is required')
			]),
			new RsFormControl('address2', checkoutUser.personal.address2 || '', []),
			new RsFormControl('city', checkoutUser.personal.city, [
				new RsValidator(RsValidatorEnum.REQ, 'City is required')
			]),
			new RsFormControl('zip', checkoutUser.personal.zip, [
				new RsValidator(RsValidatorEnum.REQ, 'Zip is required'),
				new RsValidator(RsValidatorEnum.NUM, 'Zip must be a number')
			]),
			new RsFormControl('state', checkoutUser.personal.state, [
				new RsValidator(RsValidatorEnum.REQ, 'State is required')
			]),
			new RsFormControl('country', checkoutUser.personal.country, [
				new RsValidator(RsValidatorEnum.REQ, 'Country is required')
			])
		]);
	}

	useEffect(() => {
		setInfoForm(getInfoForm());
	}, [checkoutUser]);

	useEffect(() => {
		async function getCountries() {
			try {
				const countries = await countryService.getAllCountries();
				setCountryList(formatStateOrCountryListForSelect(countries.countries));
			} catch (e) {
				console.error('getCountries', e);
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Unable to get a list of countries.'), 'Server Error');
			}
		}

		getCountries().catch(console.error);
	}, []);

	useEffect(() => {
		async function getStates() {
			try {
				const states = await countryService.getStates(infoForm.get('country').value.toString());
				setStateList(formatStateOrCountryListForSelect(states.states));
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get states for the selected country.'),
					'Server Error'
				);
			}
		}

		getStates().catch(console.error);
	}, [selectedCountry]);

	function formatStateOrCountryListForSelect(statesOrCountries: any[]) {
		return statesOrCountries.map((item) => {
			return { value: item.isoCode, label: item.name };
		});
	}

	function updateForm(control: RsFormControl) {
		if (control.key === 'country') setSelectedCountry(control.value.toString());
		setInfoForm(infoForm.clone().update(control));
	}

	function buildCheckoutUser(): Misc.Checkout {
		return {
			...checkoutUser,
			personal: {
				firstName: infoForm.get('firstName').value.toString(),
				lastName: infoForm.get('lastName').value.toString(),
				address1: infoForm.get('address1').value.toString(),
				address2: infoForm.get('address2').value.toString(),
				zip: infoForm.get('zip').value.toString(),
				city: infoForm.get('city').value.toString(),
				state: infoForm.get('state').value.toString(),
				country: infoForm.get('country').value.toString(),
				email: infoForm.get('email').value.toString(),
				phone: infoForm.get('phone').value.toString()
			},
			shouldCreateUser: signUp
		};
	}

	async function submitInfo(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			if (!(await infoForm.isValid())) {
				if (infoForm.get('phone').errors.length > 0) setPhoneError(true);
				setInfoForm(infoForm.clone());
				rsToastify.error('Please ensure you have filled out all fields', 'Missing or Incorrect Information');
				return;
			}

			const newCheckoutUser = buildCheckoutUser();
			setCheckoutUser(newCheckoutUser);
			await userService.setCheckoutUserInLocalStorage(newCheckoutUser);
			props.onContinue();
		} catch (e) {
			rsToastify.error('Payment information is invalid', 'Missing or Incorrect Information');
		}
	}

	return (
		<Box className={'rsCheckOutInfoCard'}>
			<Box className={'message'}>
				<Label variant={'h3'}>Reserve & Relax</Label>
				<p>
					When you book directly with Rentyl Resorts, you can relax knowing you are not only getting the best
					rate but you also are getting the flexibility you want.
				</p>
			</Box>
			<form onSubmit={submitInfo}>
				<Box className={'fieldGroup'}>
					<LabelInput
						labelVariant={'h5'}
						title={'First Name'}
						inputType={'text'}
						control={infoForm.get('firstName')}
						updateControl={updateForm}
					/>
					<LabelInput
						labelVariant={'h5'}
						title={'Last Name'}
						inputType={'text'}
						control={infoForm.get('lastName')}
						updateControl={updateForm}
					/>
				</Box>
				<Box className={'fieldGroup stretchedInput'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Address Line 1'}
						inputType={'text'}
						control={infoForm.get('address1')}
						updateControl={updateForm}
					/>
				</Box>
				<Box className={'fieldGroup stretchedInput'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Address Line 2'}
						inputType={'text'}
						control={infoForm.get('address2')}
						updateControl={updateForm}
					/>
				</Box>
				<Box className={'fieldGroup'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Postal/Zip code'}
						inputType={'number'}
						control={infoForm.get('zip')}
						updateControl={updateForm}
					/>
					<LabelInput
						labelVariant={'h5'}
						title={'City'}
						inputType={'text'}
						control={infoForm.get('city')}
						updateControl={updateForm}
					/>
				</Box>
				<Box className={'fieldGroup'}>
					<LabelSelect
						title={'State'}
						options={stateList}
						control={infoForm.get('state')}
						updateControl={updateForm}
					/>
					<LabelSelect
						title={'Country'}
						options={countryList}
						control={infoForm.get('country')}
						updateControl={updateForm}
					/>
				</Box>
				<Box className={'fieldGroup'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Email'}
						inputType={'text'}
						control={infoForm.get('email')}
						updateControl={updateForm}
					/>
					<LabelInput
						className={`phoneInput ${phoneError ? 'phoneError' : ''}`}
						labelVariant={size === 'small' ? 'customSixteen' : 'body5'}
						inputType={'tel'}
						title={'Phone'}
						isPhoneInput
						onChange={(value) => {
							let updatedPhone = infoForm.get('phone');
							updatedPhone.value = value;
							setInfoForm(infoForm.clone().update(updatedPhone));
							setPhoneError(false);
						}}
						initialValue={infoForm.get('phone').value.toString()}
					/>
				</Box>
				{!user && (
					<Box className={'fieldGroup stretchedInput'}>
						<LabelCheckboxFilterBar
							value={''}
							isChecked={signUp}
							text={
								'Sign me up for Spire Loyalty by Rentyl Rewards. I confirm I am at least 18 years old or older and I agree to the terms and conditions.'
							}
							onSelect={() => setSignUp(true)}
							onDeselect={() => setSignUp(false)}
							lineClamp={10}
						/>
					</Box>
				)}
				<Box className={'fieldGroup stretchedInput rightSide'}>
					<LabelButton look={'containedPrimary'} variant={'body1'} label={'Continue'} buttonType={'submit'} />
				</Box>
			</form>
		</Box>
	);
};

export default CheckOutInfoCard;
