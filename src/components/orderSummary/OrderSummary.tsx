import * as React from 'react';
import './OrderSummary.scss';
import Label from '@bit/redsky.framework.rs.label';
import OrderSummaryCard, { OrderSummaryCardProps } from '../orderSummaryCard/OrderSummaryCard';

interface OrderSummaryProps {
	orders: OrderSummaryCardProps[];
}

const OrderSummary: React.FC<OrderSummaryProps> = (props) => {
	return (
		<div className={'rsOrderSummary'}>
			<div className={'titleBorderWrapper'}>
				<div className={'sectionTitleWrapper'}>
					<Label className={'sectionTitle'} color={'#001933'}>
						Order Summary
					</Label>
				</div>
				<div className={'divider'} />
			</div>
			{props.orders.map((order, index) => {
				return (
					<OrderSummaryCard
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

export default OrderSummary;
