import * as React from 'react';
import './MultiSelectOption.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { useState } from 'react';
import Label from '@bit/redsky.framework.rs.label';

interface SelectOptionProps {
	value: string | number;
	text: string | number;
	selected?: boolean;
	onSelect: (value: string | number, text: string | number) => void;
	onDeselect: (value: string | number, text: string | number) => void;
}

const MultiSelectOption: React.FC<SelectOptionProps> = (props) => {
	const [isChecked, setIsChecked] = useState<boolean>(props.selected || false);

	return (
		<div className={'rsMultiSelectOption'}>
			<Label variant={'body1'}>{props.text}</Label>
			<label className={'checkboxContainer'}>
				<input
					value={props.value}
					type={'checkbox'}
					className={'checkboxInput'}
					onClick={(e) => {
						let inputValue = e.target as HTMLInputElement;
						if (inputValue.checked) props.onSelect(props.value, props.text);
						else props.onDeselect(props.value, props.text);
						setIsChecked(!isChecked);
					}}
					defaultChecked={isChecked}
				/>
				<span className={'checkbox'}>
					<Box />
				</span>
			</label>
		</div>
	);
};

export default MultiSelectOption;
