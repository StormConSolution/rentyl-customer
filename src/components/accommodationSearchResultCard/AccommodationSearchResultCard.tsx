import { Box, Link } from '@bit/redsky.framework.rs.996';
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

export interface AccommodationSearchResultCardProps {
	id: number | string;
	name: string;
	accommodationType: string;
	bedrooms: number;
	squareFeet: number | string;
	description: string;
	ratePerNight: number;
	pointsRatePerNight: number;
	pointsEarnable: number;
	starRating: Rating;
	roomStats: AccommodationStat[];
	carouselImagePaths: string[];
	amenityIconNames: string[];
	onBookNowClick: () => void;
	onCompareClick: () => void;
	disableCompare: boolean;
	onViewDetailsClick: () => void;
}

const AccommodationSearchResultCard: React.FC<AccommodationSearchResultCardProps> = (props) => {
	function renderCarouselImages(imagePaths: string[]): JSX.Element[] {
		return imagePaths.map((imagePath, index) => {
			return <img className="accommodationGalleryImage" src={imagePath} key={index} alt="" />;
		});
	}

	return (
		<Box className="rsAccommodationSearchResultCard">
			<Carousel showControls>{renderCarouselImages(props.carouselImagePaths)}</Carousel>
			<div className="description">
				<Label className="accommodationName" variant="h2">
					{props.name}
				</Label>
				<div>
					<Label variant="h4" className="costs">
						{StringUtils.formatMoney(props.ratePerNight)} or {addCommasToNumber(props.pointsRatePerNight)}{' '}
						points/night
					</Label>
					<Label variant="caption" className="taxAndFees">
						+ taxes &amp; fees
					</Label>
				</div>
				<div>
					<StarRating rating={props.starRating} size="small16px" />
					<Link path="">
						<Label variant="caption">{`View ${props.accommodationType} Ratings >`}</Label>
					</Link>
				</div>
				<Label className="accommodationDescription" variant="body2">
					{props.description}
				</Label>
			</div>
			<div>
				<AccommodationSearchDetailCard stats={props.roomStats} amenityIconNames={props.amenityIconNames} />
			</div>
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
};

export default AccommodationSearchResultCard;
