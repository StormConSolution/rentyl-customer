import * as React from 'react';
import './accommodationsPopup.scss';
import { Box, Popup, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import AccommodationSearchCard from '../../components/accommodationSearchCardV2/AccommodationSearchCard';
import MobileAccommodationOverviewPopup, {
	MobileAccommodationOverviewPopupProps
} from '../mobileAccommodationOverviewPopup/MobileAccommodationOverviewPopup';
import AccommodationOverviewPopup, {
	AccommodationOverviewPopupProps
} from '../accommodationOverviewPopup/AccommodationOverviewPopup';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

export interface AccommodationsPopupProps extends PopupProps {
	propertyTypeName: string;
	destinationId: number;
	destinationName: string;
	accommodations: Api.Destination.Res.Accommodation[];
	availabilityStayList: Api.Accommodation.Res.Availability[];
}

const AccommodationsPopup: React.FC<AccommodationsPopupProps> = (props) => {
	const size = useWindowResizeChange();
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');

	async function handleOnInfoClick(accommodationId: number) {
		let accommodationDetails = await accommodationService.getAccommodationDetails(accommodationId);
		if (size === 'small') {
			popupController.open<MobileAccommodationOverviewPopupProps>(MobileAccommodationOverviewPopup, {
				accommodationDetails: accommodationDetails
			});
		} else {
			popupController.open<AccommodationOverviewPopupProps>(AccommodationOverviewPopup, {
				accommodationDetails: accommodationDetails,
				destinationName: props.destinationName
			});
		}
	}

	function renderAccommodations() {
		return (
			<Box className={'accommodationCards'}>
				{props.accommodations.map((accommodation) => {
					let accommodationAvailability = props.availabilityStayList.find(
						(accommodationAvail) => accommodationAvail.id === accommodation.id
					);
					const pointsEarnable = accommodationAvailability ? accommodationAvailability.pointsEarned : 0;
					return (
						<AccommodationSearchCard
							key={accommodation.id}
							accommodation={accommodation}
							destinationId={props.destinationId}
							pointsEarnable={pointsEarnable}
							onClickInfoIcon={handleOnInfoClick}
							showInfoIcon
						/>
					);
				})}
			</Box>
		);
	}

	return (
		<Popup opened={props.opened} className={'rsAccommodationsPopup'}>
			<Paper className={'accommodationCardsContainer'}>
				<Box className={'titleContainer'}>
					<Label variant={'accommodationModalCustomOne'}>
						{props.destinationName} - {props.propertyTypeName}
					</Label>
					<Icon
						className={'closeIcon'}
						iconImg={'icon-close'}
						size={30}
						onClick={() => {
							popupController.close(AccommodationsPopup);
						}}
					/>
				</Box>
				{renderAccommodations()}
			</Paper>
		</Popup>
	);
};

export default AccommodationsPopup;
