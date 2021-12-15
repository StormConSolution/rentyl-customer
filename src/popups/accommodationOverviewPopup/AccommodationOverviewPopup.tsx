import * as React from 'react';
// import './AccommodationPopup.scss';
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

export interface AccommodationOverviewPopupProps extends PopupProps {
	accommodationDetails: Api.Accommodation.Res.Details;
	destinationName: string;
}

const AccommodationOverviewPopup: React.FC<AccommodationOverviewPopupProps> = (props) => {
	const reservationFilters = useRecoilValue<Misc.ReservationFilters>(globalState.reservationFilters);

	function getAccommodationImages() {
		let images: string[] = [];
		props.accommodationDetails.media.forEach((value) => {
			images.push(value.urls.imageKit);
		});
		return images;
	}

	function handleFloorPlanExpand() {
		let featureData: Misc.ImageTabProp[] = [];
		props.accommodationDetails.layout.forEach((value) => {
			featureData.push({
				name: value.title,
				title: value.media.title,
				imagePath: value.media.urls.imageKit,
				description: value.media.description,
				buttonLabel: value.media.title,
				otherMedia: [value.media]
			});
		});

		popupController.close(AccommodationOverviewPopup);
		popupController.open<MobileLightBoxProps>(MobileLightBox, {
			featureData: featureData,
			customOnBack: () => {
				popupController.close(MobileLightBox);
				popupController.open<AccommodationOverviewPopupProps>(AccommodationOverviewPopup, {
					accommodationDetails: props.accommodationDetails,
					destinationName: props.destinationName
				});
			},
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
			<AccommodationPopup
				renderLayoutImages={renderLayoutImages}
				renderAmenities={renderAmenities}
				renderAccommodationSize={renderAccommodationSize}
				handleReserveStay={handleReserveStay}
				popUp={AccommodationOverviewPopup}
				destinationName={props.destinationName}
				accommodationDetails={props.accommodationDetails}
			/>
			<MobileAccommodationOverviewPopup
				getAccommodationImages={getAccommodationImages}
				destinationName={props.destinationName}
				accommodationDetails={props.accommodationDetails}
				handleFloorPlanExpand={handleFloorPlanExpand}
				renderAmenities={renderAmenities}
				renderAccommodationSize={renderAccommodationSize}
				popUp={AccommodationOverviewPopup}
			/>
		</Popup>
	);
};
export default AccommodationOverviewPopup;
