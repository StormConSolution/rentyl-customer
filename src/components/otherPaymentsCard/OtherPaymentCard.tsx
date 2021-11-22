import * as React from 'react';
import './OtherPaymentCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelRadioButton from '../labelRadioButton/LabelRadioButton';
import Icon from '@bit/redsky.framework.rs.icon';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface OtherPaymentCardProps {
	name: string;
	id: number;
	last4: number;
	cardType: string;
	onDelete?: () => void;
	onSetPrimary?: (value: number) => void;
	isPrimary: 1 | 0;
}

const OtherPaymentCard: React.FC<OtherPaymentCardProps> = (props) => {
	const size = useWindowResizeChange();

	return (
		<Box className={'rsOtherPaymentCard'}>
			{!props.isPrimary ? (
				<LabelRadioButton
					labelSize={'customFifteen'}
					radioName={'primaryCreditCard'}
					value={props.id}
					checked={false}
					text={'Set as primary'}
					onSelect={(value) => {
						let newValue: number;
						if (typeof value === 'string') {
							newValue = parseInt(value);
						} else {
							newValue = value;
						}
						if (props.onSetPrimary) props.onSetPrimary(newValue);
					}}
				/>
			) : (
				<Label variant={'customSeventeen'}>Primary</Label>
			)}
			<Box display={size === 'small' ? 'flex' : ''}>
				<div>
					<Label variant={'body1'}>{props.name}</Label>
					<Label variant={'body1'}>{`${props.cardType} ending in ${props.last4}`}</Label>
				</div>
				{!props.isPrimary && size === 'small' && (
					<Icon
						className={'marginLeft'}
						iconImg={'icon-close'}
						color={'#797979'}
						onClick={props.onDelete}
						cursorPointer
					/>
				)}
			</Box>
			{!props.isPrimary && size !== 'small' && (
				<Icon iconImg={'icon-close'} color={'#797979'} onClick={props.onDelete} cursorPointer />
			)}
		</Box>
	);
};

export default OtherPaymentCard;
