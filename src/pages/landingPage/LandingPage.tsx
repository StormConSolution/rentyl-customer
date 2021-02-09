import * as React from 'react';
import './LandingPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import { animateOnScroll } from '../../utils/animateOnScroll';
import Box from '../../components/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import LabelButton from '../../components/labelButton/LabelButton';
import InfoCard from '../../components/infoCard/InfoCard';
import FeaturedRewardCard from '../../components/featuredRewardCard/FeaturedRewardCard';
import Paper from '../../components/paper/Paper';
import Button from '@bit/redsky.framework.rs.button';
import Icon from '@bit/redsky.framework.rs.icon';
import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = (props) => {
	const [activeRewards, setActiveRewards] = useState<number>(0);

	useEffect(() => {
		console.log(activeRewards);
	}, [activeRewards]);

	function getActiveRewardsStage() {
		if (activeRewards === 1) return 'stageOne';
		else if (activeRewards === 2) return 'stageTwo';
		else return '';
	}

	return (
		<Page className={'rsLandingPage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'tanBox'} />
				<Box className={'heroImgAndText'} display={'flex'} alignItems={'center'} marginBottom={135}>
					<Box>
						<Label variant={'h1'}>
							Rewarding the way you
							<br />
							<span>live, work, and play</span>
						</Label>
						<LabelButton look={'containedPrimary'} variant={'button'} label={'Get Started'} />
					</Box>
					<Box className={'infoCardWrapper'} display={'flex'}>
						<InfoCard
							width={'367px'}
							height={'120px'}
							title={'Earn points'}
							body={'Earn points for more than spending money - your loyalty is your gain'}
							icon={'icon-piggy-bank'}
							boxShadow
						/>
						<InfoCard
							width={'367px'}
							height={'120px'}
							title={'Boost your experience'}
							body={'Spire Loyalty members have the chance to earn more by leveling up in our program'}
							icon={'icon-boost'}
							boxShadow
						/>
						<InfoCard
							width={'367px'}
							height={'120px'}
							title={'Redeem points'}
							body={'Redemption with Spire means flexible ways to redeem with our partners'}
							icon={'icon-gift'}
							boxShadow
						/>
					</Box>
				</Box>
				<Box className={'featureRewards'} marginBottom={220}>
					<Label variant={'h2'}>
						<span>Feature</span> Rewards
					</Label>
					<Box className={'featureRewardCardsContainer'}>
						<FeaturedRewardCard
							mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay.png')}
							logoImg={''}
							title={'Margaritaville Villa Stay'}
						/>
						<FeaturedRewardCard
							mainImg={require('../../images/landingPage/Margaritaville-Spa -Service.png')}
							logoImg={''}
							title={'Margaritaville Spa Service'}
						/>
						<FeaturedRewardCard
							mainImg={require('../../images/landingPage/Margaritaville-Drinks-for-Two.png')}
							logoImg={''}
							title={'Margaritaville Drinks for Two'}
						/>
					</Box>
					<LabelButton look={'containedPrimary'} variant={'button'} label={'See all rewards'} />
				</Box>
				<Box className={'vacationStays'} marginBottom={220}>
					<div className={'coupleImg'} />
					<div className={'tanBox2'} />
					<Paper width={'524px'} height={'369px'} padding={'40px 50px'} boxShadow backgroundColor={'#FCFBF8'}>
						<Label variant={'caption'}>Vacation Stays and real estate</Label>
						<div className={'subHeader'}>
							Turn your vacation <br />
							<span data-aos="fade-up">into your next home</span>
						</div>
						<Label variant={'body2'}>
							With Spire Loyalty, you can earn points for home purchases, and utilize your points towards
							future home purchases. Your rent can help you earn Spire points to be used throughout our
							network, or you can utilize points to help with your rent and services. The expansive Spire
							Loyalty network of vacation properties allows you to use your Spire points on the perfect
							vacation.
						</Label>
						<LabelButton look={'containedPrimary'} variant={'button'} label={'Get started'} />
					</Paper>
				</Box>
				<Box className={'travelingWithSpire'} marginBottom={220}>
					<Label variant={'caption'}>Traveling with spire loyalty</Label>
					<div className={'subHeader'}>
						Gives you access to a <br />
						<span data-aos="fade-up">myriad of rewards</span>
					</div>
					<Label variant={'body2'}>
						With Spire you earn points for dollars spent within our network of vacation partners. Those
						points can be applied to discounts on home purchases with our partner builders.
					</Label>

					<Box
						display={'flex'}
						justifyContent={'flex-start'}
						alignItems={'flex-end'}
						className={`imageContainer ${getActiveRewardsStage()}`}
					>
						<img
							src={require(`../../images/landingPage/${activeRewards === 0 ? 'travel2x' : 'travel'}.png`)}
							className={`${activeRewards === 0 ? 'selected' : ''}`}
						/>
						<img
							src={require(`../../images/landingPage/${
								activeRewards === 1 ? 'real-estate2x' : 'real-estate'
							}.png`)}
							className={`${activeRewards === 1 ? 'selected' : ''}`}
						/>
						<img
							src={require(`../../images/landingPage/${
								activeRewards === 2 ? 'hospitality2x' : 'hospitality'
							}.png`)}
							className={`${activeRewards === 2 ? 'selected' : ''}`}
						/>
					</Box>

					<Paper width={'444px'} height={'320px'} padding={'10px 50px'} boxShadow backgroundColor={'#FCFBF8'}>
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

						<Box display={'flex'} className={'chevronBtnWrapper'}>
							<Button
								look={'none'}
								onClick={() => {
									setActiveRewards(!activeRewards ? 2 : activeRewards - 1);
								}}
							>
								<Icon iconImg={'icon-chevron-left'} color={'#001933'} size={8} />
							</Button>
							<hr />
							<Button
								look={'none'}
								onClick={() => {
									setActiveRewards((activeRewards + 1) % 3);
								}}
							>
								<Icon iconImg={'icon-chevron-right'} color={'#001933'} size={8} />
							</Button>
						</Box>
					</Paper>
				</Box>
			</div>
		</Page>
	);
};

export default LandingPage;
