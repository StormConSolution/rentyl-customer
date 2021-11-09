import * as React from 'react';
import './SigninPopup.scss';
import { useState } from 'react';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import LabelInput from '../../components/labelInput/LabelInput';
import Button from '@bit/redsky.framework.rs.button';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import SignupPopup from '../signup/SignupPopup';
import { useSetRecoilState } from 'recoil';
import globalState from '../../state/globalState';

export interface SigninPopupProps extends PopupProps {}

const SigninPopup: React.FC<SigninPopupProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [failedSignin, setFailedSignin] = useState<boolean>(false);
	const [signinForm, setSigninForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('email', '', [
				new RsValidator(RsValidatorEnum.EMAIL, 'Please enter a valid email address')
			]),
			new RsFormControl('password', '', [new RsValidator(RsValidatorEnum.REQ, 'Please enter a password')])
		])
	);

	function updateForm(control: RsFormControl) {
		setSigninForm(signinForm.clone().update(control));
	}

	async function signin() {
		if (!(await signinForm.isValid())) {
			setSigninForm(signinForm.clone());
			return;
		}
		const { email, password } = signinForm.toModel<{ email: string; password: string }>();
		try {
			await userService.loginUserByPassword(email, password);
		} catch (e) {
			setFailedSignin(true);
		}
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper className={'rsSigninPopup'} width={'420px'} position={'relative'}>
				<Icon
					iconImg={'icon-close'}
					onClick={() => {
						popupController.close(SigninPopup);
					}}
					size={14}
					cursorPointer
				/>
				<Label variant={'body1'}>Sign in / Sign up</Label>
				<hr className={'linethrough'} />
				<LabelInput
					title={'Email Address'}
					inputType={'email'}
					control={signinForm.get('email')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Password'}
					inputType={'password'}
					control={signinForm.get('password')}
					updateControl={updateForm}
				/>
				<Button look={'containedPrimary'} onClick={signin}>
					Sign in
				</Button>
				<Box className={'orOption'}>
					<hr />
					<Label variant={'body1'}>Or</Label>
					<hr />
				</Box>
				<Label variant={'body2'} mb={18}>
					No account? Save time on your next booking
				</Label>
				<Button
					look={'containedPrimary'}
					onClick={() => {
						popupController.close(SigninPopup);
						popupController.open(SignupPopup);
					}}
				>
					Sign up
				</Button>
			</Paper>
		</Popup>
	);
};

export default SigninPopup;
