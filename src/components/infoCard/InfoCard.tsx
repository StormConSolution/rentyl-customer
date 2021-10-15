import * as React from 'react';
import './InfoCard.scss';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { Box } from '@bit/redsky.framework.rs.996';

interface InfoCardProps {
	title?: string;
	body?: string;
	bodyReactNode?: React.ReactNode;
	bodyVariant?: 'body1' | 'body2';
	icon?: string;
	height?: string;
	width?: string;
	padding?: string;
	boxShadow?: boolean;
	className?: string;
}

const InfoCard: React.FC<InfoCardProps> = (props) => {
	const size = useWindowResizeChange();

	return (
		<Paper
			className={`rsInfoCard ${props.className || ''}`}
			width={props.width}
			height={props.height}
			boxShadow={props.boxShadow}
			padding={props.padding || '0 20px'}
			backgroundColor={'#FCFBF8'}
		>
			{!!props.icon && <Icon iconImg={props.icon} size={36} color={'#cc9e0d'} />}
			<Box className={'centerTitle'}>
				{!!props.title && <Label variant={size === 'small' ? 'h4' : 'h2'}>{props.title}</Label>}
				{!!props.body && !props.bodyReactNode && (
					<Label variant={props.bodyVariant || 'body1'}>{props.body}</Label>
				)}
				{!props.body && !!props.bodyReactNode && props.bodyReactNode}
			</Box>
		</Paper>
	);
};

export default InfoCard;
