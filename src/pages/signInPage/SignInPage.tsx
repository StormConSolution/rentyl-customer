import React, { FormEvent, useState } from 'react';
import './SignInPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import Input from '@bit/redsky.framework.rs.input';
import { RsFormControl, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { axiosErrorHandler } from '../../utils/errorHandler';
import { HttpStatusCode } from '../../utils/http';
import LabelLink from '../../components/labelLink/LabelLink';
import LabelButton from '../../components/labelButton/LabelButton';

const SignInPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [emailAddress, setEmailAddress] = useState<string>();
	const [password, setPassword] = useState<string | number | string[]>('');
	const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
	const [emailControl] = useState(
		new RsFormControl('email', '', [new RsValidator(RsValidatorEnum.EMAIL, 'Email is required')])
	);
	const [passwordControl] = useState(
		new RsFormControl('password', '', [new RsValidator(RsValidatorEnum.REQ, 'Password is required')])
	);

	async function signIn(e: FormEvent) {
		e.preventDefault();
		try {
			setLoginErrorMessage('');
			await userService.loginUserByPassword(`${emailAddress}`, `${password}`);
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

	return (
		<Page className={'rsLoginPage'}>
			<div className="container" data-aos="fade-up">
				<Box className="signInSection">
					<Label variant="h1">Sign in</Label>
					<form className="signInForm" action={'#'} onSubmit={signIn}>
						<Label className="inputLabel" variant="caption">
							Email
						</Label>
						<Input
							className="signInInput"
							type="text"
							look="outlined"
							control={emailControl}
							updateControl={(updatedControl) => {
								setEmailAddress(updatedControl.value.toString());
							}}
						/>
						<Label className="inputLabel" variant="caption">
							Password
						</Label>
						<Input
							className="signInInput"
							type="password"
							look="outlined"
							control={passwordControl}
							updateControl={(updatedControl) => {
								setPassword(updatedControl.value.toString());
							}}
						/>
						<LabelButton
							className="signInButton"
							look={'containedPrimary'}
							variant="caption"
							label="Sign In"
							buttonType="submit"
						/>
						{!!loginErrorMessage.length && (
							<Label className="errorText" variant={'body2'}>
								{loginErrorMessage}
							</Label>
						)}
					</form>

					<LabelLink
						className="forgotPassword"
						variant="caption"
						label="Forgot Password?"
						externalLink={false}
						path=""
					/>
				</Box>
				<Box className="signUpSection">
					<Box>
						<Label>Don't have an account?</Label>
						<LabelLink path="/signup" label="Sign Up &gt;" variant="caption" externalLink={false} />
					</Box>
				</Box>
			</div>
		</Page>
	);
};

export default SignInPage;
