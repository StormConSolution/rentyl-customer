import * as React from 'react';
import './LabelCheckboxControlled.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';

interface LabelCheckboxControlledProps {
	value: string | number;
	text: string | number;
	selected: boolean;
	onSelect: (value: string | number, text: string | number) => void;
	onDeselect: (value: string | number, text: string | number) => void;
}

const LabelCheckboxControlled: React.FC<LabelCheckboxControlledProps> = (props) => {
	return (
		<div className={'rsLabelCheckboxControlled'}>
			<label className={'checkboxContainer'}>
				<input
					value={props.value}
					type={'checkbox'}
					className={'checkboxInput'}
					onChange={(e) => {
						let inputValue = e.target as HTMLInputElement;
						if (inputValue.checked) props.onSelect(props.value, props.text);
						else props.onDeselect(props.value, props.text);
					}}
					checked={props.selected}
				/>
				<span className={'checkbox'}>
					<Box />
				</span>
			</label>
			<Label variant={'body1'}>{props.text}</Label>
		</div>
	);
};

export default LabelCheckboxControlled;
