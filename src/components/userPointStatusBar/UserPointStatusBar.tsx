import React from 'react';
import './UserPointStatusBar.scss';
import Paper from '../paper/Paper';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import LabelLink from '../labelLink/LabelLink';
import { DateUtils } from '@bit/redsky.framework.rs.utils';
import UserService from '../../services/user/user.service';
import serviceFactory from '../../services/serviceFactory';

interface UserPointStatusBarProps {
	className?: string;
}

const UserPointStatusBar: React.FC<UserPointStatusBarProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const user = userService.getCurrentUser();

	return !user ? (
		<Label variant={'body1'}>No user available</Label>
	) : (
		<div className={`rsUserPointStatusBar ${props.className || ''}`}>
			<Paper
				className={'rewardPointsContainer'}
				boxShadow
				padding={'34px 60px 30px 30px'}
				width={'1042px'}
				height={'190px'}
				position={'absolute'}
			>
				<Box display={'grid'}>
					<Label variant={'h4'}>Points Earned</Label>
					<Label variant={'h4'}>Points Pending</Label>
					<Label variant={'body1'}>
						You're 45,835 Points until you reach Silver Member Status, or pay to level up now
					</Label>
					<Label className={'yellow'} variant={'h1'}>
						{user.availablePoints}
					</Label>
					<Label className={'grey'} variant={'h1'}>
						{user.availablePoints}
					</Label>
					<Box className={'loadingBarContainer'}>
						<div className={'loadingBar'} />
					</Box>
					<LabelLink
						path={'/'}
						label={'Redeem Points'}
						variant={'caption'}
						iconRight={'icon-chevron-right'}
						iconSize={7}
					/>
					<LabelLink
						path={'/'}
						label={'Manage Points'}
						variant={'caption'}
						iconRight={'icon-chevron-right'}
						iconSize={7}
					/>
					<LabelLink
						path={'/'}
						label={'See Loyalty Tiers'}
						variant={'caption'}
						iconRight={'icon-chevron-right'}
						iconSize={7}
					/>
				</Box>
				<Box className={'pointsExpireContainer'}>
					<Label variant={'caption'}>1,342 Points will expire on {DateUtils.displayDate(new Date())}</Label>
				</Box>
			</Paper>
		</div>
	);
};

export default UserPointStatusBar;
