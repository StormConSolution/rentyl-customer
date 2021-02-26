import * as React from 'react';
import { FormEvent, useEffect, useState } from 'react';
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
import SignupOptionCheckboxes, { SignupOption } from '../../components/signupOptionCheckboxes/SignupOptionCheckboxes';
import SignupOptions from '../../components/signupOptionCheckboxes/SignupOptions';
import { HttpStatusCode } from '../../utils/http';
import { axiosErrorHandler } from '../../utils/errorHandler';
import UserService from '../../services/user/user.service';
import serviceFactory from '../../services/serviceFactory';
import Select from '../../components/Select/Select';
import LoadingPage from '../loadingPage/LoadingPage';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import debounce from 'lodash.debounce';
import rsToasts from '@bit/redsky.framework.toast';
import { sign } from 'crypto';

//TODO password match, fix country select formatting, mobile responsive
const signUpForm = new RsFormGroup([
	new RsFormControl('name', '', [new RsValidator(RsValidatorEnum.REQ, 'Name is required')]),
	new RsFormControl('dateOfBirth', '', [new RsValidator(RsValidatorEnum.REQ, 'Date of birth is required')]),
	new RsFormControl('address', '', [new RsValidator(RsValidatorEnum.REQ, 'Address is required')]),
	new RsFormControl('city', '', [new RsValidator(RsValidatorEnum.REQ, 'City is required')]),
	new RsFormControl('zipCode', '', [new RsValidator(RsValidatorEnum.REQ, 'Zip code is required')]),
	new RsFormControl('phone', '', [
		new RsValidator(RsValidatorEnum.REQ, 'Phone is required'),
		new RsValidator(RsValidatorEnum.MIN, 'Invalid phone', 10),
		new RsValidator(RsValidatorEnum.MAX, 'Invalid phone', 10)
	]),
	new RsFormControl('email', '', [
		new RsValidator(RsValidatorEnum.REQ, 'Email is required'),
		new RsValidator(RsValidatorEnum.EMAIL, 'Invalid email')
	]),
	new RsFormControl('password', '', [new RsValidator(RsValidatorEnum.REQ, 'Password is required')]),
	new RsFormControl('confirmPassword', '', [new RsValidator(RsValidatorEnum.REQ, 'Confirm password is required')])
]);

const SignUpPage: React.FC = () => {
	let userService = serviceFactory.get<UserService>('UserService');

	const [form, setForm] = useState(signUpForm);
	const [newsletter, setNewsletter] = useState<0 | 1>(0);
	const [emailNotification, setEmailNotification] = useState<0 | 1>(0);
	const [country, setCountry] = useState<string>('');
	const [countryList, setCountryList] = useState<
		{ value: number | string; text: number | string; selected?: boolean }[]
	>([]);
	const iconSize: number = 18;

	let searchDebounced = debounce(async (value) => {
		form.update(value);
	}, 500);

	useEffect(() => {
		async function getCountries() {
			try {
				let countries = await userService.getAllCountries();
				formatCountryListForSelect(countries);
			} catch (e) {
				axiosErrorHandler(e, {
					[HttpStatusCode.NOT_FOUND]: () => {}
				});
			}
		}
		getCountries().catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function renderPasswordError() {
		const inputElements = document.getElementsByClassName('rsLabelInput');
		// @ts-ignore
		inputElements[inputElements.length - 1].style.margin = 0;
	}
	async function signUp() {
		if (form.get('password').value !== form.get('confirmPassword').value) {
			renderPasswordError();
		}
		if (!(await form.isValid()) && country === '') {
			setForm(form.clone());
		}
		let newCustomer: any = form.toModel();
		newCustomer.country = country;
		newCustomer.newsLetter = newsletter;
		newCustomer.emailNotification = emailNotification;

		try {
			await userService.createNewCustomer(newCustomer);
		} catch (e) {
			axiosErrorHandler(e, {
				[HttpStatusCode.UNAUTHORIZED]: () => {
					//	setLoginErrorMessage('Invalid Username / Password');
				},
				[HttpStatusCode.NOT_FOUND]: () => {
					//	setLoginErrorMessage('Invalid Username / Password');
				}
			});
		}
	}

	function getSignupOptions(): Array<SignupOption> {
		return SignupOptions;
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

	function formatCountryListForSelect(countries: Api.Country.ICountry[] | undefined) {
		let allCountries: { value: number | string; text: number | string; selected?: boolean }[] = [];
		if (!!countries) {
			for (let i = 0; i < countries.length; i++) {
				allCountries.push({ value: countries[i].isoCode, text: countries[i].name });
			}
			setCountryList(allCountries);
		}
	}

	return countryList.length === 0 ? (
		<LoadingPage />
	) : (
		<Page className={'rsSignUpPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box display={'flex'} margin={'100px 0'} justifyContent={'center'}>
					<Box maxWidth={'480px'} marginRight={38}>
						<Label variant={'h1'}>Sign up for spire Loyalty</Label>
						<Label variant={'body1'}>
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
							invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
							et justo duo dolores et
						</Label>
					</Box>
					<Box marginLeft={38}>
						<Paper
							width={'604px'}
							height={'844px'}
							boxShadow
							backgroundColor={'#FCFBF8'}
							position={'relative'}
						>
							{/*<form className="signInForm" action={'#'} onSubmit={signUp}>*/}
							<Box padding={'48px 92px'}>
								<Box display={'flex'} justifyContent={'space-between'}>
									<LabelInput
										title={'Name *'}
										placeholder={'First and Last'}
										inputType={'text'}
										control={form.get('name')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
									/>
									<LabelInput
										title={'Date Of Birth *'}
										placeholder={'MM/DD/YYYY'}
										inputType={'text'}
										control={form.get('dateOfBirth')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
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
										title={'City *'}
										placeholder={'City'}
										inputType={'text'}
										control={form.get('city')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
									/>
									<LabelInput
										title={'Zip Code *'}
										placeholder={'Zip Code'}
										inputType={'text'}
										control={form.get('zipCode')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
									/>
								</Box>
								<Box>
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
								<Box display={'flex'} justifyContent={'space-between'}>
									<LabelInput
										title={'Phone *'}
										placeholder={'(  )  - '}
										inputType={'tel'}
										iconImage="icon-phone"
										iconSize={iconSize}
										isPhoneInput
										control={form.get('phone')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
									/>
									<LabelInput
										title={'Email *'}
										placeholder={'email@address.com'}
										inputType={'text'}
										iconImage="icon-mail"
										iconSize={iconSize}
										isEmailInput
										control={form.get('email')}
										updateControl={(updateControl) => searchDebounced(updateControl)}
									/>
								</Box>
								<LabelInput
									title={'Password *'}
									placeholder={'Minimum 8 characters'}
									inputType={'text'}
									control={form.get('password')}
									updateControl={(updateControl) => searchDebounced(updateControl)}
								/>
								<LabelInput
									title={'Confirm Password *'}
									placeholder={'Re-type password to confirm'}
									inputType={'text'}
									control={form.get('confirmPassword')}
									updateControl={(updateControl) => searchDebounced(updateControl)}
								/>
								<div class={'rsErrorMessage customErrorMessage'}>Password does not match</div>

								<SignupOptionCheckboxes
									options={getSignupOptions()}
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
					</Box>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default SignUpPage;
