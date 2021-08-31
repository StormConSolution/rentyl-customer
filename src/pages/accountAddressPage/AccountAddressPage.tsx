import * as React from 'react';
import './AccountAddressPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import { useEffect, useState } from 'react';
import AccountHeader from '../../components/accountHeader/AccountHeader';
import LoadingPage from '../loadingPage/LoadingPage';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import AccountAddressTile from '../../components/accountAddressTile/AccountAddressTile';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelSelect from '../../components/labelSelect/LabelSelect';
import LabelButton from '../../components/labelButton/LabelButton';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import CountryService from '../../services/country/country.service';
import UserAddressService from '../../services/userAddress/userAddress.service';
import { useRecoilState } from 'recoil';
import globalState from '../../models/globalState';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../../utils/utils';

let country = 'US';
let state = '';
let isDefault: 1 | 0 = 0;

const AccountAddressPage: React.FC = () => {
	const userAddressService = serviceFactory.get<UserAddressService>('UserAddressService');
	const countryService = serviceFactory.get<CountryService>('CountryService');
	const [user, setUser] = useRecoilState<Api.User.Res.Detail | undefined>(globalState.user);
	const [addressList, setAddressList] = useState<Api.User.Address[]>([]);
	const [isValidForm, setIsValidForm] = useState<boolean>(false);
	// const [addressObj, setAddressObj] = useState<Api.User.Address>();
	const [countryList, setCountryList] = useState<
		{ value: number | string; text: number | string; selected: boolean }[]
	>([]);
	const [stateList, setStateList] = useState<{ value: number | string; text: number | string; selected: boolean }[]>(
		[]
	);
	const [newAddressObj, setNewAddressObj] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('full_name', '', [new RsValidator(RsValidatorEnum.REQ, 'Full name is required')]),
			new RsFormControl('address1', '', [new RsValidator(RsValidatorEnum.REQ, 'Address is required')]),
			new RsFormControl('address2', '', []),
			new RsFormControl('city', '', [new RsValidator(RsValidatorEnum.REQ, 'City is required')]),
			new RsFormControl('zip', '', [new RsValidator(RsValidatorEnum.REQ, 'Zip is required')])
		])
	);

	useEffect(() => {
		if (!user) return;
		setAddressList(user.address);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log(newAddressObj.toModel());
		console.log('isValidForm', isValidForm);
	}, [newAddressObj]);

	useEffect(() => {
		async function getCountries() {
			try {
				let countries = await countryService.getAllCountries();
				setCountryList(formatStateOrCountryListForSelect(countries.data.data.countries));
			} catch (e) {
				console.error('getCountries', e);
				throw rsToastify.error(WebUtils.getRsErrorMessage(e, 'Country list is unavailable'), 'Server Error');
			}
		}
		getCountries().catch(console.error);
	}, []);

	useEffect(() => {
		async function getStates() {
			let selectedCountry = countryList.find((item) => item.selected);
			if (!selectedCountry) return;
			try {
				let response = await countryService.getStates(`${selectedCountry.value}`);
				if (response.data.data.states) {
					let newStates = formatStateOrCountryListForSelect(response.data.data.states);
					setStateList(newStates);
				}
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get states for given country'),
					'Server Error'
				);
			}
		}
		getStates().catch(console.error);
	}, [countryList]);

	function renderAddresses() {
		if (!addressList || !ObjectUtils.isArrayWithData(addressList)) return;
		return addressList.map((item) => {
			return (
				<AccountAddressTile
					key={item.id}
					id={item.id}
					name={item.name}
					addressLine1={item.address1}
					addressLine2={item.address2}
					zipCode={item.zip}
					city={item.city}
					state={item.state}
					country={item.country}
					isPrimary={item.isDefault}
					onDelete={() => {
						deleteAddress(item.id);
					}}
					onPrimaryChange={(addressId) => {
						updateAddressToDefault(addressId);
					}}
				/>
			);
		});
	}

	function formatStateOrCountryListForSelect(statesOrCountries: any[]) {
		return statesOrCountries.map((item) => {
			return { value: item.isoCode, text: item.name, selected: item.isoCode === 'US' };
		});
	}

	async function updateAddressToDefault(addressId: number) {
		let data = { id: addressId, isDefault: 1 };
		try {
			let response = await userAddressService.update(data);
			if (response) rsToastify.success('Address successfully updated.', 'Update Successful');

			let addresses = [...addressList];
			addresses = addresses.map((item) => {
				return { ...item, isDefault: item.id === addressId ? 1 : 0 };
			});
			setAddressList(addresses);
		} catch (e) {
			rsToastify.error(WebUtils.getRsErrorMessage(e, 'Address update failed, try again.'), 'Server Error');
		}
	}

	function isFormFilledOut(): boolean {
		return (
			!!newAddressObj.get('full_name').value.toString().length &&
			!!newAddressObj.get('address1').value.toString().length &&
			!!newAddressObj.get('city').value.toString().length &&
			!!newAddressObj.get('zip').value.toString().length &&
			!!state.length
		);
	}

	async function updateNewAddressObj(control: RsFormControl) {
		if (control.key === 'zip') control.value = +control.value;
		newAddressObj.update(control);
		setIsValidForm(isFormFilledOut());
		setNewAddressObj(newAddressObj.clone());
	}

	function convertObj(obj: Api.UserAddress.Res.Create): Api.User.Address {
		return {
			address1: obj.address1,
			address2: obj.address2,
			city: obj.city,
			country: obj.country,
			id: obj.id,
			isDefault: obj.isDefault,
			name: obj.name,
			state: obj.state,
			type: obj.type,
			zip: +obj.zip
		};
	}

	async function save() {
		if (!user) return;
		let addressObj: Api.UserAddress.Req.Create = newAddressObj.toModel();
		addressObj['userId'] = user.id;
		addressObj['type'] = 'BOTH';
		addressObj['state'] = state;
		addressObj['isDefault'] = isDefault;
		addressObj['country'] = country;

		try {
			let response = await userAddressService.create(addressObj);
			let newAddressList: Api.User.Address[] = [...addressList, convertObj(response)];
			if (response.isDefault) {
				newAddressList = newAddressList.map((item, index) => {
					return { ...item, isDefault: response.id === item.id ? 1 : 0 };
				});
			}
			newAddressObj.resetToInitialValue();
			setAddressList(newAddressList);
		} catch (e) {
			rsToastify.error(WebUtils.getRsErrorMessage(e, 'Unable to save address, try again'), 'Server Error');
		}
	}

	async function deleteAddress(id: number) {
		if (!addressList) return;
		try {
			let response = await userAddressService.delete(id);
			let newAddressList = addressList.filter((item) => item.id !== id);
			setAddressList(newAddressList);
			if (response) rsToastify.success('Address successfully removed.', 'Delete Successful');
		} catch (e) {}
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountAddressPage'}>
			<div className={'rs-page-content-wrapper'}>
				<AccountHeader selected={'ADDRESSES'} />
				<Box maxWidth={'920px'} margin={'60px auto 120px'} display={'flex'} justifyContent={'space-evenly'}>
					<Box width={'420px'}>
						<Label variant={'h2'}>Addresses</Label>
						{renderAddresses()}
					</Box>
					<Box width={'420px'}>
						<Label variant={'h2'}>Add new address</Label>
						<LabelInput
							className={'inputStretched'}
							title={'Full Name'}
							inputType={'text'}
							control={newAddressObj.get('full_name')}
							updateControl={updateNewAddressObj}
						/>
						<LabelInput
							className={'inputStretched'}
							title={'Address Line 1'}
							inputType={'text'}
							control={newAddressObj.get('address1')}
							updateControl={updateNewAddressObj}
						/>
						<LabelInput
							className={'inputStretched'}
							title={'Address Line 2'}
							inputType={'text'}
							control={newAddressObj.get('address2')}
							updateControl={updateNewAddressObj}
						/>
						<Box display={'flex'} justifyContent={'space-between'}>
							<LabelInput
								title={'City'}
								inputType={'text'}
								control={newAddressObj.get('city')}
								updateControl={updateNewAddressObj}
							/>
							<LabelInput
								title={'Zip Code'}
								inputType={'number'}
								control={newAddressObj.get('zip')}
								updateControl={updateNewAddressObj}
							/>
						</Box>
						<Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-end'}>
							<LabelSelect
								title={'State'}
								onChange={(value) => {
									let newStateList = [...stateList];
									newStateList = newStateList.map((item) => {
										return { value: item.value, text: item.text, selected: item.value === value };
									});
									setStateList(newStateList);
									state = value || '';
									setIsValidForm(isFormFilledOut());
								}}
								selectOptions={stateList}
							/>
							<LabelSelect
								title={'Country'}
								onChange={(value) => {
									let newCountryList = [...countryList];
									newCountryList = newCountryList.map((item) => {
										return { value: item.value, text: item.text, selected: item.value === value };
									});
									setCountryList(newCountryList);
									country = value || '';
									setIsValidForm(isFormFilledOut());
								}}
								selectOptions={countryList}
							/>
						</Box>
						<LabelCheckbox
							value={'isDefault'}
							text={'Set as primary'}
							isChecked={false}
							onSelect={() => {
								isDefault = 1;
							}}
							onDeselect={() => {
								isDefault = 0;
							}}
						/>
						<LabelButton
							look={isValidForm ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Add New Address'}
							disabled={!isValidForm}
							onClick={() => {
								save();
							}}
						/>
					</Box>
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default AccountAddressPage;
