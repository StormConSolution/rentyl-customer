import * as React from 'react';
import './CheckoutReservationSummaryCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '../../utils/utils';

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
					<Label variant={'customSeven'}>Encore Resort</Label>
				</div>
				<Label variant={'newDesignFont1'}>{props.title}</Label>
				<Label variant={'newDesignFont2'}>${StringUtils.formatMoney(props.price)} Total</Label>
				<Label variant={'customSeven'}>Date Booked: {props.dateBooked}</Label>
			</div>
		</div>
	);
};

export default CheckoutReservationSummaryCard;
