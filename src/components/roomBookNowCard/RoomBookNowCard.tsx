import React, { useState } from 'react';
import './RoomBookNowCard.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../labelButton/LabelButton';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box } from '@bit/redsky.framework.rs.996';
import moment from 'moment';
import Button from '@bit/redsky.framework.rs.button';
import Paper from '../paper/Paper';
import DateRangeSelector from '../dateRangeSelector/DateRangeSelector';
import LabelInput from '../labelInput/LabelInput';

interface RoomBookNowCardProps {
	points: number;
	onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	focusedInput: 'startDate' | 'endDate' | null;
	onFocusChange: (focusedInput: 'startDate' | 'endDate' | null) => void;
	onGuestChange: (value: number) => void;
	onRateCodeChange: (value: string) => void;
	className?: string;
	guestValue?: number;
	rateCode?: string;
	bookNowOnClick?: () => void;
	compareOnClick?: () => void;
	bookNowDisabled?: boolean;
	compareDisabled?: boolean;
	isAvailable: boolean;
}

const RoomBookNowCard: React.FC<RoomBookNowCardProps> = (props) => {
	const size = useWindowResizeChange();

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
				<Label className={'compareLink'} onClick={props.compareOnClick} variant={'caption'}>
					Add To Compare
					<Icon className={'addCompareIcon'} iconImg={'icon-plus'} size={7} color={'#004b98'} />
				</Label>
			</div>
		);
	}

	return (
		<Paper
			boxShadow
			backgroundColor={'#fcfbf8'}
			width={size === 'small' ? '335px' : '263px'}
			padding={size === 'small' ? '10px 10px 15px' : '22px 30px 16px'}
			className={`rsRoomBookNowCard ${props.className || ''}`}
		>
			<Box className={'roomBookNowTopContent'}>
				<Box className={'dateRangePickerBox'}>
					<Box display={'flex'}>
						<Label className={'checkInLabel dateLabels'} variant={'caption'}>
							Check In
						</Label>
						<Label className={'checkOutLabel dateLabels'} variant={'caption'}>
							Check Out
						</Label>
					</Box>
					<DateRangeSelector
						startDate={props.startDate}
						endDate={props.endDate}
						onDatesChange={props.onDatesChange}
						focusedInput={props.focusedInput}
						onFocusChange={(focusedInput) => props.onFocusChange(focusedInput)}
						monthsToShow={1}
					/>
				</Box>
				{!props.isAvailable && (
					<Label variant={'body1'} color={'red'}>
						Those dates are unavailable
					</Label>
				)}
				<LabelInput
					title={size === 'small' ? 'Guests' : '# of Guest'}
					inputType={'number'}
					className={'numberOfGuests'}
					initialValue={!!props.guestValue ? props.guestValue.toString() : ''}
					onChange={(value) => {
						props.onGuestChange(value);
					}}
				/>
				<LabelInput
					className={'rateCode'}
					title={'Rate Code'}
					inputType={'text'}
					placeholder={'Optional'}
					initialValue={props.rateCode}
					onChange={(value) => props.onRateCodeChange(value)}
				/>
				<Box className={'earnPointsBox'}>
					<Label className={'earnLabel'} variant={'caption'}>
						Earn Up To
					</Label>
					<Label className={'pointsLabel'} variant={size === 'small' ? 'h4' : 'h2'}>
						{props.points.toLocaleString('en-US', { useGrouping: true })} points
					</Label>
				</Box>
			</Box>
			<Box className={'roomBookNowBottomContent'}>
				<LabelButton
					className={'bookNowBtn'}
					look={props.bookNowDisabled && !props.isAvailable ? 'containedSecondary' : 'containedPrimary'}
					variant={'button'}
					label={'BOOK NOW'}
					disabled={props.bookNowDisabled && !props.isAvailable}
					onClick={props.bookNowOnClick}
				/>
				{renderCompareLabelOrButton()}
			</Box>
		</Paper>
	);
};

export default RoomBookNowCard;
