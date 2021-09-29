import * as React from 'react';
import './SignUpForm.scss';
import { Box, Link, popupController } from '@bit/redsky.framework.rs.996';
import LabelInput from '../../../components/labelInput/LabelInput';
import IconLabel from '../../../components/iconLabel/IconLabel';
import LabelButton from '../../../components/labelButton/LabelButton';
import Label from '@bit/redsky.framework.rs.label';
import LabelLink from '../../../components/labelLink/LabelLink';
import Paper from '../../../components/paper/Paper';
import { useState } from 'react';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import SpinningLoaderPopup from '../../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import router from '../../../utils/router';
import { axiosErrorHandler } from '../../../utils/errorHandler';
import { HttpStatusCode } from '../../../utils/http';
import { WebUtils } from '../../../utils/utils';
import serviceFactory from '../../../services/serviceFactory';
import UserService from '../../../services/user/user.service';
import useWindowResizeChange from '../../../customHooks/useWindowResizeChange';

interface SignUpFormProps {}

const SignUpForm: React.FC<SignUpFormProps> = (props) => {
	let userService = serviceFactory.get<UserService>('UserService');
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	const [hasEnoughCharacters, setHasEnoughCharacters] = useState<boolean>(false);
	const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
	const [hasSpecialCharacter, setHasSpecialCharacter] = useState<boolean>(false);
	const [formIsValid, setFormIsValid] = useState<boolean>(false);

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
				new RsValidator(RsValidatorEnum.CUSTOM, 'Password does not match', (control): boolean => {
					return control.value.toString() === signUpForm.get('password').value.toString();
				})
			])
		])
	);

	function isSignUpFormFilledOut(): boolean {
		return (
			!!signUpForm.get('firstName').value.toString().length &&
			!!signUpForm.get('lastName').value.toString().length &&
			!!signUpForm.get('primaryEmail').value.toString().length &&
			!!signUpForm.get('password').value.toString().length &&
			!!signUpForm.get('confirmPassword').value.toString().length
		);
	}

	function updateSignUpForm(control: RsFormControl) {
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
		setFormIsValid(isSignUpFormFilledOut());
		setSignUpForm(signUpForm.clone().update(control));
	}

	async function signUp() {
		if (!(await signUpForm.isValid())) {
			setSignUpForm(signUpForm.clone());
			return;
		}

		let newCustomer: any = signUpForm.toModel();
		newCustomer.name = `${newCustomer.firstName} ${newCustomer.lastName}`;
		delete newCustomer.firstName;
		delete newCustomer.lastName;
		delete newCustomer.confirmPassword;

		try {
			let res = await userService.createNewCustomer(newCustomer);
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
		<Paper className={'rsSignUpForm'} boxShadow>
			<Box className={'signUpForm'}>
				<LabelInput
					title={'First Name*'}
					inputType={'text'}
					control={signUpForm.get('firstName')}
					updateControl={updateSignUpForm}
				/>
				<LabelInput
					title={'Last Name*'}
					inputType={'text'}
					control={signUpForm.get('lastName')}
					updateControl={updateSignUpForm}
				/>
				<LabelInput
					className={'stretchedInput'}
					title={'Email*'}
					inputType={'email'}
					isEmailInput
					control={signUpForm.get('primaryEmail')}
					updateControl={updateSignUpForm}
				/>
				<Box style={{ gridColumn: 'span 2' }}>
					<LabelInput
						className={'stretchedInput'}
						title={'Password*'}
						inputType={'password'}
						control={signUpForm.get('password')}
						updateControl={updateSignUpForm}
					/>
					{signUpForm.get('password').value.toString().length > 0 && (
						<>
							<IconLabel
								labelName={'At least 8 characters'}
								iconImg={!hasEnoughCharacters ? 'icon-solid-plus' : 'icon-solid-check'}
								iconPosition={'left'}
								iconSize={16}
								color={!hasEnoughCharacters ? 'red' : 'green'}
							/>
							<IconLabel
								labelName={'1 uppercase'}
								iconImg={!hasUpperCase ? 'icon-solid-plus' : 'icon-solid-check'}
								iconPosition={'left'}
								iconSize={16}
								color={!hasUpperCase ? 'red' : 'green'}
							/>
							<IconLabel
								labelName={'1 number or special character'}
								iconImg={!hasSpecialCharacter ? 'icon-solid-plus' : 'icon-solid-check'}
								iconPosition={'left'}
								iconSize={16}
								color={!hasSpecialCharacter ? 'red' : 'green'}
							/>
						</>
					)}
				</Box>
				<LabelInput
					className={'stretchedInput'}
					title={'Confirm Password*'}
					inputType={'password'}
					control={signUpForm.get('confirmPassword')}
					updateControl={updateSignUpForm}
				/>
			</Box>
			<LabelButton
				look={'containedPrimary'}
				variant={'button'}
				label={'Sign Up'}
				onClick={() => {
					signUp();
				}}
			/>
			<Label variant={'caption'} className={'small'}>
				By signing up you are agreeing to the {size === 'small' && <br />}
				<span>
					<Link path={'/legal/terms-and-conditions'}>Terms & Conditions</Link>
				</span>{' '}
				and
				<span>
					{' '}
					<Link path={'/legal/privacy'}>Privacy Policy</Link>
				</span>
			</Label>
			<hr />
			<Box className={'signInBox'} padding={'30px 0'}>
				<Label variant={'body1'}>Already have an account?</Label>
				<LabelLink path={'/signin'} label={'Sign In >'} variant={'caption'} />
			</Box>
		</Paper>
	);
};

export default SignUpForm;
