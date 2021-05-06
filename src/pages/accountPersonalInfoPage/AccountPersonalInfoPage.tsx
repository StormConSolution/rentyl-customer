import * as React from 'react';
import './AccountPersonalInfoPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { useEffect, useState } from 'react';
import AccountHeader from '../../components/accountHeader/AccountHeader';
import useLoginState, { LoginStatus } from '../../customHooks/useLoginState';
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
import { formatPhoneNumber } from '../../utils/utils';
import LabelButton from '../../components/labelButton/LabelButton';
import rsToasts from '@bit/redsky.framework.toast';

interface AccountPersonalInfoPageProps {}

const AccountPersonalInfoPage: React.FC<AccountPersonalInfoPageProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [user, setUser] = useState<Api.User.Res.Get>();
	const [updateUser, setUpdateUser] = useState<Api.User.Req.Update>();
	const [accountInfoChanged, setAccountInfoChanged] = useState<boolean>(false);
	const [passwordMatch, setPasswordMatch] = useState<boolean>(false);

	const newPassword: string = '';
	const newRetypedPassword: string = '';

	useEffect(() => {
		let currentUser = userService.getCurrentUser();
		if (currentUser) setUser(currentUser);
	}, []);

	useEffect(() => {
		console.log(user);
	}, [user]);

	function updateUserObj(key: 'firstName' | 'lastName' | 'primaryEmail' | 'phone', value: any) {
		setUpdateUser((prev) => {
			let createAddressObj: any = { ...prev };
			createAddressObj[key] = value;
			return createAddressObj;
		});
	}

	async function saveAccountInfo() {
		if (!user) return;
		let newUpdatedUserObj: any = { ...updateUser };
		newUpdatedUserObj.id = user.id;
		try {
			let response = await userService.update(newUpdatedUserObj);
			if (response.data.data) rsToasts.success('Update Successful!!!');
			setUser(response.data.data);
		} catch (e) {
			rsToasts.error(e.message);
		}
	}

	function updatePassword() {}

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
						<div className={'fakeImg'}>
							<img src={require('../../images/white-spire.png')} />
						</div>
						<Box>
							<Label variant={'caption'}>Bronze Member</Label>
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
								You're 45,835 Points until you reach Silver Member Status, or pay to level up now
							</Label>
							<Label className={'yellow'} variant={'h1'}>
								{user.availablePoints}
							</Label>
							<Label className={'grey'} variant={'h1'}>
								{user.availablePoints}
							</Label>
							<Box className={'loadingBarContainer'}>
								<div className={'loadingBar'} />
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
						<Box className={'pointsExpireContainer'}>
							<Label variant={'caption'}>
								1,342 Points will expire on {DateUtils.displayDate(new Date())}
							</Label>
						</Box>
					</Paper>
				</Box>

				<Box display={'flex'} justifyContent={'center'} marginBottom={'130px'}>
					<Box width={'420px'} margin={'0 20px'}>
						<Label variant={'h2'}>Account Info</Label>
						<LabelInput
							className={'accountNameInput'}
							title={'Name'}
							inputType={'text'}
							onChange={(value) => {
								if (value === `${user?.firstName} ${user?.lastName}`) setAccountInfoChanged(false);
								else setAccountInfoChanged(true);
								let splitValue = value.split(' ');
								updateUserObj('firstName', splitValue[0]);
								updateUserObj('lastName', splitValue[1]);
							}}
							initialValue={`${user.firstName} ${user.lastName}`}
						/>
						<Box display={'flex'} justifyContent={'space-between'}>
							<LabelInput
								title={'Phone'}
								inputType={'tel'}
								onChange={(value) => {
									if (value === user?.phone) setAccountInfoChanged(false);
									else setAccountInfoChanged(true);
									updateUserObj('phone', value);
								}}
								iconImage={'icon-phone'}
								iconSize={18}
								maxLength={10}
								isPhoneInput
								initialValue={formatPhoneNumber(user.phone)}
							/>
							<LabelInput
								title={'Email'}
								inputType={'text'}
								onChange={(value) => {
									if (value === user?.primaryEmail) setAccountInfoChanged(false);
									else setAccountInfoChanged(true);
									updateUserObj('primaryEmail', value);
								}}
								isEmailInput
								iconImage={'icon-mail'}
								iconSize={18}
								initialValue={user.primaryEmail}
							/>
						</Box>
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
							onChange={(value) => {
								console.log('Current Password', value);
							}}
						/>
						<Box display={'flex'} justifyContent={'space-between'}>
							<LabelInput
								title={'New Password'}
								inputType={'password'}
								onChange={(value) => {
									console.log('New Password', value);
								}}
							/>
							<LabelInput
								title={'Retype new password'}
								inputType={'password'}
								onChange={(value) => {
									console.log('Retype new password', value);
								}}
							/>
						</Box>
						<LabelButton
							className={'saveBtn'}
							look={passwordMatch ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Save Changes'}
							disabled={!passwordMatch}
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
