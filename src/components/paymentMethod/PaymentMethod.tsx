import * as React from 'react';
import './PaymentMethod.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';

interface PaymentMethodProps {
	userCheckout: Api.User.Req.Checkout;
	userPrimaryPaymentMethod: Api.User.PaymentMethod | undefined;
	onEditClickCallback?: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = (props) => {
	function renderPaymentType() {
		if (props.userCheckout.paymentInfo) return 'New Card';
		if (props.userCheckout.usePoints) return 'Points';
		return 'Card';
	}
	return (
		<div className={'rsPaymentMethod'}>
			<Label className={'sectionTitle'}>Payment Method</Label>
			<Box display={'flex'} alignItems={'center'}>
				<div className={'creditCardImage'}>{renderPaymentType()}</div>
				{!!props.userCheckout.paymentInfo && (
					<div className={'paymentInfoWrapper'}>
						<Label className={'fullName'}>Card</Label>
						{props.userCheckout.useExistingPaymentMethod && props.userPrimaryPaymentMethod && (
							<div className={'cardInfoWrapper'}>
								<Label>Ending in</Label>
								<Label className={'lastFourDigits'}>{props.userPrimaryPaymentMethod.last4}</Label>
							</div>
						)}
					</div>
				)}
			</Box>
			{!!props.onEditClickCallback && (
				<Icon
					className={'editIcon'}
					iconImg={'icon-edit'}
					size={32}
					color={'black'}
					onClick={props.onEditClickCallback}
				/>
			)}
		</div>
	);
};

export default PaymentMethod;
