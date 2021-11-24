import React from 'react';
import './Counter.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { RsFormControl } from '@bit/redsky.framework.rs.form';

export interface GuestCounterProps {
	minCount?: number;
	maxCount?: number;
	title: string;
	control: RsFormControl;
	updateControl: (control: RsFormControl) => void;
	labelMarginRight: number;
	className?: string;
}

const Counter: React.FC<GuestCounterProps> = (props) => {
	function isAtMinValue(): boolean {
		if (props.minCount === undefined) return false;
		return (props.control.value as number) <= props.minCount;
	}

	function isAtMaxValue(): boolean {
		if (props.maxCount === undefined) return false;
		return (props.control.value as number) >= props.maxCount;
	}
	return (
		<Box className={`rsCounter${props.className ? ` ${props.className}` : ''}`}>
			<Label variant={'subtitle1'} mr={props.labelMarginRight}>
				{props.title}
			</Label>
			<Box className={'valueChanger'}>
				<Icon
					iconImg={'icon-minus'}
					className={isAtMinValue() ? 'disable' : ''}
					onClick={() => {
						let newValue: number = (props.control.value as number) - 1;
						if (props.minCount !== undefined && newValue < props.minCount) return;
						let tempControl = props.control;
						tempControl.value = newValue;
						props.updateControl(tempControl);
					}}
				/>
				<Label variant={'body1'}>{props.control.value as number}</Label>
				<Icon
					iconImg={'icon-plus'}
					className={isAtMaxValue() ? 'disable' : ''}
					onClick={() => {
						let newValue: number = (props.control.value as number) + 1;
						if (props.maxCount !== undefined && newValue > props.maxCount) return;
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
