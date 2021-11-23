import * as React from 'react';
import './TierDescriptionCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface TierDescriptionCardProps {
	tierImage: string;
	tierName: string;
	tierPointValue: string;
	tierDescription: string;
}

const TierDescriptionCard: React.FC<TierDescriptionCardProps> = (props) => {
	const size = useWindowResizeChange();

	return (
		<Box className={'rsTierDescriptionCard'}>
			<Box className={'tierHeader'}>
				<Box className={'imageWrapper'}>
					<img src={props.tierImage} alt={`tierDisplay-${props.tierName}`} />
				</Box>
				<Box className={'titleContainer'}>
					<Label variant={size === 'small' ? 'caption1' : 'body3'} className={'capitalize'}>
						{props.tierName}
					</Label>
					<Label variant={size === 'small' ? 'customEighteen' : 'customTwentyOne'}>
						{props.tierPointValue} points
					</Label>
				</Box>
			</Box>
			<Label variant={size === 'small' ? 'customNineteen' : 'customFifteen'} className={'paragraph'}>
				{props.tierDescription}
			</Label>
		</Box>
	);
};

export default TierDescriptionCard;
