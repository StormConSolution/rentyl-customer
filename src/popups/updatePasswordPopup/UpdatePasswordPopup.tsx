import * as React from 'react';
import './UpdatePasswordPopup.scss';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Icon from '@bit/redsky.framework.rs.icon';
import useBodyLock from '../../customHooks/useBodyLock';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { useState } from 'react';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import LabelInput from '../../components/labelInput/LabelInput';
import IconLabel from '../../components/iconLabel/IconLabel';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import LabelButton from '../../components/labelButton/LabelButton';

export interface UpdatePasswordPopupProps extends PopupProps {}

const UpdatePasswordPopup: React.FC<UpdatePasswordPopupProps> = (props) => {
	useBodyLock(props.opened);
	const userService = serviceFactory.get<UserService>('UserService');

	const [uppercaseCheck, setUppercaseCheck] = useState<boolean>(false);
	const [numberCheck, setNumberCheck] = useState<boolean>(false);
	const [passwordResetFormGroup, setPasswordResetFormGroup] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('oldPassword', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Password is required'),
				new RsValidator(RsValidatorEnum.MIN, '', 8)
			]),
			new RsFormControl('newPassword', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Password is required'),
				new RsValidator(RsValidatorEnum.MIN, '', 8)
			]),
			new RsFormControl('confirmPassword', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Password is required'),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Passwords do not match', (control): boolean => {
					return control.value.toString() === passwordResetFormGroup.get('newPassword').value.toString();
				})
			])
		])
	);

	const uppercasePattern = new RegExp('^(?=.*[A-Z])');
	const numberPattern = new RegExp('^(?=.*[0-9])');

	function isPassingAllTests() {
		const newPassword = passwordResetFormGroup.get('newPassword').value.toString();
		const confirmPassword = passwordResetFormGroup.get('confirmPassword').value.toString();

		return (
			passwordResetFormGroup.isValid() &&
			uppercaseCheck &&
			numberCheck &&
			newPassword === confirmPassword &&
			newPassword.length >= 8
		);
	}

	async function handleReset() {
		try {
			const oldPassword = passwordResetFormGroup.get('oldPassword').value.toString();
			const newPassword = passwordResetFormGroup.get('newPassword').value.toString();

			if (!isPassingAllTests()) {
				setPasswordResetFormGroup(passwordResetFormGroup.clone());
				rsToastify.error('Invalid password.', 'Failed Resetting Password');
				return;
			}

			await userService.updatePassword({ old: oldPassword, new: newPassword });
			popupController.close(UpdatePasswordPopup);
			rsToastify.success('Password reset was successful', 'Password Successfully Reset');
		} catch (e) {
			rsToastify.error('Password reset failed. Try again.', 'Failed Resetting Password');
		}
	}

	function updateForm(control: RsFormControl) {
		setPasswordResetFormGroup(passwordResetFormGroup.clone().update(control));
	}

	function updateFormAndVerifyPassword(control: RsFormControl) {
		updateForm(control);
		setUppercaseCheck(uppercasePattern.test(control.value.toString()));
		setNumberCheck(numberPattern.test(control.value.toString()));
	}

	return (
		<Popup opened={props.opened}>
			<div className={'rsUpdatePasswordPopup'}>
				<Icon
					iconImg={'icon-close'}
					onClick={() => {
						popupController.close(UpdatePasswordPopup);
					}}
					size={12}
					className={'closeBtn'}
				/>
				<div className={'popupTitle'}>
					<Label variant={'h5'}>Update Password</Label>
				</div>
				<div className={'popupBody'}>
					<div className={'passwordInput'}>
						<LabelInput
							title={'Current Password'}
							inputType={'password'}
							labelVariant={'h6'}
							control={passwordResetFormGroup.get('oldPassword')}
							updateControl={updateForm}
						/>
					</div>

					<div className={'passwordInput'}>
						<LabelInput
							title={'Create New Password'}
							inputType={'password'}
							labelVariant={'h6'}
							control={passwordResetFormGroup.get('newPassword')}
							updateControl={updateFormAndVerifyPassword}
						/>
					</div>

					<div className={'passwordInput'}>
						<LabelInput
							title={'Confirm New Password'}
							inputType={'password'}
							labelVariant={'h6'}
							control={passwordResetFormGroup.get('confirmPassword')}
							updateControl={updateForm}
						/>
					</div>
					<div>
						<IconLabel
							iconImg={
								passwordResetFormGroup.get('newPassword').value.toString().length >= 8
									? 'icon-solid-check'
									: 'icon-close'
							}
							labelName={'At least 8 characters'}
							iconPosition={'left'}
							labelVariant={'body1'}
							className={
								passwordResetFormGroup.get('newPassword').value.toString().length >= 8
									? 'success'
									: 'failure'
							}
							iconSize={16}
						/>
						<IconLabel
							iconImg={uppercaseCheck ? 'icon-solid-check' : 'icon-close'}
							labelName={'At least 1 uppercase letter'}
							iconPosition={'left'}
							labelVariant={'body1'}
							className={uppercaseCheck ? 'success' : 'failure'}
							iconSize={16}
						/>
						<IconLabel
							iconImg={numberCheck ? 'icon-solid-check' : 'icon-close'}
							labelName={'At least 1 number'}
							iconPosition={'left'}
							labelVariant={'body1'}
							className={numberCheck ? 'success' : 'failure'}
							iconSize={16}
						/>
					</div>

					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Update'}
						className={'yellow'}
						disabled={!isPassingAllTests()}
						onClick={() => handleReset()}
					/>
				</div>
			</div>
		</Popup>
	);
};

export default UpdatePasswordPopup;
