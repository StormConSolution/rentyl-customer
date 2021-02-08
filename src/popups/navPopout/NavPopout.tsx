import * as React from 'react';
import './NavPopout.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';
import { useEffect, useRef, useState } from 'react';

interface NavPopoutProps {
	onClose: () => void;
	isOpened: boolean;
}

const NavPopout: React.FC<NavPopoutProps> = (props) => {
	const popupRef = useRef<HTMLElement>(null);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (popupRef && popupRef.current && !popupRef.current.contains(event.target)) {
				props.onClose();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div ref={popupRef} className={props.isOpened ? `rsNavPopout opened` : 'rsNavPopout'}>
			<Icon iconImg={'icon-close'} onClick={props.onClose} size={21} color={'#003A76'} cursorPointer />
			<Button
				className={'signOutBtn'}
				look={'containedPrimary'}
				onClick={() => {
					localStorage.clear();
					window.location.assign('/');
				}}
			>
				Sign Out
			</Button>
		</div>
	);
};

export default NavPopout;
