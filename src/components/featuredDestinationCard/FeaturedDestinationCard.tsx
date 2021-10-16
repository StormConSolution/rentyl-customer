import * as React from 'react';
import './FeaturedDestinationCard.scss';
import { Box, Link } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Icon from '@bit/redsky.framework.rs.icon';
import router from '../../utils/router';

interface FeaturedResortCardProps {
	resortId: number;
	name: string;
	image: string;
}

const FeaturedDestinationCard: React.FC<FeaturedResortCardProps> = (props) => {
	const size = useWindowResizeChange();

	return (
		<div className={'rsFeaturedDestinationCard'}>
			<img src={props.image} alt={props.name} onClick={() => router.navigate(`?ri=${props.resortId}`)} />
			<Label variant={size === 'small' ? 'h3' : 'h2'}>{props.name}</Label>
			<Link path={`?ri=${props.resortId}`}>
				<Box display={'flex'} alignItems={'center'}>
					<Label variant={'button'}>Book Now</Label>
					<Icon iconImg={'icon-chevron-right'} size={8} />
				</Box>
			</Link>
		</div>
	);
};

export default FeaturedDestinationCard;
