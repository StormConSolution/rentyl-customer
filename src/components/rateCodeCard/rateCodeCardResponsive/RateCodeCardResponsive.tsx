import * as React from 'react';
import './RateCodeCardResponsive.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import PointsOrCentsBox from '../../pointsOrCentsBox/PointsOrCentsBox';

interface RateCodeCardResponsiveProps {
	priceObj: Misc.Pricing;
	accommodationId: number;
	destinationId: number;
}

const RateCodeCardResponsive: React.FC<RateCodeCardResponsiveProps> = (props) => {
	return (
		<Box className={'rsRateCodeCardResponsive'}>
			<Box>
				<Label variant={'accommodationModalCustomSeven'} paddingBottom={13}>
					{props.priceObj.title || 'Promotional Rate'}
				</Label>
				<Label variant={'accommodationModalCustomEight'}>
					{props.priceObj.description || 'Promotional Rate'}
				</Label>
			</Box>
			<PointsOrCentsBox
				priceObj={props.priceObj}
				accommodationId={props.accommodationId}
				destinationId={props.destinationId}
			/>
		</Box>
	);
};

export default RateCodeCardResponsive;
