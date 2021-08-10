import * as React from 'react';
import './ReservationCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelLink from '../labelLink/LabelLink';
import { addCommasToNumber } from '../../utils/utils';
import ReservationInfoCard from '../reservationInfoCard/ReservationInfoCard';
import { StringUtils } from '@bit/redsky.framework.rs.utils';

interface ReservationCardProps {
	imgPath: string;
	logo: string;
	title: string;
	address: string;
	reservationDates: { startDate: string | Date; endDate: string | Date };
	propertyType: string;
	itineraryId: string;
	maxOccupancy: number;
	amenities: string[];
	totalCostCents: number;
	totalPoints: number;
	linkPath: string;
	cancelPermitted: 0 | 1;
	itineraryTotal: number;
	paidWithPoints: boolean;
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
					itineraryId={props.itineraryId}
					maxOccupancy={props.maxOccupancy}
					amenities={props.amenities}
					cancelPermitted={props.cancelPermitted}
				/>
			</Box>
			<Paper className={'columnThree'} boxShadow padding={'25px 40px'}>
				{!props.paidWithPoints ? (
					<div>
						<Label variant={'caption'} mb={5}>
							Total Price
						</Label>
						<Label variant={'h2'}>${StringUtils.formatMoney(props.itineraryTotal)}</Label>
					</div>
				) : (
					<div>
						<Label variant={'caption'} mb={5}>
							Points Paid
						</Label>
						<Label variant={'h2'}>{addCommasToNumber(props.totalPoints)}</Label>
					</div>
				)}
				<LabelLink path={props.linkPath} label={'view details'} variant={'caption'} />
			</Paper>
		</Box>
	);
};

export default ReservationCard;
