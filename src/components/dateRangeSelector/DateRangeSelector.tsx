// Full documentation of the DateRangePicker used can be found at https://github.com/airbnb/react-dates

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import './DateRangeSelector.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';

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
	labelVariant?:
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'link1'
		| 'link2'
		| 'subtitle1'
		| 'subtitle2'
		| 'body1'
		| 'body2'
		| 'caption'
		| 'button'
		| 'overline'
		| string;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = (props) => {
	const [instanceId] = useState<string>(StringUtils.generateGuid());
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(props.startDate);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(props.endDate);

	useEffect(() => {
		setStartDateControl(props.startDate);
		setEndDateControl(props.endDate);
	}, [props.startDate, props.endDate]);

	return (
		<Box className={`rsDateRangeSelector ${props.className || ''}`}>
			<div className={'startEndLabels'}>
				<Label className={'startDateLabel'} variant={props.labelVariant || 'caption'}>
					{props.startDateLabel}
				</Label>
				<hr />
				<Label className={'endDateLabel'} variant={props.labelVariant || 'caption'}>
					{props.endDateLabel}
				</Label>
			</div>
			<DateRangePicker
				navPrev={<Icon iconImg={'icon-chevron-left'} size={10} />}
				navNext={<Icon iconImg={'icon-chevron-right'} size={10} />}
				readOnly
				startDate={startDateControl}
				startDateId={`startDate-${instanceId}`}
				endDate={endDateControl}
				endDateId={`endDate-${instanceId}`}
				onClose={({ startDate, endDate }) => props.onDatesChange(startDate, endDate)}
				onDatesChange={({ startDate, endDate }) => {
					setStartDateControl(startDate);
					setEndDateControl(endDate);
				}}
				minimumNights={2}
				focusedInput={props.focusedInput}
				onFocusChange={(focusedInput) => props.onFocusChange(focusedInput)}
				numberOfMonths={props.monthsToShow}
				verticalSpacing={20}
				noBorder
			/>
		</Box>
	);
};

export default DateRangeSelector;
