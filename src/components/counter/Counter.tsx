import React from 'react';
import './Counter.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { RsFormControl } from '@bit/redsky.framework.rs.form';
import Button from '@bit/redsky.framework.rs.button';

export interface GuestCounterProps {
	minCount?: number;
	title: string;
	control: RsFormControl;
	updateControl: (control: RsFormControl) => void;
	labelMarginRight: number;
}

const Counter: React.FC<GuestCounterProps> = (props) => {
	return (
		<Box className={'rsCounter'}>
			<Label variant={'subtitle1'} mr={props.labelMarginRight}>
				{props.title}
			</Label>
			<Box className={'valueChanger'}>
				<Button
					look={'none'}
					onClick={() => {
						let newValue: number = (props.control.value as number) - 1;
						if (props.minCount && newValue < props.minCount) return;
						let tempControl = props.control;
						tempControl.value = newValue;
						props.updateControl(tempControl);
					}}
				>
					<Icon iconImg={'icon-minus'} size={12} color={'#7070706E'} />
				</Button>

				<Label variant={'subtitle1'}>{props.control.value as number}</Label>

				<Button
					look={'none'}
					onClick={() => {
						let newValue: number = (props.control.value as number) + 1;
						let tempControl = props.control;
						tempControl.value = newValue;
						props.updateControl(tempControl);
					}}
				>
					<Icon iconImg={'icon-plus'} size={12} color={'#7070706E'} />
				</Button>
			</Box>
		</Box>
	);
};

export default Counter;
