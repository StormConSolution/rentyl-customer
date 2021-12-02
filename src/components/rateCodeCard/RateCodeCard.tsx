import * as React from 'react';
import './RateCodeCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import PointsOrCentsBox from '../pointsOrCentsBox/PointsOrCentsBox';

interface RateCodeCardProps {
	priceObj: Misc.Pricing;
	accommodationId: number;
	destinationId: number;
}

const RateCodeCard: React.FC<RateCodeCardProps> = (props) => {
	return (
		<Box className={'rsRateCodeCard'}>
			<Box>
				<Label variant={'accommodationModalCustomSeven'}>{props.priceObj.rate.name}</Label>
				<Label variant={'accommodationModalCustomEight'}>{props.priceObj.rate.description}</Label>
			</Box>
			<PointsOrCentsBox
				priceObj={props.priceObj}
				accommodationId={props.accommodationId}
				destinationId={props.destinationId}
			/>
		</Box>
	);
};

export default RateCodeCard;
