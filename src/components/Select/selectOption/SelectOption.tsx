import * as React from 'react';
import './SelectOption.scss';
import Label from '@bit/redsky.framework.rs.label';

interface SelectOptionProps {
	value: string | number;
	text: string | number;
	selected?: boolean;
	onSelect: (value: string | number, text: string | number) => void;
	onDeselect: () => void;
}

const SelectOption: React.FC<SelectOptionProps> = (props) => {
	return (
		<div
			className={`rsSelectOption ${props.selected ? 'selected' : ''}`}
			onClick={() => {
				if (props.selected) props.onDeselect();
				else props.onSelect(props.value, props.text);
			}}
		>
			<Label variant={'body2'}>{props.text}</Label>
		</div>
	);
};

export default SelectOption;
