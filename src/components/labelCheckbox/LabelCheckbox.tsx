import * as React from 'react';
import './LabelCheckbox.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import { useState } from 'react';
import Label from '@bit/redsky.framework.rs.label';

interface LabelCheckboxProps {
	value: string | number;
	text: string | number;
	selected: boolean;
	onSelect: (value: string | number, text: string | number) => void;
	onDeselect: (value: string | number, text: string | number) => void;
}

const LabelCheckbox: React.FC<LabelCheckboxProps> = (props) => {
	const [isChecked, setIsChecked] = useState<boolean>(props.selected);

	return (
		<div className={'rsLabelCheckbox'}>
			<label className={'checkboxContainer'}>
				<input
					value={props.value}
					type={'checkbox'}
					className={'checkboxInput'}
					onChange={(e) => {
						let inputValue = e.target as HTMLInputElement;
						if (inputValue.checked) props.onSelect(props.value, props.text);
						else props.onDeselect(props.value, props.text);
						setIsChecked(!isChecked);
					}}
					checked={isChecked}
				/>
				<span className={'checkbox'}>
					<Box />
				</span>
			</label>
			<Label variant={'body1'}>{props.text}</Label>
		</div>
	);
};

export default LabelCheckbox;
