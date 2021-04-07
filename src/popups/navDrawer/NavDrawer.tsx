import * as React from 'react';
import './NavDrawer.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelLink from '../../components/labelLink/LabelLink';
import useLoginState, { LoginStatus } from '../../customHooks/useLoginState';

interface NavPopoutProps {
	onClose: () => void;
	isOpened: boolean;
}

const NavDrawer: React.FC<NavPopoutProps> = (props) => {
	const popupRef = useRef<HTMLElement>(null);
	const loginStatus = useLoginState();

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
					{loginStatus === LoginStatus.LOGGED_OUT ? (
						<>
							<LabelLink
								path={'/signup'}
								label={'Sign Up'}
								variant={'button'}
								iconRight={'icon-chevron-right'}
								iconSize={7}
								iconColor={'#ffffff'}
							/>
							<LabelLink
								path={'/signin'}
								label={'Log in'}
								variant={'button'}
								iconRight={'icon-chevron-right'}
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
								localStorage.clear();
								window.location.assign('/');
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
