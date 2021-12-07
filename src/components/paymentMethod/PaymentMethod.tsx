import * as React from 'react';
import './PaymentMethod.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import { StringUtils } from '../../utils/utils';

interface PaymentMethodProps {
	userCheckout: Misc.Checkout;
	userPrimaryPaymentMethod: Api.User.PaymentMethod | undefined;
	onEditClickCallback?: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = (props) => {
	function renderPaymentType() {
		if (props.userPrimaryPaymentMethod?.type && props.userCheckout.useExistingPaymentMethod)
			return StringUtils.capitalizeFirst(props.userPrimaryPaymentMethod.type);
		if (props.userCheckout.pmData) return StringUtils.capitalizeFirst(props.userCheckout.pmData.card_type);
		if (props.userCheckout.usePoints) return 'Points';
		return 'None';
	}
	return (
		<div className={'rsPaymentMethod'}>
			<Label className={'sectionTitle'}>Payment Method</Label>
			<Box display={'flex'} alignItems={'center'}>
				<div className={'creditCardImage'}>{renderPaymentType()}</div>
				{props.userCheckout.useExistingPaymentMethod && props.userPrimaryPaymentMethod && (
					<div className={'paymentInfoWrapper'}>
						<Label className={'fullName'}>Existing Card</Label>
						<div className={'cardInfoWrapper'}>
							<Label>Ending in</Label>
							<Label className={'lastFourDigits'}>{props.userPrimaryPaymentMethod.last4}</Label>
						</div>
					</div>
				)}
				{props.userCheckout.pmData && !props.userCheckout.useExistingPaymentMethod && (
					<div className={'paymentInfoWrapper'}>
						<Label className={'fullName'}>New Card</Label>
						<div className={'cardInfoWrapper'}>
							<Label>Ending in</Label>
							<Label className={'lastFourDigits'}>{props.userCheckout.pmData.last_four_digits}</Label>
						</div>
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
