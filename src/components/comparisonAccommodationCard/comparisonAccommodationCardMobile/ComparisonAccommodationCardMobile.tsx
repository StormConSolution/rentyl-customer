import * as React from 'react';
import './ComparisonAccommodationCardMobile.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import ResortComparisonCard from '../../resortComparisonCard/ResortComparisonCard';
import IconToolTip from '../../iconToolTip/IconToolTip';
import LoadingPage from '../../../pages/loadingPage/LoadingPage';
import Label from '@bit/redsky.framework.rs.label';

interface ComparisonAccommodationCardMobileProps {
	destinationDetails: Api.Destination.Res.Get;
	handlePinToFirst?: (pinToFirst: boolean, comparisonId: number) => void;
}

const ComparisonAccommodationCardMobile: React.FC<ComparisonAccommodationCardMobileProps> = (props) => {
	function renderResortComparisonCard() {
		return (
			<Box>
				{/*<ResortComparisonCard*/}
				{/*	destinationDetails={props.destinationDetails}*/}
				{/*	handlePinToFirst={props.handlePinToFirst}*/}
				{/*/>*/}
			</Box>
		);
	}

	// function renderFeatures() {
	// 	return (
	// 		<Box display={'flex'} flexWrap={'wrap'}>
	// 			{props.destinationDetails.map((amenity) => {
	// 				return (
	// 					<IconToolTip
	// 						key={amenity.title}
	// 						title={amenity.title}
	// 						iconImg={amenity.icon}
	// 						className={'featureIconLabel'}
	// 					/>
	// 				);
	// 			})}
	// 		</Box>
	// 	);
	// }

	return !props.destinationDetails ? (
		<LoadingPage />
	) : (
		<Box className={'rsComparisonAccommodationCardMobile'}>
			<Box className={'cell'}>{renderResortComparisonCard()}</Box>
			<Box display={'flex'} flexDirection={'column'} className={'cell'}>
				<Label variant={'h4'} className={'accommodationName'} lineClamp={4}>
					{props.destinationDetails.name}
				</Label>
			</Box>
			{/*<Box className={'cell oddCell'}>{props.destinationDetails.maxOccupantCount}</Box>*/}
			<Box className={'cell'}>
				{/*{props.accommodationDetails.extraBeds === 0 ? 'no' : 'yes' || props.accommodationDetails.extraBeds}*/}
			</Box>
			<Box className={'cell oddCell'}>
				{/*{props.accommodationDetails.adaCompliant === 0*/}
				{/*	? 'no'*/}
				{/*	: 'yes' || props.accommodationDetails.adaCompliant}*/}
			</Box>
			<Box className={'cell'}>{/*{renderFeatures()}*/}</Box>
		</Box>
	);
};

export default ComparisonAccommodationCardMobile;
