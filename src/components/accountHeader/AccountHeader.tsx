import * as React from 'react';
import './AccountHeader.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import LinkButton from '../linkButton/LinkButton';

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
				<Box display={'flex'} justifyContent={'space-around'}>
					<LinkButton
						path={'/account/personal-info'}
						label={'Personal Info'}
						look={'none'}
						className={`tab ${props.selected === 'PERSONAL_INFO' ? 'selected' : ''}`}
					/>
					<LinkButton
						look={'none'}
						className={`tab ${props.selected === 'ADDRESSES' ? 'selected' : ''}`}
						label={'Addresses'}
						path={'/account/address'}
					/>
					<LinkButton
						look={'none'}
						className={`tab ${props.selected === 'PAYMENT_METHODS' ? 'selected' : ''}`}
						label={'Payment Methods'}
						path={'/account/payment-methods'}
					/>
				</Box>
			</Box>
		</div>
	);
};

export default AccountHeader;
