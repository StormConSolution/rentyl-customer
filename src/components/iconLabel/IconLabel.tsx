import React from 'react';
import './IconLabel.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';

interface IconLabelProps {
	className?: string;
	iconImg: string;
	labelName: string;
}

const IconLabel: React.FC<IconLabelProps> = (props) => {
	return (
		<Box className={`rsIconLabel ${props.className || ''}`} display={'flex'}>
			<Icon iconImg={props.iconImg} size={14} />
			<Label className={'labelClass'}>{props.labelName}</Label>
		</Box>
	);
};

export default IconLabel;
