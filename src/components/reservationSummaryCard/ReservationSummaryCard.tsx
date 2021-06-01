import * as React from 'react';
import './ReservationSummaryCard.scss';
import Paper from '../paper/Paper';
import { Box } from '@bit/redsky.framework.rs.996';
import OtherPaymentCard from '../otherPaymentsCard/OtherPaymentCard';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

interface ReservationSummaryCardProps {
	paymentMethod: Api.Reservation.PaymentMethod;
	fullName: string;
	billingAddress: Api.Reservation.BillingAddressDetails;
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
					<Label variant={'body1'}>{props.fullName}</Label>
					<Label variant={'body1'}>{`${props.billingAddress.address1} ${
						props.billingAddress.address2 || ''
					}`}</Label>
					<Label variant={'body1'}>
						{props.billingAddress.city}, {props.billingAddress.state} {props.billingAddress.zip}
					</Label>
				</Box>
			</Box>
		</Paper>
	);
};

export default ReservationSummaryCard;
