import * as React from 'react';
import './OtherPaymentCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../labelButton/LabelButton';

interface OtherPaymentCardProps {
	name: string;
	cardNumber: string;
	expDate: string;
	onDelete: () => void;
	onSetPrimary: () => void;
}

const OtherPaymentCard: React.FC<OtherPaymentCardProps> = (props) => {
	return (
		<Box className={'rsOtherPaymentCard'}>
			<Box mb={10}>
				<Label variant={'caption'}>Name on card</Label>
				<Label variant={'body1'}>{props.name}</Label>
			</Box>
			<Box mb={10}>
				<Label variant={'caption'}>Card Number</Label>
				<Label variant={'body1'}>{props.cardNumber}</Label>
			</Box>
			<Box mb={20}>
				<Label variant={'caption'}>Exp Date</Label>
				<Label variant={'body1'}>{props.expDate}</Label>
			</Box>
			<Box display={'flex'} justifyContent={'space-between'}>
				<LabelButton look={'none'} variant={'button'} label={'Set Primary'} onClick={props.onSetPrimary} />
				<LabelButton look={'none'} variant={'button'} label={'Delete'} onClick={props.onDelete} />
			</Box>
		</Box>
	);
};

export default OtherPaymentCard;
