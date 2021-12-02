import * as React from 'react';
import './NavDrawer.scss';
import { useEffect, useRef } from 'react';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import LabelLink from '../../components/labelLink/LabelLink';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import SigninPopup, { SigninPopupProps } from '../signin/SigninPopup';
import SignupPopup, { SignupPopupProps } from '../signup/SignupPopup';
import Label from '@bit/redsky.framework.rs.label';

interface NavPopoutProps {
	onClose: () => void;
	isOpened: boolean;
}

const NavDrawer: React.FC<NavPopoutProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const popupRef = useRef<HTMLElement>(null);
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (popupRef && popupRef.current && !popupRef.current.contains(event.target)) {
				document.getElementsByTagName('body')[0].style.overflow = '';
				props.onClose();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<>
			<div ref={popupRef} className={props.isOpened ? `rsNavDrawer opened` : 'rsNavDrawer'}>
				<Box padding={'24px 24px 10px'}>
					{!user ? (
						<>
							<LabelLink
								path={'/signup'}
								label={'Sign Up'}
								variant={'navDrawerCustomOne'}
								onClick={() => {
									props.onClose();
									popupController.open<SignupPopupProps>(SignupPopup, {});
								}}
							/>
							<LabelLink
								path={'/signin'}
								label={'Log in'}
								variant={'navDrawerCustomOne'}
								onClick={() => {
									props.onClose();
									popupController.open<SigninPopupProps>(SigninPopup, {});
								}}
							/>
						</>
					) : (
						<>
							<Label className={'welcomeLabel'} variant={'navDrawerCustomTwo'}>
								Welcome, {user.firstName} {user.lastName}
							</Label>
							<LabelLink
								path={'/'}
								label={'My Account'}
								variant={'navDrawerCustomOne'}
								onClick={() => {
									props.onClose();
									router.navigate('/account/personal-info');
								}}
							/>
							<LabelLink
								path={'/'}
								label={'Reservations'}
								variant={'navDrawerCustomOne'}
								onClick={() => {
									props.onClose();
									router.navigate('/reservations');
								}}
							/>

							<LabelLink
								path={'/'}
								label={'Log out'}
								variant={'navDrawerCustomOne'}
								onClick={() => {
									userService.logout();
									props.onClose();
									router.navigate('/');
								}}
							/>
						</>
					)}
				</Box>
				<hr />
				<Box padding={'24px 24px 10px'}>
					<LabelLink
						path={'/contact'}
						label={'Contact Us'}
						variant={'navDrawerCustomOne'}
						onClick={() => {
							window.open('https://rentylresorts.com/contact-us/', '_blank');
						}}
					/>
					<LabelLink
						path={'/'}
						label={'Help'}
						variant={'navDrawerCustomOne'}
						onClick={() => {
							window.open('https://rentylresorts.com/', '_blank');
						}}
					/>
				</Box>
			</div>
			<div className={`transparentOverlay ${props.isOpened ? 'opened' : ''}`} />
		</>
	);
};

export default NavDrawer;
