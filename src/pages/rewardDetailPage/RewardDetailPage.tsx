import React, { useEffect, useState } from 'react';
import './RewardDetailPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import RewardService from '../../services/reward/reward.service';
import router from '../../utils/router';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Carousel from '../../components/carousel/Carousel';
import LabelButton from '../../components/labelButton/LabelButton';
import RewardHeaderBar from '../../components/rewardHeaderBar/RewardHeaderBar';
import LoadingPage from '../loadingPage/LoadingPage';
import { addCommasToNumber, capitalize } from '../../utils/utils';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import rsToasts from '@bit/redsky.framework.toast';

const RewardDetailPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const rewardService = serviceFactory.get<RewardService>('RewardService');
	const user = userService.getCurrentUser();
	const [reward, setReward] = useState<Api.Reward.Res.Get>();
	const [imageCount, setImageCount] = useState<number>(0);
	const params = router.getPageUrlParams<{ reward: string; voucherCode: string }>([
		{ key: 'ri', default: '', type: 'string', alias: 'reward' },
		{ key: 'vc', default: '', type: 'string', alias: 'voucherCode' }
	]);

	useEffect(() => {
		async function getRewardDetails() {
			if (!params.reward) {
				router.navigate('/reward').catch(console.error);
			}
			try {
				let res: Api.Reward.Res.Get = await rewardService.getRewardById(Number(params.reward));
				setReward(res);
				if (res.media) setImageCount(res.media.length);
			} catch (e) {
				rsToasts.error('An unexpected error occurred on the server.');
			}
		}
		getRewardDetails().catch(console.error);
	}, []);

	function renderPointsLeft() {
		if (!user || !reward) return;
		let points = user.availablePoints - reward.pointCost;
		if (points > 0) {
			return `${addCommasToNumber(points)} available after purchase.`;
		} else {
			return `Only ${addCommasToNumber(reward.pointCost - user.availablePoints)} left to go..`;
		}
	}

	function renderEnabledOrDisabledButton() {
		if (user) {
			let hasEnoughPoints: boolean = false;
			if (reward) {
				hasEnoughPoints = user.availablePoints - reward.pointCost > 0;
			}
			return (
				<LabelButton
					className={'buyButton'}
					look={hasEnoughPoints ? 'containedPrimary' : 'containedSecondary'}
					variant={'button'}
					// disabled={!hasEnoughPoints}
					label={'buy with points'}
					onClick={() =>
						router.navigate(`/reward/purchase?ri=${reward ? reward.id : ''}&vc=${params.voucherCode}`)
					}
				/>
			);
		} else {
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
	}

	function renderPictures(): JSX.Element[] {
		if (!reward) return [];
		return reward.media.map((newMedia: Api.Media) => {
			return (
				<Box className={'imageWrapper'}>
					<img src={newMedia.urls.small} alt="" />
				</Box>
			);
		});
	}

	return !reward ? (
		<LoadingPage />
	) : (
		<Page className={'rsRewardDetailPage'}>
			<div className={'rs-page-content-wrapper'}>
				<RewardHeaderBar
					className={'detailPageHeader'}
					title={'Categories/Rewards/Details'}
					titleVariant={'h4'}
				/>
				<div className={'rewardDetails'}>
					<div className={'carouselContainer'}>
						<Carousel children={renderPictures()} showControls={imageCount > 1} />
					</div>
					<div className={'rewardDetailsRight'}>
						<Label className={'rewardName'} variant={'h1'}>
							{capitalize(reward.name)}
						</Label>
						<Label className={'rewardUpc'} variant={'h4'}>
							Item# {reward.upc}
						</Label>
						<Label className={'rewardDescription'} variant={'body2'}>
							{reward.description}
						</Label>
						<div className={'pointCostContainer'}>
							<Label className={'pointCostName'} variant={'h4'}>
								Point Cost
							</Label>
							<Label className={'pointCost'} variant={'h1'}>
								{addCommasToNumber(reward.pointCost)}
							</Label>
						</div>
						<div className={'buttonContainer'}>{renderEnabledOrDisabledButton()}</div>
						<Label className={'blankMorePoints'} variant={'body2'}>
							{renderPointsLeft()}
						</Label>
					</div>
				</div>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default RewardDetailPage;
