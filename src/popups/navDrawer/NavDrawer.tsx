import * as React from 'react';
import './NavDrawer.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelLink from '../../components/labelLink/LabelLink';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';

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
				<Icon iconImg={'icon-close'} onClick={props.onClose} size={21} color={'#ffffff'} cursorPointer />
				<Box mt={100} ml={40}>
					<Box mb={30}>
						<LabelLink
							path={'/'}
							label={'Redeem Points'}
							variant={'h2'}
							onClick={() => {
								props.onClose();
								router.navigate('/').catch(console.error);
							}}
						/>
						<LabelLink
							path={'/reservation/availability'}
							label={'Browse Destinations'}
							variant={'h4'}
							onClick={() => {
								props.onClose();
								router.navigate('/reservation/availability').catch(console.error);
							}}
						/>
						<LabelLink
							path={'/about-spire-points'}
							label={'Learn About Points'}
							variant={'h4'}
							onClick={() => {
								props.onClose();
								router.navigate('/about-spire-points').catch(console.error);
							}}
						/>
					</Box>
					{
						<Box mb={30}>
							<LabelLink
								path={'/account/personal-info'}
								label={'My Account'}
								variant={'h2'}
								onClick={() => {
									props.onClose();
									router.navigate('/account/personal-info').catch(console.error);
								}}
							/>
							<LabelLink
								path={'/'}
								label={'Reservations'}
								variant={'h4'}
								onClick={() => {
									props.onClose();
									router.navigate('/signup').catch(console.error);
								}}
							/>
							<LabelLink
								path={'/'}
								label={'Manage/View points'}
								variant={'h4'}
								onClick={() => {
									props.onClose();
									router.navigate('/signup').catch(console.error);
								}}
							/>
						</Box>
					}
					<LabelLink
						path={'/about-spire'}
						label={'About Spire Loyalty'}
						variant={'h2'}
						onClick={() => {
							props.onClose();
							router.navigate('/about-spire').catch(console.error);
						}}
					/>
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
								path={'/signin'}
								label={'Log in'}
								variant={'button'}
								iconRight={'icon-chevron-right'}
								onClick={() => {
									props.onClose();
									router.navigate('/signin').catch(console.error);
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
