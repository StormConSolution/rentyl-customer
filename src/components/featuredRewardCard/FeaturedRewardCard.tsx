import * as React from 'react';
import './FeaturedRewardCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import router from '../../utils/router';

interface FeaturedRewardCardProps {
	mainImg: string;
	title: string;
	urlPath: string;
}

const FeaturedRewardCard: React.FC<FeaturedRewardCardProps> = (props) => {
	return (
		<div
			className={'rsFeaturedRewardCard'}
			onClick={() => {
				router.navigate(props.urlPath).catch(console.error);
			}}
		>
			<img loading={'lazy'} className={'mainImg'} src={props.mainImg} alt={'Main'} />
			<Label variant={'h2'}>{props.title}</Label>
		</div>
	);
};

export default FeaturedRewardCard;
