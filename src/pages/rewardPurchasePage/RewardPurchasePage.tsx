import React, { useState } from 'react';
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

const RewardPurchasePage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const user = userService.getCurrentUser();
	const [termsAndConditionsIsChecked, setTermsAndConditionsIsChecked] = useState<boolean>(true);

	return (
		<Page className={'rsRewardPurchasePage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'headerBar'}>
					<RewardHeaderBar
						className={'rewardPurchaseHeader'}
						user={user}
						title={'Order Summary'}
						titleVariant={'h2'}
					/>
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
								<img src={'../../images/redeemableRewardPage/suitCoat.jpg'} alt={''} height={'130px'} />
							</div>
							<div className={'rewardText'}>
								<div className={'rewardName'}>
									<Label className={'name'} variant={'h3'}>
										Reward Name
									</Label>
									<Label className={'description'} variant={'body1'}>
										Item Integer sagittis elit tortor, vel dignissim orci imperdiet nec.
									</Label>
									<Label className={'number'} variant={'body1'}>
										Item #94030-2030
									</Label>
								</div>
								<div className={'rewardPoints'}>
									<Label className={'points'} variant={'h3'}>
										1,420
									</Label>
								</div>
							</div>
						</div>
					</div>
					<div className={'purchaseDetails'}>
						<Paper
							className={'rewardPurchasePaper'}
							min-height={'260px'}
							width={'278px'}
							backgroundColor={'#fcfbf8'}
							boxShadow
						>
							<div className={'totalPurchaseCost'}>
								<Label className={'totalCostLabel'} variant={'h4'}>
									Total Cost
								</Label>
								<div className={'pointNumberAndLabel'}>
									<Label className={'pointNumberLabel'} variant={'h1'}>
										4,260
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
												// let inputValue = e.target as HTMLInputElement;
												// if (inputValue.checked) onSelect();
												// else onDeselect();
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
									Point total after purchase: 9,905
								</Label>
							</div>
						</Paper>
						<div className={'placeOrderButtonContainer'}>
							<LabelButton
								className={'placeOrderButton'}
								look={'containedPrimary'}
								variant={'button'}
								label={'Place Order'}
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
