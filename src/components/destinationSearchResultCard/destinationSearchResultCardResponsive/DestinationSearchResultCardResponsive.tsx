import * as React from 'react';
import './DestinationSearchResultCardResponsive.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import CarouselV2 from '../../carouselV2/CarouselV2';
import LabelButton from '../../labelButton/LabelButton';
import { ObjectUtils, StringUtils } from '../../../utils/utils';
import { useRecoilState } from 'recoil';
import globalState from '../../../state/globalState';
import IconLabel from '../../iconLabel/IconLabel';
import router from '../../../utils/router';
import AccommodationsPopup, { AccommodationsPopupProps } from '../../../popups/accommodationsPopup/AccommodationsPopup';
import Icon from '@bit/redsky.framework.rs.icon';

interface DestinationSearchResultCardResponsiveProps {
	className?: string;
	destinationObj: Api.Destination.Res.Availability;
	picturePaths: string[];
	onAddCompareClick?: () => void;
	onGalleryClick: () => void;
	onRemoveCompareClick?: () => void;
	pointsEarnable: number;
	availabilityStayList: Api.Accommodation.Res.Availability[];
}

const DestinationSearchResultCardResponsive: React.FC<DestinationSearchResultCardResponsiveProps> = (props) => {
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);

	function handleAccommodations(propertyTypeId: number) {
		return props.destinationObj.accommodations.filter(
			(accommodation) => accommodation.propertyTypeId === propertyTypeId
		);
	}

	function renderPricePerNight() {
		if (reservationFilters.redeemPoints) {
			return (
				<Box display={'flex'} alignItems={'flex-end'} justifyContent={'flex-end'} flexDirection={'column'}>
					<Label variant={'subtitle3'} className={'fromText'}>
						from
					</Label>
					<Label variant={'h2'} className={'yellowText'}>
						{StringUtils.addCommasToNumber(props.destinationObj.minAccommodationPoints)}
					</Label>
					<Label variant={'subtitle3'}>points per night</Label>
					<Label variant={'italicBoldTwo'} className={'yellowText'}>
						You could earn {props.pointsEarnable} points for this stay
					</Label>
				</Box>
			);
		} else {
			return (
				<Box display={'flex'} alignItems={'flex-end'} justifyContent={'flex-end'} flexDirection={'column'}>
					<Label variant={'subtitle3'} className={'fromText'}>
						from
					</Label>
					<Label variant={'h2'}>${StringUtils.formatMoney(props.destinationObj.minAccommodationPrice)}</Label>
					<Label variant={'subtitle3'}>per night</Label>
					<Label variant={'subtitle2'}>+taxes & fees</Label>
					<Label variant={'italicBoldTwo'} className={'yellowText'}>
						You could earn {props.pointsEarnable} points for this stay
					</Label>
				</Box>
			);
		}
	}

	function renderExperiences() {
		return props.destinationObj.experiences.map((experience) => {
			return (
				<Box
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					textAlign={'center'}
					key={experience.id}
				>
					<IconLabel
						labelName={experience.title}
						iconImg={experience.icon}
						iconPosition={'top'}
						iconSize={45}
						labelVariant={'subtitle1'}
					/>
				</Box>
			);
		});
	}

	function renderButtons() {
		return props.destinationObj.propertyTypes.map((button) => {
			const accommodations: Api.Destination.Res.Accommodation[] = handleAccommodations(button.id);
			if (ObjectUtils.isArrayWithData(accommodations)) {
				return (
					<LabelButton
						key={button.id}
						look={'containedPrimary'}
						variant={'button'}
						label={button.name}
						onClick={(event) => {
							popupController.open<AccommodationsPopupProps>(AccommodationsPopup, {
								availabilityStayList: props.availabilityStayList,
								propertyTypeName: button.name,
								destinationId: props.destinationObj.id,
								destinationName: props.destinationObj.name,
								accommodations: accommodations
							});
							event.stopPropagation();
						}}
					/>
				);
			}
		});
	}

	return (
		<Box className={`rsDestinationSearchResultCardResponsive ${props.className || ''}`}>
			<Box display={'flex'}>
				<CarouselV2
					path={`/destination/details?di=${props.destinationObj.id}&startDate=${reservationFilters.startDate}&endDate=${reservationFilters.endDate}`}
					imgPaths={props.picturePaths}
					onAddCompareClick={() => {
						if (props.onAddCompareClick) props.onAddCompareClick();
					}}
					onGalleryClick={props.onGalleryClick}
					onRemoveCompareClick={() => {
						if (props.onRemoveCompareClick) props.onRemoveCompareClick();
					}}
					destinationId={props.destinationObj.id}
				/>
				<Box
					display={'flex'}
					flexDirection={'column'}
					maxWidth={'1020px'}
					padding={'5px 5px 5px 45px'}
					onClick={() => {
						router
							.navigate(
								`/destination/details?di=${props.destinationObj.id}&startDate=${reservationFilters.startDate}&endDate=${reservationFilters.endDate}`
							)
							.catch(console.error);
						setReservationFilters({ ...reservationFilters, destinationId: props.destinationObj.id });
					}}
				>
					<Label variant={'h4'} paddingBottom={'10px'}>
						{props.destinationObj.name}
					</Label>
					<Box display={'flex'} paddingBottom={'16px'}>
						<Label variant={'subtitle1'} paddingRight={'74px'}>
							{props.destinationObj.minBedroom} - {props.destinationObj.maxBedroom} Bedrooms
						</Label>
						<Label variant={'subtitle1'}>
							<Icon iconImg="icon-pin" size={15} color="#FF6469" className="locationIcon" />
							{StringUtils.buildAddressString({
								city: props.destinationObj.city,
								state: props.destinationObj.state
							})}
						</Label>
					</Box>
					<Box display={'flex'} paddingBottom={'18px'}>
						<Label variant={'body4'} className={'destinationDescription'} lineClamp={2}>
							{props.destinationObj.description}
						</Label>
					</Box>
					<Box className={'featureIcons'} paddingBottom={'30px'}>
						{renderExperiences()}
					</Box>
					<Box display={'flex'} gap={'24px'}>
						{renderButtons()}
					</Box>
				</Box>
			</Box>
			{renderPricePerNight()}
		</Box>
	);
};

export default DestinationSearchResultCardResponsive;
