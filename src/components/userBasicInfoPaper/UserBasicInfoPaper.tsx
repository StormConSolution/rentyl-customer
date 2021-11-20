import * as React from 'react';
import './UserBasicInfoPaper.scss';
import Paper from '../paper/Paper';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import router from '../../utils/router';

interface UserBasicInfoPaperProps {
	userData: Api.User.Res.Detail;
	onLogOut: () => void;
}

const UserBasicInfoPaper: React.FC<UserBasicInfoPaperProps> = (props) => {
	function renderLoadingBarPercent(): string {
		return '45%';
		// return `${Math.min(
		// 	100,
		// 	Math.floor(props.userData.lifeTimePoints / (props.userData.nextTierThreshold ? props.userData.nextTierThreshold / 100 : 100))
		// )}%`;
	}
	return (
		<Paper className={'rsUserBasicInfoPaper'} boxShadow borderRadius={'20px'} padding={'24px 26px'}>
			<Box display={'flex'} justifyContent={'space-between'} mb={16}>
				<Box display={'flex'}>
					<Label variant={'customOne'} mr={3}>
						{`${props.userData.firstName} ${props.userData.lastName}`},
					</Label>
					<Label variant={'customTwo'}>{props.userData.primaryEmail}</Label>
				</Box>
				<Box display={'flex'}>
					<Label variant={'customThree'} color={'#707070'}>
						not you?
					</Label>
					<Label ml={3} variant={'customFour'} color={'#2C3C60'} onClick={props.onLogOut}>
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
						<Label variant={'customThree'}>{props.userData.tierTitle || ''}</Label>
						<Label variant={'customThree'}>Account {props.userData.id}</Label>
					</Box>
				</Box>
				<Box textAlign={'end'}>
					<Label variant={'customThree'} mb={6}>
						You have reached {props.userData.tierTitle} Spire! Hooray!
					</Label>
					<div className={'loadingBarContainer'}>
						<div className={'loadingBar'} style={{ width: renderLoadingBarPercent() }} />
					</div>
				</Box>
			</Box>
		</Paper>
	);
};

export default UserBasicInfoPaper;
