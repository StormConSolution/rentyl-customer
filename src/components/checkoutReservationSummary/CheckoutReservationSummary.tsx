import * as React from 'react';
import './CheckoutReservationSummary.scss';
import Label from '@bit/redsky.framework.rs.label';
import CheckoutReservationSummaryCard, {
	CheckoutReservationSummaryCardProps
} from '../checkoutReservationSummaryCard/CheckoutReservationSummaryCard';

interface CheckoutReservationSummaryProps {
	orders: CheckoutReservationSummaryCardProps[];
}

const CheckoutReservationSummary: React.FC<CheckoutReservationSummaryProps> = (props) => {
	return (
		<div className={'rsCheckoutReservationSummary'}>
			<div className={'titleBorderWrapper'}>
				<div className={'sectionTitleWrapper'}>
					<Label className={'sectionTitle'}>Order Summary</Label>
				</div>
				<div className={'divider'} />
			</div>
			{props.orders.map((order, index) => {
				return (
					<CheckoutReservationSummaryCard
						key={order.title + index}
						image={order.image}
						title={order.title}
						price={order.price}
						dateBooked={order.dateBooked}
					/>
				);
			})}
		</div>
	);
};

export default CheckoutReservationSummary;
