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
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../../utils/utils';
import { OptionType } from '@bit/redsky.framework.rs.select';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

let isDefault: 1 | 0 = 0;

const AccountAddressPage: React.FC = () => {
	const size = useWindowResizeChange();
	const userAddressService = serviceFactory.get<UserAddressService>('UserAddressService');
	const countryService = serviceFactory.get<CountryService>('CountryService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [addressList, setAddressList] = useState<Api.User.Address[]>([]);
	const [isValidForm, setIsValidForm] = useState<boolean>(false);
	const [stateList, setStateList] = useState<OptionType[]>([]);
	const [countryList, setCountryList] = useState<OptionType[]>([]);
	const [newAddressObj, setNewAddressObj] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('full_name', '', [new RsValidator(RsValidatorEnum.REQ, 'Full name is required')]),
			new RsFormControl('address1', '', [new RsValidator(RsValidatorEnum.REQ, 'Address is required')]),
			new RsFormControl('address2', '', []),
			new RsFormControl('city', '', [new RsValidator(RsValidatorEnum.REQ, 'City is required')]),
			new RsFormControl('zip', '', [new RsValidator(RsValidatorEnum.REQ, 'Zip is required')]),
			new RsFormControl('state', '', []),
			new RsFormControl('country', 'US', [new RsValidator(RsValidatorEnum.REQ, 'Country is required')])
		])
	);

	useEffect(() => {
		if (!user) return;
		setAddressList(user.address);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		async function getCountries() {
			try {
				let countries = await countryService.getAllCountries();
				setCountryList(formatStateOrCountryListForSelect(countries.countries));
			} catch (e) {
				console.error('getCountries', e);
				throw rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get a list of countries.'),
					'Server Error'
				);
			}
		}
		getCountries().catch(console.error);
	}, []);

	useEffect(() => {
		async function getStates() {
			try {
				let response = await countryService.getStates(`${newAddressObj.get('country').value}` || 'US');
				if (response.states) {
					let newStates = formatStateOrCountryListForSelect(response.states);
					setStateList(newStates);
				}
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get states for the selected country.'),
					'Server Error'
				);
			}
		}
		getStates().catch(console.error);
	}, [countryList, newAddressObj.get('country').value]);

	function renderPrimaryAddress() {
		if (!addressList || !ObjectUtils.isArrayWithData(addressList)) return;
		const address = addressList.find((item) => item.isDefault);
		if (!address) return;
		return (
			<AccountAddressTile
				key={address.id}
				id={address.id}
				name={address.name}
				addressLine1={address.address1}
				addressLine2={address.address2}
				zipCode={address.zip}
				city={address.city}
				state={address.state}
				country={address.country}
				isPrimary={address.isDefault}
				onDelete={() => {
					deleteAddress(address.id);
				}}
				onPrimaryChange={(addressId) => {
					updateAddressToDefault(addressId);
				}}
			/>
		);
	}

	function renderAddresses() {
		if (!addressList || !ObjectUtils.isArrayWithData(addressList)) return;
		return addressList
			.filter((item) => !item.isDefault)
			.map((item) => {
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

	function formatStateOrCountryListForSelect(statesOrCountries: Misc.IBaseCountry[]) {
		return statesOrCountries.map((item: Misc.IBaseCountry) => {
			return { value: item.isoCode, label: item.name };
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
			!!newAddressObj.get('country').value.toString().length
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
		addressObj['isDefault'] = isDefault;

		try {
			let response = await userAddressService.create(addressObj);
			let newAddressList: Api.User.Address[] = [...addressList, convertObj(response)];
			if (response.isDefault) {
				newAddressList = newAddressList.map((item) => {
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
				<Box
					maxWidth={'920px'}
					margin={'60px auto 120px'}
					display={'flex'}
					justifyContent={'space-evenly'}
					flexDirection={size === 'small' ? 'column' : 'row'}
				>
					<Box className={'addressList'}>
						<Label variant={'h2'}>Addresses</Label>
						{renderPrimaryAddress()}
						{size !== 'small' && renderAddresses()}
					</Box>
					<Box className={'newAddress'}>
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
						<Box display={'flex'} justifyContent={'space-between'} gap={20}>
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
						<Box display={'flex'} justifyContent={'space-between'} gap={20}>
							<LabelSelect
								title={'State'}
								updateControl={updateNewAddressObj}
								options={stateList}
								control={newAddressObj.get('state')}
							/>
							<LabelSelect
								title={'Country'}
								updateControl={updateNewAddressObj}
								options={countryList}
								control={newAddressObj.get('country')}
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
					{size === 'small' && renderAddresses()}
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default AccountAddressPage;
