import React, { FormEvent, useState } from 'react';
import './SignInPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { axiosErrorHandler } from '../../utils/errorHandler';
import { HttpStatusCode } from '../../utils/http';
import LabelLink from '../../components/labelLink/LabelLink';
import LabelButton from '../../components/labelButton/LabelButton';
import router from '../../utils/router';
import { FooterLinks } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import LabelInput from '../../components/labelInput/LabelInput';
import LinkButton from '../../components/linkButton/LinkButton';

const SignInPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
	const [emailSentMessage, setEmailSentMessage] = useState<string>('');
	const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
	const [loginFormGroup, setLoginFormGroup] = useState(
		new RsFormGroup([
			new RsFormControl('email', '', [new RsValidator(RsValidatorEnum.REQ, 'Email is required')]),
			new RsFormControl('password', '', [new RsValidator(RsValidatorEnum.REQ, 'Password is required')])
		])
	);
	const [resetPasswordForm, setResetPasswordForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('email', '', [
				new RsValidator(RsValidatorEnum.REQ, 'email is required'),
				new RsValidator(RsValidatorEnum.EMAIL, 'invalid email')
			])
		])
	);
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);

	async function signIn(e: FormEvent) {
		e.preventDefault();
		if (!(await loginFormGroup.isValid())) {
			setLoginFormGroup(loginFormGroup.clone());
			return;
		}
		let data: { email: string; password: string } = loginFormGroup.toModel();

		try {
			setLoginErrorMessage('');
			await userService.loginUserByPassword(data.email, data.password);
			if (params.data !== 0 && params.data.includes('arrivalDate')) {
				await router.navigate(`/booking/packages?data=${params.data}`);
			} else {
				await router.navigate('/');
			}
		} catch (e) {
			if (e.message === 'INVALID_ROLE') {
				setLoginErrorMessage('User not allowed to log in.');
				return;
			}

			axiosErrorHandler(e, {
				[HttpStatusCode.UNAUTHORIZED]: () => {
					setLoginErrorMessage('Invalid Username / Password');
				},
				[HttpStatusCode.NOT_FOUND]: () => {
					setLoginErrorMessage('Invalid Username / Password');
				}
			});
		}
	}

	async function resetPassword() {
		let isValid = await resetPasswordForm.isValid();
		if (!isValid) {
			setResetPasswordForm(resetPasswordForm.clone());
			throw new Error('input');
		}
		setEmailSentMessage('If user exists email has been sent. Please Check your email and follow the directions.');
		try {
			await userService.requestPasswordByEmail(`${resetPasswordForm.get('email').value}`);
		} catch (e) {
			console.error(e);
		}
	}

	function renderSigninOrResetPassword() {
		if (!isForgotPassword) {
			return (
				<>
					<Label variant="h1">Sign in</Label>
					<form className="signInForm" action={'#'} onSubmit={signIn}>
						<LabelInput
							title={'Email'}
							inputType={'email'}
							control={loginFormGroup.get('email')}
							updateControl={(updateControl) => loginFormGroup.update(updateControl)}
						/>
						<LabelInput
							title={'Password'}
							inputType={'password'}
							control={loginFormGroup.get('password')}
							updateControl={(updateControl) => loginFormGroup.update(updateControl)}
						/>
						<LinkButton
							className="signInButton"
							look={'containedPrimary'}
							label="Sign In"
							buttonType="submit"
							path={'/'}
						/>
						{!!loginErrorMessage.length && (
							<Label className="rsErrorMessage" variant={'body2'}>
								{loginErrorMessage}
							</Label>
						)}
					</form>
					<Label
						className={'forgotPassword'}
						variant={'caption'}
						onClick={() => setIsForgotPassword(!isForgotPassword)}
					>
						Forgot Password?
					</Label>
				</>
			);
		} else {
			return (
				<>
					<Label variant="h1">Forgot Password</Label>
					<LabelInput
						title={'Email'}
						inputType={'email'}
						control={resetPasswordForm.get('email')}
						updateControl={(updateControl) => resetPasswordForm.update(updateControl)}
					/>
					<LabelButton
						className="signInButton"
						look={'containedPrimary'}
						variant="caption"
						label="Reset Password"
						onClick={resetPassword}
					/>
				</>
			);
		}
	}

	return (
		<Page className={'rsSignInPage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className="container" data-aos="fade-up">
					<Box className="signInSection">
						{renderSigninOrResetPassword()}
						<Box margin={'16px auto'}>{emailSentMessage}</Box>
					</Box>
					<Box className="signUpSection">
						<Box>
							<Label>Don't have an account?</Label>
							<LabelLink path="/signup" label="Sign Up &gt;" variant="caption" externalLink={false} />
						</Box>
					</Box>
				</div>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default SignInPage;
