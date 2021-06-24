import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import React from 'react';
interface AccomodationDetailsProps {
	room: number;
	accommodationName: string;
}
const AccommodationDetails: React.FC<AccomodationDetailsProps> = (props) => {
	return (
		<Box>
			<Label variant={'h3'}>Room {props.room}</Label>
			<Label variant={'body1'}>Date 1 - Date 2</Label>
			<Label variant={'body1'}>2 Adults</Label>
			<Label variant={'body1'}>0 Children</Label>
			<Box display={'flex'}>
				<Label variant={'body1'}>{props.accommodationName}</Label>
				<Label variant={'body1'}>$1000</Label>
			</Box>
			<Box display={'flex'}>
				<Label variant={'body1'}>2 Nights</Label>
				<Label variant={'body1'}>expand here</Label>
			</Box>
			<Box display={'flex'}>
				<Label variant={'body1'}>Taxes and Fees</Label>
				<Label variant={'body1'}>$500</Label>
			</Box>
			<Box display={'flex'}>
				<Label variant={'body1'}>Details</Label>
				<Label variant={'body1'}>expand</Label>
			</Box>
			<Box display={'flex'}>
				<Label variant={'body1'}>Edit</Label>
				<Label variant={'body1'}>Remove</Label>
			</Box>
		</Box>
	);
};

export default AccommodationDetails;
