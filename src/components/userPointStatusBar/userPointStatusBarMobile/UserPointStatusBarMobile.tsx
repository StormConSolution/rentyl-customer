import React from 'react';
import './UserPointStatusBarMobile.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import { DateUtils } from '@bit/redsky.framework.rs.utils';
import { useRecoilValue } from 'recoil';
import { popupController } from '@bit/redsky.framework.rs.996';
import globalState from '../../../state/globalState';
import Paper from '../../paper/Paper';
import { StringUtils } from '../../../utils/utils';
import LabelLink from '../../labelLink/LabelLink';
import LabelButton from '../../labelButton/LabelButton';
import LoyaltyTierPopup, { LoyaltyTierPopupProps } from '../../../popups/loyaltyTierPopup/LoyaltyTierPopup';

interface UserPointStatusBarProps {
	className?: string;
}

const UserPointStatusBarMobile: React.FC<UserPointStatusBarProps> = (props) => {
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
		<Paper className={`rsUserPointStatusBarMobile ${props.className || ''}`} boxShadow padding={'10px'}>
			<Box display={'flex'} justifyContent={'space-between'}>
				<Box>
					<Label variant={'h4'}>Points Earned</Label>
					<Label className={'yellow'} variant={'h3'}>
						{StringUtils.addCommasToNumber(user.availablePoints)}
					</Label>
					<LabelLink
						path={'/reward'}
						label={'Redeem Points'}
						variant={'caption'}
						iconRight={'icon-chevron-right'}
						iconSize={7}
					/>
				</Box>
				<Box>
					<Label variant={'h4'}>Points Pending</Label>
					<Label className={'grey'} variant={'h3'}>
						{StringUtils.addCommasToNumber(user.pendingPoints)}
					</Label>
					<LabelLink
						path={'/account/points'}
						label={'Manage Points'}
						variant={'caption'}
						iconRight={'icon-chevron-right'}
						iconSize={7}
					/>
				</Box>
			</Box>
			<Box mt={10}>
				<Label variant={'body1'}>
					You're {user.nextTierThreshold ? user.nextTierThreshold - user.lifeTimePoints : 0} Points until you
					reach <b>{user.nextTierThreshold ? user.nextTierTitle : user.tierTitle}</b> Spire tier.
				</Label>
				<Box className={'loadingBarContainer'}>
					<div className={'loadingBar'} style={{ width: renderLoadingBarPercent() }} />
				</Box>
				<LabelButton
					className={'seeTiers'}
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

export default UserPointStatusBarMobile;
