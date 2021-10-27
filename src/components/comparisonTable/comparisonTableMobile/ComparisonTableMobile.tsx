import * as React from 'react';
import './ComparisonTableMobile.scss';
import { Box } from '@bit/redsky.framework.rs.996';

interface ComparisonTableMobileProps {}

const ComparisonTableMobile: React.FC<ComparisonTableMobileProps> = (props) => {
	// function pinAccommodationToFirstOfList(index: number) {
	// 	if (index === 0) return;
	// 	let modifiedComparisonItems = [...comparisonItems];
	// 	modifiedComparisonItems.unshift(comparisonItems[index]);
	// 	modifiedComparisonItems.splice(index + 1, 1);
	// 	setComparisonItems(modifiedComparisonItems);
	// }

	return (
		<Box className={'rsComparisonTableMobile'}>
			<Box>
				<Box></Box>
				<Box></Box>
			</Box>
		</Box>
	);
};

export default ComparisonTableMobile;
