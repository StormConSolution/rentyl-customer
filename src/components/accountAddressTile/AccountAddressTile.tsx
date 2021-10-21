import * as React from 'react';
import './AccountAddressTile.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../labelButton/LabelButton';
import LabelRadioButton from '../labelRadioButton/LabelRadioButton';
import Paper from '../paper/Paper';
import { Box } from '@bit/redsky.framework.rs.996';

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
		<Paper className={'rsAccountAddressTile'}>
			{!props.isPrimary ? (
				<LabelRadioButton
					radioName={'primaryAddress'}
					value={props.id}
					checked={false}
					text={'Set as primary'}
					onSelect={(value) => {
						props.onPrimaryChange(+value);
					}}
				/>
			) : (
				<Label variant={'h4'}>Primary</Label>
			)}
			<Box>
				<Label variant={'body1'}>{props.name}</Label>
				<Label variant={'body1'}>{props.addressLine1}</Label>
				{!!props.addressLine2 && <Label variant={'body1'}>{props.addressLine2}</Label>}
				<Label variant={'body1'}>{props.city},</Label>
				<Label variant={'body1'}>
					{props.state} {props.zipCode} {props.country}
				</Label>
				<LabelButton look={'none'} variant={'button'} label={'Delete'} onClick={props.onDelete} />
			</Box>
		</Paper>
	);
};

export default AccountAddressTile;
