import * as React from 'react';
import './UserBasicInfoPaperMobile.scss';
import Paper from '../../paper/Paper';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '../../../utils/utils';
import LabelButton from '../../labelButton/LabelButton';
import LoyaltyTierPopup from '../../../popups/loyaltyTierPopup/LoyaltyTierPopup';

interface UserBasicInfoPaperMobileProps {
	userData: Api.User.Res.Detail;
	onLogOut: () => void;
}

const UserBasicInfoPaperMobile: React.FC<UserBasicInfoPaperMobileProps> = (props) => {
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
		<Paper className={'rsUserBasicInfoPaperMobile'} boxShadow borderRadius={'20px'}>
			<Label variant={'customOne'} mr={3}>
				{`${props.userData.firstName} ${props.userData.lastName}`},
			</Label>
			<Label variant={'customTwo'} mb={25}>
				{props.userData.primaryEmail}
			</Label>
			<Box display={'flex'} alignItems={'center'} mb={25}>
				<img src={`../../images/tierIcons/${props.userData.tierTitle || 'Bronze'}.png`} alt={'Tier Badge'} />
				<Box ml={15}>
					<Label variant={'customThree'}>{props.userData.tierTitle || ''}</Label>
					<Label variant={'customThree'}>Account {props.userData.id}</Label>
				</Box>
			</Box>
			<Label variant={'customFive'} mb={8}>
				Points Available
			</Label>
			<Label variant={'customSix'} color={'#FFA022'} mb={25}>
				{StringUtils.addCommasToNumber(props.userData.availablePoints)}
			</Label>
			<Label variant={'customFive'} mb={8}>
				Pending Points
			</Label>
			<Label variant={'userBasicInfoCustomOne'} mb={25}>
				{StringUtils.addCommasToNumber(props.userData.pendingPoints)}
			</Label>
			<Label variant={'customFive'} mb={8}>
				Lifetime Points
			</Label>
			<Label variant={'userBasicInfoCustomOne'} mb={25}>
				{StringUtils.addCommasToNumber(props.userData.lifeTimePoints)}
			</Label>
			<Label variant={'customEight'} mb={6}>
				You have reached {props.userData.tierTitle || 'Bronze'} Spire Level! Hooray!
			</Label>
			<div className={'loadingBarContainer'}>
				<div className={'loadingBar'} style={{ width: renderLoadingBarPercent() }} />
			</div>
			<Box paddingTop={10}>
				<LabelButton
					look={'containedPrimary'}
					variant={'customThree'}
					label={'See Loyalty Tiers'}
					onClick={() => {
						popupController.open(LoyaltyTierPopup);
					}}
				/>
			</Box>
			<Box display={'flex'} mt={30}>
				<Label variant={'customThree'} color={'#707070'} ml={'auto'}>
					not you?
				</Label>
				<Label ml={3} variant={'customFour'} color={'#2C3C60'} onClick={props.onLogOut}>
					Log Out
				</Label>
			</Box>
		</Paper>
	);
};

export default UserBasicInfoPaperMobile;
