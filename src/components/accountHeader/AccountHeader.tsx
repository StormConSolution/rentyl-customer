import * as React from 'react';
import './AccountHeader.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import LabelButton from '../labelButton/LabelButton';
import router from '../../utils/router';

interface AccountHeaderProps {
	selected:
		| 'PERSONAL_INFO'
		| 'ADDRESSES'
		| 'PAYMENT_METHODS'
		| 'NOTIFICATION_PREFERENCES'
		| 'DIGITAL_REWARDS'
		| 'SOCIAL_MEDIA';
}

const AccountHeader: React.FC<AccountHeaderProps> = (props) => {
	return (
		<div className={'rsAccountHeader'}>
			<Box>
				<Label variant={'h1'}>Your Account</Label>
				<Box display={'flex'} justifyContent={'center'}>
					<LabelButton
						look={'none'}
						variant={'button'}
						className={`tab ${props.selected === 'PERSONAL_INFO' ? 'selected' : ''}`}
						label={'Personal Info'}
						onClick={() => {
							router.navigate('/account/personal-info');
						}}
					/>
					<LabelButton
						look={'none'}
						variant={'button'}
						className={`tab ${props.selected === 'ADDRESSES' ? 'selected' : ''}`}
						label={'Addresses'}
						onClick={() => {
							router.navigate('/account/address');
						}}
					/>
					<LabelButton
						look={'none'}
						variant={'button'}
						className={`tab ${props.selected === 'PAYMENT_METHODS' ? 'selected' : ''}`}
						label={'Payment Methods'}
						onClick={() => {
							router.navigate('/account/payment-methods');
						}}
					/>
				</Box>
			</Box>
		</div>
	);
};

export default AccountHeader;
