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

export interface SigninPopupProps extends PopupProps {}

const SigninPopup: React.FC<SigninPopupProps> = (props) => {
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
				<Label variant={'h2'}>Sign in / Sign up</Label>
				<hr />
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
				<Button look={'containedPrimary'}>Sign in</Button>
				<Box className={'orOption'}>
					<hr />
					<Label variant={'body1'}>Or</Label>
					<hr />
				</Box>
				<Label variant={'body1'}>No account? Save time on your next booking.</Label>
				<Button look={'containedPrimary'} onClick={() => {}}>
					Sign up
				</Button>
			</Paper>
		</Popup>
	);
};

export default SigninPopup;
