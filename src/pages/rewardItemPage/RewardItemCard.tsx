import React from 'react';
import './RewardItemCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import IconLabel from '../../components/iconLabel/IconLabel';
import router from '../../utils/router';
import { addCommasToNumber, capitalize } from '../../utils/utils';

interface RewardItemCardProps {
	imgPath: string;
	title: string;
	points: number | string;
	description: string;
	rewardId: number | string;
	className?: string;
}

const RewardItemCard: React.FC<RewardItemCardProps> = (props) => {
	return (
		<div className={`rsRewardItemCard ${props.className || ''}`}>
			<div className={'imageContainer'}>
				<img className={'rewardImg'} src={props.imgPath} alt={'rewardImage'} height={'250px'} width={'278px'} />
			</div>
			<Label className={'rewardName'} variant={'h2'}>
				{capitalize(props.title)}
			</Label>
			<Label className={'rewardPoints'} variant={'h3'}>
				{addCommasToNumber(props.points as number)} Points
			</Label>
			<Label className={'rewardDescription'} variant={'body1'}>
				{props.description}
			</Label>
			<IconLabel
				className={'rewardDetails'}
				labelName={'View Details'}
				iconImg={'icon-chevron-right'}
				iconPosition={'right'}
				iconSize={7}
				labelVariant={'caption'}
				onClick={() => router.navigate(`/reward/details?ri=${props.rewardId}`)}
			/>
		</div>
	);
};

export default RewardItemCard;
