import React, { useState } from 'react';
import './CheckboxList.scss';
import { SelectOptions } from '../Select/Select';
import LabelCheckbox from '../labelCheckbox/LabelCheckbox';
import IconLabel from '../iconLabel/IconLabel';

interface CheckboxListProps {
	onChange: (value: (string | number)[], options: SelectOptions[]) => void;
	options: SelectOptions[];
	selectedIds?: (number | string)[];
	name: string;
	className?: string;
}

const CheckboxList: React.FC<CheckboxListProps> = (props) => {
	const [showAll, setShowAll] = useState<boolean>(false);
	const [options, setOptions] = useState<SelectOptions[]>(props.options);
	const [selectedIds, setSelectedIds] = useState<(string | number)[]>(props.selectedIds ? props.selectedIds : []);

	function setSelectedCategories(value: string | number) {
		let index = selectedIds.indexOf(value);
		let newSelectedIds = [...selectedIds];
		if (index === -1) {
			newSelectedIds.push(value);
		} else {
			newSelectedIds.splice(index, 1);
		}
		setSelectedIds(newSelectedIds);
		return newSelectedIds;
	}

	function onSelectCheckbox(value: string | number) {
		let newOptions = [...options];
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
		setOptions(newOptions);
		props.onChange(setSelectedCategories(value), newOptions);
	}
	function onDeselectCheckbox(value: string | number) {
		let newOptions = [...options];
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
		setOptions(newOptions);
		props.onChange(setSelectedCategories(value), newOptions);
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
					isChecked={props.options[i].selected}
					onSelect={(value, text) => {
						onSelectCheckbox(value);
					}}
					onDeselect={(value, text) => {
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
