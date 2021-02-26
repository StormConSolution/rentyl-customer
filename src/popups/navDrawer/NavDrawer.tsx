import * as React from 'react';
import './NavDrawer.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';
import { useEffect, useRef, useState } from 'react';

interface NavPopoutProps {
	onClose: () => void;
	isOpened: boolean;
}

const NavDrawer: React.FC<NavPopoutProps> = (props) => {
	const popupRef = useRef<HTMLElement>(null);

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
				<Button
					className={'signOutBtn'}
					look={'containedPrimary'}
					onClick={() => {
						localStorage.clear();
						window.location.assign('/signin');
					}}
				>
					Sign In
				</Button>
			</div>
			<div className={`transparentOverlay ${props.isOpened ? 'opened' : ''}`} />
		</>
	);
};

export default NavDrawer;
