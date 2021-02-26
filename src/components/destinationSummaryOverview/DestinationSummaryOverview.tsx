import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import './DestinationSummaryOverview.scss';

export interface DestinationSummaryOverviewProps {
	text?: string;
	amenities?: AmenityIcon[];
	finePrint?: string;
	className?: string;
}

interface AmenityIcon {
	iconName: string;
	label: string;
}

const DestinationSummaryOverview: React.FC<DestinationSummaryOverviewProps> = (props) => {
	function renderAmenities(amenities: AmenityIcon[]): JSX.Element[] {
		return amenities.map((amenity: AmenityIcon, index: number) => {
			return (
				<div key={index} className="amenityIcon">
					<Icon iconImg={amenity.iconName} />
					<Label variant="caption">{amenity.label}</Label>
				</div>
			);
		});
	}

	return (
		<div className={`rsDestinationSummaryOverview`}>
			{!!props.text && <Label variant="body2">{props.text}</Label>}
			{!!props.amenities && <Box className="amenities">{renderAmenities(props.amenities)}</Box>}
			{!!props.finePrint && (
				<div className="finePrint">
					<Label variant="body2">{props.finePrint}</Label>
				</div>
			)}
		</div>
	);
};

export default DestinationSummaryOverview;
