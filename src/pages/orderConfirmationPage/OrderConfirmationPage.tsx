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

const OrderConfirmationPage = () => {
	const rewardService = serviceFactory.get<RewardService>('RewardService');
	const params = router.getPageUrlParams<{ reward: number; voucherCode: string }>([
		{ key: 'ri', default: '', type: 'string', alias: 'reward' },
		{ key: 'vc', default: '', type: 'string', alias: 'voucherCode' }
	]);
	const [reward, setReward] = useState<Api.Reward.Res.Get>();

	useEffect(() => {
		async function getRewardDetails() {
			if (!params.reward) {
				router.navigate('/reward').catch(console.error);
			}
			try {
				let res = await rewardService.getRewardById(Number(params.reward));
				setReward(res);
			} catch (e) {
				rsToasts.error('An unexpected error occurred on the server.');
			}
		}
		getRewardDetails().catch(console.error);
	}, []);
	return (
		<Page className={'rsOrderConfirmationPage'}>
			<Box>
				<Label variant={'h1'}>Order Confirmation</Label>
				<Box display={'flex'}>
					<Label variant={'h3'}>Ordered</Label>
					<Label variant={'body1'}></Label>{' '}
				</Box>
			</Box>
			<Footer links={FooterLinkTestData} />
		</Page>
	);
};

export default OrderConfirmationPage;
