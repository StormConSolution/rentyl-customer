import React from 'react';
import './RewardHeaderBar.scss';
import IconLabel from '../iconLabel/IconLabel';
import router from '../../utils/router';
import Label from '@bit/redsky.framework.rs.label';
import PointsOrLogin from '../pointsOrLogin/PointsOrLogin';

interface RewardHeaderBarProps {
	title: string;
	titleVariant: string;
	className?: string;
}

const RewardHeaderBar: React.FC<RewardHeaderBarProps> = (props) => {
	return (
		<div className={`rsRewardHeaderBar ${props.className || ''}`}>
			<div className={'headerBar'}>
				<div className={'headerBarLeft'}>
					<IconLabel
						className={'backLink'}
						labelName={'Back to browse'}
						iconImg={'icon-chevron-left'}
						iconPosition={'left'}
						iconSize={7}
						labelVariant={'caption'}
						onClick={() => router.navigate('/reward')}
					/>
					<Label className={'headerTitle'} variant={props.titleVariant}>
						{props.title}
					</Label>
				</div>
				<div className={'headerBarRight'}>
					<PointsOrLogin />
				</div>
			</div>
		</div>
	);
};

export default RewardHeaderBar;
