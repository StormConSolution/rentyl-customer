import { Box, Page } from '@bit/redsky.framework.rs.996';
import React, { useEffect, useState } from 'react';
import './OrderConfirmationPage.scss';
import router from '../../utils/router';
import RewardService from '../../services/reward/reward.service';
import serviceFactory from '../../services/serviceFactory';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { DateUtils, StringUtils, WebUtils } from '../../utils/utils';
import LoadingPage from '../loadingPage/LoadingPage';
import Paper from '../../components/paper/Paper';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import Img from '@bit/redsky.framework.rs.img';
import Accordion from '@bit/redsky.framework.rs.accordion';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

const OrderConfirmationPage = () => {
	const size = useWindowResizeChange();
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
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Reward no longer exists.'), 'Server Error');
				router.navigate('/').catch(console.error);
			}
		}
		getRewardDetails().catch(console.error);
	}, []);

	return !reward ? (
		<LoadingPage />
	) : (
		<Page className={'rsOrderConfirmationPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Label variant={'h1'} mt={80}>
					Order Confirmation
				</Label>
				<hr />
				<Box
					display={'flex'}
					flexDirection={size === 'small' ? 'column' : 'row'}
					justifyContent={'space-between'}
					alignItems={'flex-start'}
					padding={size === 'small' ? '0 20px' : '0'}
					marginBottom={25}
				>
					<Paper className={'sectionOne'} boxShadow>
						<Img
							src={
								reward.media.find((image) => image.isPrimary)?.urls.imageKit ||
								reward.media[0].urls.imageKit
							}
							alt={'Reward Image'}
							width={size === 'small' ? 350 : 800}
							height={size === 'small' ? 200 : 400}
						/>
						<Label variant={'h2'} className={'confirmationLabel'}>
							Your Order Is Confirmed
						</Label>
						<Label variant={'body1'} paddingLeft={size === 'small' ? '10px' : '85px'} margin={10}>
							Thank you for choosing to shop with us.
						</Label>
						<Label variant={'body1'} paddingLeft={size === 'small' ? '10px' : '85px'} margin={10}>
							Your order has been received and is now being processed.
						</Label>
						<Label
							variant={'body1'}
							paddingLeft={size === 'small' ? '10px' : '85px'}
							paddingBottom={'20px'}
							margin={10}
						>
							You will shortly be receiving an email confirmation with all your details
						</Label>
					</Paper>
					<Paper
						boxShadow
						padding={'30px'}
						width={size === 'small' ? '100%' : '600px'}
						className={'sectionTwo'}
					>
						<Label variant={'h3'}>Order</Label>
						<hr />
						<Box display={'flex'} flexDirection={'column'}>
							<Box display={'flex'} justifyContent={'space-between'}>
								<Label variant={'h4'}>Order:</Label>
								<Label variant={'body1'}>#{params.voucherCode}</Label>
							</Box>
							<Box display={'flex'} justifyContent={'space-between'}>
								<Label variant={'h4'}>Order Date:</Label>
								<Label variant={'body1'}>{DateUtils.displayUserDate(new Date(), 'MM/DD/YYYY')}</Label>
							</Box>
							<Accordion isOpen titleReact={<Label variant={'h4'}>Items in Order</Label>}>
								<Box display={'flex'} justifyContent={'space-between'}>
									<Label variant={'body1'}>{reward.name}</Label>
									<Label variant={'body1'}>
										{StringUtils.addCommasToNumber(reward.pointCost)} Points
									</Label>
								</Box>
							</Accordion>
							<Box display={'flex'} justifyContent={'space-between'} className={'orderTotal'}>
								<Label variant={'h4'}>Total</Label>
								<Label variant={'h4'}>{StringUtils.addCommasToNumber(reward.pointCost)} Points</Label>
							</Box>
						</Box>
					</Paper>
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default OrderConfirmationPage;
