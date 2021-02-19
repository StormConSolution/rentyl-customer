import React from 'react';
import './RoomBookNowCard.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../labelButton/LabelButton';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box } from '@bit/redsky.framework.rs.996';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Button from '@bit/redsky.framework.rs.button';

interface RoomBookNowCardProps {
	className?: string;
	points: number;
	bookNowOnClick?: () => void;
	bookNowDisabled?: boolean;
	compareOnClick?: () => void;
	compareDisabled?: boolean;
	onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	focusedInput: 'startDate' | 'endDate' | null;
	changeFocusedInput: (focusedInput: 'startDate' | 'endDate' | null) => void;
}

const RoomBookNowCard: React.FC<RoomBookNowCardProps> = (props) => {
	const size = useWindowResizeChange();

	function getClassNameForResponsiveness() {
		if (size === 'small') {
			return `rsRoomBookNowCard mobile ${props.className || ''}`;
		}
		return `rsRoomBookNowCard ${props.className || ''}`;
	}

	function renderCompareLabelOrButton() {
		if (size === 'small') {
			return (
				<Button
					className={'compareBtnMobile'}
					look={'containedSecondary'}
					onClick={props.compareOnClick}
					disabled={props.compareDisabled}
					type={'button'}
				>
					<Label className={'compareBtnTextMobile'} variant={'button'}>
						ADD TO COMPARE
						<Icon className={'addCompareIconMobile'} iconImg={'icon-plus'} size={8} color={'#004b98'} />
					</Label>
				</Button>
			);
		}
		return (
			<div className={'compareLinkDiv'}>
				<Label className={'compareLink'} onClick={props.compareOnClick}>
					Add To Compare
					<Icon className={'addCompareIcon'} iconImg={'icon-plus'} size={7} color={'#004b98'} />
				</Label>
			</div>
		);
	}

	return (
		<div className={getClassNameForResponsiveness()}>
			<Box className={'roomBookNowTopContent'}>
				<Box className={'dateRangePickerBox'}>
					<Box display={'flex'}>
						<Label className={'checkInLabel dateLabels'} variant={'body1'}>
							Check In
						</Label>
						<Label className={'checkOutLabel dateLabels'} variant={'body1'}>
							Check Out
						</Label>
					</Box>
					<DateRangePicker
						startDate={props.startDate}
						startDateId="startDate"
						endDate={props.endDate}
						endDateId="endDate"
						onDatesChange={({ startDate, endDate }) => props.onDatesChange(startDate, endDate)}
						focusedInput={props.focusedInput}
						onFocusChange={(focusedInput) => props.changeFocusedInput(focusedInput)}
						numberOfMonths={1}
						noBorder
					/>
				</Box>
				<Box className={'earnPointsBox'}>
					<Label className={'earnLabel'} variant={'body1'}>
						Earn Up To
					</Label>
					<Label className={'pointsLabel'} variant={'h2'}>
						{props.points.toLocaleString('en-US', { useGrouping: true })} points
					</Label>
				</Box>
			</Box>
			<Box className={'roomBookNowBottomContent'}>
				<LabelButton
					className={'bookNowBtn'}
					look={'containedPrimary'}
					variant={'button'}
					label={'BOOK NOW'}
					disabled={props.bookNowDisabled}
					onClick={props.bookNowOnClick}
				/>
				{renderCompareLabelOrButton()}
			</Box>
		</div>
	);
};

export default RoomBookNowCard;
