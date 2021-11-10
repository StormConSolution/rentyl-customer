import * as React from 'react';
import './NavDrawer.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import { useEffect, useRef } from 'react';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import LabelLink from '../../components/labelLink/LabelLink';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import { isRouteUnauthorized } from '../../utils/utils';
import { NavData } from './NavData';
import SigninPopup, { SigninPopupProps } from '../signin/SigninPopup';

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

	function renderNavLinks(forUser: boolean) {
		return NavData.filter((item) => {
			return forUser === item.isSignedIn;
		}).map((item, index) => {
			if (isRouteUnauthorized(item.route)) return false;

			return (
				<LabelLink
					key={index}
					path={item.route}
					label={item.title}
					variant={item.isSectionHeader ? 'h2' : 'h4'}
					onClick={() => {
						props.onClose();
						router.navigate(item.route).catch(console.error);
					}}
				/>
			);
		});
	}

	return (
		<>
			<div ref={popupRef} className={props.isOpened ? `rsNavDrawer opened` : 'rsNavDrawer'}>
				<Icon iconImg={'icon-close'} onClick={props.onClose} size={21} color={'#ffffff'} cursorPointer />
				<Box mt={100} ml={40}>
					<Box mb={30}>{renderNavLinks(false)}</Box>
					{user && renderNavLinks(true)}
				</Box>
				<Box
					display={'flex'}
					alignItems={'center'}
					justifyContent={'space-evenly'}
					borderTop={'1px solid #fff'}
					position={'absolute'}
					bottom={0}
					left={0}
					height={62}
					width={'100%'}
				>
					{!user ? (
						<>
							<LabelLink
								path={'/signup'}
								label={'Sign Up'}
								variant={'button'}
								iconRight={'icon-chevron-right'}
								onClick={() => {
									props.onClose();
									router.navigate('/signup').catch(console.error);
								}}
								iconSize={7}
								iconColor={'#ffffff'}
							/>
							<LabelLink
								path={'#'}
								label={'Log in'}
								variant={'button'}
								iconRight={'icon-chevron-right'}
								onClick={() => {
									props.onClose();
									popupController.open<SigninPopupProps>(SigninPopup, {});
								}}
								iconSize={7}
								iconColor={'#ffffff'}
							/>
						</>
					) : (
						<LabelLink
							path={'/'}
							label={'Log out'}
							variant={'button'}
							iconRight={'icon-chevron-right'}
							iconSize={7}
							iconColor={'#ffffff'}
							onClick={() => {
								userService.logout();
								props.onClose();
								router.navigate('/');
							}}
						/>
					)}
				</Box>
			</div>
			<div className={`transparentOverlay ${props.isOpened ? 'opened' : ''}`} />
		</>
	);
};

export default NavDrawer;
