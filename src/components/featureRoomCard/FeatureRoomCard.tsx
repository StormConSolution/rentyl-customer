import React from 'react';
import './FeatureRoomCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Paper from '../paper/Paper';

interface FeatureRoomCardProps {
	mainImg: string;
	title: string;
	discountAmount: number;
	bookNowPath: () => void;
	className?: string;
}

const FeatureRoomCard: React.FC<FeatureRoomCardProps> = (props) => {
	return (
		<Paper className={`rsFeatureRoomCard ${props.className || ''}`} height={'247px'} width={'278px'}>
			<Box className={'limitOfferWhiteBox'}>
				<Label className={'limitOfferLabel'} variant={'caption'}>
					Limited offer
				</Label>
			</Box>
			<img className={'mainImg'} src={props.mainImg} alt={'Main'} />
			<Label className={'titleLabel'} variant={'caption'}>
				{props.title}
			</Label>
			<Label className={'discountLabel'} variant={'h2'}>
				${props.discountAmount} off
			</Label>
			<Label className={'bookNowPathLink'} onClick={props.bookNowPath}>
				Book Now
				<Icon className={'bookNowIcon'} iconImg={'icon-chevron-right'} size={9} color={'#004b98'} />
			</Label>
		</Paper>
	);
};
export default FeatureRoomCard;
