import * as React from 'react';
import { useEffect, useState } from 'react';
import './SignUpPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Footer from '../../components/footer/Footer';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../../components/paper/Paper';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelLink from '../../components/labelLink/LabelLink';
import UserService from '../../services/user/user.service';
import serviceFactory from '../../services/serviceFactory';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { axiosErrorHandler } from '../../utils/errorHandler';
import { HttpStatusCode } from '../../utils/http';
import { StringUtils, WebUtils } from '../../utils/utils';
import router from '../../utils/router';
import LabelSelect from '../../components/labelSelect/LabelSelect';
import CountryService from '../../services/country/country.service';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import Icon from '@bit/redsky.framework.rs.icon';
import { FooterLinks } from '../../components/footer/FooterLinks';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';

let phoneNumber = '';
let country = 'US';
let state = '';

const SignUpPage: React.FC = () => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	let userService = serviceFactory.get<UserService>('UserService');
	const countryService = serviceFactory.get<CountryService>('CountryService');
	const size = useWindowResizeChange();
	const [hasEnoughCharacters, setHasEnoughCharacters] = useState<boolean>(false);
	const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
	const [hasSpecialCharacter, setHasSpecialCharacter] = useState<boolean>(false);
	const [isValidForm, setIsValidForm] = useState<boolean>(false);
	const [formIsValid, setFormIsValid] = useState<boolean>(false);
	const [stateList, setStateList] = useState<{ value: number | string; text: number | string; selected: boolean }[]>(
		[]
	);
	const [countryList, setCountryList] = useState<
		{ value: number | string; text: number | string; selected: boolean }[]
	>([]);
	const [newAddressObj, setNewAddressObj] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('address1', '', [new RsValidator(RsValidatorEnum.REQ, 'Address is required')]),
			new RsFormControl('city', '', [new RsValidator(RsValidatorEnum.REQ, 'City is required')]),
			new RsFormControl('zip', '', [new RsValidator(RsValidatorEnum.REQ, 'Zip is required')])
		])
	);
	const [signUpForm, setSignUpForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('firstName', '', [new RsValidator(RsValidatorEnum.REQ, 'First name is required')]),
			new RsFormControl('lastName', '', [new RsValidator(RsValidatorEnum.REQ, 'Last name is required')]),
			new RsFormControl('primaryEmail', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Email Required'),
				new RsValidator(RsValidatorEnum.EMAIL, 'Invalid email')
			]),
			new RsFormControl('password', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Please provide a password'),
				new RsValidator(RsValidatorEnum.CUSTOM, '', (control) => {
					return /(?=(.*[0-9])+|(.*[ !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])+)(?=(.*[a-z])+)(?=(.*[A-Z])+)[0-9a-zA-Z !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]{8,}/g.test(
						control.value.toString()
					);
				}),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Password must not be password', (control) => {
					return control.value.toString() !== 'password';
				})
			]),
			new RsFormControl('confirmPassword', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Please retype your new password'),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Password does not match', (control) => {
					let newPassword: any = signUpForm.get('password').value.toString();
					return control.value === newPassword;
				})
			])
		])
	);

	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);

	useEffect(() => {
		if (user) {
			router.navigate('/').catch(console.error);
		}
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
			let selectedCountry = countryList.find((item) => item.selected);
			if (!selectedCountry) return;
			try {
				let response = await countryService.getStates(`${selectedCountry.value}`);
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
	}, [countryList]);

	function formatStateOrCountryListForSelect(statesOrCountries: any[]) {
		return statesOrCountries.map((item) => {
			return { value: item.isoCode, text: item.name, selected: item.isoCode === 'US' };
		});
	}

	function isSignUpFormFilledOut(): boolean {
		return (
			!!signUpForm.get('firstName').value.toString().length &&
			!!signUpForm.get('lastName').value.toString().length &&
			!!signUpForm.get('primaryEmail').value.toString().length &&
			!!signUpForm.get('password').value.toString().length &&
			!!signUpForm.get('confirmPassword').value.toString().length
		);
	}

	function updateUserObjForm(control: RsFormControl) {
		if (control.key === 'password') {
			const password = control.value.toString();
			//check for 8 minimum characters
			setHasEnoughCharacters(password.length >= 8);
			//check for at least 1 capital
			const upperCheck = new RegExp(/[A-Z]/g);
			setHasUpperCase(upperCheck.test(password));
			//check for a number or special character
			const specialCharacter = new RegExp(/[0-9!\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]/g);
			setHasSpecialCharacter(specialCharacter.test(password));
		}
		if (control.key === 'phone' && control.value.toString().length === 10) {
			control.value = StringUtils.formatPhoneNumber(control.value.toString());
		} else if (control.key === 'phone' && control.value.toString().length > 10) {
			control.value = StringUtils.removeAllExceptNumbers(control.value.toString());
		} else if (control.key === 'firstName' || control.key === 'lastName') {
			control.value = StringUtils.removeLineEndings(control.value.toString());
		}
		signUpForm.update(control);
		setFormIsValid(isSignUpFormFilledOut());
		setSignUpForm(signUpForm.clone());
	}

	async function updateNewAddressObj(control: RsFormControl) {
		if (control.key === 'zip' && typeof control.value === 'string') {
			control.value = +control.value.replace(/[^0-9]/g, '');
		}
		newAddressObj.update(control);
		setIsValidForm(isFormFilledOut());
		setNewAddressObj(newAddressObj.clone());
	}

	function isFormFilledOut(): boolean {
		return (
			!!newAddressObj.get('address1').value.toString().length &&
			!!newAddressObj.get('city').value.toString().length &&
			!!newAddressObj.get('zip').value.toString().length &&
			!!state.length
		);
	}

	async function signUp() {
		popupController.open(SpinningLoaderPopup);
		if (!phoneNumber.length || phoneNumber.length < 3) {
			popupController.close(SpinningLoaderPopup);
			return rsToastify.error('Phone number is required', 'Missing Phone Number.');
		}

		if (!(await signUpForm.isValid())) {
			setSignUpForm(signUpForm.clone());
			return;
		}

		let newCustomer: any = signUpForm.toModel();
		newCustomer.name = `${newCustomer.firstName} ${newCustomer.lastName}`;
		newCustomer.phone = phoneNumber;
		delete newCustomer.firstName;
		delete newCustomer.lastName;
		delete newCustomer.confirmPassword;

		let addressObj: Api.UserAddress.Req.Create = newAddressObj.toModel();
		addressObj['type'] = 'BOTH';
		addressObj['state'] = state;
		addressObj['isDefault'] = 1;
		addressObj['country'] = country;
		try {
			let res = await userService.createNewCustomer({ ...newCustomer, address: addressObj });
			if (res) {
				rsToastify.success('Account was successfully created.', 'Account Created');
				popupController.close(SpinningLoaderPopup);
				if (params.data !== 0 && params.data.includes('arrivalDate')) {
					router.navigate(`/signin?data=${params.data}`).catch(console.error);
				} else {
					router.navigate(`/signin`).catch(console.error);
				}
			}
		} catch (e) {
			popupController.close(SpinningLoaderPopup);
			axiosErrorHandler(e, {
				[HttpStatusCode.CONFLICT]: () => {
					throw rsToastify.error(
						WebUtils.getRsErrorMessage(e, 'This email is already in use.'),
						'Server Error'
					);
				}
			});
			console.error('Signup new customer', e);
			throw rsToastify.error(
				WebUtils.getRsErrorMessage(e, 'Unable to create account, try again.'),
				'Server Error'
			);
		}
	}

	return (
		<Page className={'rsSignUpPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box
					className={'descriptionAndFormBox'}
					display={'flex'}
					margin={size === 'small' ? '100px 20px' : '100px 0'}
					justifyContent={'center'}
				>
					<Box maxWidth={'480px'} margin={size === 'small' ? '0 0 163px 0' : '0 38px 0 0'}>
						<Label className={'descriptionText'} variant={size === 'small' ? 'h2' : 'h1'}>
							Sign up for spire Loyalty
						</Label>
						<Label className={'descriptionText'} variant={size === 'small' ? 'body2' : 'body1'}>
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
							invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
							et justo duo dolores et
						</Label>
					</Box>

					<Paper
						className={'formPaper'}
						width={size === 'small' ? '335px' : '604px'}
						height={size === 'small' ? '900px' : '925px'}
						boxShadow
						backgroundColor={'#FCFBF8'}
						position={'relative'}
					>
						<Box
							display={size === 'small' ? 'block' : 'flex'}
							justifyContent={'space-between'}
							flexDirection={'column'}
							padding={size === 'small' ? '20px' : '48px 92px'}
						>
							<Box display={'flex'} justifyContent={'space-between'}>
								<LabelInput
									title={'First Name'}
									inputType={'text'}
									control={signUpForm.get('firstName')}
									updateControl={updateUserObjForm}
								/>
								<LabelInput
									title={'Last Name'}
									inputType={'text'}
									control={signUpForm.get('lastName')}
									updateControl={updateUserObjForm}
								/>
							</Box>
							<LabelInput
								className={'inputStretched'}
								title={'Address'}
								inputType={'text'}
								control={newAddressObj.get('address1')}
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
							<Box display={'flex'} className={'countryState'}>
								<LabelSelect
									title={'State'}
									onChange={(value) => {
										let newStateList = [...stateList];
										newStateList = newStateList.map((item) => {
											return {
												value: item.value,
												text: item.text,
												selected: item.value === value
											};
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
											return {
												value: item.value,
												text: item.text,
												selected: item.value === value
											};
										});
										setCountryList(newCountryList);
										country = value || '';
										setIsValidForm(isFormFilledOut());
									}}
									selectOptions={countryList}
								/>
							</Box>

							<LabelInput
								title={'Phone'}
								inputType={'text'}
								isPhoneInput
								onChange={(value) => {
									phoneNumber = value.toString();
								}}
							/>
							<LabelInput
								title={'Email'}
								inputType={'text'}
								isEmailInput
								control={signUpForm.get('primaryEmail')}
								updateControl={updateUserObjForm}
							/>
							<LabelInput
								title={'Password'}
								inputType={'password'}
								control={signUpForm.get('password')}
								updateControl={updateUserObjForm}
							/>
							<Box display={'flex'} className={'passwordCheck'}>
								<Icon
									iconImg={!hasEnoughCharacters ? 'icon-solid-plus' : 'icon-solid-check'}
									color={!hasEnoughCharacters ? 'red' : 'green'}
								/>
								<Label variant={'caption'} color={!hasEnoughCharacters ? 'red' : 'green'}>
									At least 8 characters{' '}
								</Label>
							</Box>
							<Box display={'flex'} className={'passwordCheck'}>
								<Icon
									iconImg={!hasUpperCase ? 'icon-solid-plus' : 'icon-solid-check'}
									color={!hasUpperCase ? 'red' : 'green'}
								/>
								<Label variant={'caption'} color={!hasUpperCase ? 'red' : 'green'}>
									1 uppercase
								</Label>
							</Box>
							<Box display={'flex'} className={'passwordCheck'}>
								<Icon
									iconImg={!hasSpecialCharacter ? 'icon-solid-plus' : 'icon-solid-check'}
									color={!hasSpecialCharacter ? 'red' : 'green'}
								/>
								<Label variant={'caption'} color={!hasSpecialCharacter ? 'red' : 'green'}>
									1 number or special character
								</Label>
							</Box>
							<LabelInput
								title={'Confirm Password'}
								inputType={'password'}
								control={signUpForm.get('confirmPassword')}
								updateControl={updateUserObjForm}
							/>

							<LabelButton
								look={!formIsValid && !isValidForm ? 'containedSecondary' : 'containedPrimary'}
								variant={'caption'}
								label={'Sign Up'}
								onClick={signUp}
								disabled={!formIsValid || !isValidForm}
							/>

							<div className={'termsAndPrivacy'}>
								By signing up you are agreeing to the <a href={'/'}>Terms & Conditions</a> and{' '}
								<a href={'/'}>Privacy Policy.</a>
							</div>
						</Box>
						<Box
							className={'signInBottomBox'}
							display={'flex'}
							flexDirection={'column'}
							justifyContent={'center'}
							alignItems={'center'}
							marginTop={'auto'}
							height={'100px'}
						>
							<Label variant={'body1'}>Already have an account?</Label>
							<LabelLink path={'/signin'} externalLink={false} label={'Sign In'} variant={'button'} />
						</Box>
					</Paper>
					<Paper
						className={'successMsgPaper'}
						width={size === 'small' ? '335px' : '604px'}
						height={size === 'small' ? '146px' : '200px'}
						boxShadow
						backgroundColor={'#FFFFFF'}
						position={'relative'}
					>
						<Label className={'successText'} variant={size === 'small' ? 'h2' : 'h1'}>
							Thank you for signing up
						</Label>
						<Label className={'successText'} variant={'body1'}>
							You will receive an email shortly to confirm your account.
						</Label>
					</Paper>
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default SignUpPage;
