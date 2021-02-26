import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import Carousel from '../carousel/Carousel';
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
	function renderPictures(picturePaths: string[]): JSX.Element[] {
		return picturePaths.map((path: string, index: number) => {
			return <img src={path} alt="" />;
		});
	}

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
};

export default DestinationSearchResultCard;
