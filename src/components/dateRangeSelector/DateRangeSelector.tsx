// Full documentation of the DateRangePicker used can be found at https://github.com/airbnb/react-dates

import React, { useState } from 'react';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import './DateRangeSelector.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { StringUtils } from '@bit/redsky.framework.rs.utils';

export interface DateRangeSelectorProps {
	onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	focusedInput?: 'startDate' | 'endDate' | null;
	monthsToShow: number;
	className?: string;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = (props) => {
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(props.focusedInput || null);
	const [instanceId] = useState<string>(StringUtils.generateGuid());
	return (
		<Box className={`rsDateRangeSelector ${props.className || ''}`}>
			<DateRangePicker
				startDate={props.startDate}
				startDateId={`startDate-${instanceId}`}
				endDate={props.endDate}
				endDateId={`endDate-${instanceId}`}
				onDatesChange={({ startDate, endDate }) => props.onDatesChange(startDate, endDate)}
				focusedInput={focusedInput}
				onFocusChange={setFocusedInput}
				numberOfMonths={props.monthsToShow}
				noBorder
			/>
		</Box>
	);
};

export default DateRangeSelector;
