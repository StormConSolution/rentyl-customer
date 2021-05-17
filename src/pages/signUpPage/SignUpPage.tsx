import * as React from 'react';
import { useState } from 'react';
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
import UserService from '../../services/user/user.service';
import serviceFactory from '../../services/serviceFactory';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { axiosErrorHandler } from '../../utils/errorHandler';
import { HttpStatusCode } from '../../utils/http';
import rsToasts from '@bit/redsky.framework.toast';
import { formatPhoneNumber, removeAllExceptNumbers, removeExtraSpacesReturnsTabs } from '../../utils/utils';
import { useSetRecoilState } from 'recoil';
import globalState from '../../models/globalState';
import router from '../../utils/router';

let phoneNumber = '';

const SignUpPage: React.FC = () => {
	let userService = serviceFactory.get<UserService>('UserService');
	const size = useWindowResizeChange();
	const setUser = useSetRecoilState<Api.User.Res.Detail | undefined>(globalState.user);
	const [formIsValid, setFormIsValid] = useState<boolean>(false);
	const [signUpForm, setSignUpForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('firstName', '', [new RsValidator(RsValidatorEnum.REQ, 'First name is required')]),
			new RsFormControl('lastName', '', [new RsValidator(RsValidatorEnum.REQ, 'Last name is required')]),
			new RsFormControl('primaryEmail', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Email Required'),
				new RsValidator(RsValidatorEnum.EMAIL, 'Invalid email')
			]),
			new RsFormControl('password', '', [new RsValidator(RsValidatorEnum.REQ, 'Please provide a password')]),
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

	function isSignUpFormFilledOut(): boolean {
		return (
			!!signUpForm.get('firstName').value.toString().length &&
			!!signUpForm.get('lastName').value.toString().length &&
			!!signUpForm.get('primaryEmail').value.toString().length &&
			!!signUpForm.get('password').value.toString().length &&
			!!signUpForm.get('confirmPassword').value.toString().length
		);
	}

	async function updateUserObjForm(control: RsFormControl) {
		if (control.key === 'phone' && control.value.toString().length === 10) {
			let newValue = formatPhoneNumber(control.value.toString());
			control.value = newValue;
		} else if (control.key === 'phone' && control.value.toString().length > 10) {
			let newValue = removeAllExceptNumbers(control.value.toString());
			control.value = newValue;
		} else if (control.key === 'firstName' || control.key === 'lastName') {
			let newValue = removeExtraSpacesReturnsTabs(control.value.toString());
			control.value = newValue;
		}
		signUpForm.update(control);
		let isValid = await signUpForm.isValid();
		setFormIsValid(isSignUpFormFilledOut() && isValid);
		setSignUpForm(signUpForm.clone());
	}

	async function signUp() {
		if (!phoneNumber.length) {
			return rsToasts.error('Phone number is required');
		}

		let newCustomer: any = signUpForm.toModel();
		newCustomer.name = `${newCustomer.firstName} ${newCustomer.lastName}`;
		newCustomer.phone = phoneNumber;
		delete newCustomer.firstName;
		delete newCustomer.lastName;
		delete newCustomer.confirmPassword;
		try {
			let res = await userService.createNewCustomer(newCustomer);
			if (res.data) {
				rsToasts.success('Account Created');
				if (params.data !== 0 && params.data.includes('arrivalDate')) {
					router.navigate(`/signin?data=${params.data}`).catch(console.error);
				} else {
					router.navigate(`/signin`).catch(console.error);
				}
			}
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
					<Box className={'formWrapper'} marginLeft={size === 'small' ? 0 : 38}>
						<Paper
							className={'formPaper'}
							width={size === 'small' ? '335px' : '604px'}
							height={size === 'small' ? '725px' : '675px'}
							boxShadow
							backgroundColor={'#FCFBF8'}
							position={'relative'}
						>
							<Box padding={size === 'small' ? '20px' : '48px 92px'}>
								<Box display={size === 'small' ? 'block' : 'flex'} justifyContent={'space-between'}>
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
									title={'Email'}
									inputType={'text'}
									isEmailInput
									control={signUpForm.get('primaryEmail')}
									updateControl={updateUserObjForm}
									iconImage={'icon-mail'}
									iconSize={18}
								/>
								<LabelInput
									title={'Phone'}
									inputType={'text'}
									isPhoneInput
									onChange={(value) => {
										phoneNumber = value.toString();
									}}
								/>
								<LabelInput
									title={'Password'}
									inputType={'password'}
									control={signUpForm.get('password')}
									updateControl={updateUserObjForm}
								/>
								<LabelInput
									title={'Confirm Password'}
									inputType={'password'}
									control={signUpForm.get('confirmPassword')}
									updateControl={updateUserObjForm}
								/>

								<LabelButton
									look={!formIsValid ? 'containedSecondary' : 'containedPrimary'}
									variant={'button'}
									label={'Sign Up'}
									onClick={signUp}
									disabled={!formIsValid}
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
