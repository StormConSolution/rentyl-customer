import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import Paper from '../paper/Paper';
import './AccomodationInfoCard.scss';

export interface AccomodationInfoCardProps {
	width?: string;
	height?: string;
	logoImagePath: string;
	destinationName: string;
	accomodationName: string;
	accomodationDescription: string;
}

const AccomodationInfoCard: React.FC<AccomodationInfoCardProps> = (props) => {
	return (
		<Paper width={props.width} height={props.height} boxShadow className="rsAccomodationInfoCard">
			<img className="destinationLogo" src={props.logoImagePath} alt={props.destinationName + ' logo'} />
			<Label variant="h2" display="block">
				{props.destinationName}
			</Label>
			<Label variant="h1" display="block">
				{props.accomodationName}
			</Label>
			<Label variant="body2" display="block">
				{props.accomodationDescription}
			</Label>
		</Paper>
	);
};

export default AccomodationInfoCard;
