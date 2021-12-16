import * as React from 'react';
import './UserBasicInfoPaperMobile.scss';
import Paper from '../../paper/Paper';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '../../../utils/utils';
import LabelButton from '../../labelButton/LabelButton';
import LoyaltyTierPopup from '../../../popups/loyaltyTierPopup/LoyaltyTierPopup';
import { useState } from 'react';
import Icon from '@bit/redsky.framework.rs.icon';

interface UserBasicInfoPaperMobileProps {
	userData: Api.User.Res.Detail;
	onLogOut: () => void;
}

const UserBasicInfoPaperMobile: React.FC<UserBasicInfoPaperMobileProps> = (props) => {
	const [visibilityToggle, setVisibilityToggle] = useState<boolean>(true);
	function renderLoadingBarPercent(): string {
		return `${Math.min(
			100,
			Math.floor(
				props.userData.lifeTimePoints /
					(props.userData.nextTierThreshold ? props.userData.nextTierThreshold / 100 : 100)
			)
		)}%`;
	}
	function replaceLettersWithStars(accountNumber: any): string {
		let lastFour = accountNumber.slice(-4);
		return accountNumber.replace(/\d/g, '*').slice(0, -4) + lastFour;
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
					<Label variant={'customThree'}>{props.userData.tierTitle || 'Bronze'}</Label>
					<Box display={'flex'} alignItems={'center'}>
						<Label variant={'customThree'} marginRight={'16px'}>
							Account{' '}
							{visibilityToggle
								? props.userData.accountNumber
								: replaceLettersWithStars(props.userData.accountNumber)}
						</Label>
					</Box>
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

			<Box className={'pointsContainer'} mt={20} display={'flex'}>
				<LabelButton
					look={'containedPrimary'}
					variant={'customTwentyThree'}
					label={'Loyalty Tiers'}
					onClick={() => {
						popupController.open(LoyaltyTierPopup);
					}}
				/>
				<Box display={'flex'} ml={10}>
					<Label variant={'customTwentyFive'} color={'#707070'} ml={'auto'}>
						Not you?
					</Label>
					<Label ml={3} variant={'customTwentyFour'} color={'#2C3C60'} onClick={props.onLogOut}>
						Log Out
					</Label>
				</Box>
			</Box>
		</Paper>
	);
};

export default UserBasicInfoPaperMobile;
