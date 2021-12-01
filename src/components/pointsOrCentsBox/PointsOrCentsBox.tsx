import * as React from 'react';
import './PointsOrCentsBox.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '../../utils/utils';
import LabelButton from '../labelButton/LabelButton';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import router from '../../utils/router';
import AccommodationsPopup from '../../popups/accommodationsPopup/AccommodationsPopup';

interface PointsOrCentsBoxProps {
	priceObj: Misc.Pricing;
	accommodationId: number;
	destinationId: number;
}

const PointsOrCentsBox: React.FC<PointsOrCentsBoxProps> = (props) => {
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

	function renderPriceOrPoints() {
		if (reservationFilters.redeemPoints) {
			return (
				<Box className={'pointsContainer'}>
					<Label variant={'accommodationModalCustomSix'}>from</Label>
					<Label variant={'h3'} className={'yellowText'}>
						{props.priceObj ? StringUtils.addCommasToNumber(props.priceObj.pricePoints) : 0}
					</Label>
					<Label variant={'accommodationModalCustomFive'}>points per night</Label>
					<LabelButton
						look={'containedPrimary'}
						variant={'buttonTwo'}
						label={'Book Now'}
						className={'yellow'}
						onClick={onBookNow}
					/>
				</Box>
			);
		} else {
			return (
				<Box className={'priceContainer'}>
					<Label variant={'h3'}>
						{props.priceObj ? '$' + StringUtils.formatMoney(props.priceObj.priceCents) : 0}
					</Label>
					<Label variant={'accommodationModalCustomFour'}>per night</Label>
					<Label variant={'accommodationModalCustomFive'}>+ taxes & fees</Label>
					<LabelButton
						look={'containedPrimary'}
						variant={'buttonTwo'}
						label={'Book Now'}
						className={'yellow'}
						onClick={onBookNow}
					/>
				</Box>
			);
		}
	}

	return <Box className={'rsPointsOrCentsBox'}>{renderPriceOrPoints()}</Box>;
};

export default PointsOrCentsBox;
