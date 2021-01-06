import * as React from 'react';
import './UserBadge.scss';
import Label from '@bit/redsky.framework.rs.label';
import Button from '@bit/redsky.framework.rs.button';
import Icon from '@bit/redsky.framework.rs.icon';

import { useState } from 'react';
import Box from '../box/Box';
import DropDownMenu from './dropDownMenu/DropDownMenu';
import DropDownItem from './dropDownItem/DropDownItem';
import Avatar from '@bit/redsky.framework.rs.avatar';

interface UserBadgeProps {
	userName: string;
	imageUrl?: string;
}

const UserBadge: React.FC<UserBadgeProps> = (props) => {
	const [menuOpen, setMenuOpen] = useState<boolean>(false);

	return (
		<div className={'rsUserBadge'}>
			<Avatar widthHeight={40} image={props.imageUrl} />
			<Label variant={'subtitle1'}>{props.userName}</Label>
			<Button look={'none'} onClick={() => setMenuOpen(!menuOpen)}>
				<Icon iconImg={'icon-chevron-down'} size={12} color={'#fff'} />
			</Button>
			{menuOpen && (
				<DropDownMenu>
					<DropDownItem
						title={'Sign out'}
						iconImg={'icon-logout'}
						onClick={() => {
							localStorage.clear();
							window.location.assign('/');
						}}
					/>
				</DropDownMenu>
			)}
		</div>
	);
};

export default UserBadge;
