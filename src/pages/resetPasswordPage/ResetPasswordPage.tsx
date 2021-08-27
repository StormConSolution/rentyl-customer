import React, { useEffect, useState } from 'react';
import { Page } from '@bit/redsky.framework.rs.996';
import './ResetPasswordPage.scss';
import Label from '@bit/redsky.framework.rs.label';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import router from '../../utils/router';
import UserService from '../../services/user/user.service';
import serviceFactory from '../../services/serviceFactory';
import { HttpStatusCode } from '../../utils/http';
import { axiosErrorHandler } from '../../utils/errorHandler';
import HeroImage from '../../components/heroImage/HeroImage';
import Paper from '../../components/paper/Paper';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import LabelLink from '../../components/labelLink/LabelLink';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';

const ResetPasswordPage: React.FC = () => {
	let userService = serviceFactory.get<UserService>('UserService');
	let size = useWindowResizeChange();
	const [guidResponse, setGuidResponse] = useState<boolean>(false);
	const [guid, setGuid] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const params: any = router.getPageUrlParams([{ key: 'guid', default: '', type: 'string', alias: 'guid' }]);

	const [passwordForm, setPasswordForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('password', '', [
				new RsValidator(
					RsValidatorEnum.CUSTOM,
					'Password must have: Minimum 8 characters, 1 Uppercase letter, 1 Lowercase letter, 1 Number or 1 Special character',
					(control) => {
						return /(?=(.*[0-9])+|(.*[ !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])+)(?=(.*[a-z])+)(?=(.*[A-Z])+)[0-9a-zA-Z !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]{8,}/g.test(
							control.value.toString()
						);
					}
				)
			]),
			new RsFormControl('verifyPassword', '', [
				new RsValidator(
					RsValidatorEnum.CUSTOM,
					'Password must have: Minimum 8 characters, 1 Uppercase letter, 1 Lowercase letter, 1 Number or 1 Special character',
					(control) => {
						return /(?=(.*[0-9])+|(.*[ !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])+)(?=(.*[a-z])+)(?=(.*[A-Z])+)[0-9a-zA-Z !\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]{8,}/g.test(
							control.value.toString()
						);
					}
				)
			])
		])
	);

	useEffect(() => {
		async function verifyGuid() {
			try {
				setErrorMessage('');
				let res = await userService.guidValidation(`${params.guid}`);
				setGuid(params.guid);
				setGuidResponse(!!res as boolean);
			} catch (e) {
				setErrorMessage(
					'The 24 hour time has elapsed. The reset password link is no longer valid. Please try again.'
				);
				axiosErrorHandler(e, {
					[HttpStatusCode.NOT_FOUND]: () => {
						setErrorMessage('The 24 hour time has elapsed. The link is no longer valid. Please try again.');
					},
					[HttpStatusCode.BAD_REQUEST]: () => {
						setErrorMessage('The 24 hour time has elapsed. The link is no longer valid. Please try again.');
					}
				});
			}
		}
		verifyGuid().catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function resetPasswordRequest() {
		if (!(await passwordForm.isValid())) {
			setPasswordForm(passwordForm.clone());
			return;
		}
		const password = passwordForm.get('password').value.toString();
		const verifyPassword = passwordForm.get('verifyPassword').value;
		if (password !== verifyPassword) {
			setErrorMessage('passwords do not match.');
			return;
		}
		try {
			await userService.resetPasswordByGuid(guid, password);
			await router.navigate('/signin');
		} catch (e) {
			axiosErrorHandler(e, {
				[HttpStatusCode.NOT_FOUND]: () => {
					setErrorMessage(
						'The 24 hour time has elapsed. The reset password link is no longer valid. Please try again.'
					);
				},
				[HttpStatusCode.BAD_REQUEST]: () => {
					setErrorMessage(
						'The 24 hour time has elapsed. The password link is no longer valid. Please try again.'
					);
				}
			});
		}
	}

	function renderPasswordResetForm() {
		if (!guidResponse) return <></>;
		return (
			<>
				<LabelInput
					title={'Password *'}
					inputType={'password'}
					control={passwordForm.get('password')}
					updateControl={(updateControl) => passwordForm.update(updateControl)}
				/>
				<LabelInput
					title={'Verify Password *'}
					inputType={'password'}
					control={passwordForm.get('verifyPassword')}
					updateControl={(updateControl) => passwordForm.update(updateControl)}
				/>
				<LabelButton
					className="resetButton"
					look={'containedPrimary'}
					variant="caption"
					label="Reset Password"
					onClick={() => resetPasswordRequest()}
				/>
			</>
		);
	}

	return (
		<Page className="rsResetPasswordPage">
			<HeroImage
				image={require('../../images/signInPage/signIn-background.png')}
				height={'clamp(620px, 680px, 880px'}
				mobileHeight={'clamp(620px, 680px, 880px'}
			>
				<div className="container" data-aos="fade-up">
					<Paper
						className={'passwordPaper'}
						backgroundColor={'#FCFBF8'}
						position={'relative'}
						padding={size === 'small' ? '30px 20px' : '50px 85px'}
					>
						<Label className={'resetPasswordTitle'} variant={'h3'}>
							Reset Password Center
						</Label>
						{renderPasswordResetForm()}
						{!!errorMessage.length && (
							<Label className="errorText" variant={'body1'}>
								{errorMessage}
							</Label>
						)}
						<LabelLink
							className={'signInLink'}
							path={'/signin'}
							label={'Sign In Page'}
							variant={'caption'}
						/>
					</Paper>
				</div>
			</HeroImage>
			<Footer links={FooterLinkTestData} />
		</Page>
	);
};

export default ResetPasswordPage;
