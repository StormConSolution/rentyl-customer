import * as React from 'react';
import './PaymentMethod.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';

interface PaymentMethodProps {
	cardHolderName: string;
	cardBrand: string;
	lastFourDigits: number;
	onEditClickCallback?: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = (props) => {
	return (
		<div className={'rsPaymentMethod'}>
			<Label className={'sectionTitle'}>Payment Method</Label>
			<Box display={'flex'} alignItems={'center'}>
				<div className={'creditCardImage'}>Card</div>
				<div className={'paymentInfoWrapper'}>
					<Label className={'fullName'}>{props.cardHolderName}</Label>
					<div className={'cardInfoWrapper'}>
						<Label>{props.cardBrand} ending in</Label>
						<Label className={'lastFourDigits'}>{props.lastFourDigits}</Label>
					</div>
				</div>
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
