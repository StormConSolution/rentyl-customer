import * as React from 'react';
import './NotificationTile.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { useState } from 'react';

interface NotificationTileProps {
	title: string;
	description: string;
	onChangeEmail: (type: 'SELECT' | 'DESELECT') => void;
	onChangeText: (type: 'SELECT' | 'DESELECT') => void;
	isTextSelected: boolean;
	isEmailSelected: boolean;
	className?: string;
}

const NotificationTile: React.FC<NotificationTileProps> = (props) => {
	const [isEmailChecked, setIsEmailChecked] = useState<boolean>(props.isEmailSelected);
	const [isTextChecked, setIsTextChecked] = useState<boolean>(props.isTextSelected);

	return (
		<Box className={`rsNotificationTile ${props.className || ''}`}>
			<Box maxWidth={'540px'}>
				<Label variant={'h4'}>{props.title}</Label>
				<Label variant={'body1'}>{props.description}</Label>
			</Box>
			<Box display={'flex'} width={'80px'} justifyContent={'space-between'} marginLeft={'auto'}>
				<label className={'checkboxContainer'}>
					<input
						type={'checkbox'}
						className={'checkboxInput'}
						onChange={(e) => {
							let inputValue = e.target as HTMLInputElement;
							if (inputValue.checked) props.onChangeEmail('SELECT');
							else props.onChangeEmail('DESELECT');
							setIsEmailChecked(!isEmailChecked);
						}}
						checked={isEmailChecked}
					/>
					<span className={'checkbox'}>
						<Box />
					</span>
				</label>
				<label className={'checkboxContainer'}>
					<input
						type={'checkbox'}
						className={'checkboxInput'}
						onChange={(e) => {
							let inputValue = e.target as HTMLInputElement;
							if (inputValue.checked) props.onChangeText('SELECT');
							else props.onChangeText('DESELECT');
							setIsTextChecked(!isTextChecked);
						}}
						checked={isTextChecked}
					/>
					<span className={'checkbox'}>
						<Box />
					</span>
				</label>
			</Box>
		</Box>
	);
};

export default NotificationTile;
