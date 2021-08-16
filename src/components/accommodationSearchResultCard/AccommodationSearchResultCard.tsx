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
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import AccommodationSearchResultCardMobile from './accommodationSearchResultCardMobile/AccommodationSearchResultCardMobile';
import AccommodationSearchResultCardResponsive from './accommodationSearchResultCardResponsive/AccommodationSearchResultCardResponsive';

export interface AccommodationSearchResultCardProps {
	id: number | string;
	name: string;
	accommodationType?: string;
	maxSleeps: number;
	squareFeet: number | null;
	description: string;
	ratePerNightInCents: number;
	pointsRatePerNight: number;
	pointsEarnable: number;
	// starRating: Rating;
	roomStats: AccommodationStat[];
	carouselImagePaths: string[];
	amenityIconNames: string[];
	onBookNowClick: () => void;
	onCompareClick?: () => void;
	disableCompare?: boolean;
	onViewDetailsClick?: () => void;
	hideButtons?: boolean;
	currentRoom?: boolean;
}

const AccommodationSearchResultCard: React.FC<AccommodationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();

	return size === 'small' ? (
		<AccommodationSearchResultCardMobile
			id={props.id}
			name={props.name}
			maxSleeps={props.maxSleeps}
			squareFeet={props.squareFeet}
			description={props.description}
			ratePerNightInCents={props.ratePerNightInCents}
			pointsRatePerNight={props.pointsRatePerNight}
			pointsEarnable={props.pointsEarnable}
			roomStats={props.roomStats}
			carouselImagePaths={props.carouselImagePaths}
			amenityIconNames={props.amenityIconNames}
			onBookNowClick={props.onBookNowClick}
			onCompareClick={props.onCompareClick}
			onViewDetailsClick={props.onViewDetailsClick}
			accommodationType={props.accommodationType}
			currentRoom={props.currentRoom}
			disableCompare={props.disableCompare}
			hideButtons={props.hideButtons}
		/>
	) : (
		<AccommodationSearchResultCardResponsive
			id={props.id}
			name={props.name}
			maxSleeps={props.maxSleeps}
			squareFeet={props.squareFeet}
			description={props.description}
			ratePerNightInCents={props.ratePerNightInCents}
			pointsRatePerNight={props.pointsRatePerNight}
			pointsEarnable={props.pointsEarnable}
			roomStats={props.roomStats}
			carouselImagePaths={props.carouselImagePaths}
			amenityIconNames={props.amenityIconNames}
			onBookNowClick={props.onBookNowClick}
			onCompareClick={props.onCompareClick}
			onViewDetailsClick={props.onViewDetailsClick}
			accommodationType={props.accommodationType}
			currentRoom={props.currentRoom}
			disableCompare={props.disableCompare}
			hideButtons={props.hideButtons}
		/>
	);
};

export default AccommodationSearchResultCard;
