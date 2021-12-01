import * as React from 'react';
import './OrderSummaryCard.scss';
import Label from '@bit/redsky.framework.rs.label';

export interface OrderSummaryCardProps {
	image: string;
	title: string;
	price: number;
	dateBooked: string;
}

const FONT_COLOR = '#001933';

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = (props) => {
	return (
		<div className={'rsOrderSummaryCard'}>
			<img className={'cardImage'} src={props.image} alt={'order card image'} />
			<div className={'infoWrapper'}>
				<div className={'resortWrapper'}>
					<img
						className={'resortLogo'}
						src={'../../images/checkoutPage/encore-reunion-logo-color.png'}
						alt={'encore resort'}
					/>
					<Label className={'resortName'} color={FONT_COLOR}>
						Encore Resort
					</Label>
				</div>
				<Label className={'orderTitle'} color={FONT_COLOR}>
					{props.title}
				</Label>
				<Label className={'price'} color={FONT_COLOR}>
					${props.price} total
				</Label>
				<Label className={'dateBooked'} color={FONT_COLOR}>
					Date booked: {props.dateBooked}
				</Label>
			</div>
		</div>
	);
};

export default OrderSummaryCard;
