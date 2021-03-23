// Full documentation of the DateRangePicker used can be found at https://github.com/airbnb/react-dates

import React, { useState } from 'react';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import './DateRangeSelector.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import Label from '@bit/redsky.framework.rs.label';

export interface DateRangeSelectorProps {
	onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	focusedInput: 'startDate' | 'endDate' | null;
	onFocusChange: (focusedInput: 'startDate' | 'endDate' | null) => void;
	monthsToShow: number;
	className?: string;
	startDateLabel?: string;
	endDateLabel?: string;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = (props) => {
	const [instanceId] = useState<string>(StringUtils.generateGuid());
	return (
		<Box className={`rsDateRangeSelector ${props.className || ''}`}>
			<div className={'startEndLabels'}>
				<Label className={'startDateLabel'} variant={'caption'}>
					{props.startDateLabel}
				</Label>
				<Label className={'endDateLabel'} variant={'caption'}>
					{props.endDateLabel}
				</Label>
			</div>
			<DateRangePicker
				startDate={props.startDate}
				startDateId={`startDate-${instanceId}`}
				endDate={props.endDate}
				endDateId={`endDate-${instanceId}`}
				onDatesChange={({ startDate, endDate }) => props.onDatesChange(startDate, endDate)}
				focusedInput={props.focusedInput}
				onFocusChange={(focusedInput) => props.onFocusChange(focusedInput)}
				numberOfMonths={props.monthsToShow}
				noBorder
			/>
		</Box>
	);
};

export default DateRangeSelector;
