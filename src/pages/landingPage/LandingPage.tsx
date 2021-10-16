import * as React from 'react';
import './LandingPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import Img from '@bit/redsky.framework.rs.img';
import LabelButton from '../../components/labelButton/LabelButton';
import InfoCard from '../../components/infoCard/InfoCard';
import FeaturedRewardCard from '../../components/featuredRewardCard/FeaturedRewardCard';
import Paper from '../../components/paper/Paper';
import { useEffect, useState } from 'react';
import CarouselButtons from '../../components/carouselButtons/CarouselButtons';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Carousel from '../../components/carousel/Carousel';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import RewardService from '../../services/reward/reward.service';
import useCustomPageText from '../../customHooks/useCustomPageText';
import { WebUtils } from '../../utils/utils';

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
	const size = useWindowResizeChange();
	const rewardService = serviceFactory.get<RewardService>('RewardService');
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const [activeRewards, setActiveRewards] = useState<number>(0);
	const [featuredRewards, setFeaturedRewards] = useState<Api.Reward.Category.Res.Get[]>();

	const text = useCustomPageText('LandingPage');

	useEffect(() => {
		async function getFeatureRewards() {
			try {
				const query = WebUtils.createPageQueryObject(1, 50, 'DESC', 'createdOn', 'exact', [
					{ column: 'isFeatured', value: 1 },
					{ column: 'isActive', value: 1, matchType: 'exact', conjunction: 'AND' }
				]);
				let rewardCategories = await rewardService.getPagedCategories(query);
				setFeaturedRewards(rewardCategories.data);
			} catch (e) {
				console.log(e.message);
			}
		}
		getFeatureRewards().catch(console.error);
	}, []);

	function getActiveRewardsStage() {
		if (activeRewards === 1) return 'stageOne';
		else if (activeRewards === 2) return 'stageTwo';
		else return '';
	}

	function renderFeatureRewards() {
		if (!featuredRewards) return [];
		return featuredRewards.map((item, index) => {
			return (
				<FeaturedRewardCard
					key={index}
					mainImg={item.media[0].urls.large}
					title={item.name}
					urlPath={`/reward?cids=[${item.id}]`}
				/>
			);
		});
	}

	return (
		<Page className={'rsLandingPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box
					className={'heroImgAndText'}
					display={'flex'}
					alignItems={'center'}
					marginBottom={size === 'small' ? 366 : 135}
				>
					<Box>
						<div className={'heroText'}>
							{text('heroTitle1', 'Rewarding the way you')}
							<br />
							<span>{text('heroTitle2', 'live, work, and play')}</span>
						</div>
						<LabelButton
							look={'containedPrimary'}
							variant={'button'}
							label={user ? 'Browse Destinations' : 'Get Started'}
							onClick={() => {
								if (user) router.navigate('/reservation/availability').catch(console.error);
								else router.navigate('/signup').catch(console.error);
							}}
						/>
					</Box>
					<Box className={'infoCardWrapper'} display={'flex'}>
						<InfoCard
							width={'367px'}
							height={'120px'}
							title={'Earn points'}
							body={'Earn points for more than spending money - your loyalty is your gain'}
							bodyVariant={'body2'}
							icon={'icon-piggy-bank'}
							boxShadow
						/>
						<InfoCard
							width={'367px'}
							height={'120px'}
							title={'Boost your experience'}
							body={'Spire Loyalty members have the chance to earn more by leveling up in our program'}
							bodyVariant={'body2'}
							icon={'icon-boost'}
							boxShadow
						/>
						<InfoCard
							width={'367px'}
							height={'120px'}
							title={'Redeem points'}
							body={'Redemption with Spire means flexible ways to redeem with our partners'}
							bodyVariant={'body2'}
							icon={'icon-gift'}
							boxShadow
						/>
					</Box>
				</Box>
				<Box className={'sectionOne'} marginBottom={size === 'small' ? 80 : 220}>
					<Label variant={size === 'small' ? 'h2' : 'h1'}>
						<span>Feature</span> Rewards
					</Label>
					<Box className={'featureRewardCardsContainer'}>
						<Carousel children={renderFeatureRewards()} />
					</Box>
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'See all rewards'}
						onClick={() => {
							router.navigate('/reward');
						}}
					/>
				</Box>
				<Box className={'sectionTwo'} marginBottom={146}>
					<div className={'coupleImg'} />
					<div className={'tanBox2'} />
					<Paper width={'524px'} height={'369px'} padding={'40px 50px'} boxShadow backgroundColor={'#FCFBF8'}>
						<Label variant={'caption'}>Vacation Stays and real estate</Label>
						<Label variant={size === 'small' ? 'h2' : 'h1'}>
							Turn your vacation <br />
							<span data-aos="fade-up">into your next home</span>
						</Label>
						<Label variant={'body2'}>
							With Spire Loyalty, you can earn points for home purchases, and utilize your points towards
							future home purchases. Your rent can help you earn Spire points to be used throughout our
							network, or you can utilize points to help with your rent and services. The expansive Spire
							Loyalty network of vacation properties allows you to use your Spire points on the perfect
							vacation.
						</Label>
						<LabelButton
							look={'containedPrimary'}
							variant={'button'}
							label={user ? 'Browse Destinations' : 'Get Started'}
							onClick={() => {
								if (user) router.navigate('/reservation/availability').catch(console.error);
								else router.navigate('/signup').catch(console.error);
							}}
						/>
					</Paper>
				</Box>
				<Box className={'sectionThree'} marginBottom={110}>
					<Box maxWidth={'610px'} margin={'0 auto 25px'} textAlign={'center'}>
						<Label variant={'caption'}>Traveling with spire loyalty</Label>
						<Label variant={'h1'}>
							Gives you access to a <span data-aos="fade-up">myriad of rewards</span>
						</Label>
						<Label variant={'body1'}>
							With Spire you earn points for dollars spent within our network of vacation partners. Those
							points can be applied to discounts on home &amp; other purchases with our partner builders.
						</Label>
					</Box>

					{size === 'small' ? (
						<Box className={'mobileImageStepperWrapper'}>
							<Carousel imageIndex={activeRewards}>
								<Img
									src={
										'https://ik.imagekit.io/redsky/LandingPage/travel2x_f_-s5WJsu.png?updatedAt=1630532450621'
									}
									rootMargin={'0px 0px 500px 0px'}
									className={`${activeRewards === 0 ? 'selected' : ''}`}
									width={236}
									height={206}
									alt={'Travel'}
									srcSetSizes={[472]}
									onClick={() => {
										setActiveRewards(0);
									}}
								/>
								<Img
									src={
										'https://ik.imagekit.io/redsky/LandingPage/real-estate2x_YIKhbr6jy.png?updatedAt=1630532443109'
									}
									rootMargin={'0px 0px 500px 0px'}
									className={`${activeRewards === 1 ? 'selected' : ''}`}
									width={577}
									height={450}
									alt={'Real Estate'}
									srcSetSizes={[1154]}
									onClick={() => {
										setActiveRewards(1);
									}}
								/>
								<Img
									src={
										'https://ik.imagekit.io/redsky/LandingPage/hospitality2x_V7OBn0yLg.png?updatedAt=1630532440996'
									}
									rootMargin={'0px 0px 500px 0px'}
									className={`${activeRewards === 2 ? 'selected' : ''}`}
									width={236}
									height={206}
									alt={'Hospitality'}
									srcSetSizes={[472]}
									onClick={() => {
										setActiveRewards(2);
									}}
								/>
							</Carousel>

							<Paper
								className={'mobileImageStepper'}
								width={'313px'}
								height={'129px'}
								padding={'10px 20px'}
								boxShadow
								backgroundColor={'#FCFBF8'}
								position={'absolute'}
							>
								<InfoCard
									className={activeRewards <= 0 ? 'selected' : ''}
									padding={'0'}
									height={'80px'}
									width={'273px'}
									icon={'icon-map'}
									title={'Travel'}
									body={'Room bookings, upgrades, and perfect getaways.'}
								/>
								<InfoCard
									className={activeRewards === 1 ? 'selected' : ''}
									padding={'0'}
									height={'80px'}
									width={'273px'}
									icon={'icon-hand-shake'}
									title={'Real Estate'}
									body={'Future home purchases, vacation properties'}
								/>
								<InfoCard
									className={activeRewards === 2 ? 'selected' : ''}
									padding={'0'}
									height={'80px'}
									width={'273px'}
									icon={'icon-wine'}
									title={'Hospitality'}
									body={'Free meals and beverages, and exciting excursions'}
								/>
								<CarouselButtons
									position={'absolute'}
									bottom={'-20px'}
									left={'50px'}
									onClickRight={() => setActiveRewards((activeRewards + 1) % 3)}
									onClickLeft={() => setActiveRewards(!activeRewards ? 2 : activeRewards - 1)}
								/>
							</Paper>
						</Box>
					) : (
						<>
							<Box
								display={'flex'}
								justifyContent={'flex-start'}
								alignItems={'flex-end'}
								className={`imageContainer ${getActiveRewardsStage()}`}
							>
								<Img
									src={
										'https://ik.imagekit.io/redsky/LandingPage/travel2x_f_-s5WJsu.png?updatedAt=1630532450621'
									}
									rootMargin={'0px 0px 500px 0px'}
									className={`${activeRewards === 0 ? 'selected' : ''}`}
									width={236}
									height={206}
									alt={'Travel'}
									srcSetSizes={[472]}
									onClick={() => {
										setActiveRewards(0);
									}}
								/>
								<Img
									src={
										'https://ik.imagekit.io/redsky/LandingPage/real-estate2x_YIKhbr6jy.png?updatedAt=1630532443109'
									}
									rootMargin={'0px 0px 500px 0px'}
									className={`${activeRewards === 1 ? 'selected' : ''}`}
									width={577}
									height={450}
									alt={'Real Estate'}
									srcSetSizes={[1154]}
									onClick={() => {
										setActiveRewards(1);
									}}
								/>
								<Img
									src={
										'https://ik.imagekit.io/redsky/LandingPage/hospitality2x_V7OBn0yLg.png?updatedAt=1630532440996'
									}
									rootMargin={'0px 0px 500px 0px'}
									className={`${activeRewards === 2 ? 'selected' : ''}`}
									width={236}
									height={206}
									alt={'Hospitality'}
									srcSetSizes={[472]}
									onClick={() => {
										setActiveRewards(2);
									}}
								/>
							</Box>
							<Paper
								className={'imageStepper'}
								width={'444px'}
								height={'320px'}
								padding={'10px 50px'}
								boxShadow
								backgroundColor={'#FCFBF8'}
								position={'absolute'}
							>
								<InfoCard
									className={activeRewards <= 0 ? 'selected' : ''}
									padding={'0'}
									height={'80px'}
									width={'100%'}
									icon={'icon-map'}
									title={'Travel'}
									body={'Room bookings, upgrades, and perfect getaways.'}
								/>
								<InfoCard
									className={activeRewards === 1 ? 'selected' : ''}
									padding={'0'}
									height={'80px'}
									width={'100%'}
									icon={'icon-hand-shake'}
									title={'Real Estate'}
									body={'Future home purchases, vacation properties'}
								/>
								<InfoCard
									className={activeRewards === 2 ? 'selected' : ''}
									padding={'0'}
									height={'80px'}
									width={'100%'}
									icon={'icon-wine'}
									title={'Hospitality'}
									body={'Free meals and beverages, and exciting excursions'}
								/>

								<CarouselButtons
									position={'absolute'}
									bottom={'-20px'}
									left={'50px'}
									onClickRight={() => setActiveRewards((activeRewards + 1) % 3)}
									onClickLeft={() => setActiveRewards(!activeRewards ? 2 : activeRewards - 1)}
								/>
							</Paper>{' '}
						</>
					)}

					{size !== 'small' && (
						<LabelButton
							look={'containedPrimary'}
							variant={'button'}
							label={'How spire loyalty benefits you'}
							onClick={() => {
								router.navigate('/features-and-benefits').catch(console.error);
							}}
						/>
					)}
				</Box>
				<Box
					className={'sectionFour'}
					margin={'0 auto 170px'}
					width={'100%'}
					display={'flex'}
					flexWrap={'wrap'}
					justifyContent={'center'}
				>
					<Img
						rootMargin={'0px 0px 500px 0px'}
						width={577}
						height={450}
						srcSetSizes={[600]}
						src={'https://ik.imagekit.io/redsky/LandingPage/coffee2x_ATsh3wrg6.png?updatedAt=1630532447509'}
						alt={'Coffee Guy'}
					/>
					<Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
						<Label variant={size === 'small' ? 'h2' : 'h1'}>
							Earning points <span>every day</span>
						</Label>
						<Box display={'grid'} className={'sectionFourCardsWrapper'}>
							<InfoCard
								icon={'icon-tea-cup'}
								body={
									'Purchasing your morning coffee with our partners earns you points with every sip.'
								}
								height={'92px'}
								width={'310px'}
								padding={'0 25px'}
								boxShadow
							/>
							<InfoCard
								icon={'icon-spa'}
								body={'Earn points for a massage or space service.'}
								height={'92px'}
								width={'310px'}
								padding={'0 25px'}
								boxShadow
							/>
							<InfoCard
								icon={'icon-food-plate'}
								body={'Dine with us during your stay and earn.'}
								height={'92px'}
								width={'310px'}
								padding={'0 25px'}
								boxShadow
							/>
							<InfoCard
								icon={'icon-social'}
								body={'Refer friends to Spire and increase your points balance and Spire status.'}
								height={'92px'}
								width={'310px'}
								padding={'0 25px'}
								boxShadow
							/>
						</Box>
						{size === 'small' && (
							<LabelButton
								look={'containedPrimary'}
								variant={'button'}
								label={'How spire loyalty benefits you'}
								onClick={() => {
									router.navigate('/features-and-benefits').catch(console.error);
								}}
							/>
						)}
					</Box>
				</Box>
				{/*//TODO: temporarily deactivated pending information from Spire.*/}
				{/*<Box className={'sectionFive'}>*/}
				{/*	<Label variant={size === 'small' ? 'h2' : 'h1'}>*/}
				{/*		Create an <span>unforgettable experience</span>*/}
				{/*	</Label>*/}
				{/*	<Box*/}
				{/*		bgcolor={'#f7f1db'}*/}
				{/*		height={size === 'small' ? '347px' : '440px'}*/}
				{/*		display={'flex'}*/}
				{/*		justifyContent={'center'}*/}
				{/*	>*/}
				{/*		{size === 'small' ? (*/}
				{/*			<Carousel>*/}
				{/*				<FeaturedDestinationCard*/}
				{/*					image={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}*/}
				{/*					name={'Orlando Disney Experience'}*/}
				{/*					resortId={1}*/}
				{/*				/>*/}
				{/*				<FeaturedDestinationCard*/}
				{/*					image={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}*/}
				{/*					name={'Island H20 Live! Water Park'}*/}
				{/*					resortId={2}*/}
				{/*				/>*/}
				{/*			</Carousel>*/}
				{/*		) : (*/}
				{/*			<>*/}
				{/*				<FeaturedDestinationCard*/}
				{/*					image={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}*/}
				{/*					name={'Orlando Disney Experience'}*/}
				{/*					resortId={1}*/}
				{/*				/>*/}
				{/*				<FeaturedDestinationCard*/}
				{/*					image={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}*/}
				{/*					name={'Island H20 Live! Water Park'}*/}
				{/*					resortId={2}*/}
				{/*				/>{' '}*/}
				{/*			</>*/}
				{/*		)}*/}
				{/*	</Box>*/}
				{/*</Box>*/}
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default LandingPage;
