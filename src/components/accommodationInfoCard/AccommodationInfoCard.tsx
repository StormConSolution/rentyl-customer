import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import Paper from '../paper/Paper';
import './AccommodationInfoCard.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

export interface AccommodationInfoCardProps {
	width?: string;
	height?: string;
	logoImagePath: string;
	destinationName: string;
	accommodationName: string;
	accommodationDescription: string;
}

const AccommodationInfoCard: React.FC<AccommodationInfoCardProps> = (props) => {
	const size = useWindowResizeChange();
	return (
		<Paper
			padding={size === 'small' ? '25px' : '50px'}
			boxShadow
			backgroundColor={'#FCFBF8'}
			width={size === 'small' ? '335px' : '536px'}
			className="rsAccommodationInfoCard"
		>
			<img className="destinationLogo" src={props.logoImagePath} alt={props.destinationName + ' logo'} />
			<Label variant={size === 'small' ? 'h4' : 'h2'} display="block">
				{props.destinationName}
			</Label>
			<Label variant={size === 'small' ? 'h2' : 'h1'} display="block">
				{props.accommodationName}
			</Label>
			<Label variant={'body2'} display="block">
				{props.accommodationDescription}
			</Label>
		</Paper>
	);
};

export default AccommodationInfoCard;
