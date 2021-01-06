import React from 'react';
import Label from '@bit/redsky.framework.rs.label';
import Box from '../box/Box';
import './Menu.scss';
import MenuItem from './menuItem/MenuItem';
import MenuGroup from './menuGroup/MenuGroup';

const Menu: React.FC = () => {
	return (
		<Box className="rsMenu">
			<Box className="topName" p={'16px 0px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
				<img src={require('../../images/volcanicLogoYellow_T.png')} alt="" />

				<Label variant={'h6'}>VOLCANIC</Label>
			</Box>
			<MenuItem name={'Dashboard'} path={'/dashboard'} iconName={'icon-home'} backgroundColor={'#333333'} />
			<MenuGroup
				name={'Volcanic Retail'}
				defaultOpen={false}
				backgroundColor={'#333333'}
				openedBackgroundColor={'#474747'}
			>
				<MenuItem name={'Brands'} path={'/brands/list'} iconName={'icon-store'} backgroundColor={'#5c5c5c'} />
				<MenuItem
					name={'Companies'}
					path={'/companies/list'}
					iconName={'icon-domain'}
					backgroundColor={'#5c5c5c'}
				/>
				<MenuItem name={'User'} path={'/users/list'} iconName={'icon-person'} backgroundColor={'#5c5c5c'} />
				<MenuItem name={'Products'} path={'/company'} backgroundColor={'#5c5c5c'} />
			</MenuGroup>
			<MenuGroup
				name={'Sales'}
				defaultOpen={false}
				backgroundColor={'#333333'}
				openedBackgroundColor={'#474747'}
			></MenuGroup>
			<MenuItem name={'Reports'} path={'/reports'} iconName={'icon-chart'} />
		</Box>
	);
};

export default Menu;
