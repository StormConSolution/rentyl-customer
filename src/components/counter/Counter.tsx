import React from 'react';
import './Counter.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { RsFormControl } from '@bit/redsky.framework.rs.form';

export interface GuestCounterProps {
	minCount?: number;
	title: string;
	control: RsFormControl;
	updateControl: (control: RsFormControl) => void;
	className?: string;
}

const Counter: React.FC<GuestCounterProps> = (props) => {
	return (
		<Box className={`rsCounter${props.className ? ` ${props.className}` : ''}`}>
			<Label variant={'body1'}>{props.title}</Label>
			<Box className={'valueChanger'}>
				<Icon
					iconImg={'icon-minus'}
					onClick={() => {
						let newValue: number = (props.control.value as number) - 1;
						if (props.minCount && newValue < props.minCount) return;
						let tempControl = props.control;
						tempControl.value = newValue;
						props.updateControl(tempControl);
					}}
				/>
				<Label variant={'body1'}>{props.control.value as number}</Label>
				<Icon
					iconImg={'icon-plus'}
					onClick={() => {
						let newValue: number = (props.control.value as number) + 1;
						let tempControl = props.control;
						tempControl.value = newValue;
						props.updateControl(tempControl);
					}}
				/>
			</Box>
		</Box>
	);
};

export default Counter;
