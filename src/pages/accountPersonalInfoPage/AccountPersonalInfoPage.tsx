import * as React from 'react';
import { useEffect, useState } from 'react';
import './AccountPersonalInfoPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LoadingPage from '../loadingPage/LoadingPage';
import LabelInput from '../../components/labelInput/LabelInput';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import router from '../../utils/router';
import { WebUtils } from '../../utils/utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Paper from '../../components/paper/Paper';
import SubNavMenu from '../../components/subNavMenu/SubNavMenu';
import LabelLink from '../../components/labelLink/LabelLink';

interface AccountPersonalInfoPageProps {}

const AccountPersonalInfoPage: React.FC<AccountPersonalInfoPageProps> = () => {
	const size = useWindowResizeChange();
	const userService = serviceFactory.get<UserService>('UserService');
	const [user, setUser] = useRecoilState<Api.User.Res.Detail | undefined>(globalState.user);
	const [accountInfoChanged, setAccountInfoChanged] = useState<boolean>(false);
	const [isUserFormValid, setIsUserFormValid] = useState<boolean>(false);
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

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountPersonalInfoPage'}>
			<SubNavMenu title={'Personal Information'} />
			<div className={'rs-page-content-wrapper'}>
				<Paper borderRadius={'20px'} boxShadow>
					<Label variant={'customEleven'} mb={size === 'small' ? 25 : 50}>
						Account Info
					</Label>
					<Label variant={size === 'small' ? 'customSixteen' : 'body5'} mb={9}>
						Email Address
					</Label>
					<Box className={'fakeEmailInput'}>
						<Label>{user.primaryEmail}</Label>
					</Box>
					<Label variant={'customFourteen'} mb={26}>
						Please contact support to update your email.
					</Label>
					<Box
						display={'flex'}
						justifyContent={'space-between'}
						mb={size === 'small' ? 0 : 26}
						flexDirection={size === 'small' ? 'column' : ''}
					>
						<LabelInput
							labelVariant={size === 'small' ? 'customSixteen' : 'body5'}
							title={'First Name'}
							inputType={'text'}
							control={updateUserForm.get('firstName')}
							updateControl={updateUserObjForm}
						/>
						<LabelInput
							labelVariant={size === 'small' ? 'customSixteen' : 'body5'}
							title={'Last Name'}
							inputType={'text'}
							control={updateUserForm.get('lastName')}
							updateControl={updateUserObjForm}
						/>
					</Box>

					<LabelInput
						className={'phoneInput'}
						labelVariant={size === 'small' ? 'customSixteen' : 'body5'}
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
					<LabelLink path={'/'} label={'Update my password'} variant={'customThirteen'} />
					<LabelButton
						className={'saveBtn'}
						look={'containedPrimary'}
						variant={'customTwelve'}
						label={'Save'}
						disabled={!isUserFormValid}
						onClick={saveAccountInfo}
					/>
				</Paper>
			</div>
		</Page>
	);
};

export default AccountPersonalInfoPage;
