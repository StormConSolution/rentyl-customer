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
import LabelButton from '../labelButton/LabelButton';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';

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
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);

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
						{company.allowCashBooking && '$' + StringUtils.formatMoney(props.ratePerNightInCents)}
						{company.allowCashBooking && company.allowPointBooking && ' or '}
						{company.allowPointBooking && addCommasToNumber(props.ratePerNightInCents) + ' points'} / night
					</Label>
					{company.allowCashBooking && (
						<Label variant="caption" className="taxAndFees">
							+ taxes &amp; fees
						</Label>
					)}
					{/*<StarRating rating={props.starRating} size="small16px" />*/}
					{!props.hideButtons && (
						<LabelButton
							onClick={props.onViewDetailsClick}
							look="containedSecondary"
							label="View Details"
							variant="caption"
						/>
					)}
				</div>
				<AccommodationSearchCallToActionCard
					points={props.pointsEarnable}
					maxSleeps={props.maxSleeps}
					squareFeet={props.squareFeet}
					compareDisabled={props.disableCompare}
					bookNowOnClick={props.onBookNowClick}
					compareOnClick={props.onCompareClick}
					viewDetailsOnClick={props.onViewDetailsClick}
					hideButtons={props.hideButtons}
					currentRoom={props.currentRoom}
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
						{company && (
							<Label variant="h4" className="costs">
								{company.allowCashBooking && '$' + StringUtils.formatMoney(props.ratePerNightInCents)}{' '}
								{company.allowCashBooking && company.allowPointBooking && ' or '}
								{company.allowPointBooking && addCommasToNumber(props.pointsRatePerNight) + ' points'}
								/night
							</Label>
						)}
						{company && company.allowCashBooking && (
							<Label variant="caption" className="taxAndFees">
								+ taxes &amp; fees
							</Label>
						)}
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
						maxSleeps={props.maxSleeps}
						points={props.pointsEarnable}
						squareFeet={props.squareFeet}
						compareDisabled={props.disableCompare}
						bookNowOnClick={props.onBookNowClick}
						compareOnClick={props.onCompareClick}
						viewDetailsOnClick={props.onViewDetailsClick}
						hideButtons={props.hideButtons}
						currentRoom={props.currentRoom}
					/>
				</div>
			</Box>
		);
	}

	return size === 'small' ? renderSmallLayout() : renderLargeLayout();
};

export default AccommodationSearchResultCard;
