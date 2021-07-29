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
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import LabelInput from '../../components/labelInput/LabelInput';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { removeExtraSpacesReturnsTabs } from '../../utils/utils';
import LabelButton from '../../components/labelButton/LabelButton';
import rsToasts from '@bit/redsky.framework.toast';
import { useRecoilState } from 'recoil';
import globalState from '../../models/globalState';
import UserPointStatusBar from '../../components/userPointStatusBar/UserPointStatusBar';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';

interface AccountPersonalInfoPageProps {}

let phoneNumber = '';

const AccountPersonalInfoPage: React.FC<AccountPersonalInfoPageProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [user, setUser] = useRecoilState<Api.User.Res.Detail | undefined>(globalState.user);
	const [accountInfoChanged, setAccountInfoChanged] = useState<boolean>(false);
	const [passwordFormValid, setPasswordFormValid] = useState<boolean>(false);
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
				new RsValidator(
					RsValidatorEnum.CUSTOM,
					'Password must have: Minimum 8 characters, 1 Uppercase letter, 1 Lowercase letter, 1 Number or 1 Special character',
					(control) => {
						return /(?=(.*[0-9])+|(.*[ !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])+)(?=(.*[a-z])+)(?=(.*[A-Z])+)[0-9a-zA-Z !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]{8,}/g.test(
							control.value.toString()
						);
					}
				),
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
		if (!user) return;
		phoneNumber = user.phone;
	}, [user]);

	function isAccountFormFilledOut(): boolean {
		return !!updateUserObj.get('fullName').value.toString().length && !!phoneNumber.length;
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
			let newValue = removeExtraSpacesReturnsTabs(control.value.toString());
			control.value = newValue;
		}
		updateUserObj.update(control);
		let isFormValid = await updateUserObj.isValid();
		setAccountInfoChanged(isAccountFormFilledOut() && isFormValid);
		setUpdateUserObj(updateUserObj.clone());
	}

	async function updateUserPasswordForm(control: RsFormControl) {
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
			if (response.data.data) {
				rsToasts.success('Update Successful!!!');
				setUser(response.data.data);
			}
		} catch (e) {
			rsToasts.error(e.message);
		}
	}

	async function updatePassword() {
		if (!user) return;
		let newPasswordForm: any = updateUserPassword.toModel();
		delete newPasswordForm.retypeNewPassword;
		setPasswordFormValid(false);
		try {
			let response = await userService.updatePassword(newPasswordForm);
			if (response.data.data) rsToasts.success('Password Updated!');
		} catch (e) {
			rsToasts.error(e.message);
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
								<img src={require('../../images/white-spire.png')} />
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
						<Box display={'flex'} justifyContent={'space-between'}>
							<LabelInput
								title={'New Password'}
								inputType={'password'}
								control={updateUserPassword.get('new')}
								updateControl={updateUserPasswordForm}
							/>
							<LabelInput
								title={'Retype new password'}
								inputType={'password'}
								control={updateUserPassword.get('retypeNewPassword')}
								updateControl={updateUserPasswordForm}
							/>
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
							isChecked={true}
							text={'I want to receive e-mails with the latest promotions, offers, and Spire updates'}
							onSelect={() => {
								// Waiting for backend
								console.log('Selected');
							}}
							onDeselect={() => {
								// Waiting for backend
								console.log('De-selected');
							}}
						/>
					</Box>
				</Box>

				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default AccountPersonalInfoPage;
