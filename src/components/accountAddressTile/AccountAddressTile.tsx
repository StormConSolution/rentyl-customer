import * as React from 'react';
import './AccountAddressTile.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../labelButton/LabelButton';
import LabelRadioButton from '../labelRadioButton/LabelRadioButton';

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
			<Label variant={'body1'}>{props.name}</Label>
			<Label variant={'body1'}>{props.addressLine1}</Label>
			{!!props.addressLine2 && <Label variant={'body1'}>{props.addressLine2}</Label>}
			<Label variant={'body1'}>
				{props.city} {props.state}, {props.zipCode} {props.country}
			</Label>
			<LabelButton look={'none'} variant={'button'} label={'Delete'} onClick={props.onDelete} />
			{!props.isPrimary && (
				<LabelRadioButton
					radioName={'primaryAddress'}
					value={props.id}
					checked={false}
					text={'Set as primary'}
					onSelect={(value) => {
						props.onPrimaryChange(+value);
					}}
				/>
			)}
			{!!props.isPrimary && <Label variant={'h4'}>Primary</Label>}
		</div>
	);
};

export default AccountAddressTile;
