import React, { FormEvent, useEffect, useState } from 'react';
import './SignInPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import Input from '@bit/redsky.framework.rs.input';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { axiosErrorHandler } from '../../utils/errorHandler';
import { HttpStatusCode } from '../../utils/http';
import LabelLink from '../../components/labelLink/LabelLink';
import LabelButton from '../../components/labelButton/LabelButton';
import router from '../../utils/router';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';

const SignInPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [emailAddress, setEmailAddress] = useState<string>();
	const [password, setPassword] = useState<string | number | string[]>('');
	const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
	const loginFormGroup = new RsFormGroup([
		new RsFormControl('email', '', [new RsValidator(RsValidatorEnum.REQ, 'Email is required')]),
		new RsFormControl('password', '', [new RsValidator(RsValidatorEnum.REQ, 'Password is required')])
	]);

	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);

	async function signIn(e: FormEvent) {
		e.preventDefault();
		try {
			setLoginErrorMessage('');
			await userService.loginUserByPassword(`${emailAddress}`, `${password}`);
			if (params.data !== 0 && params.data.includes('startDate')) {
				await router.navigate(`/booking?data=${params.data}`);
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

	return (
		<Page className={'rsSignInPage'}>
			<div className={'rs-page-content-wrapper'}>
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
								control={loginFormGroup.get('email')}
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
								control={loginFormGroup.get('password')}
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
								<Label className="rsErrorMessage" variant={'body2'}>
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
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default SignInPage;
