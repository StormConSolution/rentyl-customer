import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import React from 'react';
import { addCommasToNumber } from '../../utils/utils';
import Carousel from '../carousel/Carousel';
import AccommodationSearchCallToActionCard from '../accommodationSearchCallToActionCard/AccommodationSearchCallToActionCard';
import AccommodationSearchDetailCard, {
	AccommodationStat
} from '../accommodationSearchDetailCard/AccommodationSearchDetailCard';
import StarRating, { Rating } from '../starRating/StarRating';
import './AccommodationSearchResultCard.scss';
import LabelLink from '../labelLink/LabelLink';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import LabelButton from '../labelButton/LabelButton';

export interface AccommodationSearchResultCardProps {
	id: number | string;
	name: string;
	accommodationType: string;
	bedrooms: number;
	squareFeet: number | string;
	description: string;
	ratePerNightInCents: number;
	pointsRatePerNight: number;
	pointsEarnable: number;
	starRating: Rating;
	roomStats: AccommodationStat[];
	carouselImagePaths: string[];
	amenityIconNames: string[];
	onBookNowClick: () => void;
	onCompareClick: () => void;
	disableCompare?: boolean;
	onViewDetailsClick: () => void;
}

const AccommodationSearchResultCard: React.FC<AccommodationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();

	function renderCarouselImages(imagePaths: string[]): JSX.Element[] {
		return imagePaths.map((imagePath, index) => {
			return <img className="accommodationGalleryImage" src={imagePath} key={index} alt="" />;
		});
	}

	function renderSmallLayout(): JSX.Element {
		return (
			<Box className="rsAccommodationSearchResultCard">
				<img alt={props.name} src={props.carouselImagePaths[0]} />
				<div className="info">
					<Label className="accommodationName" variant="h4">
						{props.name}
					</Label>
					<Label variant="body2" className="costs">
						${StringUtils.formatMoney(props.ratePerNightInCents)} or{' '}
						{addCommasToNumber(props.pointsRatePerNight)} points / night
					</Label>
					<Label variant="caption" className="taxAndFees">
						+ taxes &amp; fees
					</Label>
					<StarRating rating={props.starRating} size="small16px" />
					<LabelButton
						onClick={props.onViewDetailsClick}
						look="containedSecondary"
						label="View Details"
						variant="caption"
					/>
				</div>
				<AccommodationSearchCallToActionCard
					points={props.pointsEarnable}
					bedrooms={props.bedrooms}
					squareFeet={props.squareFeet.toString()}
					compareDisabled={props.disableCompare}
					bookNowOnClick={props.onBookNowClick}
					compareOnClick={props.onCompareClick}
					viewDetailsOnClick={props.onViewDetailsClick}
				/>
			</Box>
		);
	}

	function renderLargeLayout(): JSX.Element {
		return (
			<Box className="rsAccommodationSearchResultCard">
				<Carousel showControls>{renderCarouselImages(props.carouselImagePaths)}</Carousel>
				<div className="info">
					<Label className="accommodationName" variant="h2">
						{props.name}
					</Label>
					<div>
						<Label variant="h4" className="costs">
							${StringUtils.formatMoney(props.ratePerNightInCents)} or{' '}
							{addCommasToNumber(props.pointsRatePerNight)} points/night
						</Label>
						<Label variant="caption" className="taxAndFees">
							+ taxes &amp; fees
						</Label>
					</div>
					{/*<div>*/}
					{/*	<StarRating rating={props.starRating} size="small16px" />*/}
					{/*	<LabelLink variant="caption" path="" label={`View ${props.accommodationType} Ratings >`} />*/}
					{/*</div>*/}
					<Label className="accommodationDescription" variant="body2">
						{props.description}
					</Label>
				</div>
				<Box className="detailCardHolder" alignSelf={'flex-end'}>
					<AccommodationSearchDetailCard stats={props.roomStats} amenityIconNames={props.amenityIconNames} />
				</Box>
				<div>
					<AccommodationSearchCallToActionCard
						points={props.pointsEarnable}
						bedrooms={props.bedrooms}
						squareFeet={props.squareFeet.toString()}
						compareDisabled={props.disableCompare}
						bookNowOnClick={props.onBookNowClick}
						compareOnClick={props.onCompareClick}
						viewDetailsOnClick={props.onViewDetailsClick}
					/>
				</div>
			</Box>
		);
	}

	return size === 'small' ? renderSmallLayout() : renderLargeLayout();
};

export default AccommodationSearchResultCard;
