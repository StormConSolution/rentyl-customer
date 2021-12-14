import * as React from 'react';
import './DestinationSearchResultCardMobile.scss';
import CarouselV2 from '../../carouselV2/CarouselV2';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import router from '../../../utils/router';
import Icon from '@bit/redsky.framework.rs.icon';
import { useRecoilValue } from 'recoil';
import globalState from '../../../state/globalState';
import { ObjectUtils, StringUtils } from '../../../utils/utils';
import DestinationDetailsMobilePopup, {
	DestinationDetailsMobilePopupProps
} from '../../../popups/destinationDetailsMobilePopup/DestinationDetailsMobilePopup';
import LabelButton from '../../labelButton/LabelButton';
import AccommodationsPopup, { AccommodationsPopupProps } from '../../../popups/accommodationsPopup/AccommodationsPopup';

interface DestinationSearchResultCardMobileProps {
	className?: string;
	destinationObj: Api.Destination.Res.Availability;
	picturePaths: string[];
	onAddCompareClick?: () => void;
	onGalleryClick: () => void;
	onRemoveCompareClick?: () => void;
	pointsEarnable: number;
	availabilityStayList: Api.Accommodation.Res.Availability[];
}

const DestinationSearchResultCardMobile: React.FC<DestinationSearchResultCardMobileProps> = (props) => {
	const reservationFilters = useRecoilValue(globalState.reservationFilters);

	function handleAccommodations(propertyTypeId: number) {
		return props.destinationObj.accommodations.filter(
			(accommodation) => accommodation.propertyTypeId === propertyTypeId
		);
	}

	function renderPricePerNight() {
		if (reservationFilters.redeemPoints) {
			return (
				<Box display={'flex'}>
					<Label variant={'boldCaption1'} className={'yellowText'}>
						{StringUtils.addCommasToNumber(props.destinationObj.minAccommodationPoints)}pts
					</Label>
					<Label variant={'caption1'}>/night</Label>
				</Box>
			);
		} else {
			return (
				<Box display={'flex'}>
					<Label variant={'boldCaption1'}>
						${StringUtils.formatMoney(props.destinationObj.minAccommodationPrice)}/
					</Label>
					<Label variant={'caption1'}>night</Label>
				</Box>
			);
		}
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
						className={'accommodationButton'}
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
		<Box className={'rsDestinationSearchResultCardMobile'}>
			<CarouselV2
				path={() => {
					router.updateUrlParams({
						di: props.destinationObj.id,
						startDate: reservationFilters.startDate as string,
						endDate: reservationFilters.endDate as string
					});
					popupController.open<DestinationDetailsMobilePopupProps>(DestinationDetailsMobilePopup);
				}}
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
			<Box className={'mobileCardInfo'}>
				<Box display={'flex'} justifyContent={'space-between'} paddingTop={'16px'} paddingBottom={'10px'}>
					<Label variant={'subtitle1'}>{props.destinationObj.name}</Label>
					<Icon
						iconImg={'icon-info-outline'}
						onClick={() => {
							router.updateUrlParams({
								di: props.destinationObj.id,
								startDate: reservationFilters.startDate as string,
								endDate: reservationFilters.endDate as string
							});
							popupController.open<DestinationDetailsMobilePopupProps>(DestinationDetailsMobilePopup);
						}}
						size={20}
					/>
				</Box>
				<Box display={'flex'} justifyContent={'space-between'} paddingBottom={'16px'}>
					<Label variant={'caption1'} paddingRight={'74px'}>
						{props.destinationObj.minBedroom} - {props.destinationObj.maxBedroom} Bedrooms
					</Label>
					<Label variant={'caption1'} className={'addressLabel'}>
						<Icon iconImg="icon-pin" size={12} color="#FF6469" className="locationIcon" />
						{StringUtils.buildAddressString({
							city: props.destinationObj.city,
							state: props.destinationObj.state
						})}
					</Label>
				</Box>
				{renderPricePerNight()}
				<Box paddingTop={'8px'}>
					{!reservationFilters.redeemPoints && (
						<Label className={'earnText'} variant={'italicBold'}>
							You could earn from {props.pointsEarnable} points for this stay
						</Label>
					)}
				</Box>
			</Box>
			<Box className={'buttonContainer'}>{renderButtons()}</Box>
		</Box>
	);
};

export default DestinationSearchResultCardMobile;
