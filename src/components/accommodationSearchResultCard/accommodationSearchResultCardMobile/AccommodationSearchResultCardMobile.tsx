import * as React from 'react';
import './AccommodationSearchResultCardMobile.scss';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import AccommodationSearchDetailCard, {
	AccommodationStat
} from '../../accommodationSearchDetailCard/AccommodationSearchDetailCard';
import Carousel from '../../carousel/Carousel';
import { useRecoilValue } from 'recoil';
import globalState from '../../../state/globalState';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelButton from '../../labelButton/LabelButton';
import Img from '@bit/redsky.framework.rs.img';

interface AccommodationSearchResultCardMobileProps {
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

const AccommodationSearchResultCardMobile: React.FC<AccommodationSearchResultCardMobileProps> = (props) => {
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);

	function renderPictures(picturePaths: string[]): JSX.Element[] {
		return picturePaths.map((path: string, index) => {
			return (
				<Box key={index} className={'imageWrapper'}>
					<Img
						className="accommodationGalleryImage"
						src={path}
						key={index}
						alt={'Accommodation Image'}
						width={345}
						height={290}
						loading={'lazy'}
						rootMargin={'0px 0px 200px 0px'}
					/>
				</Box>
			);
		});
	}

	return (
		<div className={'rsAccommodationSearchResultCardMobile'}>
			<Carousel showControls children={renderPictures(props.carouselImagePaths)} />
			<Label variant="h2" mb={10}>
				{props.name}
			</Label>
			<Label variant="h4" mb={8}>
				{company.allowCashBooking && '$' + StringUtils.formatMoney(props.ratePerNightInCents)}
				{company.allowCashBooking && company.allowPointBooking && props.pointsRatePerNight && ' or '}
				{company.allowPointBooking &&
					props.pointsRatePerNight &&
					StringUtils.addCommasToNumber(props.pointsRatePerNight) + ' points'}
				/night
			</Label>
			<Label variant={'body1'} mb={8}>
				{props.description}
			</Label>
			<AccommodationSearchDetailCard stats={props.roomStats} amenityIconNames={props.amenityIconNames} />
			<Box display={'flex'} justifyContent={!props.hideButtons ? 'space-between' : 'center'} mt={10}>
				<LabelButton
					className={'small'}
					look={'containedPrimary'}
					variant={'button'}
					label={props.currentRoom ? 'Keep Room' : 'BOOK NOW'}
					onClick={props.onBookNowClick}
				/>
				{!props.hideButtons && (
					<LabelButton
						className={'small'}
						variant={'button'}
						look={'containedSecondary'}
						label={'View Details'}
						onClick={props.onViewDetailsClick}
					/>
				)}
			</Box>
			{!props.hideButtons && (
				<LabelButton
					className={'compareBtn'}
					look={'none'}
					variant={'button'}
					label={'Add To Compare +'}
					onClick={props.onCompareClick}
				/>
			)}
		</div>
	);
};

export default AccommodationSearchResultCardMobile;
