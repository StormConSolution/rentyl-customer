import * as React from 'react';
import './AboutSpirePointsPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import ImageTitleLink from '../../components/imageTitleLink/ImageTitleLink';
import Carousel from '../../components/carousel/Carousel';
import InfoCard from '../../components/infoCard/InfoCard';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import Paper from '../../components/paper/Paper';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface AboutSpirePointsPageProps {}

const AboutSpirePointsPage: React.FC<AboutSpirePointsPageProps> = (props) => {
	const size = useWindowResizeChange();

	return (
		<Page className={'rsAboutSpirePointsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					image={require('../../images/aboutSpirePointsPage/Mask Group 8.jpg')}
					height={'420px'}
					mobileHeight={'200px'}
				>
					<h1>About Spire Points</h1>
				</HeroImage>
				<Box className={'sectionOne'} margin={'0 auto 60px'} textAlign={'center'}>
					<Label variant={size === 'small' ? 'h2' : 'h1'} mb={20}>
						What can I buy with my points?
					</Label>
					<Label variant={'body1'}>
						Spire Points can be used for everyday small redemption items all the way up to rent and payments
						on home purchases - For the first time in a loyalty program, points are more flexible and can be
						used for life changing redemptions.
					</Label>
				</Box>
				<Carousel
					children={[
						<ImageTitleLink
							title={'Use points for resort stays'}
							imgUrl={require('../../images/aboutSpirePointsPage/building.png')}
							path={'/reservation/availability'}
						/>,
						<ImageTitleLink
							title={'Browse merchandise'}
							imgUrl={require('../../images/aboutSpirePointsPage/guy-with-headphones.jpg')}
							path={'/reward'}
						/>
					]}
				/>
				<Box className={'sectionTwo'} mb={120}>
					<h1>How do I earn points?</h1>
					<Box className={'infoCardWrapper'}>
						<InfoCard
							width={'100%'}
							height={'120px'}
							icon={'icon-resort'}
							boxShadow
							title={'Stay at a resort'}
						/>
						<InfoCard
							width={'100%'}
							height={'120px'}
							icon={'icon-gift'}
							boxShadow
							title={'Purchase points'}
						/>
						<InfoCard
							width={'100%'}
							height={'120px'}
							icon={'icon-for-sale'}
							boxShadow
							title={'Purchase real estate'}
						/>
						<InfoCard
							width={'100%'}
							height={'120px'}
							icon={'icon-for-rental'}
							boxShadow
							title={'Get a rental'}
						/>
					</Box>
				</Box>
				<Box className={'sectionThree'} height={'600px'} position={'relative'}>
					<div className={'tanBox'}>
						<Paper boxShadow>
							<Label mb={20} variant={'h1'}>
								What else can I do?
							</Label>
							<Label mb={33} variant={'body1'}>
								With your Spire membership, you have access to unique redemption opportunities with our
								unique ecosystem of partners. Being a Spire member also gives you access to special
								events and promotions that are exclusive to Spire. You can buy points and share points
								adding more flexibility to your membership.
							</Label>
						</Paper>
					</div>
					<img src={require('../../images/aboutSpirePointsPage/payment-image.png')} />
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default AboutSpirePointsPage;
