import * as React from 'react';
import './FeaturedRewardCard.scss';
import Label from '@bit/redsky.framework.rs.label';

interface FeaturedRewardCardProps {
	mainImg: string;
	logoImg: string;
	title: string;
}

const FeaturedRewardCard: React.FC<FeaturedRewardCardProps> = (props) => {
	return (
		<div className={'rsFeaturedRewardCard'}>
			<img className={'mainImg'} src={props.mainImg} alt={'Main'} />
			{/*<img className={'logoImg'} src={props.mainImg} alt={'Company Logo'}/>*/}
			<div className={'logoImg'} />
			<Label variant={'h2'}>{props.title}</Label>
		</div>
	);
};

export default FeaturedRewardCard;
