import React, { useEffect, useState } from 'react';
import './RewardDetailPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import router from '../../utils/router';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import useLoginState, { LoginStatus } from '../../customHooks/useLoginState';
import Carousel from '../../components/carousel/Carousel';
import LabelButton from '../../components/labelButton/LabelButton';
import rsToasts from '@bit/redsky.framework.toast';
import RewardHeaderBar from '../../components/rewardHeaderBar/RewardHeaderBar';

const RewardDetailPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [user, setUser] = useState<Api.User.Res.Get>();
	const loginStatus = useLoginState();
	const [reward, setReward] = useState<Api.Reward.Res.Get>();
	const imagePaths = [
		'../../images/redeemableRewardPage/perfume.jpg',
		'../../images/redeemableRewardPage/earbuds.jpg',
		'../../images/redeemableRewardPage/suitCoat.jpg'
	];

	useEffect(() => {
		if (loginStatus === LoginStatus.LOGGED_IN) setUser(userService.getCurrentUser());
	}, []);

	function renderEnabledOrDisabledButton() {
		if (user) {
			return (
				<LabelButton
					className={'buyButton'}
					look={'containedPrimary'}
					variant={'button'}
					label={'buy with points'}
					onClick={() => router.navigate(`/reward/purchase?ri=${reward ? reward.id : ''}`)}
				/>
			);
		}
		return (
			<LabelButton
				className={'disabledButton'}
				look={'containedPrimary'}
				variant={'button'}
				label={'buy with points'}
				onClick={() => rsToasts.error('please sign in to redeem points')}
			/>
		);
	}

	function renderPictures(picturePaths: string[]): JSX.Element[] {
		return picturePaths.map((path: string) => {
			return (
				<Box className={'imageWrapper'}>
					<img src={path} alt="" />
				</Box>
			);
		});
	}

	return (
		<Page className={'rsRewardDetailPage'}>
			<div className={'rs-page-content-wrapper'}>
				<RewardHeaderBar
					className={'detailPageHeader'}
					user={user}
					title={'Categories/Rewards/Details'}
					titleVariant={'h4'}
				/>
				<div className={'rewardDetails'}>
					<div className={'carouselContainer'}>
						<Carousel children={renderPictures(imagePaths)} showControls />
					</div>
					<div className={'rewardDetailsRight'}>
						<Label className={'rewardName'} variant={'h1'}>
							Headphones
						</Label>
						<Label className={'rewardUpc'} variant={'h4'}>
							Item #94030-2030
						</Label>
						<Label className={'rewardDescription'} variant={'body2'}>
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
							invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
							et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
							Lorem ipsum dolor sit amet.
						</Label>
						<div className={'pointCostContainer'}>
							<Label className={'pointCostName'} variant={'h4'}>
								Point Cost
							</Label>
							<Label className={'pointCost'} variant={'h1'}>
								1,420
							</Label>
						</div>
						<div className={'buttonContainer'}>{renderEnabledOrDisabledButton()}</div>
						<Label className={'blankMorePoints'} variant={'body2'}>
							Only 935 points left to go..
						</Label>
					</div>
				</div>
			</div>
		</Page>
	);
};

export default RewardDetailPage;
