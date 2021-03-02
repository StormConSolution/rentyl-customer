// Full documentation of the DateRangePicker used can be found at https://github.com/airbnb/react-dates

import React from 'react';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import './DateRangeSelector.scss';
import { Box } from '@bit/redsky.framework.rs.996';

export interface DateRangeSelectorProps {
	onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	focusedInput: 'startDate' | 'endDate' | null;
	changeFocusedInput: (focusedInput: 'startDate' | 'endDate' | null) => void;
	monthsToShow: number;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = (props) => {
	return (
		<Box className="rsDateRangeSelector">
			<DateRangePicker
				startDate={props.startDate}
				startDateId="startDate"
				endDate={props.endDate}
				endDateId="endDate"
				onDatesChange={({ startDate, endDate }) => props.onDatesChange(startDate, endDate)}
				focusedInput={props.focusedInput}
				onFocusChange={(focusedInput) => props.changeFocusedInput(focusedInput)}
				numberOfMonths={props.monthsToShow}
				noBorder
			/>
		</Box>
	);
};

export default DateRangeSelector;
