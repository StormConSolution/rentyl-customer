import * as React from 'react';
import './ComparisonTableResponsive.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import ComparisonAccommodationCardResponsive from '../../comparisonAccommodationCard/comparisonAccommodationCardResponsive/ComparisonAccommodationCardResponsive';
import Label from '@bit/redsky.framework.rs.label';

interface ComparisonTableResponsiveProps {
	comparisonState: Misc.ComparisonState;
	destinationDetailList: Api.Destination.Res.Get[];
}

const ComparisonTableResponsive: React.FC<ComparisonTableResponsiveProps> = (props) => {
	function renderTableItems() {
		return props.comparisonState.destinationDetails.map((destination, index) => {
			let accommodationDetails = props.destinationDetailList.find((details) => {
				// if (details.destinationId === destination.destinationId) {
				// 	return details;
				// }
			});
			return (
				<Box key={destination.destinationId}>
					{/*<ComparisonAccommodationCardResponsive*/}
					{/*	accommodationDetails={accommodationDetails || props.accommodationDetailList[0]}*/}
					{/*	destinationDetails={destination}*/}
					{/*/>*/}
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
