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
			<Box>
				<Label variant={'body1'}>{props.name}</Label>
				<Label variant={'body1'}>{props.addressLine1}</Label>
				{!!props.addressLine2 && <Label variant={'body1'}>{props.addressLine2}</Label>}
				<Label variant={'body1'}>{props.city},</Label>
				<Label variant={'body1'}>
					{props.state} {props.zipCode} {props.country}
				</Label>
			</Box>
			{!props.isPrimary && (
				<Icon iconImg={'icon-close'} color={'#797979'} onClick={props.onDelete} cursorPointer />
			)}
		</div>
	);
};

export default AccountAddressTile;
