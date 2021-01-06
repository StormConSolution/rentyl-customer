import React, { FormEvent, useState } from 'react';
import { Page } from '@bit/redsky.framework.rs.996';
import Input from '@bit/redsky.framework.rs.input';
import { RsFormControl, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import Button from '@bit/redsky.framework.rs.button';
import './LoginPage.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Box from '../../components/box/Box';
import UserService from '../../services/user/user.service';
import serviceFactory from '../../services/serviceFactory';
import { axiosErrorHandler } from '../../utils/errorHandler';
import { HttpStatusCode } from '../../utils/http';

const LoginPage: React.FC = () => {
	let userService = serviceFactory.get<UserService>('UserService');
	const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
	const [emailAddress, setEmailAddress] = useState<string | number | string[]>('');
	const [password, setPassword] = useState<string | number | string[]>('');
	const [passwordControl, setPasswordControl] = useState(
		new RsFormControl('password', '', [new RsValidator(RsValidatorEnum.REQ, 'Password is required')])
	);
	const [emailControl, setEmailControl] = useState(
		new RsFormControl('email', '', [new RsValidator(RsValidatorEnum.EMAIL, 'Email is required')])
	);

	async function signInUser(e: FormEvent) {
		e.preventDefault();
		try {
			setLoginErrorMessage('');
			await userService.loginUserByPassword(`${emailAddress}`, `${password}`);
		} catch (e) {
			if (e.message === 'INVALID_ROLE') {
				setLoginErrorMessage('User not allowed to login.');
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
		<Page className="rsLoginPage">
			<Box className="loggedOutTitleBar" p={'0 20px'} display={'flex'} alignItems={'center'}>
				<img src={require('../../images/volcanicLogoYellow_T.png')} alt="" width="51.75" height="26.52" />
				<Label className="volcanicLabel" variant={'h6'}>
					VOLCANIC
				</Label>
			</Box>
			<form className="signInWrapper" action={'#'} onSubmit={signInUser}>
				<Box
					className="signInContainer"
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					p={'22px 68px'}
				>
					<Box className="titleContainer" display={'flex'} flexDirection={'column'} alignItems={'center'}>
						<Label className="signInHeader" variant={'h4'}>
							Sign in
						</Label>
						<Label className="signInSubheader" variant={'subtitle2'}>
							Access Volcanic Admin Site
						</Label>
					</Box>
					<Input
						className="signInInput"
						placeholder="Email Address"
						type={'text'}
						look={'filled'}
						control={emailControl}
						updateControl={(updateControl) => setEmailAddress(updateControl.value)}
					/>
					<Input
						className="signInInput"
						placeholder="Password"
						type={'password'}
						look={'filled'}
						control={passwordControl}
						updateControl={(updateControl) => setPassword(updateControl.value)}
					/>
					<Button className="signInButton" look={'containedPrimary'} type="submit">
						SIGN IN
					</Button>
					{!!loginErrorMessage.length && (
						<Label className="errorText" variant={'body2'}>
							{loginErrorMessage}
						</Label>
					)}
					<Label className={'forgotPassword'} variant={'body1'}>
						Forgot password?
					</Label>
				</Box>
			</form>
		</Page>
	);
};

export default LoginPage;
