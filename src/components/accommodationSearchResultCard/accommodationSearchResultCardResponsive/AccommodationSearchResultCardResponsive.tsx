import * as React from 'react';
import './AccommodationSearchResultCardResponsive.scss';
import { useRecoilValue } from 'recoil';
import globalState from '../../../models/globalState';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import { addCommasToNumber } from '../../../utils/utils';
import AccommodationSearchCallToActionCard from '../../accommodationSearchCallToActionCard/AccommodationSearchCallToActionCard';
import Carousel from '../../carousel/Carousel';
import AccommodationSearchDetailCard, {
	AccommodationStat
} from '../../accommodationSearchDetailCard/AccommodationSearchDetailCard';

interface AccommodationSearchResultCardResponsiveProps {
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

const AccommodationSearchResultCardResponsive: React.FC<AccommodationSearchResultCardResponsiveProps> = (props) => {
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);

	function renderCarouselImages(imagePaths: string[]): JSX.Element[] {
		return imagePaths.map((imagePath, index) => {
			return <img className="accommodationGalleryImage" src={imagePath} key={index} alt="" />;
		});
	}

	return (
		<Box className="rsAccommodationSearchResultCardResponsive">
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
			<Box display={'flex'}>
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
			</Box>
		</Box>
	);
};

export default AccommodationSearchResultCardResponsive;
