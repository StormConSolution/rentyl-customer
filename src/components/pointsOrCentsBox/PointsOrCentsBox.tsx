import * as React from 'react';
import './PointsOrCentsBox.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '../../utils/utils';
import LabelButton from '../labelButton/LabelButton';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';

interface PointsOrCentsBoxProps {
	priceObj: Misc.Pricing;
}

const PointsOrCentsBox: React.FC<PointsOrCentsBoxProps> = (props) => {
	const reservationFilters = useRecoilValue<Misc.ReservationFilters>(globalState.reservationFilters);

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
					/>
				</Box>
			);
		}
	}

	return <Box className={'rsPointsOrCentsBox'}>{renderPriceOrPoints()}</Box>;
};

export default PointsOrCentsBox;
