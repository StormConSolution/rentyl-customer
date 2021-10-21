import React from 'react';
import './UserPointStatusBarResponsive.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import { DateUtils } from '@bit/redsky.framework.rs.utils';
import { useRecoilValue } from 'recoil';
import { popupController } from '@bit/redsky.framework.rs.996';
import globalState from '../../../state/globalState';
import LabelButton from '../../labelButton/LabelButton';
import LoyaltyTierPopup, { LoyaltyTierPopupProps } from '../../../popups/loyaltyTierPopup/LoyaltyTierPopup';
import { StringUtils } from '../../../utils/utils';
import Paper from '../../paper/Paper';
import LabelLink from '../../labelLink/LabelLink';

interface UserPointStatusBarProps {
	className?: string;
}

const UserPointStatusBarResponsive: React.FC<UserPointStatusBarProps> = (props) => {
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	function renderLoadingBarPercent(): string {
		if (!user) return '';
		return `${Math.min(
			100,
			Math.floor(user.lifeTimePoints / (user.nextTierThreshold ? user.nextTierThreshold / 100 : 100))
		)}%`;
	}

	return !user ? (
		<Label variant={'body1'}>No user available</Label>
	) : (
		<Paper
			className={`rsUserPointStatusBarResponsive ${props.className || ''}`}
			boxShadow
			padding={'34px 60px 30px 30px'}
			width={'1042px'}
			height={'190px'}
		>
			<Box display={'grid'}>
				<Label variant={'h4'}>Points Earned</Label>
				<Label variant={'h4'}>Points Pending</Label>
				<Label variant={'body1'}>
					You're {user.nextTierThreshold ? user.nextTierThreshold - user.lifeTimePoints : 0} Points until you
					reach <b>{user.nextTierThreshold ? user.nextTierTitle : user.tierTitle}</b> Spire tier.
				</Label>
				<Label className={'yellow'} variant={'h1'}>
					{StringUtils.addCommasToNumber(user.availablePoints)}
				</Label>
				<Label className={'grey'} variant={'h1'}>
					{StringUtils.addCommasToNumber(user.pendingPoints)}
				</Label>
				<Box className={'loadingBarContainer'}>
					<div className={'loadingBar'} style={{ width: renderLoadingBarPercent() }} />
				</Box>
				<LabelLink
					path={'/reward'}
					label={'Redeem Points'}
					variant={'caption'}
					iconRight={'icon-chevron-right'}
					iconSize={7}
				/>
				<LabelLink
					path={'/account/points'}
					label={'Manage Points'}
					variant={'caption'}
					iconRight={'icon-chevron-right'}
					iconSize={7}
				/>
				<LabelButton
					look={'none'}
					label={'See Loyalty Tiers'}
					variant={'caption'}
					onClick={() => {
						popupController.open<LoyaltyTierPopupProps>(LoyaltyTierPopup, {});
					}}
				/>
			</Box>
			{!!user.pointsExpiring && (
				<Box className={'pointsExpireContainer'}>
					<Label variant={'caption'}>
						{user.pointsExpiring || 0} Points will expire on{' '}
						{DateUtils.displayDate(user.pointsExpiringOn || new Date())}
					</Label>
				</Box>
			)}
		</Paper>
	);
};

export default UserPointStatusBarResponsive;
