import React from 'react';
import './MenuGroup.scss';

import Accordion from '@bit/redsky.framework.rs.accordion';

interface MenuGroupProps {
	name?: string;
	nameReact?: React.ReactNode;
	backgroundColor?: string;
	openedBackgroundColor?: string;
	defaultOpen: boolean;
}

const MenuGroup: React.FC<MenuGroupProps> = (props) => {
	return (
		<Accordion
			title={props.name}
			titleReact={props.nameReact}
			color={'#fff'}
			backgroundColor={props.backgroundColor}
			openedBackgroundColor={props.openedBackgroundColor}
			iconLeft={'icon-folder'}
			isOpen={props.defaultOpen}
		>
			{props.children}
		</Accordion>
	);
};

export default MenuGroup;
