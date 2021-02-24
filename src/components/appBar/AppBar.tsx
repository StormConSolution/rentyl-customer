import React, { useState } from 'react';
import Box from '../box/Box';
import './AppBar.scss';
import { Link } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import NavDrawer from '../../popups/navDrawer/NavDrawer';
import LabelButton from '../labelButton/LabelButton';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

const AppBar: React.FC = () => {
	const [showSlideOutMenu, setShowSlideOutMenu] = useState<boolean>(false);
	// const user = serviceFactory.get<UserService>('UserService').getCurrentUser();
	const size = useWindowResizeChange();

	return (
		<Box className="rsAppBar">
			<Link path={'/'}>
				<img src={require('../../images/FullLogo-StandardBlack.png')} alt={'company logo'} width={'111px'} />
			</Link>

			<Box display={'flex'} alignItems={'center'}>
				{!size && (
					<LabelButton look={'containedPrimary'} variant={'button'} label={'Learn about spire loyalty'} />
				)}
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

			<NavDrawer
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
