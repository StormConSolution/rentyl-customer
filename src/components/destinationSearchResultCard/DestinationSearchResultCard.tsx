import React from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { DestinationSummaryTab } from '../tabbedDestinationSummary/TabbedDestinationSummary';
import DestinationSearchResultCardMobile from './destinationSearchResultCardMobile/DestinationSearchResultCardMobile';
import DestinationSearchResultCardResponsive from './destinationSearchResultCardResponsive/DestinationSearchResultCardResponsive';

export interface DestinationSearchResultCardProps {
	className?: string;
	destinationName: string;
	destinationDescription: string;
	destinationFeatures: {
		id: number;
		title: string;
		icon: string;
	}[];
	address: string;
	picturePaths: string[];
	destinationDetailsPath: string;
	summaryTabs: DestinationSummaryTab[];
	onAddCompareClick?: () => void;
}

const DestinationSearchResultCard: React.FC<DestinationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();

	return size === 'small' ? (
		<DestinationSearchResultCardMobile
			destinationName={props.destinationName}
			address={props.address}
			picturePaths={props.picturePaths}
			destinationDetailsPath={props.destinationDetailsPath}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
		/>
	) : (
		<DestinationSearchResultCardResponsive
			destinationName={props.destinationName}
			destinationDescription={props.destinationDescription}
			destinationFeatures={props.destinationFeatures}
			address={props.address}
			picturePaths={props.picturePaths}
			destinationDetailsPath={props.destinationDetailsPath}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
		/>
	);
};

export default DestinationSearchResultCard;
