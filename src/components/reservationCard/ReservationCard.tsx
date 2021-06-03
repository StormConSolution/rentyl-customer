import * as React from 'react';
import './ReservationCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import LabelLink from '../labelLink/LabelLink';
import { addCommasToNumber } from '../../utils/utils';
import router from '../../utils/router';
import ReservationInfoCard from '../reservationInfoCard/ReservationInfoCard';
import { StringUtils } from '@bit/redsky.framework.rs.utils';

interface ReservationCardProps {
	imgPath: string;
	logo: string;
	title: string;
	address: string;
	reservationDates: { startDate: string | Date; endDate: string | Date };
	propertyType: string;
	sleeps: number;
	maxOccupancy: number;
	amenities: string[];
	totalCostCents: number;
	totalPoints: number;
	onViewDetailsClick: () => void;
}

const ReservationCard: React.FC<ReservationCardProps> = (props) => {
	return (
		<Box className={'rsReservationCard'}>
			<div className={'columnOne'}>
				<img src={props.imgPath} alt={'Reservation Card Image'} />
			</div>
			<Box className={'columnTwo'} position={'relative'}>
				<Box className={'rowOne'} display={'flex'} alignItems={'center'}>
					<img src={props.logo} alt={'Accommodation Logo'} />
					<div>
						<Label variant={'h1'}>{props.title}</Label>
						<Label variant={'caption'}>{props.address}</Label>
					</div>
				</Box>
				<ReservationInfoCard
					reservationDates={props.reservationDates}
					propertyType={props.propertyType}
					sleeps={props.sleeps}
					maxOccupancy={props.maxOccupancy}
					amenities={props.amenities}
				/>
			</Box>
			<Paper className={'columnThree'} boxShadow padding={'25px 40px'}>
				<div>
					<Label variant={'caption'} mb={5}>
						Total Amount Paid
					</Label>
					<Label variant={'h2'}>${StringUtils.formatMoney(props.totalCostCents)}</Label>
				</div>
				<div>
					<Label variant={'caption'} mb={5}>
						Points Paid
					</Label>
					<Label variant={'h2'}>{addCommasToNumber(props.totalPoints)}</Label>
				</div>
				<LabelLink path={'/'} label={'view details'} variant={'caption'} onClick={props.onViewDetailsClick} />
			</Paper>
		</Box>
	);
};

export default ReservationCard;
