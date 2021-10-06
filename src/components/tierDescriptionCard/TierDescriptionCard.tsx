import * as React from 'react';
import './TierDescriptionCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';

interface TierDescriptionCardProps {
	tierImage: string;
	tierName: string;
	tierPointValue: string;
	tierDescription: string;
}

const TierDescriptionCard: React.FC<TierDescriptionCardProps> = (props) => {
	return (
		<Box className={'rsTierDescriptionCard'}>
			<Box className={'tierHeader'}>
				<Box className={'imageWrapper'}>
					<img src={props.tierImage} alt={''} />
				</Box>
				<Box className={'titleContainer'}>
					<Label variant={'h4'} className={'capitalize'}>
						{props.tierName}
					</Label>
					<Label variant={'h2'}>{props.tierPointValue} points</Label>
				</Box>
			</Box>
			<Label variant={'body1'} className={'paragraph'}>
				{props.tierDescription}
			</Label>
		</Box>
	);
};

export default TierDescriptionCard;
