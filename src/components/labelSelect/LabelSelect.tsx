import * as React from 'react';
import './LabelSelect.scss';
import Label from '@bit/redsky.framework.rs.label';
// import Select, { SelectOptions } from '../Select/Select';
import Select, { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl } from '@bit/redsky.framework.rs.form';

interface LabelSelectProps {
	title: string;
	onChange: (value: any) => void;
	selectOptions: OptionType[];
	className?: string;
	placeHolder?: string;
	showSelectedAsPlaceHolder?: boolean;
	autoCalculateWidth?: boolean;
	control: RsFormControl;
	defaultValue?: readonly OptionType[] | OptionType | null;
	value?: readonly OptionType[] | OptionType | null;
}

const LabelSelect: React.FC<LabelSelectProps> = (props) => {
	return (
		<div className={`rsLabelSelect ${props.className || ''}`}>
			<Label variant={'caption'}>{props.title}</Label>
			<Select
				control={props.control}
				updateControl={props.onChange}
				options={props.selectOptions}
				isClearable={true}
				defaultValue={props.defaultValue}
				value={props.value}
			/>
		</div>
	);
};

export default LabelSelect;
