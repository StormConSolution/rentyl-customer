import * as React from 'react';
import './LabelCheckbox.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import { ReactNode, useEffect, useState } from 'react';
import Label from '@bit/redsky.framework.rs.label';

interface LabelCheckboxProps {
	value: string | number;
	text: string | number | ReactNode;
	isChecked?: boolean;
	onSelect: (value: string | number, text: string | number | ReactNode) => void;
	onDeselect: (value: string | number, text: string | number | ReactNode) => void;
	className?: string;
}

const LabelCheckbox: React.FC<LabelCheckboxProps> = (props) => {
	const [isChecked, setIsChecked] = useState<boolean>(props.isChecked || false);

	useEffect(() => {
		setIsChecked(props.isChecked || false);
	}, [props.isChecked]);

	return (
		<div className={`rsLabelCheckbox ${props.className || ''}`}>
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
