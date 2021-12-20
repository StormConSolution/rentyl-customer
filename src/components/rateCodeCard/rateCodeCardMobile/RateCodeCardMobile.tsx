import * as React from 'react';
import './RateCodeCardMobile.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '../../../utils/utils';
import LabelButton from '../../labelButton/LabelButton';
import router from '../../../utils/router';
import { useRecoilState } from 'recoil';
import globalState from '../../../state/globalState';
import DestinationDetailsMobilePopup from '../../../popups/destinationDetailsMobilePopup/DestinationDetailsMobilePopup';

interface RateCodeCardMobileProps {
	priceObj: Misc.Pricing;
	accommodationId: number;
	destinationId: number;
	pointsEarnable: number;
	loyaltyStatus: Model.LoyaltyStatus;
}

const RateCodeCardMobile: React.FC<RateCodeCardMobileProps> = (props) => {
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);

	function onBookNow() {
		if (props.loyaltyStatus !== 'ACTIVE') {
			setReservationFilters({ ...reservationFilters, redeemPoints: false });
		}
		let data: any = { ...reservationFilters, redeemPoints: props.loyaltyStatus === 'ACTIVE' };
		let rateCode = '';
		if (typeof props.priceObj.rate === 'string') {
			rateCode = props.priceObj.rate;
		} else if (typeof props.priceObj.rate === 'object') {
			rateCode = props.priceObj.rate.code;
		}
		let newRoom: Misc.StayParams = {
			uuid: Date.now(),
			adults: data.adultCount,
			children: data.childCount || 0,
			accommodationId: props.accommodationId,
			arrivalDate: data.startDate,
			departureDate: data.endDate,
			packages: [],
			rateCode: rateCode
		};
		data = StringUtils.setAddPackagesParams({ destinationId: props.destinationId, newRoom });
		popupController.close(DestinationDetailsMobilePopup);
		router.navigate(`/booking/packages?data=${data}`).catch(console.error);
	}

	function renderPointsOrCash() {
		if (reservationFilters.redeemPoints && props.loyaltyStatus === 'ACTIVE') {
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
				<Label variant={'accommodationModalCustomThirteen'}>
					{props.priceObj.rate.name || 'Promotional Rate'}
				</Label>
				<Label variant={'bookingSummaryCustomThree'}>
					{props.priceObj.rate.description || 'Promotional Rate'}
				</Label>
				{renderPointsOrCash()}
				{!reservationFilters.redeemPoints && props.loyaltyStatus === 'ACTIVE' && (
					<Label variant={'accommodationModalCustomTwelve'} className={'earnText'}>
						You will earn {props.pointsEarnable} points for this stay
					</Label>
				)}
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
