import React, { useState } from 'react';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './MaskedDateRangeSelector.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import DateRangeSelector from '../dateRangeSelector/DateRangeSelector';
import Button from '@bit/redsky.framework.rs.button';
import Label, { LabelProps } from '@bit/redsky.framework.rs.label';

export interface MaskedDateRangeSelectorProps {
	onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	startDatePlaceholderText?: string;
	endDatePlaceholderText?: string;
	monthsToShow: number;
	className?: string;
	startDateLabel?: string;
	endDateLabel?: string;
	labelVariant?: LabelProps['variant'];
	isMobile?: boolean;
}

const MaskedDateRangeSelector: React.FC<MaskedDateRangeSelectorProps> = (props) => {
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);

	function openDateRangePicker(rangePart: 'startDate' | 'endDate') {
		setFocusedInput(rangePart);
	}

	return (
		<Box className={`rsMaskedDateRangeSelector ${props.className || ''}`}>
			<DateRangeSelector
				startDatePlaceholderText={props.startDatePlaceholderText}
				endDatePlaceholderText={props.endDatePlaceholderText}
				isMobile={props.isMobile}
				onDatesChange={props.onDatesChange}
				startDate={props.startDate}
				endDate={props.endDate}
				focusedInput={focusedInput}
				onFocusChange={(focus) => setFocusedInput(focus)}
				monthsToShow={props.monthsToShow}
			/>
			<Box className={'startDateBox'}>
				{!!props.startDateLabel && <Label variant={props.labelVariant}>{props.startDateLabel}</Label>}
				<Button
					className={'startDateMask'}
					onClick={() => openDateRangePicker('startDate')}
					look={'textPrimary'}
				>
					{props.startDate?.format('MM-DD-YY')}
				</Button>
			</Box>
			<Box className={'endDateBox'}>
				{!!props.endDateLabel && <Label variant={props.labelVariant}>{props.endDateLabel}</Label>}
				<Button className={'endDateMask'} onClick={() => openDateRangePicker('endDate')} look={'textPrimary'}>
					{props.endDate?.format('MM-DD-YY')}
				</Button>
			</Box>
		</Box>
	);
};

export default MaskedDateRangeSelector;
