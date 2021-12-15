import React, { useEffect, useState } from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import DestinationSearchResultCardMobile from './destinationSearchResultCardMobile/DestinationSearchResultCardMobile';
import DestinationSearchResultCardResponsive from './destinationSearchResultCardResponsive/DestinationSearchResultCardResponsive';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import { popupController } from '@bit/redsky.framework.rs.996';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import { ObjectUtils } from '../../utils/utils';
import DestinationService from '../../services/destination/destination.service';

export interface DestinationSearchResultCardProps {
	className?: string;
	destinationObj: Api.Destination.Res.Availability;
	picturePaths: string[];
	onAddCompareClick?: () => void;
	onRemoveCompareClick?: () => void;
	onGalleryClick: () => void;
}

const DestinationSearchResultCard: React.FC<DestinationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const reservationFilters = useRecoilValue<Misc.ReservationFilters>(globalState.reservationFilters);
	const [availabilityStayList, setAvailabilityStayList] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [pointsEarnable, setPointsEarnable] = useState<number>(0);
	const [loyaltyStatus, setLoyaltyStatus] = useState<Model.LoyaltyStatus>('PENDING');

	useEffect(() => {
		async function getDestination() {
			try {
				const res = await destinationService.getDestinationById({ id: props.destinationObj.id });
				setLoyaltyStatus(res.loyaltyStatus);
			} catch (e) {
				console.error(e);
			}
		}
		getDestination().catch(console.error);
	}, []);

	useEffect(() => {
		async function getAccommodationAvailability() {
			try {
				popupController.open(SpinningLoaderPopup);
				const searchQueryObj: Misc.ReservationFilters = { ...reservationFilters };
				let key: keyof Misc.ReservationFilters;
				for (key in searchQueryObj) {
					if (searchQueryObj[key] === undefined) delete searchQueryObj[key];
				}
				if (searchQueryObj.priceRangeMin) searchQueryObj.priceRangeMin *= 100;
				if (searchQueryObj.priceRangeMax) searchQueryObj.priceRangeMax *= 100;
				const result = await accommodationService.availability(props.destinationObj.id, searchQueryObj);
				setAvailabilityStayList((prev: Api.Accommodation.Res.Availability[]) => {
					return [
						...prev.filter((accommodation) => {
							return !result.data
								.map((newList: Api.Accommodation.Res.Availability) => newList.id)
								.includes(accommodation.id);
						}),
						...result.data
					];
				});
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				console.error();
			}
		}
		getAccommodationAvailability().catch(console.error);
	}, []);

	useEffect(() => {
		if (ObjectUtils.isArrayWithData(availabilityStayList)) {
			let accommodationAvailability = availabilityStayList;
			accommodationAvailability.sort(function (pointsEarnedA, pointsEarnedB) {
				return pointsEarnedA.pointsEarned - pointsEarnedB.pointsEarned;
			});
			setPointsEarnable(accommodationAvailability[0].pointsEarned);
		}
	}, [availabilityStayList]);

	return size === 'small' ? (
		<DestinationSearchResultCardMobile
			availabilityStayList={availabilityStayList}
			pointsEarnable={pointsEarnable}
			destinationObj={props.destinationObj}
			picturePaths={props.picturePaths}
			onAddCompareClick={props.onAddCompareClick}
			onRemoveCompareClick={props.onRemoveCompareClick}
			onGalleryClick={props.onGalleryClick}
			loyaltyStatus={loyaltyStatus}
		/>
	) : (
		<DestinationSearchResultCardResponsive
			availabilityStayList={availabilityStayList}
			pointsEarnable={pointsEarnable}
			destinationObj={props.destinationObj}
			picturePaths={props.picturePaths}
			onAddCompareClick={props.onAddCompareClick}
			onRemoveCompareClick={props.onRemoveCompareClick}
			onGalleryClick={props.onGalleryClick}
			loyaltyStatus={loyaltyStatus}
		/>
	);
};

export default DestinationSearchResultCard;
