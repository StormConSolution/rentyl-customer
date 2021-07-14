import React from 'react';
import moment from 'moment';
import Box from '../box/Box';
import DateRangeSelector from '../dateRangeSelector/DateRangeSelector';
import LabelInput from '../labelInput/LabelInput';
import './FilterBar.scss';
import debounce from 'lodash.debounce';
import { addCommasToNumber, removeAllExceptNumbers } from '../../utils/utils';

export interface FilterBarProps {
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	focusedInput: 'startDate' | 'endDate' | null;
	onFocusChange: (focusedInput: 'startDate' | 'endDate' | null) => void;
	monthsToShow: number;
	onChangeAdults: (value: any) => void;
	onChangeChildren: (value: any) => void;
	onChangePriceMin: (value: any) => void;
	onChangePriceMax: (value: any) => void;
	adultsInitialInput?: string;
	childrenInitialInput?: string;
	initialPriceMin?: string;
	initialPriceMax?: string;
	className?: string;
}

const FilterBar: React.FC<FilterBarProps> = (props) => {
	return (
		<Box className={`rsFilterBar ${props.className || ''}`}>
			<DateRangeSelector
				startDate={props.startDate}
				endDate={props.endDate}
				onDatesChange={props.onDatesChange}
				monthsToShow={props.monthsToShow}
				focusedInput={props.focusedInput}
				onFocusChange={(focusedInput) => props.onFocusChange(focusedInput)}
				startDateLabel={'check in'}
				endDateLabel={'check out'}
			/>
			<LabelInput
				className="numberOfAdults"
				inputType="text"
				title="# of Adults"
				initialValue={props.adultsInitialInput || '2'}
				onChange={debounce(async (value) => {
					props.onChangeAdults(value);
				}, 300)}
			/>
			<LabelInput
				className="numberOfChildren"
				inputType="text"
				title="# of Children"
				initialValue={props.childrenInitialInput || '0'}
				onChange={debounce(async (value) => {
					props.onChangeChildren(value);
				}, 300)}
			/>
			<LabelInput
				className="priceMin"
				inputType="text"
				title="Price Min"
				initialValue={`$${addCommasToNumber(props.initialPriceMin)}` || ''}
				onChange={debounce(async (value) => {
					props.onChangePriceMin(removeAllExceptNumbers(value));
				}, 500)}
			/>
			<LabelInput
				className="priceMax"
				inputType="text"
				title="Price Max"
				initialValue={`$${addCommasToNumber(props.initialPriceMax)}` || ''}
				onChange={debounce(async (value) => {
					props.onChangePriceMax(removeAllExceptNumbers(value));
				}, 500)}
			/>
		</Box>
	);
};

export default FilterBar;
