import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Carousel from '../carousel/Carousel';
import DestinationSummaryOverview, {
	DestinationSummaryOverviewProps
} from '../destinationSummaryOverview/DestinationSummaryOverview';
import LabelLink from '../labelLink/LabelLink';
import LinkButton from '../linkButton/LinkButton';
import { Rating } from '../starRating/StarRating';
import TabbedDestinationSummary, { DestinationSummaryTab } from '../tabbedDestinationSummary/TabbedDestinationSummary';
import './DestinationSearchResultCard.scss';
import DestinationSearchResultCardMobile from './destinationSearchResultCardMobile/DestinationSearchResultCardMobile';
import DestinationSearchResultCardResponsive from './destinationSearchResultCardResponsive/DestinationSearchResultCardResponsive';

export interface DestinationSearchResultCardProps {
	className?: string;
	destinationName: string;
	address: string;
	logoImagePath: string;
	picturePaths: string[];
	starRating: Rating;
	reviewPath: string;
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
			logoImagePath={props.logoImagePath}
			picturePaths={props.picturePaths}
			starRating={props.starRating}
			reviewPath={props.reviewPath}
			destinationDetailsPath={props.destinationDetailsPath}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
		/>
	) : (
		<DestinationSearchResultCardResponsive
			destinationName={props.destinationName}
			address={props.address}
			logoImagePath={props.logoImagePath}
			picturePaths={props.picturePaths}
			starRating={props.starRating}
			reviewPath={props.reviewPath}
			destinationDetailsPath={props.destinationDetailsPath}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
		/>
	);
};

export default DestinationSearchResultCard;
