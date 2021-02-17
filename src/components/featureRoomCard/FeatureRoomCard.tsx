import React from 'react';
import './FeatureRoomCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box, Link } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';

interface FeatureRoomCardProps {
	className?: string;
	mainImg: string;
	title: string;
	discountAmount: number;
	bookNowPath: string;
}

const FeatureRoomCard: React.FC<FeatureRoomCardProps> = (props) => {
	return (
		<div className={'rsFeatureRoomCard'}>
			<Box className={'limitOfferWhiteBox'}>
				<Label className={'limitOfferLabel'} variant={'body1'}>
					LIMITED OFFER
				</Label>
			</Box>
			<img className={'mainImg'} src={props.mainImg} alt={'Main'} />
			<Label className={'titleLabel'} variant={'body1'}>
				{props.title}
			</Label>
			<Label className={'discountLabel'} variant={'h2'}>
				${props.discountAmount} off
			</Label>
			<Link className={'bookNowPathLink'} path={props.bookNowPath}>
				Book Now
				<Icon className={'bookNowIcon'} iconImg={'icon-chevron-right'} size={9} color={'#004b98'} />
			</Link>
		</div>
	);
};
export default FeatureRoomCard;
