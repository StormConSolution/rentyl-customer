import * as React from 'react';
import './DropDownItem.scss';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import Box from '../../box/Box';

interface DropDownItemProps {
	title: string;
	iconImg?: string;
	onClick?: () => void;
}

const DropDownItem: React.FC<DropDownItemProps> = (props) => {
	return (
		<Box className={'rsDropDownItem'} display={'flex'} alignItems={'center'} onClick={props.onClick}>
			<Label variant={'body1'}>{props.title}</Label>
			{!!props.iconImg && <Icon iconImg={props.iconImg} color={'#ffffff'} />}
		</Box>
	);
};

export default DropDownItem;
