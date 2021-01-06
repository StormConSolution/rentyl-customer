import React from 'react';
import Label from '@bit/redsky.framework.rs.label';
import Box from '../../box/Box';

interface MenuTextItemProps {
	name: string;
}

const MenuTextItem: React.FC<MenuTextItemProps> = (props) => {
	return (
		<Box className="rsMenuTextItem" p={'5px 20px'}>
			<Label>{props.name}</Label>
		</Box>
	);
};

export default MenuTextItem;
