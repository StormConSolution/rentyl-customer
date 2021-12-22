import * as React from 'react';
import './PaymentMethod.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import { StringUtils } from '../../utils/utils';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';

interface PaymentMethodProps {
	userCheckout: Misc.Checkout;
	userPrimaryPaymentMethod: Api.User.PaymentMethod | undefined;
	onEditClickCallback?: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = (props) => {
	const reservationFilters = useRecoilValue<Misc.ReservationFilters>(globalState.reservationFilters);

	function getPaymentLogo(cardType: string) {
		let logo = '';
		switch (cardType.toLowerCase()) {
			case 'visa':
				logo = '../../images/creditCardLogos/Visa.svg';
				break;
			case 'mastercard':
				logo = '../../images/creditCardLogos/MasterCard.svg';
				break;
			case 'discover':
				logo = '../../images/creditCardLogos/Discover.svg';
				break;
			case 'amex':
				logo = '../../images/creditCardLogos/AmEx.svg';
				break;
		}
		if (!logo) return StringUtils.capitalizeFirst(cardType);
		// else return logo;
		else return <img src={logo} alt={'credit Card Logo'} width={104} height={64} />;
	}

	function renderPaymentType() {
		if (props.userPrimaryPaymentMethod?.type && props.userCheckout.useExistingPaymentMethod)
			return StringUtils.capitalizeFirst(props.userPrimaryPaymentMethod.type);
		if (props.userCheckout.pmData) return getPaymentLogo(props.userCheckout.pmData.card_type);
		if (reservationFilters.redeemPoints) return 'Points';
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
