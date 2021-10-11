import * as React from 'react';
import { useEffect, useState } from 'react';
import './AccountPersonalInfoPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import AccountHeader from '../../components/accountHeader/AccountHeader';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LoadingPage from '../loadingPage/LoadingPage';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import LabelInput from '../../components/labelInput/LabelInput';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import UserPointStatusBar from '../../components/userPointStatusBar/UserPointStatusBar';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import Icon from '@bit/redsky.framework.rs.icon';
import router from '../../utils/router';
import { StringUtils, WebUtils } from '../../utils/utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

interface AccountPersonalInfoPageProps {}

const AccountPersonalInfoPage: React.FC<AccountPersonalInfoPageProps> = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [user, setUser] = useRecoilState<Api.User.Res.Detail | undefined>(globalState.user);
	const [accountInfoChanged, setAccountInfoChanged] = useState<boolean>(false);
	const [isPasswordFormValid, setIsPasswordFormValid] = useState<boolean>(false);
	const [isUserFormValid, setIsUserFormValid] = useState<boolean>(false);
	const [hasEnoughCharacters, setHasEnoughCharacters] = useState<boolean>(false);
	const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
	const [hasSpecialCharacter, setHasSpecialCharacter] = useState<boolean>(false);
	const [updateUserForm, setUpdateUserForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('firstName', user?.firstName || '', [
				new RsValidator(RsValidatorEnum.MIN, 'Enter a First Name', 1)
			]),
			new RsFormControl('lastName', user?.lastName || '', [
				new RsValidator(RsValidatorEnum.MIN, 'Enter a Last Name', 1)
			]),
			new RsFormControl('phone', user?.phone || '', [
				new RsValidator(RsValidatorEnum.REQ, 'Enter a valid phone number'),
				new RsValidator(RsValidatorEnum.MIN, 'Enter a valid phone number', 4)
			])
		])
	);

	const [newPasswordForm, setNewPasswordForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('old', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Please provide your current password here')
			]),
			new RsFormControl('new', '', [
				new RsValidator(RsValidatorEnum.CUSTOM, '', (control) => {
					return /(?=(.*[0-9])+|(.*[ !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])+)(?=(.*[a-z])+)(?=(.*[A-Z])+)[0-9a-zA-Z !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]{8,}/g.test(
						control.value.toString()
					);
				}),
				new RsValidator(RsValidatorEnum.REQ, 'Please provide a new password')
			]),
			new RsFormControl('retypeNewPassword', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Please retype your new password'),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Password does not match', (control) => {
					let newPassword: any = newPasswordForm.get('new').value.toString();
					return control.value === newPassword;
				})
			])
		])
	);

	useEffect(() => {
		async function validateForm() {
			setAccountInfoChanged(updateUserForm.isModified());
			let isValid = await updateUserForm.isValid();
			setIsUserFormValid(isValid);
		}
		validateForm().catch(console.error);
	}, [updateUserForm]);

	useEffect(() => {
		if (!user) router.navigate('/signup').catch(console.error);
	}, [user]);

	async function updateUserObjForm(control: RsFormControl) {
		setUpdateUserForm(updateUserForm.clone().update(control));
	}

	async function checkIsFormValid(): Promise<boolean> {
		let formIsValid = await newPasswordForm.isValid();
		setNewPasswordForm(newPasswordForm.clone());
		setIsPasswordFormValid(formIsValid);
		return formIsValid;
	}

	async function updateUserPasswordForm(control: RsFormControl) {
		if (control.key === 'new') {
			const password = control.value.toString();
			//check for 8 minimum characters
			setHasEnoughCharacters(password.length >= 8);
			//check for at least 1 capital
			const upperCheck = new RegExp(/[A-Z]/g);
			setHasUpperCase(upperCheck.test(password));
			//check for a number or special character
			const specialCharacter = new RegExp(/[0-9!\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]/g);
			setHasSpecialCharacter(specialCharacter.test(password));
		}
		setNewPasswordForm(newPasswordForm.clone().update(control));
		checkIsFormValid().catch(console.error);
	}

	async function saveAccountInfo() {
		if (!isUserFormValid) {
			rsToastify.error('Missing some information. Make sure everything is filled out', 'Missing Information');
			return;
		}
		if (!user) return;
		let newUpdatedUserObj: any = updateUserForm.toModel();
		newUpdatedUserObj.id = user.id;
		try {
			let response = await userService.update(newUpdatedUserObj);
			rsToastify.success('Account information successfully updated. ', 'Update Successful!');
			setUser(response);
		} catch (e) {
			rsToastify.error(WebUtils.getRsErrorMessage(e, 'Update failed, try again'), 'Server Error');
		}
	}

	async function updatePassword() {
		if (!(await checkIsFormValid())) {
			rsToastify.error('Missing or incorrect information submitted for password change.', 'Missing Information!');
			return;
		}
		if (!user) return;
		let newPassword: any = newPasswordForm.toModel();
		delete newPassword.retypeNewPassword;
		try {
			let response = await userService.updatePassword(newPassword);
			if (response) rsToastify.success('Password successfully updated.', 'Password Updated!');
			newPasswordForm.resetToInitialValue();
		} catch (e) {
			rsToastify.error(WebUtils.getRsErrorMessage(e, 'Failed to update password'), 'Server Error');
		}
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountPersonalInfoPage'}>
			<div className={'rs-page-content-wrapper'}>
				<AccountHeader selected={'PERSONAL_INFO'} />
				<Box className={'personalInfoHeader'}>
					<Label variant={'h1'}>
						Welcome, {user.firstName} {user.lastName}
					</Label>
					<Box display={'flex'} alignItems={'center'}>
						{user.tierBadge ? (
							<img src={user.tierBadge} alt={'Tier Badge'} />
						) : (
							<div className={'fakeImg'}>
								<img src={require('../../images/white-spire.png')} alt={'white spire'} />
							</div>
						)}
						<Box>
							<Label variant={'caption'}>{user.tierTitle}</Label>
							<Label variant={'body1'}>Account #{user.id}</Label>
						</Box>
					</Box>
					<UserPointStatusBar />
				</Box>

				<Box className={'editSection'}>
					<Box>
						<Label variant={'h2'}>Account Info</Label>
						<LabelInput
							title={'First Name'}
							inputType={'text'}
							control={updateUserForm.get('firstName')}
							updateControl={updateUserObjForm}
						/>
						<LabelInput
							title={'Last Name'}
							inputType={'text'}
							control={updateUserForm.get('lastName')}
							updateControl={updateUserObjForm}
						/>
						<LabelInput
							inputType={'tel'}
							title={'Phone'}
							isPhoneInput
							onChange={(value) => {
								let updatedPhone = updateUserForm.get('phone');
								updatedPhone.value = value;
								setUpdateUserForm(updateUserForm.clone().update(updatedPhone));
							}}
							initialValue={updateUserForm.get('phone').value.toString()}
						/>
						<LabelButton
							className={'saveBtn'}
							look={accountInfoChanged && isUserFormValid ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Save Changes'}
							disabled={!isUserFormValid}
							onClick={saveAccountInfo}
						/>
					</Box>
					<Box>
						<Label variant={'h2'}>Update Password</Label>
						<LabelInput
							className={'accountNameInput'}
							title={'Current Password'}
							inputType={'password'}
							control={newPasswordForm.get('old')}
							updateControl={updateUserPasswordForm}
						/>
						<LabelInput
							title={'New Password'}
							inputType={'password'}
							control={newPasswordForm.get('new')}
							updateControl={updateUserPasswordForm}
							labelVariant={'caption'}
						/>

						<LabelInput
							title={'Retype new password'}
							inputType={'password'}
							control={newPasswordForm.get('retypeNewPassword')}
							updateControl={updateUserPasswordForm}
							labelVariant={'caption'}
						/>
						{newPasswordForm.isModified() && (
							<>
								<Box display={'flex'} className={'passwordCheck'}>
									<Icon
										iconImg={!hasEnoughCharacters ? 'icon-solid-plus' : 'icon-solid-check'}
										color={!hasEnoughCharacters ? 'red' : 'green'}
									/>
									<Label variant={'caption'} color={!hasEnoughCharacters ? 'red' : 'green'}>
										At least 8 characters{' '}
									</Label>
								</Box>
								<Box display={'flex'} className={'passwordCheck'}>
									<Icon
										iconImg={!hasUpperCase ? 'icon-solid-plus' : 'icon-solid-check'}
										color={!hasUpperCase ? 'red' : 'green'}
									/>
									<Label variant={'caption'} color={!hasUpperCase ? 'red' : 'green'}>
										1 uppercase
									</Label>
								</Box>
								<Box display={'flex'} className={'passwordCheck'}>
									<Icon
										iconImg={!hasSpecialCharacter ? 'icon-solid-plus' : 'icon-solid-check'}
										color={!hasSpecialCharacter ? 'red' : 'green'}
									/>
									<Label variant={'caption'} color={!hasSpecialCharacter ? 'red' : 'green'}>
										1 number or special character
									</Label>
								</Box>
							</>
						)}
						<LabelButton
							key={2}
							className={'saveBtn'}
							look={isPasswordFormValid ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Save Changes'}
							onClick={() => {
								updatePassword();
							}}
						/>
					</Box>
					<Box>
						<Label variant={'h2'}>Notification Preferences</Label>
						<LabelCheckbox
							value={''}
							isChecked={!!user.allowEmailNotification}
							text={'I want to receive e-mails with the latest promotions, offers, and Spire updates'}
							onSelect={() => {
								userService.update({ id: user?.id, allowEmailNotification: 1 }).catch(console.error);
							}}
							onDeselect={() => {
								userService.update({ id: user?.id, allowEmailNotification: 0 }).catch(console.error);
							}}
						/>
					</Box>
				</Box>

				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default AccountPersonalInfoPage;
