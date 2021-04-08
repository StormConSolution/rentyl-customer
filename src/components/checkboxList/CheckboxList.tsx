import React, { useState } from 'react';
import './CheckboxList.scss';
import { SelectOptions } from '../Select/Select';
import LabelCheckbox from '../labelCheckbox/LabelCheckbox';
import IconLabel from '../iconLabel/IconLabel';

interface CheckboxListProps {
	onChange: (value: string | number | null) => void;
	options: SelectOptions[];
	className?: string;
}

const CheckboxList: React.FC<CheckboxListProps> = (props) => {
	const [showAll, setShowAll] = useState<boolean>(false);

	function renderSelectOptions() {
		let categories = [];
		let displayAmount = showAll ? props.options.length : 5;
		for (let i = 0; i < displayAmount; i++) {
			categories.push(
				<LabelCheckbox
					key={i}
					value={props.options[i].value}
					text={props.options[i].text}
					selected={props.options[i].selected}
					onSelect={(value, text) => {
						console.log('checkbox select onselect value', value);
						console.log('checkbox select onselect text', text);
					}}
					onDeselect={(value, text) => {
						console.log('checkbox select onselect value', value);
						console.log('checkbox select onselect text', text);
					}}
				/>
			);
		}
		return categories;
	}

	function renderSeeAllIcon() {
		return (
			<IconLabel
				className={'seeAll'}
				labelName={showAll ? 'see less' : 'see all'}
				iconImg={'icon-chevron-right'}
				iconPosition={'right'}
				iconSize={7}
				onClick={() => setShowAll(showAll ? false : true)}
			/>
		);
	}

	return (
		<div className={`rsSelectList ${props.className || ''}`}>
			{renderSelectOptions()}
			{renderSeeAllIcon()}
		</div>
	);
};

export default CheckboxList;
