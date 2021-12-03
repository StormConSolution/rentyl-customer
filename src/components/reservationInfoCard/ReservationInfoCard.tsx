import * as React from 'react';
import './ReservationInfoCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { DateUtils } from '../../utils/utils';
import { Box } from '@bit/redsky.framework.rs.996';

interface ReservationInfoCardProps {
	reservationDates: { startDate: string | Date; endDate: string | Date };
	propertyType: string;
	itineraryId: string;
	maxOccupancy: number;
	misc?: { title: string; data: string | number }[];
	cancelPermitted: 0 | 1;
}

const ReservationInfoCard: React.FC<ReservationInfoCardProps> = (props) => {
	function renderReservationDates() {
		return `${DateUtils.displayUserDate(props.reservationDates.startDate)} - ${DateUtils.displayUserDate(
			props.reservationDates.endDate
		)}`;
	}

	return (
		<Box className={'rsReservationInfoCard'}>
			<Box paddingRight={50}>
				<Label variant={'customThree'}>Reservation date</Label>
				<Label variant={'customFour'} className={'contentFont'}>
					{renderReservationDates()}
				</Label>
			</Box>
			<Box paddingRight={50}>
				<Label variant={'customThree'}>Itinerary number</Label>
				<Label variant={'customFour'} className={'contentFont'}>
					{props.itineraryId}
				</Label>
			</Box>
			<Box paddingRight={50}>
				<Label variant={'customThree'}>Property type</Label>
				<Label variant={'customFour'} className={'contentFont'}>
					{props.propertyType}
				</Label>
			</Box>
			<Box>
				<Label variant={'customThree'}>Max occupancy</Label>
				<Label variant={'customFour'} className={'contentFont'}>
					{props.maxOccupancy}
				</Label>
			</Box>
		</Box>
	);
};

export default ReservationInfoCard;
