import React from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { DestinationSummaryTab } from '../tabbedDestinationSummary/TabbedDestinationSummary';
import DestinationSearchResultCardMobile from './destinationSearchResultCardMobile/DestinationSearchResultCardMobile';
import DestinationSearchResultCardResponsive from './destinationSearchResultCardResponsive/DestinationSearchResultCardResponsive';
import DestinationExperience = Api.Destination.Res.DestinationExperience;

export interface PriceObject {
	priceCents: number;
	pricePoints: number;
	quantityAvailable: number;
	rateCode: string;
}

export interface DestinationSearchResultCardProps {
	className?: string;
	destinationId: number;
	destinationName: string;
	minPrice: number;
	minPoints: number;
	destinationDescription: string;
	destinationExperiences: DestinationExperience[];
	address: string;
	picturePaths: string[];
	summaryTabs: DestinationSummaryTab[];
	onAddCompareClick?: () => void;
	onRemoveCompareClick?: () => void;
	onGalleryClick: () => void;
}

const DestinationSearchResultCard: React.FC<DestinationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();

	return size === 'small' ? (
		<DestinationSearchResultCardMobile
			destinationId={props.destinationId}
			destinationName={props.destinationName}
			address={props.address}
			picturePaths={props.picturePaths}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
			onRemoveCompareClick={props.onRemoveCompareClick}
			minPrice={props.minPrice}
			minPoints={props.minPoints}
			onGalleryClick={props.onGalleryClick}
		/>
	) : (
		<DestinationSearchResultCardResponsive
			destinationId={props.destinationId}
			destinationName={props.destinationName}
			destinationDescription={props.destinationDescription}
			destinationExperiences={props.destinationExperiences}
			address={props.address}
			picturePaths={props.picturePaths}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
			onRemoveCompareClick={props.onRemoveCompareClick}
			minPrice={props.minPrice}
			minPoints={props.minPoints}
			onGalleryClick={props.onGalleryClick}
		/>
	);
};

export default DestinationSearchResultCard;
