import * as React from 'react';
import { useState } from 'react';
import './SignupPopup.scss';
import { Box, Link, Popup, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import LabelInput from '../../components/labelInput/LabelInput';
import Button from '@bit/redsky.framework.rs.button';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';

export interface SignupPopupProps extends PopupProps {
	primaryEmail?: string;
	password?: string;
}

const SignupPopup: React.FC<SignupPopupProps> = (props) => {
	const [spireSignup, setSpireSignup] = useState<boolean>(false);
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [signUpForm, setSignUpForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('firstName', '', [new RsValidator(RsValidatorEnum.REQ, 'First name is required')]),
			new RsFormControl('lastName', '', [new RsValidator(RsValidatorEnum.REQ, 'Last name is required')]),
			new RsFormControl('primaryEmail', props.primaryEmail || '', [
				new RsValidator(RsValidatorEnum.REQ, 'Email Required'),
				new RsValidator(RsValidatorEnum.EMAIL, 'Invalid email')
			]),
			new RsFormControl('password', props.password || '', [
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

	function updateForm(control: RsFormControl) {
		setSignUpForm(signUpForm.clone().update(control));
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper className={'rsSignupPopup'} width={'420px'} position={'relative'}>
				<Icon
					iconImg={'icon-close'}
					onClick={() => {
						popupController.close(SignupPopup);
					}}
					size={14}
					cursorPointer
				/>
				<Label variant={'body1'}>Sign up</Label>
				<hr className={'linethrough'} />
				<LabelInput
					title={'First name'}
					inputType={'text'}
					control={signUpForm.get('firstName')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Last name'}
					inputType={'text'}
					control={signUpForm.get('lastName')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Email Address'}
					inputType={'email'}
					control={signUpForm.get('primaryEmail')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Create new password'}
					inputType={'password'}
					control={signUpForm.get('password')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Confirm new password'}
					inputType={'password'}
					control={signUpForm.get('confirmPassword')}
					updateControl={updateForm}
				/>
				<LabelCheckbox
					value={1}
					text={<>Sign me up for Spire Loyalty by Rentyl Rewards. I confirm I am at least 18 years old.</>}
					onSelect={() => {
						setSpireSignup(true);
					}}
					onDeselect={() => {
						setSpireSignup(false);
					}}
					lineClamp={3}
					isChecked={spireSignup}
				/>
				<LabelCheckbox
					value={1}
					text={
						<>
							I agree to the{' '}
							<Link path={`/legal/terms-and-conditions`} external target={'blank'}>
								<span>terms and conditions</span>.
							</Link>
							.
						</>
					}
					onSelect={() => {
						setHasAgreedToTerms(true);
					}}
					onDeselect={() => {
						setHasAgreedToTerms(false);
					}}
					isChecked={hasAgreedToTerms}
				/>
				<Button look={'containedPrimary'}>Sign up</Button>
			</Paper>
		</Popup>
	);
};

export default SignupPopup;
