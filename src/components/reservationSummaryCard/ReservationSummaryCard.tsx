import * as React from 'react';
import './ReservationSummaryCard.scss';
import Paper from '../paper/Paper';
import { Box } from '@bit/redsky.framework.rs.996';
import OtherPaymentCard from '../otherPaymentsCard/OtherPaymentCard';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

interface ReservationSummaryCardProps {
	paymentMethod: Api.Reservation.PaymentMethod;
}

const ReservationSummaryCard: React.FC<ReservationSummaryCardProps> = (props) => {
	return (
		<Paper boxShadow className={'rsReservationSummaryCard'} backgroundColor={'#FCFBF8'}>
			<Box padding={'25px 40px'}></Box>
			<hr />
			<Box padding={'25px 40px'} display={'flex'}>
				<Box>
					<Label variant={'h4'} mb={10}>
						Payment Method
					</Label>
					<OtherPaymentCard
						name={props.paymentMethod.nameOnCard}
						cardNumber={props.paymentMethod.cardNumber}
						expDate={`${props.paymentMethod?.expirationMonth}/${props.paymentMethod?.expirationYear}`}
					/>
				</Box>
				<Box>
					<Label variant={'h4'} mb={10}>
						Billing Address
					</Label>
					<Label variant={'body1'}>Jon Doherty</Label>
					<Label variant={'body1'}>123 East Maple Rd</Label>
					<Label variant={'body1'}>Newark, DE 07101</Label>
				</Box>
			</Box>
		</Paper>
	);
};

export default ReservationSummaryCard;
