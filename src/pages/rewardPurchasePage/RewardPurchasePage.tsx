import React, { useEffect, useState } from 'react';
import './RewardPurchasePage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import RewardHeaderBar from '../../components/rewardHeaderBar/RewardHeaderBar';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import LabelButton from '../../components/labelButton/LabelButton';
import LabelLink from '../../components/labelLink/LabelLink';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import RewardService from '../../services/reward/reward.service';
import router from '../../utils/router';
import rsToasts from '@bit/redsky.framework.toast';
import LoadingPage from '../loadingPage/LoadingPage';
import { addCommasToNumber } from '../../utils/utils';

const RewardPurchasePage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const rewardService = serviceFactory.get<RewardService>('RewardService');
	const user = userService.getCurrentUser();
	const [reward, setReward] = useState<Api.Reward.Res.Get>();
	const [termsAndConditionsIsChecked, setTermsAndConditionsIsChecked] = useState<boolean>(true);
	const params = router.getPageUrlParams<{ reward: number; voucherCode: string }>([
		{ key: 'ri', default: '', type: 'string', alias: 'reward' },
		{ key: 'vc', default: '', type: 'string', alias: 'voucherCode' }
	]);
	const [hasEnoughPoints, setHasEnoughPoints] = useState<boolean>(false);

	useEffect(() => {
		async function getRewardDetails() {
			if (!params.reward) {
				router.navigate('/reward').catch(console.error);
			}
			try {
				let res = await rewardService.getRewardById(Number(params.reward));
				setReward(res);
			} catch (e) {
				rsToasts.error('Reward Item no longer exists.');
			}
		}
		getRewardDetails().catch(console.error);
	}, []);

	useEffect(() => {
		if (user && reward) {
			setHasEnoughPoints(user.availablePoints - reward.pointCost > 0);
		}
	}, [reward, user]);

	async function claimRewardVoucher() {
		if (!termsAndConditionsIsChecked) {
			rsToasts.error('You must agree to the terms and conditions.');
			return;
		}
		try {
			await rewardService.claimRewardVoucher({ rewardId: Number(params.reward), code: params.voucherCode });
			rsToasts.success('You have claimed your voucher');
			router.navigate(`/reward/confirm?ri=${params.reward}&vc=${params.voucherCode}`).catch(console.error);
		} catch (e) {
			rsToasts.error('Unable to claim reward.');
		}
	}

	return !reward ? (
		<LoadingPage />
	) : (
		<Page className={'rsRewardPurchasePage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'headerBarPageContainer'}>
					<RewardHeaderBar className={'rewardPurchaseHeader'} title={'Order Summary'} titleVariant={'h2'} />
				</div>
				<div className={'mainContentContainer'}>
					<div className={'rewardDetailsContainer'}>
						<div className={'rewardDetailsTitle'}>
							<Label className={'imageColumn'} variant={'body1'}>
								Image
							</Label>
							<Label className={'RewardColumn'} variant={'body1'}>
								Reward
							</Label>
						</div>
						<div className={'reward'}>
							<div className={'imageContainer'}>
								<img src={reward.media[0].urls.thumb} alt={''} />
							</div>
							<div className={'rewardText'}>
								<div className={'rewardName'}>
									<Label className={'name'} variant={'h3'}>
										{reward.name}
									</Label>
									<Label className={'description'} variant={'body1'}>
										{reward.description}
									</Label>
									<Label className={'number'} variant={'body1'}>
										Item # {reward.upc}
									</Label>
								</div>
								<div className={'rewardPoints'}>
									<Label className={'points'} variant={'h3'}>
										{addCommasToNumber(reward.pointCost)}
									</Label>
								</div>
							</div>
						</div>
					</div>
					<div className={'purchaseDetails'}>
						<Paper className={'rewardPurchasePaper'} width={'278px'} backgroundColor={'#fcfbf8'} boxShadow>
							<div className={'totalPurchaseCost'}>
								<Label className={'totalCostLabel'} variant={'h4'}>
									Total Cost
								</Label>
								<div className={'pointNumberAndLabel'}>
									<Label className={'pointNumberLabel'} variant={'h1'}>
										{addCommasToNumber(reward.pointCost)}
									</Label>
									<Label className={'pointsLabel'} variant={'h2'}>
										points
									</Label>
								</div>
								<div className={'checkboxDiv'}>
									<label className={'checkboxContainer'}>
										<input
											className={'checkboxInput'}
											value={'termsAndConditions'}
											type={'checkbox'}
											onChange={() => {
												setTermsAndConditionsIsChecked(!termsAndConditionsIsChecked);
											}}
											checked={termsAndConditionsIsChecked}
										/>
										<span className={'checkbox'}>
											<Box />
										</span>
									</label>
									<Label className={'termsAndConditionLabel'} variant={'body1'}>
										I agree to the&nbsp;
										<a className={'termsLink'} href={'/'}>
											terms
										</a>
										&nbsp; and&nbsp;
										<a className={'conditionsLink'} href={'/'}>
											conditions
										</a>
									</Label>
								</div>
							</div>
							<div className={'pointsAfterPurchase'}>
								<Label className={'pointsAfterPurchaseLabel'} variant={'body1'}>
									Point total after purchase:{' '}
									{addCommasToNumber((user ? user.availablePoints : 0) - reward.pointCost)}
								</Label>
							</div>
						</Paper>
						<div className={'placeOrderButtonContainer'}>
							<LabelButton
								className={'placeOrderButton'}
								look={hasEnoughPoints ? 'containedPrimary' : 'containedSecondary'}
								//disabled={!hasEnoughPoints}
								variant={'button'}
								label={'Place Order'}
								onClick={claimRewardVoucher}
							/>
						</div>
						<div className={'policyContainer'}>
							<LabelLink
								className={'returnPolicyLink'}
								path={'/'}
								label={'Return Policy'}
								variant={'body2'}
							/>
							<LabelLink
								className={'privacyPolicyLink'}
								path={'/'}
								label={'Privacy Policy'}
								variant={'body2'}
							/>
						</div>
					</div>
				</div>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default RewardPurchasePage;
