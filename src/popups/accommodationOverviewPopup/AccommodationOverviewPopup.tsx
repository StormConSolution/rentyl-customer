import * as React from 'react';
import { Popup, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';

import router from '../../utils/router';
import { ObjectUtils, StringUtils } from '../../utils/utils';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import AccommodationPopup from './accomodationPopup/AccommodationPopup';
import MobileLightBox, { MobileLightBoxProps } from '../mobileLightBox/MobileLightBox';
import MobileAccommodationOverviewPopup from './mobileAccomodationPopup/MobileAccommodationOverviewPopup';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

export interface AccommodationOverviewPopupProps extends PopupProps {
	accommodationDetails: Api.Accommodation.Res.Details;
	destinationName: string;
}

const AccommodationOverviewPopup: React.FC<AccommodationOverviewPopupProps> = (props) => {
	const reservationFilters = useRecoilValue<Misc.ReservationFilters>(globalState.reservationFilters);
	const size = useWindowResizeChange();

	function getAccommodationImages() {
		return props.accommodationDetails.media.map((item) => item.urls.imageKit);
	}

	function handleFloorPlanExpand() {
		let featureData: Misc.ImageTabProp[] = props.accommodationDetails.layout.map(
			({
				title,
				media,
				media: {
					title: mediaTitle,
					description,
					urls: { imageKit: imagePath }
				}
			}) => ({
				name: title,
				title: mediaTitle,
				imagePath,
				description,
				buttonLabel: mediaTitle,
				otherMedia: [media]
			})
		);
		popupController.open<MobileLightBoxProps>(MobileLightBox, {
			featureData: featureData,
			floorPlanClass: true
		});
	}

	function handleReserveStay() {
		let data: any = { ...reservationFilters };
		let newRoom: Misc.StayParams = {
			uuid: Date.now(),
			adults: data.adultCount,
			children: data.childCount || 0,
			accommodationId: props.accommodationDetails.id,
			arrivalDate: data.startDate,
			departureDate: data.endDate,
			packages: [],
			rateCode: ''
		};
		data = StringUtils.setAddPackagesParams({ destinationId: props.accommodationDetails.destinationId, newRoom });
		popupController.close(AccommodationOverviewPopup);
		router.navigate(`/booking/packages?data=${data}`).catch(console.error);
	}

	function renderAccommodationSize() {
		let size = '';
		let sizeObj = ObjectUtils.smartParse(props.accommodationDetails.size);
		if (sizeObj) {
			size = `${sizeObj.min} to ${sizeObj.max} ${sizeObj.units === 'SquareFeet' ? `ft` : sizeObj.units}`;
		}
		return (
			<Label variant={'subtitle1'} className={'label'}>
				{size}
				{sizeObj?.units === 'SquareFeet' ? <span className={'superScript'}>2</span> : ''}
			</Label>
		);
	}

	function renderAmenities() {
		if (!props.accommodationDetails) return <></>;
		return props.accommodationDetails.amenities.map((amenity) => {
			return (
				<div className={'amenityItem'} key={`amenity-${amenity.id}`}>
					<Icon iconImg={amenity.icon} size={42} />
					<Label variant={'accommodationOverviewCustomOne'}>{amenity.title}</Label>
				</div>
			);
		});
	}

	function renderLayoutImages(): React.ReactNodeArray {
		if (!props.accommodationDetails.layout) return [<div />];
		return props.accommodationDetails.layout.map((layout) => {
			return (
				<div className={'imageTile'}>
					<img src={layout.media.urls.imageKit} alt={layout.title} />
				</div>
			);
		});
	}

	return (
		<Popup opened={props.opened}>
			{size ? (
				<MobileAccommodationOverviewPopup
					getAccommodationImages={getAccommodationImages}
					destinationName={props.destinationName}
					accommodationDetails={props.accommodationDetails}
					handleFloorPlanExpand={handleFloorPlanExpand}
					renderAmenities={renderAmenities}
					renderAccommodationSize={renderAccommodationSize}
					popUp={AccommodationOverviewPopup}
				/>
			) : (
				<AccommodationPopup
					renderLayoutImages={renderLayoutImages}
					renderAmenities={renderAmenities}
					renderAccommodationSize={renderAccommodationSize}
					handleReserveStay={handleReserveStay}
					popUp={AccommodationOverviewPopup}
					destinationName={props.destinationName}
					accommodationDetails={props.accommodationDetails}
				/>
			)}
		</Popup>
	);
};
export default AccommodationOverviewPopup;
