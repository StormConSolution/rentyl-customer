import React, { useState } from 'react';
import Box from '../box/Box';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import './AppBar.scss';
import { Link } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import NavPopout from '../../popups/navPopout/NavPopout';

const AppBar: React.FC = () => {
	const [showSlideOutMenu, setShowSlideOutMenu] = useState<boolean>(false);
	const user = serviceFactory.get<UserService>('UserService').getCurrentUser();

	return (
		<Box className="rsAppBar">
			<Link path={'/dashboard'}>
				<img src={require('../../images/FullLogo-StandardBlack.png')} alt={'company logo'} width={'111px'} />
			</Link>

			<Icon
				iconImg={'icon-hamburger-menu'}
				color={'#003A76'}
				size={21}
				cursorPointer
				onClick={() => setShowSlideOutMenu(true)}
			/>
			<NavPopout isOpened={showSlideOutMenu} onClose={() => setShowSlideOutMenu(false)} />
		</Box>
	);
};

export default AppBar;
