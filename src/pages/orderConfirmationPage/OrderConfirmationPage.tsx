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
import { DateUtils } from '../../utils/utils';
import LoadingPage from '../loadingPage/LoadingPage';

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
				<Box display={'flex'} justifyContent={'space-between'} className={'confirmationHeader'}>
					<Label variant={'h1'}>Order Confirmation</Label>
					<Box
						display={'flex'}
						alignItems={'center'}
						justifyContent={'space-between'}
						className={'orderDate'}
					>
						<Label variant={'h3'}>Ordered: </Label>
						<Label variant={'body1'}>
							{DateUtils.displayDate(new Date())} {DateUtils.displayTime(new Date())}
						</Label>
					</Box>
				</Box>
				<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
					<Box display={'flex'}>
						<div style={renderStyle()} className={'rewardImage'} />
						<Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} margin={20}>
							<Label variant={'body1'}>{reward.description}</Label>
							<Label variant={'h3'}>Item #{reward.upc}</Label>
							<Label variant={'h3'}>Gift Certificate # {params.voucherCode}</Label>
							<Label variant={'caption'}>Redemption Instructions</Label>
						</Box>
					</Box>
					<Label variant={'h3'}>{reward.pointCost} Points</Label>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default OrderConfirmationPage;
