import * as React from 'react';
import { Box } from '@bit/redsky.framework.rs.996';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import RateCodeCardResponsive from './rateCodeCardResponsive/RateCodeCardResponsive';
import RateCodeCardMobile from './rateCodeCardMobile/RateCodeCardMobile';

interface RateCodeCardProps {
	priceObj: Misc.Pricing;
	accommodationId: number;
	destinationId: number;
	pointsEarnable: number;
	loyaltyStatus: Model.LoyaltyStatus;
}

const RateCodeCard: React.FC<RateCodeCardProps> = (props) => {
	const size = useWindowResizeChange();
	return (
		<Box className={'rsRateCodeCard'} width={'100%'}>
			{size === 'small' ? (
				<RateCodeCardMobile
					priceObj={props.priceObj}
					accommodationId={props.accommodationId}
					destinationId={props.destinationId}
					pointsEarnable={props.pointsEarnable}
					loyaltyStatus={props.loyaltyStatus}
				/>
			) : (
				<RateCodeCardResponsive
					priceObj={props.priceObj}
					accommodationId={props.accommodationId}
					destinationId={props.destinationId}
					loyaltyStatus={props.loyaltyStatus}
				/>
			)}
		</Box>
	);
};

export default RateCodeCard;
