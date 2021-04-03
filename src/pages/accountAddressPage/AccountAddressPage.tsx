import * as React from 'react';
import './AccountAddressPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { useEffect, useState } from 'react';
import AccountHeader from '../../components/accountHeader/AccountHeader';
import useLoginState, { LoginStatus } from '../../customHooks/useLoginState';
import LoadingPage from '../loadingPage/LoadingPage';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import AccountAddressTile from '../../components/accountAddressTile/AccountAddressTile';
import LabelInput from '../../components/labelInput/LabelInput';
import rsToasts from '@bit/redsky.framework.toast';
import LabelSelect from '../../components/labelSelect/LabelSelect';
import LabelButton from '../../components/labelButton/LabelButton';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import CountryService from '../../services/country/country.service';
import UserAddressService from '../../services/userAddress/userAddress.service';

interface AccountAddressPageProps {}

const AccountAddressPage: React.FC<AccountAddressPageProps> = (props) => {
	const loginStatus = useLoginState();
	const userService = serviceFactory.get<UserService>('UserService');
	const userAddressService = serviceFactory.get<UserAddressService>('UserAddressService');
	const countryService = serviceFactory.get<CountryService>('CountryService');
	const [user, setUser] = useState<Api.User.Res.Get>();
	const [addressList, setAddressList] = useState<Api.User.Address[]>([]);
	const [formChanged, setFormChanged] = useState<boolean>(false);
	const [addressObj, setAddressObj] = useState<Api.User.Address>();
	const [countryList, setCountryList] = useState<
		{ value: number | string; text: number | string; selected: boolean }[]
	>([]);
	const [stateList, setStateList] = useState<{ value: number | string; text: number | string; selected: boolean }[]>(
		[]
	);
	const [reloadPage, setReloadPage] = useState<number>(0);

	useEffect(() => {
		if (loginStatus === LoginStatus.LOGGED_IN) {
			let userObj = userService.getCurrentUser();
			if (!userObj) return;
			setAddressList(userObj.address);
			setUser(userObj);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loginStatus]);

	useEffect(() => {
		async function getCountries() {
			try {
				let countries = await countryService.getAllCountries();
				setCountryList(formatStateOrCountryListForSelect(countries.data.data.countries));
				updateAddressObj('country', 'US');
			} catch (e) {
				console.error('getCountries', e);
				throw rsToasts.error('An unexpected error occurred on the server.');
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
				rsToasts.error(e.message);
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
					onPrimaryChange={(addressId) => {}}
				/>
			);
		});
	}

	function formatStateOrCountryListForSelect(statesOrCountries: any[]) {
		return statesOrCountries.map((item) => {
			return { value: item.isoCode, text: item.name, selected: item.isoCode === 'US' };
		});
	}

	function updateAddressObj(
		key: 'address1' | 'address2' | 'name' | 'city' | 'state' | 'zip' | 'country' | 'isDefault',
		value: any
	) {
		setAddressObj((prev) => {
			let createAddressObj: any = { ...prev };
			createAddressObj[key] = value;
			return createAddressObj;
		});
	}

	function validateObject(obj: any) {
		let newObj: any = { ...obj };
		let key = ['name', 'address1', 'address2', 'zip', 'city', 'state', 'country', 'isDefault'];
		for (let value of key) {
			if (Object.keys(newObj).includes(value)) {
				if (newObj[value] === '') {
					throw new Error('You are missing ' + value);
				}
			} else {
				if (value === 'address2') {
					newObj[value] = '';
				} else if (value === 'isDefault') {
					newObj[value] = 0;
				} else {
					throw new Error('You are missing ' + value);
				}
			}
		}
		return newObj;
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
		let newAddressObj: any = { ...addressObj };
		try {
			newAddressObj = validateObject(newAddressObj);
			newAddressObj['userId'] = user.id;
			newAddressObj['type'] = 'BOTH';
		} catch (e) {
			rsToasts.error(e.message);
			return;
		}
		try {
			let response = await userAddressService.create(newAddressObj);
			if (response.data.data) console.log(response.data.data);
			let newAddressList: Api.User.Address[] = [...addressList, convertObj(response.data.data)];
			setAddressList(newAddressList);
		} catch (e) {
			rsToasts.error(e.message);
		}
	}

	async function deleteAddress(id: number) {
		if (!addressList) return;
		try {
			let response = await userAddressService.delete(id);
			let newAddressList = addressList.filter((item) => item.id !== id);
			setAddressList(newAddressList);
			if (response.data.data) rsToasts.success('Delete Successful');
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
						<Label variant={'h2'}>Primary Address</Label>
						{renderAddresses()}
					</Box>
					<Box width={'420px'}>
						<Label variant={'h2'}>Add new address</Label>
						<LabelInput
							className={'inputStretched'}
							title={'Full Name'}
							inputType={'text'}
							onChange={(value) => {
								setFormChanged(true);
								updateAddressObj('name', value);
							}}
						/>
						<LabelInput
							className={'inputStretched'}
							title={'Address Line 1'}
							inputType={'text'}
							onChange={(value) => {
								setFormChanged(true);
								updateAddressObj('address1', value);
							}}
						/>
						<LabelInput
							className={'inputStretched'}
							title={'Address Line 2'}
							inputType={'text'}
							onChange={(value) => {
								setFormChanged(true);
								updateAddressObj('address2', value);
							}}
						/>
						<Box display={'flex'} justifyContent={'space-between'}>
							<LabelInput
								title={'City'}
								inputType={'text'}
								onChange={(value) => {
									setFormChanged(true);
									updateAddressObj('city', value);
								}}
							/>
							<LabelInput
								title={'Zip Code'}
								inputType={'number'}
								onChange={(value) => {
									setFormChanged(true);
									updateAddressObj('zip', +value);
								}}
							/>
						</Box>
						<Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-end'}>
							<LabelSelect
								title={'State'}
								onChange={(value) => {
									setFormChanged(true);
									let newStateList = [...stateList];
									newStateList = newStateList.map((item) => {
										return { value: item.value, text: item.text, selected: item.value === value };
									});
									setStateList(newStateList);
									updateAddressObj('state', value);
								}}
								selectOptions={stateList}
							/>
							<LabelSelect
								title={'Country'}
								onChange={(value) => {
									setFormChanged(true);
									let newCountryList = [...countryList];
									newCountryList = newCountryList.map((item) => {
										return { value: item.value, text: item.text, selected: item.value === value };
									});
									setCountryList(newCountryList);
									updateAddressObj('country', value);
								}}
								selectOptions={countryList}
							/>
						</Box>
						<LabelCheckbox
							value={'isDefault'}
							text={'Set as primary'}
							selected={false}
							onSelect={(value, text) => {
								setFormChanged(true);
								updateAddressObj('isDefault', 1);
							}}
							onDeselect={(value, text) => {
								updateAddressObj('isDefault', 0);
							}}
						/>
						<LabelButton
							look={formChanged ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Add New Address'}
							disabled={!formChanged}
							onClick={() => {
								save();
							}}
						/>
					</Box>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default AccountAddressPage;
