import { Page } from '@bit/redsky.framework.rs.996';
import React, { useEffect, useState } from 'react';
import './OrderConfirmationPage.scss';
import router from '../../utils/router';
import rsToasts from '@bit/redsky.framework.toast';
import RewardService from '../../services/reward/reward.service';
import serviceFactory from '../../services/serviceFactory';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Box from '../../components/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { addCommasToNumber, DateUtils } from '../../utils/utils';
import LoadingPage from '../loadingPage/LoadingPage';
import Paper from '../../components/paper/Paper';

const OrderConfirmationPage = () => {
	const rewardService = serviceFactory.get<RewardService>('RewardService');
	const params = router.getPageUrlParams<{ reward: number; voucherCode: string }>([
		{ key: 'ri', default: '', type: 'string', alias: 'reward' },
		{ key: 'vc', default: '', type: 'string', alias: 'voucherCode' }
	]);
	const [reward, setReward] = useState<Api.Reward.Res.Get>();

	useEffect(() => {
		async function getRewardDetails() {
			if (!params.reward || !params.voucherCode) {
				router.navigate('/reward').catch(console.error);
			}
			try {
				let res = await rewardService.getRewardById(Number(params.reward));
				setReward(res);
			} catch (e) {
				rsToasts.error('Reward no longer exists.');
				router.navigate('/').catch(console.error);
			}
		}
		getRewardDetails().catch(console.error);
	}, []);

	function renderStyle() {
		if (!reward) return;
		let styles: any = {
			width: '200px',
			height: '200px',
			backgroundImage: `url(${reward.media[0].urls.large})`
		};
		return styles;
	}

	return !reward ? (
		<LoadingPage />
	) : (
		<Page className={'rsOrderConfirmationPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Label variant={'h1'} mt={80} mb={80}>
					Thank you for your order
				</Label>

				<Paper boxShadow padding={'50px'}>
					<Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
						<div>
							<Label variant={'h2'} mb={30}>
								Order Confirmation
							</Label>
							<Label variant={'body1'}>Order Number: </Label>
						</div>
						<Box display={'flex'} alignItems={'center'}>
							<Label variant={'h3'} mr={4}>
								Ordered:
							</Label>
							<Label variant={'body1'}>
								{DateUtils.displayDate(new Date())} {DateUtils.displayTime(new Date())}
							</Label>
						</Box>
					</Box>
					<hr />
					<Box display={'flex'} alignItems={'center'}>
						<Box display={'flex'} alignItems={'center'}>
							<img src={reward.media[0].urls.large} alt={'Order Image'} />
							<div>
								<Label variant={'h3'} mb={10}>
									{reward.description}
								</Label>
								<Label variant={'h4'} mb={10}>
									Item #{reward.upc}
								</Label>
								<Label variant={'h4'}>Gift Certificate # {params.voucherCode}</Label>
								<Label variant={'body1'}>{reward.redemptionInstructions}</Label>
							</div>
						</Box>
						<Label variant={'h3'} className={'pointsLabel'}>
							{addCommasToNumber(reward.pointCost)} <span>points</span>
						</Label>
					</Box>
				</Paper>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default OrderConfirmationPage;
