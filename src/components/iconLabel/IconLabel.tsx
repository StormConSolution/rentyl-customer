import React from 'react';
import './IconLabel.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';

interface IconLabelProps {
	labelName: string;
	iconImg: string;
	iconPosition: 'top' | 'right' | 'bottom' | 'left';
	iconSize: number;
	labelVariant?:
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'sectionHeader'
		| 'title'
		| 'subtitle1'
		| 'subtitle2'
		| 'body1'
		| 'body2'
		| 'caption'
		| 'button'
		| 'overline'
		| 'srOnly'
		| 'inherit'
		| 'error';
	className?: string;
	onClick?: () => void;
}

const IconLabel: React.FC<IconLabelProps> = (props) => {
	return (
		<Box className={`rsIconLabel ${props.className || ''} ${props.iconPosition}`} onClick={props.onClick}>
			<Icon className={'icon'} iconImg={props.iconImg} size={props.iconSize} />
			<Label variant={props.labelVariant} className={'label'}>
				{props.labelName}
			</Label>
		</Box>
	);
};

export default IconLabel;
