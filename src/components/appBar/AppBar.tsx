import React, { useState } from 'react';
import Box from '../box/Box';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import './AppBar.scss';
import { Link } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import NavPopout from '../../popups/navPopout/NavPopout';
import LabelButton from '../labelButton/LabelButton';

const AppBar: React.FC = () => {
	const [showSlideOutMenu, setShowSlideOutMenu] = useState<boolean>(false);
	// const user = serviceFactory.get<UserService>('UserService').getCurrentUser();

	return (
		<Box className="rsAppBar">
			<Link path={'/dashboard'}>
				<img src={require('../../images/FullLogo-StandardBlack.png')} alt={'company logo'} width={'111px'} />
			</Link>

			<Box display={'flex'} alignItems={'center'}>
				<LabelButton look={'containedPrimary'} variant={'button'} label={'Learn about spire loyalty'} />
				<Icon
					iconImg={'icon-hamburger-menu'}
					color={'#003A76'}
					size={21}
					cursorPointer
					onClick={() => {
						document.getElementsByTagName('body')[0].style.overflow = 'hidden';
						setShowSlideOutMenu(true);
					}}
				/>
			</Box>

			<NavPopout
				isOpened={showSlideOutMenu}
				onClose={() => {
					document.getElementsByTagName('body')[0].style.overflow = '';
					setShowSlideOutMenu(false);
				}}
			/>
		</Box>
	);
};

export default AppBar;
