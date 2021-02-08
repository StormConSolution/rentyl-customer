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

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = (props) => {
	animateOnScroll();

	return (
		<Page className={'rsLandingPage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'tanBox'} />
				<Box className={'heroImgAndText'} display={'flex'} alignItems={'center'}>
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
							icon={'icon-spa'}
							boxShadow
						/>
						<InfoCard
							width={'367px'}
							height={'120px'}
							title={'Boost your experience'}
							body={'Spire Loyalty members have the chance to earn more by leveling up in our program'}
							icon={'icon-spa'}
							boxShadow
						/>
						<InfoCard
							width={'367px'}
							height={'120px'}
							title={'Redeem points'}
							body={'Redemption with Spire means flexible ways to redeem with our partners'}
							icon={'icon-spa'}
							boxShadow
						/>
					</Box>
				</Box>
				<Box className={'featureRewards'}>
					<Label variant={'h2'}>
						<span>Feature</span> Rewards
					</Label>
					<Box className={'featureRewardCardsContainer'}>
						<FeaturedRewardCard mainImg={''} logoImg={''} title={'Margaritaville Villa Stay'} />
						<FeaturedRewardCard mainImg={''} logoImg={''} title={'Margaritaville Spa Service'} />
						<FeaturedRewardCard mainImg={''} logoImg={''} title={'Margaritaville Drinks for Two'} />
					</Box>
					<LabelButton look={'containedPrimary'} variant={'button'} label={'See all rewards'} />
				</Box>
				<Box className={'vacationStays'}>
					<div className={'fakeImg'} />
					<div className={'tanBox2'} />
					<Paper width={'524px'} height={'369px'} padding={'40px 50px'} boxShadow backgroundColor={'#FCFBF8'}>
						<Label variant={'caption'}>Vacation Stays and real estate</Label>
						<div className={'subHeader'}>
							Turn your vacation <br />
							<span>into your next home</span>
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
			</div>
		</Page>
	);
};

export default LandingPage;
