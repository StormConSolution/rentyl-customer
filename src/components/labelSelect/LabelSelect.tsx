import * as React from 'react';
import './LabelSelect.scss';
import Label from '@bit/redsky.framework.rs.label';
import Select, { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl } from '@bit/redsky.framework.rs.form';

interface LabelSelectProps {
	title: string;
	onChange: (value: any) => void;
	selectOptions: OptionType[];
	className?: string;
	placeHolder?: string;
	control: RsFormControl;
	isMulti?: boolean;
}

const LabelSelect: React.FC<LabelSelectProps> = (props) => {
	return (
		<div className={`rsLabelSelect ${props.className || ''}`}>
			<Label variant={'caption'}>{props.title}</Label>
			<Select
				control={props.control}
				updateControl={(control) => {
					props.onChange(control);
				}}
				options={props.selectOptions}
				isClearable={true}
				isMulti={props.isMulti}
			/>
		</div>
	);
};

export default LabelSelect;
