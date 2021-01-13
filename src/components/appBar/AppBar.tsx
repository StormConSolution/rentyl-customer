import React from 'react';
import Box from '../box/Box';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import './AppBar.scss';
import UserBadge from '../userBadge/UserBadge';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';

const AppBar: React.FC = () => {
	const user = serviceFactory.get<UserService>('UserService').getCurrentUser();

	return (
		<Box
			className="rsAppBar"
			bgcolor={'#333333'}
			p={'12px 20px'}
			display={'flex'}
			justifyContent={'flex-end'}
			alignItems={'center'}
		>
			<Button look={'none'} className={'notificationBtn'}>
				<Icon iconImg={'icon-notification'} size={20} color={'#fff'} />
			</Button>
			<UserBadge userName={`${user?.firstName}`} imageUrl={''} />
		</Box>
	);
};

export default AppBar;
