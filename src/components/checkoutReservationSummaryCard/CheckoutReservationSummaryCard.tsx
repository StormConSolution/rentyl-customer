import * as React from 'react';
import './CheckoutReservationSummaryCard.scss';
import Label from '@bit/redsky.framework.rs.label';

export interface CheckoutReservationSummaryCardProps {
	image: string;
	title: string;
	price: number;
	dateBooked: string;
}

const CheckoutReservationSummaryCard: React.FC<CheckoutReservationSummaryCardProps> = (props) => {
	return (
		<div className={'rsCheckoutReservationSummaryCard'}>
			<img className={'cardImage'} src={props.image} alt={'order card image'} />
			<div className={'infoWrapper'}>
				<div className={'resortWrapper'}>
					<img
						className={'resortLogo'}
						src={'../../images/checkoutPage/encore-reunion-logo-color.png'}
						alt={'encore resort'}
					/>
					<Label className={'resortName'}>Encore Resort</Label>
				</div>
				<Label className={'orderTitle'}>{props.title}</Label>
				<Label className={'price'}>${props.price} total</Label>
				<Label className={'dateBooked'}>Date booked: {props.dateBooked}</Label>
			</div>
		</div>
	);
};

export default CheckoutReservationSummaryCard;
