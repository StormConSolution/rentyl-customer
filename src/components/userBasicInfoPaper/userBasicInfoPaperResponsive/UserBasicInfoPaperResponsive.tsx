import * as React from 'react';
import './UserBasicInfoPaperResponsive.scss';
import Paper from '../../paper/Paper';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '../../../utils/utils';
import LabelButton from '../../labelButton/LabelButton';
import LoyaltyTierPopup from '../../../popups/loyaltyTierPopup/LoyaltyTierPopup';
import Icon from '@bit/redsky.framework.rs.icon';

interface UserBasicInfoPaperResponsiveProps {
	userData: Api.User.Res.Detail;
	onLogOut: () => void;
}

const UserBasicInfoPaperResponsive: React.FC<UserBasicInfoPaperResponsiveProps> = (props) => {
	function renderLoadingBarPercent(): string {
		return `${Math.min(
			100,
			Math.floor(
				props.userData.lifeTimePoints /
					(props.userData.nextTierThreshold ? props.userData.nextTierThreshold / 100 : 100)
			)
		)}%`;
	}
	return (
		<Paper className={'rsUserBasicInfoPaperResponsive'} boxShadow borderRadius={'20px'}>
			<Box display={'flex'} justifyContent={'space-between'} mb={16}>
				<Box display={'flex'}>
					<Label variant={'customOne'} mr={3}>
						{`${props.userData.firstName} ${props.userData.lastName}`},
					</Label>
					<Label variant={'customTwo'}>{props.userData.primaryEmail}</Label>
				</Box>
				<Box display={'flex'}>
					<Label variant={'customThree'} color={'#707070'}>
						Not you?
					</Label>
					<Label
						ml={3}
						variant={'customFour'}
						color={'#2C3C60'}
						onClick={props.onLogOut}
						className={'clickable'}
					>
						Log Out
					</Label>
				</Box>
			</Box>
			<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={30}>
				<Box display={'flex'} alignItems={'center'}>
					<img
						src={`../../images/tierIcons/${props.userData.tierTitle || 'Bronze'}.png`}
						alt={'Tier Badge'}
					/>
					<Box ml={15}>
						<Label variant={'customThree'}>{props.userData.tierTitle || 'Bronze'}</Label>
						<Label variant={'customThree'}>
							Account {props.userData.id}
							<Icon
								className={'visibilityIcon'}
								iconImg={'icon-solid-question-circle'}
								onClick={() => {
									alert('This will hide your account number');
								}}
							></Icon>
						</Label>
					</Box>
				</Box>
				<Box textAlign={'end'}>
					<Label variant={'customThree'} mb={6}>
						You have reached {props.userData.tierTitle || 'Bronze'} Spire Level! Hooray!
					</Label>
					<div className={'loadingBarContainer'}>
						<div className={'loadingBar'} style={{ width: renderLoadingBarPercent() }} />
					</div>
				</Box>
			</Box>
			<Box className={'pointsContainer'}>
				<div>
					<Label variant={'customFive'} mb={8}>
						Points Available
					</Label>
					<Label variant={'customSix'} color={'#FFA022'}>
						{StringUtils.addCommasToNumber(props.userData.availablePoints)}
					</Label>
				</div>
				<div>
					<Label variant={'customFive'} mb={8}>
						Points Pending
					</Label>
					<Label variant={'userBasicInfoCustomOne'}>
						{StringUtils.addCommasToNumber(props.userData.pendingPoints)}
					</Label>
				</div>
				<div>
					<Label variant={'customFive'} mb={8}>
						Lifetime Points
					</Label>
					<Label variant={'userBasicInfoCustomOne'}>
						{StringUtils.addCommasToNumber(props.userData.lifeTimePoints)}
					</Label>
				</div>
				<div className={'loyaltyTierButtonContainer'}>
					<LabelButton
						look={'containedPrimary'}
						variant={'customTwentyThree'}
						label={'See Loyalty Tiers'}
						onClick={() => {
							popupController.open(LoyaltyTierPopup);
						}}
					/>
				</div>
			</Box>
		</Paper>
	);
};

export default UserBasicInfoPaperResponsive;
