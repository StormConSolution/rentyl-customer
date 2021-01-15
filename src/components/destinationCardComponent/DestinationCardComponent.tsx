import * as React from 'react';
import Box from '../box/Box';

interface DestinationCardComponentProps {
	name: string;
	code: string;
	status: string;
	maxOccupancy: number;
	maxSleeps: number;
	roomClass: string;
	adaCompliant: number;
	totalCost: number;
	currencyCode: string;
	quantityAvailable: number;
}

const DestinationCardComponent: React.FC<DestinationCardComponentProps> = (props, key) => {
	return (
		<Box key={key} className="searchResults" display={'flex'}>
			<Box className="destinationPictures" display={'flex'}></Box>
			<Box>
				<h1>{props.name}</h1>
				<p>
					&emsp;Code: {props.code}, Status: {props.status}, Max Occupancy: {props.maxOccupancy}, Max Sleeps:{' '}
					{props.maxSleeps}, Room Class: {props.roomClass}, ADA Compliant: {props.adaCompliant}, Total Cost:{' '}
					{props.totalCost}, Currency Code: {props.currencyCode}, Quantity Available:{' '}
					{props.quantityAvailable}
				</p>
			</Box>
		</Box>
	);
};
export default DestinationCardComponent;
