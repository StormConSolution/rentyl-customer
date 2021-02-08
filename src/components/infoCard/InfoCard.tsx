import * as React from 'react';
import './InfoCard.scss';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import Box from '../box/Box';

interface InfoCardProps {
	title?: string;
	body?: string;
	icon?: string;
	height?: string;
	width?: string;
	boxShadow?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = (props) => {
	return (
		<Paper
			className={'rsInfoCard'}
			width={props.width}
			height={props.height}
			boxShadow={props.boxShadow}
			padding={'0 20px'}
			backgroundColor={'#FCFBF8'}
		>
			{!!props.icon && <Icon iconImg={props.icon} size={36} color={'#cc9e0d'} />}
			<Box>
				{!!props.title && <Label variant={'h3'}>{props.title}</Label>}
				{!!props.body && <Label variant={'body2'}>{props.body}</Label>}
			</Box>
		</Paper>
	);
};

export default InfoCard;
