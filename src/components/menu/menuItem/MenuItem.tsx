import React from 'react';
import Label from '@bit/redsky.framework.rs.label';
import { Link } from '@bit/redsky.framework.rs.996';
import './MenuItem.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';

interface MenuItemProps {
	name: string;
	path: string;
	iconName?: string;
	backgroundColor?: string;
}
const MenuItem: React.FC<MenuItemProps> = (props) => {
	return (
		<Link path={props.path}>
			<Button look={'none'} className="rsMenuItem" backgroundColor={props.backgroundColor}>
				{props.iconName && <Icon iconImg={props.iconName} size={17} />}
				<Label className={props.iconName && 'marginLeft'} variant={'subtitle2'}>
					{props.name}
				</Label>
			</Button>
		</Link>
	);
};

export default MenuItem;
