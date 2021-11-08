import * as React from 'react';
import './Checkbox.scss';
import Label from '@bit/redsky.framework.rs.label';
import { ChangeEvent, ReactText } from 'react';

interface CheckboxProps {
	title?: ReactText | number;
	value?: ReactText | number;
	onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
	checked?: boolean;
	id?: string;
	name?: string;
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
				id={props.id}
				name={props.name}
			/>
			<Label className="filterByItemLabel" paddingLeft="10px">
				{props.title}
			</Label>
		</div>
	);
};

export default Checkbox;
