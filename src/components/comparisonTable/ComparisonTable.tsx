import * as React from 'react';
import ComparisonTableResponsive from './comparisonTableResponsive/ComparisonTableResponsive';
import ComparisonTableMobile from './comparisonTableMobile/ComparisonTableMobile';

interface ComparisonTableProps {
	comparisonItems: Misc.ComparisonCardInfo[];
	accommodationDetailList: Api.Accommodation.Res.Details[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = (props) => {
	return (
		<div className={'rsComparisonTable'}>
			<ComparisonTableResponsive
				comparisonItems={props.comparisonItems}
				accommodationDetailList={props.accommodationDetailList}
			/>
			<ComparisonTableMobile />
		</div>
	);
};

export default ComparisonTable;
