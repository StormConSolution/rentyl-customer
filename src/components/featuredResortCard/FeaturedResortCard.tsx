import * as React from 'react';
import './FeaturedResortCard.scss';
import { Link } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import LabelLink from '../labelLink/LabelLink';

interface FeaturedResortCardProps {
	resortId: number;
	name: string;
	image: string;
}

const FeaturedResortCard: React.FC<FeaturedResortCardProps> = (props) => {
	return (
		<Link path={`?ri=${props.resortId}`} className={'rsFeaturedResortCard'}>
			<img src={props.image} alt={props.name} />
			<Label variant={'h2'}>{props.name}</Label>
			<LabelLink
				path={`?ri=${props.resortId}`}
				externalLink={false}
				label={'Book Now'}
				variant={'button'}
				iconRight={'icon-chevron-right'}
				iconSize={9}
			/>
		</Link>
	);
};

export default FeaturedResortCard;
