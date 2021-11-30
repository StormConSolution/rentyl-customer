import * as React from 'react';
import './RateCodeCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import PointsOrCentsBox from '../pointsOrCentsBox/PointsOrCentsBox';

interface RateCodeCardProps {
	priceObj: Misc.Pricing;
}

const RateCodeCard: React.FC<RateCodeCardProps> = (props) => {
	return (
		<Box className={'rsRateCodeCard'}>
			<Box>
				<Label variant={'accommodationModalCustomSeven'}>{props.priceObj.title}</Label>
				<Label variant={'accommodationModalCustomEight'}>{props.priceObj.description}</Label>
			</Box>
			<PointsOrCentsBox priceObj={props.priceObj} />
		</Box>
	);
};

export default RateCodeCard;
