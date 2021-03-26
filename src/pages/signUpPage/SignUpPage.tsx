import * as React from 'react';
import { useEffect, useState } from 'react';
import './SignUpPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Box from '../../components/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../../components/paper/Paper';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';
import LabelLink from '../../components/labelLink/LabelLink';
import SignupOptionCheckboxes from '../../components/signupOptionCheckboxes/SignupOptionCheckboxes';
import SignupOptions from '../../components/signupOptionCheckboxes/SignupOptions';
import { HttpStatusCode } from '../../utils/http';
import { axiosErrorHandler } from '../../utils/errorHandler';
import UserService from '../../services/user/user.service';
import serviceFactory from '../../services/serviceFactory';
import Select from '../../components/Select/Select';
import LoadingPage from '../loadingPage/LoadingPage';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import debounce from 'lodash.debounce';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { formatDateForServer, formatPhoneNumber, formatReadableDate } from '../../utils/utils';
import rsToasts from '@bit/redsky.framework.toast';

const signUpForm = new RsFormGroup([
	new RsFormControl('name', '', [new RsValidator(RsValidatorEnum.REQ, 'Name is required')]),
	new RsFormControl('birthDate', '', [
		new RsValidator(RsValidatorEnum.REQ, 'Date of birth is required'),
		new RsValidator(RsValidatorEnum.MIN, 'incorrect date of birth', 7),
		new RsValidator(RsValidatorEnum.MAX, 'incorrect date of birth', 8)
	]),
	new RsFormControl('address', '', [new RsValidator(RsValidatorEnum.REQ, 'Address is required')]),
	new RsFormControl('city', '', [new RsValidator(RsValidatorEnum.REQ, 'City is required')]),
	new RsFormControl('zip', '', [new RsValidator(RsValidatorEnum.REQ, 'Zip code is required')]),
	new RsFormControl('phone', '', [
		new RsValidator(RsValidatorEnum.REQ, 'Phone is required'),
		new RsValidator(RsValidatorEnum.MIN, 'Invalid phone', 10),
		new RsValidator(RsValidatorEnum.MAX, 'Invalid phone', 10)
	]),
	new RsFormControl('primaryEmail', '', [
		new RsValidator(RsValidatorEnum.REQ, 'Email is required'),
		new RsValidator(RsValidatorEnum.EMAIL, 'Invalid email')
	]),
	new RsFormControl('password', '', [new RsValidator(RsValidatorEnum.REQ, 'Password is required')]),
	new RsFormControl('confirmPassword', '', [new RsValidator(RsValidatorEnum.REQ, '')])
]);

const SignUpPage: React.FC = () => {
	let userService = serviceFactory.get<UserService>('UserService');
	const size = useWindowResizeChange();
	const [form, setForm] = useState(signUpForm);
	const [newsletter, setNewsletter] = useState<0 | 1>(0);
	const [emailNotification, setEmailNotification] = useState<0 | 1>(0);
	const [country, setCountry] = useState<string>('US');
	const [countryList, setCountryList] = useState<
		{ value: number | string; text: number | string; selected: boolean }[]
	>([]);
	const iconSize: number = 18;

	let searchDebounced = debounce(async (value) => {
		form.update(value);
	}, 500);

	let formatPhoneDebounced = debounce((phone) => {
		form.update(phone);
		let formatted = formatPhoneNumber(phone.value);
		let element: HTMLInputElement | null = document.querySelector('.rsSignUpPage .phoneInput input');
		if (element) element.value = formatted;
	}, 500);

	let formatDateDebounced = debounce((dob) => {
		form.update(dob);
		let formattedDate = formatReadableDate(dob.value);
		let elementDate: HTMLInputElement | null = document.querySelector('.rsSignUpPage .dateInput input');
		if (elementDate) elementDate.value = formattedDate;
	}, 500);

	let checkPasswordsMatchDebounced = debounce((confirmPassword) => {
		form.update(confirmPassword);
		if (form.get('password').value !== confirmPassword.value) {
			renderPasswordError();
		} else {
			deletePasswordError();
		}
		return;
	}, 500);

	useEffect(() => {
		async function getCountries() {
			try {
				let countries = await userService.getAllCountries();
				formatCountryListForSelect(countries);
			} catch (e) {
				console.error('getCountries', e);
				throw rsToasts.error('An unexpected error occurred on the server.');
			}
		}
		getCountries().catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function renderSuccessMsg() {
		const formPaperElements: NodeListOf<HTMLElement> = document.querySelectorAll('.formPaper');
		formPaperElements[0].style.display = 'none';
		const successMsgPaperElements: NodeListOf<HTMLElement> = document.querySelectorAll('.successMsgPaper');
		successMsgPaperElements[0].style.display = 'flex';
	}

	function renderPasswordError() {
		const errorLabel: NodeListOf<HTMLElement> = document.querySelectorAll('.customErrorMessage');
		errorLabel[0].style.display = 'flex';
		const inputElements: NodeListOf<HTMLElement> = document.querySelectorAll('div.rsLabelInput');
		inputElements[inputElements.length - 1].style.margin = '0';
	}

	function deletePasswordError() {
		const errorLabel: NodeListOf<HTMLElement> = document.querySelectorAll('.customErrorMessage');
		errorLabel[0].style.display = 'none';
	}

	async function signUp() {
		if (!(await form.isValid()) && country === '') {
			setForm(form.clone());
		}
		let newCustomer: any = form.toModel();
		newCustomer.birthDate = formatDateForServer(newCustomer.birthDate);
		newCustomer.country = country;
		newCustomer.newsLetter = newsletter;
		newCustomer.emailNotification = emailNotification;
		delete newCustomer.confirmPassword;
		try {
			await userService.createNewCustomer(newCustomer);
			renderSuccessMsg();
		} catch (e) {
			axiosErrorHandler(e, {
				[HttpStatusCode.CONFLICT]: () => {
					throw rsToasts.error('This email is already in use.');
				}
			});
			console.error('Signup new customer', e);
			throw rsToasts.error('An unexpected error occurred on the server.');
		}
	}

	function toggleCheckBoxValue(inputValue: HTMLInputElement) {
		if (inputValue.value === 'newsletter') {
			inputValue.checked ? setNewsletter(1) : setNewsletter(0);
		} else {
			inputValue.checked ? setEmailNotification(1) : setEmailNotification(0);
		}
	}
	function signupOptionClickPlaceholder(e: React.MouseEvent) {
		let inputValue = e.target as HTMLInputElement;
		toggleCheckBoxValue(inputValue);
	}

	function formatCountryListForSelect(countries: Api.Country.ICountry[]) {
		setCountryList(
			countries.map((item) => {
				if (item.isoCode === 'US') {
					return { value: item.isoCode, text: item.name, selected: true };
				} else {
					return { value: item.isoCode, text: item.name, selected: false };
				}
			})
		);
	}

	return countryList.length === 0 ? (
		<LoadingPage />
	) : (
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
					<Box className={'formWrapper'} marginLeft={size === 'small' ? 0 : 38}>
						<Paper
							className={'formPaper'}
							width={size === 'small' ? '335px' : '604px'}
							height={size === 'small' ? '982px' : '884px'}
							boxShadow
							backgroundColor={'#FCFBF8'}
							position={'relative'}
						>
							<Box padding={size === 'small' ? '20px' : '48px 92px'}>
								<Box display={size === 'small' ? 'block' : 'flex'} justifyContent={'space-between'}>
									<LabelInput
										title={'Name *'}
										placeholder={'First and Last'}
										inputType={'text'}
										control={form.get('name')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
									/>
									<LabelInput
										className={'dateInput'}
										title={'Date Of Birth *'}
										placeholder={'MM/DD/YYYY'}
										inputType={'text'}
										control={form.get('birthDate')}
										updateControl={(updateControl) => formatDateDebounced(updateControl)}
									/>
								</Box>
								<LabelInput
									title={'Address *'}
									placeholder={'Street, Apartment or Suite'}
									inputType={'text'}
									control={form.get('address')}
									updateControl={(updateControl) => searchDebounced(updateControl)}
								/>
								<Box display={'flex'} justifyContent={'space-between'}>
									<LabelInput
										className={'cityLabelInput'}
										title={'City *'}
										placeholder={'City'}
										inputType={'text'}
										control={form.get('city')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
									/>
									<LabelInput
										className={'zipLabelInput'}
										title={'Zip Code *'}
										placeholder={'Zip Code'}
										inputType={'text'}
										control={form.get('zip')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
									/>
								</Box>
								<Box className={'selectBox'}>
									<Label className={'countryLabel'} variant={'caption'}>
										Country
									</Label>
									<Select
										placeHolder={'Select your country'}
										onChange={(value) => {
											if (value) setCountry(value.toString());
										}}
										options={countryList}
									/>
								</Box>
								<Box display={size === 'small' ? 'block' : 'flex'} justifyContent={'space-between'}>
									<LabelInput
										className={'phoneInput'}
										title={'Phone *'}
										placeholder={'(  )  - '}
										inputType={'tel'}
										iconImage="icon-phone"
										iconSize={iconSize}
										isPhoneInput
										control={form.get('phone')}
										maxLength={10}
										updateControl={(updateControl) => {
											formatPhoneDebounced(updateControl);
										}}
									/>
									<LabelInput
										title={'Email *'}
										placeholder={'email@address.com'}
										inputType={'text'}
										iconImage="icon-mail"
										iconSize={iconSize}
										isEmailInput
										control={form.get('primaryEmail')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
									/>
								</Box>
								<LabelInput
									title={'Password *'}
									placeholder={'Minimum 8 characters'}
									inputType={'password'}
									control={form.get('password')}
									updateControl={(updateControl) => searchDebounced(updateControl)}
								/>
								<LabelInput
									title={'Confirm Password *'}
									placeholder={'Re-type password to confirm'}
									inputType={'password'}
									control={form.get('confirmPassword')}
									updateControl={(updateControl) => checkPasswordsMatchDebounced(updateControl)}
								/>
								<div className={'rsErrorMessage customErrorMessage'}>Password does not match</div>

								<SignupOptionCheckboxes
									options={SignupOptions}
									onClick={signupOptionClickPlaceholder}
								/>

								<LabelButton
									look={'containedPrimary'}
									variant={'button'}
									label={'Sign Up'}
									onClick={signUp}
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
								borderTop={'1px solid #DEDEDE'}
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
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default SignUpPage;
