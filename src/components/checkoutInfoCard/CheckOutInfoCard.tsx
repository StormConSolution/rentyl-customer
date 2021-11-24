import * as React from 'react';
import { useEffect, useState } from 'react';
import './CheckOutInfoCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import LabelInput from '../labelInput/LabelInput';
import LabelSelect from '../labelSelect/LabelSelect';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../../utils/utils';
import serviceFactory from '../../services/serviceFactory';
import CountryService from '../../services/country/country.service';
import Button from '@bit/redsky.framework.rs.button';
import LabelButton from '../labelButton/LabelButton';

export interface CheckOutInfoCardProps {}
const CheckOutInfoCard: React.FC<CheckOutInfoCardProps> = (props) => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const countryService = serviceFactory.get<CountryService>('CountryService');
	const [stateList, setStateList] = useState<Misc.OptionType[]>([]);
	const [countryList, setCountryList] = useState<Misc.OptionType[]>([]);
	const [infoForm, setInfoForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('firstName', user?.firstName || '', [
				new RsValidator(RsValidatorEnum.REQ, 'First name is required')
			]),
			new RsFormControl('lastName', user?.lastName || '', [
				new RsValidator(RsValidatorEnum.REQ, 'Last name is required')
			]),
			new RsFormControl('email', user?.primaryEmail || '', [
				new RsValidator(RsValidatorEnum.EMAIL, 'Enter a valid Email')
			]),
			new RsFormControl('phone', user?.phone || '', [
				new RsValidator(RsValidatorEnum.REQ, 'A phone number is required')
			]),
			new RsFormControl('address1', '', [new RsValidator(RsValidatorEnum.REQ, 'Address is required')]),
			new RsFormControl('address2', '', []),
			new RsFormControl('city', '', [new RsValidator(RsValidatorEnum.REQ, 'City is required')]),
			new RsFormControl('zip', '', [new RsValidator(RsValidatorEnum.REQ, 'Zip is required')]),
			new RsFormControl('state', '', [new RsValidator(RsValidatorEnum.REQ, 'State is required')]),
			new RsFormControl('country', 'US', [new RsValidator(RsValidatorEnum.REQ, 'Country is required')])
		])
	);

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
			let selectedCountry = infoForm.get('country');
			if (!selectedCountry) return;
			try {
				let response = await countryService.getStates(`${selectedCountry.value}`);
				if (response.states) {
					setStateList(formatStateOrCountryListForSelect(response.states));
				}
				let stateValue = infoForm.get('state');
				stateValue.value = '';
				setInfoForm(infoForm.clone().update(stateValue));
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get states for the selected country.'),
					'Server Error'
				);
			}
		}
		getStates().catch(console.error);
	}, [infoForm.get('country').value]);

	function formatStateOrCountryListForSelect(statesOrCountries: any[]) {
		return statesOrCountries.map((item) => {
			return { value: item.isoCode, label: item.name };
		});
	}

	function updateForm(control: RsFormControl) {
		setInfoForm(infoForm.clone().update(control));
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
			<form>
				<LabelInput
					title={'First Name'}
					inputType={'text'}
					control={infoForm.get('firstName')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Last Name'}
					inputType={'text'}
					control={infoForm.get('lastName')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Email'}
					inputType={'text'}
					control={infoForm.get('email')}
					updateControl={updateForm}
				/>
				<LabelInput
					inputType={'tel'}
					title={'Phone'}
					isPhoneInput
					onChange={(value) => {
						let updatedPhone = infoForm.getClone('phone');
						updatedPhone.value = value;
						updateForm(updatedPhone);
					}}
					initialValue={user?.phone}
				/>
				<LabelInput
					className={'stretchedInput'}
					title={'Address Line 1'}
					inputType={'text'}
					control={infoForm.get('address1')}
					updateControl={updateForm}
				/>
				<LabelInput
					className={'stretchedInput'}
					title={'Address Line 2'}
					inputType={'text'}
					control={infoForm.get('address2')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'City'}
					inputType={'text'}
					control={infoForm.get('city')}
					updateControl={updateForm}
				/>
				<LabelSelect
					title={'State'}
					options={stateList}
					control={infoForm.get('state')}
					updateControl={updateForm}
				/>
				<LabelInput title={'Zip'} inputType={'text'} control={infoForm.get('zip')} updateControl={updateForm} />
				<LabelSelect
					title={'Country'}
					options={countryList}
					control={infoForm.get('country')}
					updateControl={updateForm}
				/>
				<LabelButton look={'containedPrimary'} variant={'body1'} label={'Continue'} onClick={() => {}} />
			</form>
		</Box>
	);
};

export default CheckOutInfoCard;
