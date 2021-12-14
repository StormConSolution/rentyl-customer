import * as React from 'react';
import './RateCodeCardResponsive.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import PointsOrCentsBox from '../../pointsOrCentsBox/PointsOrCentsBox';

interface RateCodeCardResponsiveProps {
	priceObj: Misc.Pricing;
	accommodationId: number;
	destinationId: number;
	loyaltyStatus: Model.LoyaltyStatus;
}

const RateCodeCardResponsive: React.FC<RateCodeCardResponsiveProps> = (props) => {
	return (
		<Box className={'rsRateCodeCardResponsive'}>
			<Box>
				<Label variant={'accommodationModalCustomSeven'} paddingBottom={13}>
					{props.priceObj.rate.name || 'Promotional Rate'}
				</Label>
				<Label variant={'accommodationModalCustomEight'}>
					{props.priceObj.rate.description || 'Promotional Rate'}
				</Label>
			</Box>
			<PointsOrCentsBox
				priceObj={props.priceObj}
				accommodationId={props.accommodationId}
				destinationId={props.destinationId}
				loyaltyStatus={props.loyaltyStatus}
			/>
		</Box>
	);
};

export default RateCodeCardResponsive;
