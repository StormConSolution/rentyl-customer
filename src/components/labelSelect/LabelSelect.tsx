import * as React from 'react';
import './LabelSelect.scss';
import Label from '@bit/redsky.framework.rs.label';
import Select, { SelectProps } from '@bit/redsky.framework.rs.select';

interface LabelSelectProps extends SelectProps {
	title: string;
}

const LabelSelect: React.FC<LabelSelectProps> = (props) => {
	return (
		<div className={`rsLabelSelect ${props.className || ''}`}>
			<Label variant={'caption'}>{props.title}</Label>
			<Select {...props} className={''} />
		</div>
	);
};

export default LabelSelect;
