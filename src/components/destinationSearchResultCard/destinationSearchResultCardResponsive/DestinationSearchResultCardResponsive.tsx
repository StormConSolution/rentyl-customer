import * as React from 'react';
import './DestinationSearchResultCardResponsive.scss';
import TabbedDestinationSummary, {
	DestinationSummaryTab
} from '../../tabbedDestinationSummary/TabbedDestinationSummary';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import LinkButton from '../../linkButton/LinkButton';
import Carousel from '../../carousel/Carousel';
import LabelLink from '../../labelLink/LabelLink';
import StarRating from '../../starRating/StarRating';
import Img from '@bit/redsky.framework.rs.img';

interface DestinationSearchResultCardResponsiveProps {
	className?: string;
	destinationName: string;
	address: string;
	logoImagePath: string;
	picturePaths: string[];
	starRating: number;
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
					<Img src={path} loading={'lazy'} alt={'Resort Image'} width={278} height={318} />
				</Box>
			);
		});
	}

	return (
		<Box className={`rsDestinationSearchResultCardResponsive ${props.className || ''}`}>
			<Carousel showControls children={renderPictures(props.picturePaths)} />
			<div className="info">
				<div className={'logoContainer'}>
					{props.logoImagePath && props.logoImagePath !== '' && (
						<img alt={''} src={props.logoImagePath} className="destinationLogo" />
					)}
				</div>
				<div className="nameAndAddress">
					<Label variant="h2">{props.destinationName}</Label>
					<Label variant="caption">{props.address}</Label>
				</div>
				<LinkButton label="Resort Details" path={props.destinationDetailsPath} look={'containedPrimary'} />
				<StarRating size="small16px" rating={props.starRating} />
				<LabelLink
					className="ratings"
					label="View Reviews >"
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

export default DestinationSearchResultCardResponsive;
