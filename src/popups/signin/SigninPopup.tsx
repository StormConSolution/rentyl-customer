import * as React from 'react';
import './SigninPopup.scss';
import { FormEvent, useState } from 'react';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import LabelInput from '../../components/labelInput/LabelInput';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import SignupPopup, { SignupPopupProps } from '../signup/SignupPopup';
import LabelButton from '../../components/labelButton/LabelButton';
import SpinningLoaderPopup, { SpinningLoaderPopupProps } from '../spinningLoaderPopup/SpinningLoaderPopup';

export interface SigninPopupProps extends PopupProps {}

const SigninPopup: React.FC<SigninPopupProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [signinForm, setSigninForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('primaryEmail', '', [
				new RsValidator(RsValidatorEnum.EMAIL, 'Please enter a valid email address')
			]),
			new RsFormControl('password', '', [new RsValidator(RsValidatorEnum.REQ, 'Please enter a password')])
		])
	);

	function updateForm(control: RsFormControl) {
		setSigninForm(signinForm.clone().update(control));
		if (errorMessage !== '') {
			setErrorMessage('');
		}
	}

	async function signIn(event?: FormEvent<HTMLFormElement>) {
		if (event) event.preventDefault();
		if (!(await signinForm.isValid())) {
			setSigninForm(signinForm.clone());
			setErrorMessage('Missing information');
			return;
		}
		const { primaryEmail, password } = signinForm.toModel<{ primaryEmail: string; password: string }>();
		try {
			popupController.open<SpinningLoaderPopupProps>(SpinningLoaderPopup, {});
			await userService.loginUserByPassword(primaryEmail, password);
			setErrorMessage('');
			popupController.closeAll();
		} catch (e) {
			popupController.close(SpinningLoaderPopup);
			setErrorMessage('Invalid username/password');
		}
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper className={'rsSigninPopup'} position={'relative'}>
				<form onSubmit={signIn}>
					<Icon
						iconImg={'icon-close'}
						onClick={() => {
							popupController.close(SigninPopup);
						}}
						size={20}
						cursorPointer
					/>
					<Label variant={'h4'}>Sign in / Sign up</Label>
					<hr className={'lineThrough'} />
					<LabelInput
						title={'Email Address'}
						inputType={'email'}
						control={signinForm.get('primaryEmail')}
						updateControl={updateForm}
						labelVariant={'body5'}
					/>
					<LabelInput
						title={'Password'}
						inputType={'password'}
						control={signinForm.get('password')}
						updateControl={updateForm}
						labelVariant={'body5'}
					/>
					<LabelButton look={'containedPrimary'} label={'Sign in'} variant={'button'} buttonType={'submit'} />
				</form>
				<Label className={'errorMessage'} variant={'body2'} color={'red'}>
					{errorMessage}
				</Label>
				<LabelButton
					className={'forgotPasswordText'}
					look={'none'}
					variant={'body2'}
					label={'Forgot password'}
					onClick={() => {
						userService.requestPasswordByEmail(signinForm.get('primaryEmail').value as string);
					}}
				/>
				<Box className={'orOption'}>
					<hr />
					<Label variant={'body1'}>Or</Label>
					<hr />
				</Box>
				<Label className={'noAccount'} variant={'body5'} mb={18}>
					No account? Save time on your next booking.
				</Label>
				<LabelButton
					className={'yellow'}
					look={'containedPrimary'}
					onClick={() => {
						popupController.close(SigninPopup);
						popupController.open<SignupPopupProps>(SignupPopup, {
							primaryEmail: signinForm.get('primaryEmail').value as string,
							password: signinForm.get('password').value as string
						});
					}}
					label={'Sign up'}
					variant={'button'}
				/>
			</Paper>
		</Popup>
	);
};

export default SigninPopup;
