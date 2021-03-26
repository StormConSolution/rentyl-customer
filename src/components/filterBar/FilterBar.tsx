import React from 'react';
import { RsFormControl } from '@bit/redsky.framework.rs.form';
import moment from 'moment';
import Box from '../box/Box';
import DateRangeSelector from '../dateRangeSelector/DateRangeSelector';
import LabelInput from '../labelInput/LabelInput';
import './FilterBar.scss';

export interface FilterBarProps {
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	focusedInput: 'startDate' | 'endDate' | null;
	onFocusChange: (focusedInput: 'startDate' | 'endDate' | null) => void;
	monthsToShow: number;
	numberOfAdultsControl: RsFormControl;
	numberOfAdultsUpdateControl: (updateControl: RsFormControl) => void;
	numberOfChildrenControl: RsFormControl;
	numberOfChildrenUpdateControl: (updateControl: RsFormControl) => void;
	priceMinControl: RsFormControl;
	priceMinUpdateControl: (updateControl: RsFormControl) => void;
	priceMaxControl: RsFormControl;
	priceMaxUpdateControl: (updateControl: RsFormControl) => void;
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
				inputType="number"
				title="# of Adults"
				initialValue={2}
				control={props.numberOfAdultsControl}
				updateControl={props.numberOfAdultsUpdateControl}
			/>
			<LabelInput
				className="numberOfChildren"
				inputType="number"
				title="# of Children"
				initialValue={0}
				control={props.numberOfChildrenControl}
				updateControl={props.numberOfChildrenUpdateControl}
			/>
			<LabelInput
				className="priceMin"
				inputType="text"
				title="Price Min"
				control={props.priceMinControl}
				updateControl={props.priceMinUpdateControl}
			/>
			<LabelInput
				className="priceMax"
				inputType="text"
				title="Price Max"
				control={props.priceMaxControl}
				updateControl={props.priceMaxUpdateControl}
			/>
		</Box>
	);
};

export default FilterBar;
