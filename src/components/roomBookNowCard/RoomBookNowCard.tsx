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
	onDatesChangeBN: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	startDateBN: moment.Moment | null;
	endDateBN: moment.Moment | null;
	focusedInputBN: 'startDate' | 'endDate' | null;
	changeFocusedInputBN: (focusedInputBN: 'startDate' | 'endDate' | null) => void;
}

const RoomBookNowCard: React.FC<RoomBookNowCardProps> = (props) => {
	const size = useWindowResizeChange();

	function classNameForResponsiveness() {
		if (size === 'small') {
			return !!props.className
				? `rsRoomBookNowCard rsRoomBookNowCardMobile ${props.className}`
				: 'rsRoomBookNowCard rsRoomBookNowCardMobile';
		}
		return !!props.className
			? `rsRoomBookNowCard rsRoomBookNowCardNormal ${props.className}`
			: 'rsRoomBookNowCard rsRoomBookNowCardNormal';
	}

	function compareLabelOrButton() {
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
		<div className={classNameForResponsiveness()}>
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
						startDate={props.startDateBN}
						startDateId="startDate"
						endDate={props.endDateBN}
						endDateId="endDate"
						onDatesChange={({ startDate, endDate }) => props.onDatesChangeBN(startDate, endDate)}
						focusedInput={props.focusedInputBN}
						onFocusChange={(focusedInput) => props.changeFocusedInputBN(focusedInput)}
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
				{compareLabelOrButton()}
			</Box>
		</div>
	);
};

export default RoomBookNowCard;
