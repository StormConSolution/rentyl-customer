import * as React from 'react';
import './DestinationSearchResultCardResponsive.scss';
import { Rating } from '../../starRating/StarRating';
import TabbedDestinationSummary, {
	DestinationSummaryTab
} from '../../tabbedDestinationSummary/TabbedDestinationSummary';
import { Box } from '@bit/redsky.framework.rs.996';
import DestinationSummaryOverview, {
	DestinationSummaryOverviewProps
} from '../../destinationSummaryOverview/DestinationSummaryOverview';
import Label from '@bit/redsky.framework.rs.label';
import LinkButton from '../../linkButton/LinkButton';
import Carousel from '../../carousel/Carousel';
import LabelLink from '../../labelLink/LabelLink';

interface DestinationSearchResultCardResponsiveProps {
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

const DestinationSearchResultCardResponsive: React.FC<DestinationSearchResultCardResponsiveProps> = (props) => {
	function renderPictures(picturePaths: string[]): JSX.Element[] {
		return picturePaths.map((path: string) => {
			return (
				<Box className={'imageWrapper'}>
					<img src={path} alt="" />
				</Box>
			);
		});
	}

	function isSummaryOverviewTab(tab: DestinationSummaryTab) {
		return tab.content.hasOwnProperty('amenities');
	}

	function getAmenityIcons() {
		const overviewTab = props.summaryTabs.filter(isSummaryOverviewTab)[0];
		if (!overviewTab) return;
		return (overviewTab.content as DestinationSummaryOverviewProps).amenities;
	}

	return (
		<Box className={`rsDestinationSearchResultCardResponsive ${props.className || ''}`}>
			<Carousel showControls children={renderPictures(props.picturePaths)} />
			<div className="info">
				<img alt={props.destinationName} src={props.logoImagePath} className="destinationLogo" />
				<div className="nameAndAddress">
					<Label variant="h2">{props.destinationName}</Label>
					<Label variant="caption">{props.address}</Label>
				</div>
				<LinkButton label="Resort Details" path={props.destinationDetailsPath} />
				{/*<StarRating size="small16px" rating={props.starRating} /> we don't have this information in the database yet*/}
				{/*<LabelLink*/}
				{/*	className="ratings"*/}
				{/*	label="View ratings >"*/}
				{/*	path={props.reviewPath}*/}
				{/*	variant="caption"*/}
				{/*	externalLink={false}*/}
				{/*/>*/}
				<LabelLink
					className="addCompare"
					label="Add to compare +"
					variant="caption"
					onClick={props.onAddCompareClick}
					path=""
					externalLink={false}
				/>

				<TabbedDestinationSummary tabs={props.summaryTabs} />
			</div>
		</Box>
	);
};

export default DestinationSearchResultCardResponsive;
