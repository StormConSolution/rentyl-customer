import React, { useState } from 'react';
import './CheckboxList.scss';
import { SelectOptions } from '../Select/Select';
import IconLabel from '../iconLabel/IconLabel';
import LabelCheckbox from '../labelCheckbox/LabelCheckbox';

interface CheckboxListProps {
	onChange: (selectedValues: (string | number)[], options: SelectOptions[]) => void;
	options: SelectOptions[];
	selectedIds?: (number | string)[];
	name: string;
	className?: string;
}

const CheckboxList: React.FC<CheckboxListProps> = (props) => {
	const [showAll, setShowAll] = useState<boolean>(false);

	function getSelectedValues(options: SelectOptions[]): (string | number)[] {
		return options
			.filter((option) => {
				return option.selected;
			})
			.map((option) => {
				return option.value;
			});
	}

	function onSelectCheckbox(value: string | number) {
		let newOptions = [...props.options];
		newOptions = newOptions.map((item) => {
			if (value === item.value) {
				return {
					selected: item.value === value,
					value: item.value,
					text: item.text
				};
			} else {
				return item;
			}
		});
		props.onChange(getSelectedValues(newOptions), newOptions);
	}

	function onDeselectCheckbox(value: string | number) {
		let newOptions = [...props.options];
		newOptions = newOptions.map((item) => {
			if (value === item.value) {
				return {
					selected: false,
					value: item.value,
					text: item.text
				};
			} else {
				return item;
			}
		});
		props.onChange(getSelectedValues(newOptions), newOptions);
	}

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
					onSelect={(value) => {
						onSelectCheckbox(value);
					}}
					onDeselect={(value) => {
						onDeselectCheckbox(value);
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
				labelName={showAll ? `see less ${props.name}` : `see all ${props.name}`}
				iconImg={'icon-chevron-right'}
				iconPosition={'right'}
				iconSize={7}
				labelVariant={'caption'}
				onClick={() => setShowAll(!showAll)}
			/>
		);
	}

	return (
		<div className={`rsCheckboxList ${props.className || ''}`}>
			{renderSelectOptions()}
			{renderSeeAllIcon()}
		</div>
	);
};

export default CheckboxList;
