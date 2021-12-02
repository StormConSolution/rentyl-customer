import * as React from 'react';
import './RateCodeCardMobile.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '../../../utils/utils';
import LabelButton from '../../labelButton/LabelButton';
import AccommodationsPopup from '../../../popups/accommodationsPopup/AccommodationsPopup';
import router from '../../../utils/router';
import { useRecoilValue } from 'recoil';
import globalState from '../../../state/globalState';

interface RateCodeCardMobileProps {
	priceObj: Misc.Pricing;
	accommodationId: number;
	destinationId: number;
}

const RateCodeCardMobile: React.FC<RateCodeCardMobileProps> = (props) => {
	const reservationFilters = useRecoilValue<Misc.ReservationFilters>(globalState.reservationFilters);

	function onBookNow() {
		let data: any = { ...reservationFilters };
		let newRoom: Misc.StayParams = {
			uuid: Date.now(),
			adults: data.adultCount,
			children: data.childCount || 0,
			accommodationId: props.accommodationId,
			arrivalDate: data.startDate,
			departureDate: data.endDate,
			packages: [],
			rateCode: props.priceObj.rateCode
		};
		data = StringUtils.setAddPackagesParams({ destinationId: props.destinationId, newRoom });
		popupController.close(AccommodationsPopup);
		router.navigate(`/booking/packages?data=${data}`).catch(console.error);
	}

	function renderPointsOrCash() {
		if (reservationFilters.redeemPoints) {
			return (
				<Box className={'pricePerNight'}>
					<Label variant={'accommodationModalCustomEleven'} className={'yellowText'}>
						{StringUtils.addCommasToNumber(props.priceObj.pricePoints)}pts
					</Label>
					<Label variant={'pointsPageCustomSix'}>/night</Label>
				</Box>
			);
		} else {
			return (
				<Box className={'pricePerNight'}>
					<Label variant={'accommodationModalCustomEleven'}>
						{'$' + StringUtils.formatMoney(props.priceObj.priceCents) + '/ '}
					</Label>
					<Label variant={'pointsPageCustomSix'}>night + taxes & fees</Label>
				</Box>
			);
		}
	}

	return (
		<Box className={'rsRateCodeCardMobile'}>
			<Box>
				<Label variant={'accommodationModalCustomThirteen'}>{props.priceObj.title || 'Promotional Rate'}</Label>
				<Label variant={'bookingSummaryCustomThree'}>{props.priceObj.description || 'Promotional Rate'}</Label>
				{renderPointsOrCash()}
				<Label variant={'accommodationModalCustomTwelve'} className={'earnText'}>
					You will earn points for this stay
				</Label>
			</Box>
			<Box className={'buttonContainer'}>
				<LabelButton
					look={'containedPrimary'}
					variant={'buttonTwo'}
					label={'Book Now'}
					className={'yellow'}
					onClick={onBookNow}
				/>
			</Box>
		</Box>
	);
};

export default RateCodeCardMobile;
