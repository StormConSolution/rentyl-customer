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

let phoneNumber = '';

const AccountPersonalInfoPage: React.FC<AccountPersonalInfoPageProps> = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [user, setUser] = useRecoilState<Api.User.Res.Detail | undefined>(globalState.user);
	const [accountInfoChanged, setAccountInfoChanged] = useState<boolean>(false);
	const [passwordFormValid, setPasswordFormValid] = useState<boolean>(false);
	const [hasEnoughCharacters, setHasEnoughCharacters] = useState<boolean>(false);
	const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
	const [hasSpecialCharacter, setHasSpecialCharacter] = useState<boolean>(false);
	const [updateUserObj, setUpdateUserObj] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('fullName', user?.firstName + ' ' + user?.lastName || '', [
				new RsValidator(RsValidatorEnum.REQ, 'Full name is required')
			])
		])
	);

	const [updateUserPassword, setUpdateUserPassword] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('old', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Please provide your current password here')
			]),
			new RsFormControl('new', '', [
				new RsValidator(RsValidatorEnum.CUSTOM, '', (control) => {
					return StringUtils.validateEmail(control.value.toString());
				}),
				new RsValidator(RsValidatorEnum.REQ, 'Please provide a new password')
			]),
			new RsFormControl('retypeNewPassword', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Please retype your new password'),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Password does not match', (control) => {
					let newPassword: any = updateUserPassword.get('new').value.toString();
					return control.value === newPassword;
				})
			])
		])
	);

	useEffect(() => {
		if (!user) router.navigate('/signup').catch(console.error);
		else phoneNumber = user.phone;
	}, [user]);

	function isAccountFormFilledOut(): boolean {
		return !!updateUserObj.get('fullName').value.toString().length && phoneNumber.length > 4;
	}

	function isPasswordFormFilledOut(): boolean {
		return (
			!!updateUserPassword.get('old').value.toString().length &&
			!!updateUserPassword.get('new').value.toString().length &&
			!!updateUserPassword.get('retypeNewPassword').value.toString().length
		);
	}

	async function updateUserObjForm(control: RsFormControl) {
		if (control.key === 'fullName') {
			control.value = StringUtils.removeLineEndings(control.value.toString());
		}
		updateUserObj.update(control);
		let isFormValid = await updateUserObj.isValid();
		setAccountInfoChanged(isAccountFormFilledOut() && isFormValid);
		setUpdateUserObj(updateUserObj.clone());
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
		updateUserPassword.update(control);
		let isFormValid = await updateUserPassword.isValid();
		setPasswordFormValid(isPasswordFormFilledOut() && isFormValid);
		setUpdateUserPassword(updateUserPassword.clone());
	}

	async function saveAccountInfo() {
		if (!user) return;
		let newUpdatedUserObj: any = updateUserObj.toModel();
		let splitName = newUpdatedUserObj.fullName.split(' ');
		newUpdatedUserObj.firstName = splitName[0];
		newUpdatedUserObj.lastName = splitName[1];
		newUpdatedUserObj.phone = phoneNumber;
		newUpdatedUserObj.id = user.id;
		delete newUpdatedUserObj.fullName;

		try {
			let response = await userService.update(newUpdatedUserObj);
			rsToastify.success('Account information successfully updated. ', 'Update Successful!');
			setUser(response);
		} catch (e) {
			rsToastify.error(WebUtils.getRsErrorMessage(e, 'Update failed, try again'), 'Server Error');
		}
	}

	async function updatePassword() {
		if (!user) return;
		let newPasswordForm: any = updateUserPassword.toModel();
		delete newPasswordForm.retypeNewPassword;
		setPasswordFormValid(false);
		try {
			let response = await userService.updatePassword(newPasswordForm);
			if (response) rsToastify.success('Password successfully updated.', 'Password Updated!');
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
							title={'Name'}
							inputType={'text'}
							control={updateUserObj.get('fullName')}
							updateControl={updateUserObjForm}
						/>
						<LabelInput
							inputType={'tel'}
							title={'Phone'}
							isPhoneInput
							onChange={async (value) => {
								phoneNumber = value;
								let isFormValid = await updateUserObj.isValid();
								setAccountInfoChanged(isAccountFormFilledOut() && isFormValid);
							}}
							initialValue={user?.phone}
						/>
						<LabelButton
							className={'saveBtn'}
							look={accountInfoChanged ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Save Changes'}
							disabled={!accountInfoChanged}
							onClick={() => {
								saveAccountInfo();
							}}
						/>
					</Box>
					<Box>
						<Label variant={'h2'}>Update Password</Label>
						<LabelInput
							className={'accountNameInput'}
							title={'Current Password'}
							inputType={'password'}
							control={updateUserPassword.get('old')}
							updateControl={updateUserPasswordForm}
						/>
						<Box display={'grid'} className={'passwordCheck'}>
							<LabelInput
								title={'New Password'}
								inputType={'password'}
								control={updateUserPassword.get('new')}
								updateControl={updateUserPasswordForm}
								labelVariant={'caption'}
							/>

							<LabelInput
								title={'Retype new password'}
								inputType={'password'}
								control={updateUserPassword.get('retypeNewPassword')}
								updateControl={updateUserPasswordForm}
								labelVariant={'caption'}
							/>
						</Box>
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
						<LabelButton
							key={2}
							className={'saveBtn'}
							look={passwordFormValid ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Save Changes'}
							disabled={!passwordFormValid}
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
