import * as React from 'react';
import './DropDownMenu.scss';
import Box from '../../box/Box';
import { ReactNode } from 'react';

interface UserDropDownProps {
	children?: ReactNode;
}

const DropDownMenu: React.FC<UserDropDownProps> = (props) => {
	return (
		<Box className={'rsDropDownMenu'} padding={10}>
			{props.children}
		</Box>
	);
};

export default DropDownMenu;
