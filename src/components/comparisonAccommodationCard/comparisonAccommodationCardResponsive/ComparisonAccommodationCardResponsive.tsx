import * as React from 'react';
import './ComparisonAccommodationCardResponsive.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import ResortComparisonCard from '../../resortComparisonCard/ResortComparisonCard';
import IconToolTip from '../../iconToolTip/IconToolTip';
import LoadingPage from '../../../pages/loadingPage/LoadingPage';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { ObjectUtils } from '../../../utils/utils';

interface ComparisonAccommodationCardProps {
	accommodationDetails: Api.Accommodation.Res.Details;
	destinationDetails: Misc.ComparisonCardInfo;
}

const ComparisonAccommodationCardResponsive: React.FC<ComparisonAccommodationCardProps> = (props) => {
	function renderResortComparisonCard() {
		return (
			<Box>
				<ResortComparisonCard destinationDetails={props.destinationDetails} />
			</Box>
		);
	}

	function renderFeatures() {
		if (!ObjectUtils.isArrayWithData(props.accommodationDetails.amenities)) return;
		return (
			<Box display={'flex'} flexWrap={'wrap'}>
				{props.accommodationDetails.amenities.map((amenity) => {
					return (
						<IconToolTip
							key={amenity.title}
							title={amenity.title}
							iconImg={amenity.icon}
							className={'featureIconLabel'}
						/>
					);
				})}
			</Box>
		);
	}

	return !props.accommodationDetails || !props.destinationDetails ? (
		<LoadingPage />
	) : (
		<Box className={'rsComparisonAccommodationCard'}>
			<Box>{renderResortComparisonCard()}</Box>
			<Box>
				<Label variant={'h4'} lineClamp={1} showMoreButton={true}>
					{props.accommodationDetails.name}
				</Label>
			</Box>
			<Box className={'oddCell'}>{props.accommodationDetails.maxOccupantCount}</Box>
			<Box>
				{props.accommodationDetails.extraBeds === 0 ? 'no' : 'yes' || props.accommodationDetails.extraBeds}
			</Box>
			<Box className={'oddCell'}>
				{props.accommodationDetails.adaCompliant === 0
					? 'no'
					: 'yes' || props.accommodationDetails.adaCompliant}
			</Box>
			<Box>{renderFeatures()}</Box>
			<Box className={'oddCell'}>
				<Label variant={'body1'}>{props.accommodationDetails.longDescription}</Label>
			</Box>
		</Box>
	);
};

export default ComparisonAccommodationCardResponsive;
