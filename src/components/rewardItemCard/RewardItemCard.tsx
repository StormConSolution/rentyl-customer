import React from 'react';
import './RewardItemCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import IconLabel from '../iconLabel/IconLabel';
import router from '../../utils/router';

interface RewardItemCardProps {
	imgPath: string;
	title: string;
	points: number;
	description: string;
	rewardId: number | string;
	className?: string;
}

const RewardItemCard: React.FC<RewardItemCardProps> = (props) => {
	function renderStyles() {
		let styles: any = {
			backgroundImage: `url(${props.imgPath})`,
			height: '250px',
			width: '278px'
		};
		return styles;
	}

	return (
		<div className={`rsRewardItemCard ${props.className || ''}`}>
			<div className={'itemImgContainer'} style={renderStyles()} />
			<Label variant={'h3'}>{props.title}</Label>
			<Label variant={'h5'}>{props.points} Points</Label>
			<Label variant={'subtitle1'}>{props.description}</Label>
			<IconLabel
				labelName={'View Details'}
				iconImg={'icon-chevron-right'}
				iconPosition={'right'}
				iconSize={7}
				onClick={() => router.navigate(`/reward/details?ri=${props.rewardId}`)}
			/>
		</div>
	);
};

export default RewardItemCard;
