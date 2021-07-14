import * as React from 'react';
import './ReservationInfoCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import LabelButton from '../labelButton/LabelButton';
import { popupController } from '@bit/redsky.framework.rs.996';
import ConfirmOptionPopup, { ConfirmOptionPopupProps } from '../../popups/confirmOptionPopup/ConfirmOptionPopup';
import { DateUtils } from '../../utils/utils';

interface ReservationInfoCardProps {
	reservationDates: { startDate: string | Date; endDate: string | Date };
	propertyType: string;
	sleeps: number;
	maxOccupancy: number;
	amenities: string[];
	misc?: { title: string; data: string | number }[];
	toggleConfirmation?: (toggle?: boolean) => void;
	cancelPermitted: 0 | 1;
	cancelPolicy?: string;
	edit?: () => void;
}

const ReservationInfoCard: React.FC<ReservationInfoCardProps> = (props) => {
	function renderReservationDates() {
		return `${DateUtils.displayUserDate(props.reservationDates.startDate)} - ${DateUtils.displayUserDate(
			props.reservationDates.endDate
		)}`;
	}

	function renderAmenityIcons() {
		return props.amenities.map((item, index) => {
			return <Icon key={index} iconImg={item} size={22} />;
		});
	}

	function renderMiscData() {
		if (!props.misc) return;

		return props.misc.map((item, index) => {
			return (
				<div key={index}>
					<Label variant={'caption'}>{item.title}</Label>
					<Label variant={'body1'}>{item.data}</Label>
				</div>
			);
		});
	}

	return (
		<Paper className={'rsReservationInfoCard'} padding={'15px 25px'} backgroundColor={'#f7f1db'}>
			<div>
				<Label variant={'caption'}>Reservation Date</Label>
				<Label variant={'body1'}>{renderReservationDates()}</Label>
			</div>
			<div>
				<Label variant={'caption'}>Sleeps</Label>
				<Label variant={'body1'}>{props.sleeps}</Label>
			</div>
			<div className={'amenities'}>
				<Label variant={'caption'}>Amenities</Label>
				<Label variant={'body1'}>{renderAmenityIcons()}</Label>
			</div>
			<div>
				<Label variant={'caption'}>Property Type</Label>
				<Label variant={'body1'}>{props.propertyType}</Label>
			</div>
			<div>
				<Label variant={'caption'}>Max Occupancy</Label>
				<Label variant={'body1'}>{props.maxOccupancy}</Label>
			</div>
			{!!props.misc && renderMiscData()}
			{/*will add back in once we have reservations that are cancellable to test && props.cancelPermitted === 1*/}
			{new Date(props.reservationDates.startDate) > new Date() && (
				<LabelButton
					variant={'button'}
					onClick={() => {
						if (props.edit) props.edit();
					}}
					label={'Edit'}
					look={'containedPrimary'}
				/>
			)}
		</Paper>
	);
};

export default ReservationInfoCard;