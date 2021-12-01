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

const FONT_COLOR = '#001933';

const PaymentMethod: React.FC<PaymentMethodProps> = (props) => {
	return (
		<div className={'rsPaymentMethod'}>
			<Label className={'sectionTitle'} color={FONT_COLOR}>
				Payment Method
			</Label>
			<Box display={'flex'} alignItems={'center'}>
				<div className={'creditCardImage'}>Card</div>
				<div className={'paymentInfoWrapper'}>
					<Label className={'fullName'} color={FONT_COLOR}>
						{props.cardHolderName}
					</Label>
					<div className={'cardInfoWrapper'}>
						<Label color={'#001933'}>{props.cardBrand} ending in</Label>
						<Label className={'lastFourDigits'} color={FONT_COLOR}>
							{props.lastFourDigits}
						</Label>
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
