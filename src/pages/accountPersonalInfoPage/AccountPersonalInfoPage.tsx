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
import Paper from '../../components/paper/Paper';
import LabelLink from '../../components/labelLink/LabelLink';
import { DateUtils } from '@bit/redsky.framework.rs.utils';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import LabelInput from '../../components/labelInput/LabelInput';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import {
	addCommasToNumber,
	formatPhoneNumber,
	removeAllExceptNumbers,
	removeExtraSpacesReturnsTabs
} from '../../utils/utils';
import LabelButton from '../../components/labelButton/LabelButton';
import rsToasts from '@bit/redsky.framework.toast';
import { useRecoilState } from 'recoil';
import globalState from '../../models/globalState';

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
			new RsFormControl('new', '', [new RsValidator(RsValidatorEnum.REQ, 'Please provide a new password')]),
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

	function renderLoadingBarPercent(): string {
		if (!user) return '';
		return `${Math.floor(user.lifeTimePoints / (user.nextTierThreshold / 100))}%`;
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
					<Paper
						className={'rewardPointsContainer'}
						boxShadow
						padding={'34px 60px 30px 30px'}
						width={'1042px'}
						height={'190px'}
						position={'absolute'}
					>
						<Box display={'grid'}>
							<Label variant={'h4'}>Points Earned</Label>
							<Label variant={'h4'}>Points Pending</Label>
							<Label variant={'body1'}>
								You're {user.nextTierThreshold - user.lifeTimePoints} Points until you reach{' '}
								<b>{user.nextTierTitle}</b> Status, or pay to level up now
							</Label>
							<Label className={'yellow'} variant={'h1'}>
								{addCommasToNumber(user.availablePoints)}
							</Label>
							<Label className={'grey'} variant={'h1'}>
								{addCommasToNumber(user.pendingPoints)}
							</Label>
							<Box className={'loadingBarContainer'}>
								<div className={'loadingBar'} style={{ width: renderLoadingBarPercent() }} />
							</Box>
							<LabelLink
								path={'/'}
								label={'Redeem Points'}
								variant={'caption'}
								iconRight={'icon-chevron-right'}
								iconSize={7}
							/>
							<LabelLink
								path={'/'}
								label={'Manage Points'}
								variant={'caption'}
								iconRight={'icon-chevron-right'}
								iconSize={7}
							/>
							<LabelLink
								path={'/'}
								label={'See Loyalty Tiers'}
								variant={'caption'}
								iconRight={'icon-chevron-right'}
								iconSize={7}
							/>
						</Box>
						{!!user.pointsExpiring && (
							<Box className={'pointsExpireContainer'}>
								<Label variant={'caption'}>
									{user.pointsExpiring || 0} Points will expire on{' '}
									{DateUtils.displayDate(user.pointsExpiringOn || new Date())}
								</Label>
							</Box>
						)}
					</Paper>
				</Box>

				<Box display={'flex'} justifyContent={'center'} marginBottom={'130px'}>
					<Box width={'420px'} margin={'0 20px'}>
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
					<Box width={'420px'} margin={'0 20px'}>
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
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default AccountPersonalInfoPage;
