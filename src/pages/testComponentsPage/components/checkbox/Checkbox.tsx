import * as React from 'react';
import './Checkbox.scss';
import Label from '@bit/redsky.framework.rs.label';
import { ReactText } from 'react';

interface CheckboxProps {
	title?: ReactText | number;
	value?: ReactText | number;
	onChange?: () => void;
	checked?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
	return (
		<div className="rsCheckbox">
			<input
				type="checkbox"
				className="filterByCheckbox"
				value={props.value}
				onChange={props.onChange}
				checked={props.checked}
			/>
			<Label className="filterByItemLabel" paddingLeft="10px">
				{props.title}
			</Label>
		</div>
	);
};

export default Checkbox;
