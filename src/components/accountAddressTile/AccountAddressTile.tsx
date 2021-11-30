import * as React from 'react';
import './AccountAddressTile.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelRadioButton from '../labelRadioButton/LabelRadioButton';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface AddressTileProps {
	id: number;
	name: string;
	addressLine1: string;
	addressLine2?: string;
	zipCode: number;
	city: string;
	state: string;
	country: string;
	isPrimary: 1 | 0 | boolean;
	onDelete: () => void;
	onPrimaryChange: (addressId: number) => void;
}

const AccountAddressTile: React.FC<AddressTileProps> = (props) => {
	const size = useWindowResizeChange();
	return (
		<div className={'rsAccountAddressTile'}>
			{!props.isPrimary ? (
				<LabelRadioButton
					labelSize={'customFifteen'}
					radioName={'primaryAddress'}
					value={props.id}
					checked={false}
					text={'Set as primary'}
					onSelect={(value) => {
						props.onPrimaryChange(+value);
					}}
				/>
			) : (
				<Label variant={'customSeventeen'}>Primary</Label>
			)}
			<Box display={size === 'small' ? 'flex' : ''} alignItems={size === 'small' ? 'center' : ''}>
				<div>
					<Label variant={'body1'}>{props.name}</Label>
					<Label variant={'body1'}>{props.addressLine1}</Label>
					{!!props.addressLine2 && <Label variant={'body1'}>{props.addressLine2}</Label>}
					<Label variant={'body1'}>{props.city},</Label>
					<Label variant={'body1'}>
						{props.state} {props.zipCode} {props.country}
					</Label>
				</div>
				{!props.isPrimary && size === 'small' && (
					<Icon
						className={'marginLeft'}
						iconImg={'icon-trash'}
						color={'#000000'}
						onClick={props.onDelete}
						cursorPointer
						size={21}
					/>
				)}
			</Box>
			{!props.isPrimary && size !== 'small' && (
				<Icon iconImg={'icon-trash'} color={'#000000'} onClick={props.onDelete} cursorPointer size={21} />
			)}
		</div>
	);
};

export default AccountAddressTile;
