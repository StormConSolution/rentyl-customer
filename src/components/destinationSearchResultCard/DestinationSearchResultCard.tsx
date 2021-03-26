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
import StarRating, { Rating } from '../starRating/StarRating';
import TabbedDestinationSummary, { DestinationSummaryTab } from '../tabbedDestinationSummary/TabbedDestinationSummary';
import './DestinationSearchResultCard.scss';

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
	onAddCompareClick: () => void;
}

const DestinationSearchResultCard: React.FC<DestinationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();

	function renderPictures(picturePaths: string[]): JSX.Element[] {
		let pictureArray = picturePaths.map((path: string, index: number) => {
			return (
				<Box className={'imageWrapper'}>
					<img src={path} alt="" />
				</Box>
			);
		});
		console.log('pictureArray', pictureArray);
		return pictureArray;
	}

	function isSummaryOverviewTab(tab: DestinationSummaryTab) {
		return tab.content.hasOwnProperty('amenities');
	}

	function getAmenityIcons() {
		const overviewTab = props.summaryTabs.filter(isSummaryOverviewTab)[0];
		if (!overviewTab) return;
		return (overviewTab.content as DestinationSummaryOverviewProps).amenities;
	}

	function renderSmallLayout(): JSX.Element {
		return (
			<Box className={`rsDestinationSearchResultCard ${props.className || ''}`}>
				<img alt={props.destinationName} src={props.picturePaths[0]} />
				<div className="info">
					<div className="nameAndAddress">
						<Label variant="h4">{props.destinationName}</Label>
						<Label variant="caption">
							<Icon iconImg="icon-map" />
							{props.address}
						</Label>
					</div>
					<StarRating size="small16px" rating={props.starRating} />
					<DestinationSummaryOverview finePrint="" amenities={getAmenityIcons()} />
				</div>
				<div className="buttonHolder">
					<LinkButton
						className="addCompare"
						label="Add to compare +"
						onClick={props.onAddCompareClick}
						path=""
						buttonSecondary
					/>
					<LinkButton label="Resort Details" path={props.destinationDetailsPath} />
				</div>
			</Box>
		);
	}

	function renderLargeLayout() {
		return (
			<Box className={`rsDestinationSearchResultCard ${props.className || ''}`}>
				<Carousel showControls children={renderPictures(props.picturePaths)} />
				<div className="info">
					<img alt={props.destinationName} src={props.logoImagePath} className="destinationLogo" />
					<div className="nameAndAddress">
						<Label variant="h2">{props.destinationName}</Label>
						<Label variant="caption">{props.address}</Label>
					</div>
					<LinkButton label="Resort Details" path={props.destinationDetailsPath} />
					<StarRating size="small16px" rating={props.starRating} />
					<LabelLink
						className="ratings"
						label="View ratings >"
						path={props.reviewPath}
						variant="caption"
						externalLink={false}
					/>
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
	}

	return size === 'small' ? renderSmallLayout() : renderLargeLayout();
};

export default DestinationSearchResultCard;
