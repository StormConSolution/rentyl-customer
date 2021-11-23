import * as React from 'react';
import ComparisonTableResponsive from './comparisonTableResponsive/ComparisonTableResponsive';
import ComparisonTableMobile from './comparisonTableMobile/ComparisonTableMobile';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface ComparisonTableProps {
	comparisonItems: Misc.ComparisonState;
	accommodationDetailList: Api.Accommodation.Res.Details[];
	handlePinToFirst?: (pinToFirst: boolean, comparisonId: number) => {};
}

const ComparisonTable: React.FC<ComparisonTableProps> = (props) => {
	const size = useWindowResizeChange();
	return (
		<div className={'rsComparisonTable'} />
		// <div className={'rsComparisonTable'}>
		// 	{size !== 'small' ? (
		// 		<></>
		// 	) : (
		// 		// <ComparisonTableResponsive
		// 		// 	comparisonItems={props.comparisonItems}
		// 		// 	accommodationDetailList={props.accommodationDetailList}
		// 		// />
		// 		<></>
		// 		// <ComparisonTableMobile
		// 		// 	comparisonItems={props.comparisonItems}
		// 		// 	accommodationDetailList={props.accommodationDetailList}
		// 		// />
		// 	)}
		// </div>
	);
};

export default ComparisonTable;
