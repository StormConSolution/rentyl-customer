import * as React from 'react';
import './LabelCheckboxFilterBar.scss';
import { ReactNode, useEffect, useState } from 'react';
import Label from '@bit/redsky.framework.rs.label';

interface LabelCheckboxV2Props {
	value: string | number;
	text: string | number | ReactNode;
	isChecked?: boolean;
	onSelect: (value: string | number, text: string | number | ReactNode) => void;
	onDeselect: (value: string | number, text: string | number | ReactNode) => void;
	className?: string;
	lineClamp?: number;
	isDisabled?: boolean;
	textColor?: string;
}

const LabelCheckboxFilterBar: React.FC<LabelCheckboxV2Props> = (props) => {
	const [isChecked, setIsChecked] = useState<boolean>(props.isChecked || false);

	useEffect(() => {
		setIsChecked(props.isChecked || false);
	}, [props.isChecked]);

	return (
		<div className={`rsLabelCheckboxFilterBar ${props.className || ''}`}>
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
					disabled={props.isDisabled}
				/>
			</label>
			<Label variant={'body1'} color={props.textColor} lineClamp={props.lineClamp || 2} className="titleLabel">
				{props.text}
			</Label>
		</div>
	);
};

export default LabelCheckboxFilterBar;
