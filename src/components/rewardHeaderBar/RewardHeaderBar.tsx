import React from 'react';
import './RewardHeaderBar.scss';
import IconLabel from '../iconLabel/IconLabel';
import router from '../../utils/router';
import Label from '@bit/redsky.framework.rs.label';
import PointsOrLogin from '../pointsOrLogin/PointsOrLogin';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';

interface RewardHeaderBarProps {
	title: string;
	titleVariant: string;
	className?: string;
}

const RewardHeaderBar: React.FC<RewardHeaderBarProps> = (props) => {
	let userService = serviceFactory.get<UserService>('UserService');
	const user = userService.getCurrentUser();
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
					<PointsOrLogin user={user} />
				</div>
			</div>
		</div>
	);
};

export default RewardHeaderBar;
