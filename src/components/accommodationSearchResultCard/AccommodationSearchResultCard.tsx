import { Box, Link } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import { addCommasToNumber, formatMoney } from '../../utils/utils';
import Carousel from '../carousel/Carousel';
import RoomSearchDetailCard, { RoomStat } from '../roomSearchDetailCard/RoomSearchDetailCard';
import StarRating from '../starRating/StarRating';
import './AccommodationSearchResultCard.scss';

export interface AccommodationSearchResultCardProps {
	id: number | string;
	name: string;
	accommodationType: string;
	description: string;
	ratePerNight: number;
	pointsPerNight: number;
	starRating: 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
	roomStats: Array<RoomStat>;
	carouselImagePaths: Array<string>;
	amenityIconNames: Array<string>;
}

const AccommodationSearchResultCard: React.FC<AccommodationSearchResultCardProps> = (props) => {
	function renderCarouselImages(imagePaths: Array<string>): Array<JSX.Element> {
		return imagePaths.map((imagePath, index) => {
			return <img className="accommodationGalleryImage" src={imagePath} key={index} alt="" />;
		});
	}

	return (
		<Box className="rsAccommodationSearchResultCard">
			<Carousel showControls>{renderCarouselImages(props.carouselImagePaths)}</Carousel>
			<div>
				<Label className="accommodationName" variant="h2">
					{props.name}
				</Label>
				<Label variant="h4">
					{formatMoney(props.ratePerNight)} or {addCommasToNumber(props.pointsPerNight)} points/night
				</Label>
				<Label variant="caption">+ taxes &amp; fees</Label>
				<StarRating rating={props.starRating} size="large32px" />
				<Link path="">
					<Label variant="caption">View {props.accommodationType} Ratings</Label>
				</Link>
				<Label className="accommodationDescription" variant="body1">
					{props.description}
				</Label>
			</div>
			<div>
				<RoomSearchDetailCard stats={props.roomStats} amenityIconNames={props.amenityIconNames} />
			</div>
			<div>{/* for the Book Now card */}</div>
		</Box>
	);
};

export default AccommodationSearchResultCard;
