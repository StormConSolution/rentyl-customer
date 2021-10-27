import * as React from 'react';
import './ComparisonTableResponsive.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import ComparisonAccommodationCard from '../../comparisonAccommodationCard/ComparisonAccommodationCard';
import Label from '@bit/redsky.framework.rs.label';
export interface TableData {
	description: JSX.Element[];
	guestLimit: JSX.Element[];
	extraBedding: JSX.Element[];
	features: JSX.Element[];
	adaCompliant: JSX.Element[];
}

interface ComparisonTableResponsiveProps {
	comparisonItems: Misc.ComparisonCardInfo[];
	accommodationDetailList: Api.Accommodation.Res.Details[];
}

const ComparisonTableResponsive: React.FC<ComparisonTableResponsiveProps> = (props) => {
	function renderTableItems() {
		return props.comparisonItems.map((destination, index) => {
			let accommodationDetails = props.accommodationDetailList.find((details) => {
				return details.id === destination.selectedRoom || details.destinationId === destination.destinationId;
			});
			return (
				<Box>
					<ComparisonAccommodationCard
						accommodationDetails={accommodationDetails || props.accommodationDetailList[0]}
						destinationDetails={destination}
					/>
				</Box>
			);
		});
	}

	return (
		<Box className={'rsComparisonTableResponsive'}>
			<Box className={'rowTitles'}>
				<Box height={'100px'}></Box>
				<Label variant={'h4'}>Property Type</Label>
				<Label variant={'h4'} className={'oddCell'}>
					Guest Limit
				</Label>
				<Label variant={'h4'}>Extra Bedding</Label>
				<Label variant={'h4'} className={'oddCell'}>
					Accessible
				</Label>
				<Label variant={'h4'}>Features</Label>
				<Label variant={'h4'} className={'oddCell'}>
					Description
				</Label>
			</Box>
			{renderTableItems()}
		</Box>
	);
};

export default ComparisonTableResponsive;
