import './SearchResultCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import React from 'react';
import useWindowResizeChange from '../../../customHooks/useWindowResizeChange';
import { addCommasToNumber } from '../../../utils/utils';
import Carousel from '../../../components/carousel/Carousel';
import { AccommodationStat } from '../../../components/accommodationSearchDetailCard/AccommodationSearchDetailCard';
import Icon from '@bit/redsky.framework.rs.icon';
import LabelButton from '../../../components/labelButton/LabelButton';
import Paper from '../../../components/paper/Paper';

export interface AccommodationSearchResultCardProps {
	id: number | string;
	name: string;
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
}

const SearchResultCard: React.FC<AccommodationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();

	function renderCarouselImages(imagePaths: string[]): JSX.Element[] {
		return imagePaths.map((imagePath, index) => {
			return <img className="accommodationGalleryImage" src={imagePath} key={index} alt="" />;
		});
	}

	function renderAmenities() {
		return props.amenityIconNames.map((icon) => <Icon iconImg={icon} />);
	}

	function renderRoomStats() {
		return props.roomStats.map((stat) => {
			return (
				<Box className="roomStat">
					<Label variant="caption">{stat.label}</Label>
					<Label variant="body2">{stat.datum}</Label>
				</Box>
			);
		});
	}

	function renderSmallLayout(): JSX.Element {
		return (
			<Paper className="rsSearchResultCard">
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
					{/*<StarRating rating={props.starRating} size="small16px" />*/}
				</div>
				<hr />
			</Paper>
		);
	}

	function renderLargeLayout(): JSX.Element {
		return (
			<Box className="rsSearchResultCard">
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
					<Box className="detailCardHolder" alignSelf={'flex-end'}>
						<div>{renderAmenities()}</div>
						<div>{renderRoomStats()}</div>
						{/*<AccommodationSearchDetailCard stats={props.roomStats} amenityIconNames={props.amenityIconNames} />*/}
					</Box>
					{/*	<StarRating rating={props.starRating} size="small16px" />*/}
					<Label className="accommodationDescription" variant="body2">
						{props.description}
					</Label>
				</div>

				<div className={'bookNow'}>
					<div>
						<Label variant={'body1'}>Earn up to</Label>
						<Label variant={'h3'}>{props.pointsEarnable} points</Label>
					</div>
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Book Now'}
						onClick={props.onBookNowClick}
					/>
				</div>
			</Box>
		);
	}

	return size === 'small' ? renderSmallLayout() : renderLargeLayout();
};

export default SearchResultCard;
