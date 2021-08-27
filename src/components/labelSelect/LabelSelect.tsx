import * as React from 'react';
import './LabelSelect.scss';
import Label from '@bit/redsky.framework.rs.label';
import Select, { SelectOptions } from '../Select/Select';

interface LabelSelectProps {
	title: string;
	onChange: (value: any) => void;
	selectOptions: SelectOptions[];
	className?: string;
	placeHolder?: string;
	showSelectedAsPlaceHolder?: boolean;
	autoCalculateWidth?: boolean;
}

const LabelSelect: React.FC<LabelSelectProps> = (props) => {
	return (
		<div className={`rsLabelSelect ${props.className || ''}`}>
			<Label variant={'caption'}>{props.title}</Label>
			<Select
				onChange={props.onChange}
				options={props.selectOptions}
				placeHolder={props.placeHolder}
				showSelectedAsPlaceHolder={props.showSelectedAsPlaceHolder}
				autoCalculateWidth={props.autoCalculateWidth}
			/>
		</div>
	);
};

export default LabelSelect;
