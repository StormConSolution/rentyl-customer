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
import { WebUtils } from '../../utils/utils';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import SigninPopup, { SigninPopupProps } from '../signin/SigninPopup';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import SpinningLoaderPopup, { SpinningLoaderPopupProps } from '../spinningLoaderPopup/SpinningLoaderPopup';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

export interface SignupPopupProps extends PopupProps {
	primaryEmail?: string;
	password?: string;
}

const SignupPopup: React.FC<SignupPopupProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const size = useWindowResizeChange();
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
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
		if (errorMessage !== '') {
			setErrorMessage('');
		}
	}

	async function signup() {
		if (!(await signUpForm.isValid())) {
			setSignUpForm(signUpForm.clone());
			setErrorMessage('Missing information');
			return;
		}
		try {
			popupController.open<SpinningLoaderPopupProps>(SpinningLoaderPopup, {});
			const userToCreate: Api.Customer.Req.Create = {
				name: `${signUpForm.get('firstName').value} ${signUpForm.get('lastName').value}`,
				password: signUpForm.get('password').value as string,
				primaryEmail: signUpForm.get('primaryEmail').value as string
			};
			await userService.createNewCustomer(userToCreate);
			rsToastify.success('Account created successfully', 'Success!');
			popupController.close(SignupPopup);
			popupController.close(SpinningLoaderPopup);
			popupController.open<SigninPopupProps>(SigninPopup, {});
		} catch (e) {
			setErrorMessage(WebUtils.getRsErrorMessage(e, 'Unexpected Server error'));
		}
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper className={'rsSignupPopup'} position={'relative'}>
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
				<Box
					display={'flex'}
					flexDirection={size === 'small' ? 'column' : 'row'}
					gap={size === 'small' ? 0 : 36}
				>
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
				</Box>
				<LabelInput
					title={'Email Address'}
					inputType={'email'}
					control={signUpForm.get('primaryEmail')}
					updateControl={updateForm}
				/>
				<Box
					display={'flex'}
					flexDirection={size === 'small' ? 'column' : 'row'}
					gap={size === 'small' ? 0 : 36}
				>
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
				</Box>
				<LabelCheckbox
					value={1}
					text={
						<>
							I agree to the{' '}
							<Link path={`/legal/terms-and-conditions`} external target={'blank'}>
								<span>terms and conditions</span>.
							</Link>
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
				<Button
					look={hasAgreedToTerms ? 'containedPrimary' : 'containedTertiary'}
					disabled={!hasAgreedToTerms}
					onClick={signup}
				>
					Sign up
				</Button>
				<Label variant={'body2'} color={'red'}>
					{errorMessage}
				</Label>
				<hr />
				<Label variant={'body2'}>
					Already a member?{' '}
					<Button
						look={'none'}
						onClick={() => {
							popupController.close(SignupPopup);
							popupController.open<SigninPopupProps>(SignupPopup, {});
						}}
					>
						login
					</Button>{' '}
					here
				</Label>
			</Paper>
		</Popup>
	);
};

export default SignupPopup;
