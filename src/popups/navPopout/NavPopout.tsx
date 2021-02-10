import * as React from 'react';
import './NavPopout.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';
import { useEffect, useRef, useState } from 'react';
import Box from '../../components/box/Box';
import LabelLink from '../../components/labelLink/LabelLink';
import LabelButton from '../../components/labelButton/LabelButton';

interface NavPopoutProps {
	onClose: () => void;
	isOpened: boolean;
}

const NavPopout: React.FC<NavPopoutProps> = (props) => {
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
			<div ref={popupRef} className={props.isOpened ? `rsNavPopout opened` : 'rsNavPopout'}>
				<Icon iconImg={'icon-close'} onClick={props.onClose} size={21} color={'#ffffff'} cursorPointer />
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
			<div className={`transparentOverlay ${props.isOpened ? 'opened' : ''}`} />
		</>
	);
};

export default NavPopout;
