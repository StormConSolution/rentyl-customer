import * as React from 'react';
import ComparisonTableResponsive from './comparisonTableResponsive/ComparisonTableResponsive';
import ComparisonTableMobile from './comparisonTableMobile/ComparisonTableMobile';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface ComparisonTableProps {
	comparisonState: Misc.ComparisonState;
	destinationDetailList: Api.Destination.Res.Get[];
	handlePinToFirst?: (pinToFirst: boolean, comparisonId: number) => {};
}

const ComparisonTable: React.FC<ComparisonTableProps> = (props) => {
	const size = useWindowResizeChange();
	return size !== 'small' ? (
		<ComparisonTableResponsive
			comparisonState={props.comparisonState}
			destinationDetailList={props.destinationDetailList}
		/>
	) : (
		<ComparisonTableMobile
			comparisonState={props.comparisonState}
			destinationDetailList={props.destinationDetailList}
		/>
	);
};

export default ComparisonTable;
