import * as React from 'react';
import './AboutSpirePage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../../components/labelButton/LabelButton';
import router from '../../utils/router';
import InfoCard from '../../components/infoCard/InfoCard';
import LabelLink from '../../components/labelLink/LabelLink';
import Icon from '@bit/redsky.framework.rs.icon';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import FeatureRoomCard from '../../components/featureRoomCard/FeatureRoomCard';
import { useRef } from 'react';
import CarouselButtons from '../../components/carouselButtons/CarouselButtons';
import BookNowImage from '../../components/bookNowImage/BookNowImage';
import Carousel from '../../components/carousel/Carousel';

interface AboutSpirePageProps {}

const AboutSpirePage: React.FC<AboutSpirePageProps> = (props) => {
	const parentRef = useRef<HTMLElement>(null);
	const childRef = useRef<HTMLElement>(null);
	const size = useWindowResizeChange();

	let imageIndex = 0;

	function moveImagesRight() {
		if (parentRef.current!.childElementCount - 1 === imageIndex) {
			imageIndex = 0;
		} else {
			imageIndex++;
		}
		let childWidth = childRef.current!.offsetWidth;
		parentRef.current!.style.transform = `translateX(-${imageIndex * childWidth}px)`;
	}

	function moveImagesLeft() {
		if (imageIndex === 0) imageIndex = parentRef.current!.childElementCount;
		imageIndex--;
		let childWidth = childRef.current!.offsetWidth;
		parentRef.current!.style.transform = `translateX(-${imageIndex * childWidth}px)`;
	}

	return (
		<Page className={'rsAboutSpirePage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					image={require('../../images/aboutSpirePage/family-hugging.png')}
					height={'630px'}
					mobileHeight={'430px'}
				>
					<Paper boxShadow width={'536px'} padding={'50px'}>
						<h1>Spire Loyalty</h1>
						<Label variant={'body2'} mb={'5px'}>
							Spire Loyalty is the premier loyalty platform for real estate, hospitality and every day
							purchases. We reward the way you live, work and play.
						</Label>
						<Label variant={'body2'} mb={'5px'}>
							With Spire Loyalty you’re rewarded for a broad base of transactions. You have the ability to
							earn points for life purchases like buying a home or renting an apartment, and for
							purchasing meals at your favorite restaurants.
						</Label>
						<Label variant={'body2'} mb={'20px'}>
							Welcome to Spire - we look forward to welcoming you with rewards.
						</Label>
						<Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}>
							<LabelButton
								look={'containedPrimary'}
								variant={'button'}
								label={'Sign up for spire'}
								onClick={() => {
									router.navigate('/signup').catch(console.error);
								}}
							/>
							<LabelButton
								look={'containedSecondary'}
								variant={'button'}
								label={'Features and benefits'}
								onClick={() => {
									router.navigate('/features-and-benefits').catch(console.error);
								}}
							/>
						</Box>
					</Paper>
					<div className={'tanBox'} />
				</HeroImage>

				<Box className={'sectionOne'} mb={120}>
					<img src={require('../../images/aboutSpirePage/key-chain.png')} alt={'Key Chain'} />
					<Box className={'textBox'}>
						<h1>History of Spire</h1>
						<Label variant={'body2'} mb={'20px'}>
							Spire was born out of desire to reward people for some of the most important transactions in
							our lives. We know that through Spire our members will be able to aspire to new heights. As
							a technology company, we are committed to creating unique and seamless ways for our partners
							and members to achieve their goals.
						</Label>
						<LabelButton
							look={'containedPrimary'}
							variant={'button'}
							label={'Be part of our history'}
							onClick={() => {
								router.navigate('/signup').catch(console.error);
							}}
						/>
					</Box>
				</Box>
				<Box className={'sectionTwo'} mb={120}>
					<h1>How do I earn points?</h1>
					<Box className={'infoCardWrapper'}>
						<InfoCard
							width={'100%'}
							height={'120px'}
							icon={'icon-resort'}
							bodyReactNode={
								<LabelLink
									path={'/'}
									label={'Browse Stays'}
									variant={'button'}
									iconRight={'icon-chevron-right'}
									iconSize={7}
								/>
							}
							boxShadow
							title={'Stay at a resort'}
						/>
						<InfoCard
							width={'100%'}
							height={'120px'}
							icon={'icon-gift'}
							bodyReactNode={
								<LabelLink
									path={'/'}
									label={'Buy points'}
									variant={'button'}
									iconRight={'icon-chevron-right'}
									iconSize={7}
								/>
							}
							boxShadow
							title={'Purchase points'}
						/>
						<InfoCard
							width={'100%'}
							height={'120px'}
							icon={'icon-for-sale'}
							bodyReactNode={
								<LabelLink
									path={'/'}
									label={'Learn More'}
									variant={'button'}
									iconRight={'icon-chevron-right'}
									iconSize={7}
								/>
							}
							boxShadow
							title={'Purchase real estate'}
						/>
						<InfoCard
							width={'100%'}
							height={'120px'}
							icon={'icon-for-rental'}
							bodyReactNode={
								<LabelLink
									path={'/'}
									label={'Browse rentals'}
									variant={'button'}
									iconRight={'icon-chevron-right'}
									iconSize={7}
								/>
							}
							boxShadow
							title={'Get a rental'}
						/>
					</Box>
				</Box>
				{size !== 'small' ? (
					<Box className={'sectionThree'} mb={120} height={'600px'} position={'relative'}>
						<div className={'tanBox'}>
							<CarouselButtons
								onClickLeft={() => {
									moveImagesLeft();
								}}
								onClickRight={() => {
									moveImagesRight();
								}}
								position={'absolute'}
								bottom={'0'}
								right={'-40px'}
							/>
						</div>
						<Box overflow={'hidden'} className={'featureSliderWrapper'}>
							<div ref={parentRef} className={'featureSlider'}>
								<div ref={childRef}>
									<BookNowImage
										width={'270px'}
										height={'200px'}
										title={
											'Join us at Island H20 Live! Spire Loyalty members receive the VIP treatment'
										}
										linkPath={'/'}
										imgUrl={require('../../images/aboutSpirePage/Mask Group 30-2.png')}
									/>
								</div>

								<div>
									<BookNowImage
										width={'270px'}
										height={'200px'}
										title={
											'Sunset Walk your way to points earnings - El Jeffe and Estefan Kitchen are offering discounted drinks and appetizers to Spire members'
										}
										linkPath={'/'}
										imgUrl={require('../../images/aboutSpirePage/Mask Group 30-1.png')}
									/>
								</div>
								<div>
									<BookNowImage
										width={'270px'}
										height={'200px'}
										title={
											'Upgrade your stay at our partner resort properties where Spire members receive points multipliers on stays and on property spending.'
										}
										linkPath={'/'}
										imgUrl={require('../../images/aboutSpirePage/Mask Group 30.png')}
									/>
								</div>
							</div>
						</Box>
						<Box className={'imageWrapper'}>
							<img src={require('../../images/aboutSpirePage/credit-card-payment.png')} />
							<Box maxWidth={445}>
								<Label variant={'caption'} mb={20}>
									Featured points promotion
								</Label>
								<Label variant={'h1'} mb={20}>
									Get 2x the points value for Margaritaville today only when paying with points.
								</Label>
								<Label variant={'body1'} mb={30}>
									Earning points is now twice as fun with our Margaritaville points promotion.
									Increase your points earning power while you enjoy Margaritavilles award winning
									hospitality…….and Margaritas!
								</Label>
								<LabelButton look={'containedPrimary'} variant={'button'} label={'Book Now'} />
							</Box>
						</Box>
					</Box>
				) : (
					<Box className={'sectionThree'} mb={120} height={'465px'} position={'relative'}>
						<div className={'tanBox'} />
						<Carousel
							children={[
								<BookNowImage
									width={'335px'}
									height={'440px'}
									reactTitle={
										<>
											<Label variant={'caption'} mb={20}>
												Featured points promotion
											</Label>
											<Label variant={'h1'} mb={20}>
												Get 2x the points value for Margaritaville today only when paying with
												points.
											</Label>
											<Label variant={'body1'} mb={30}>
												Earning points is now twice as fun with our Margaritaville points
												promotion. Increase your points earning power while you enjoy
												Margaritavilles award winning hospitality…….and Margaritas!
											</Label>
										</>
									}
									linkPath={'/'}
									imgUrl={require('../../images/aboutSpirePage/credit-card-payment.png')}
								/>,
								<BookNowImage
									width={'335px'}
									height={'440px'}
									title={
										'Join us at Island H20 Live! Spire Loyalty members receive the VIP treatment'
									}
									linkPath={'/'}
									imgUrl={require('../../images/aboutSpirePage/Mask Group 30-2.png')}
								/>,
								<BookNowImage
									width={'335px'}
									height={'440px'}
									title={
										'Sunset Walk your way to points earnings - El Jeffe and Estefan Kitchen are offering discounted drinks and appetizers to Spire members'
									}
									linkPath={'/'}
									imgUrl={require('../../images/aboutSpirePage/Mask Group 30-1.png')}
								/>,
								<BookNowImage
									width={'335px'}
									height={'440px'}
									title={
										'Upgrade your stay at our partner resort properties where Spire members receive points multipliers on stays and on property spending.'
									}
									linkPath={'/'}
									imgUrl={require('../../images/aboutSpirePage/Mask Group 30.png')}
								/>
							]}
						/>
					</Box>
				)}
				<Box className={'sectionOne'} mb={120}>
					<Box className={'textBox'}>
						<h1>Earn and Grow</h1>
						<Label variant={'body2'} mb={'20px'}>
							As you earn points by making purchases, or taking part in inspiring events, you are on your
							way to greater things. Becoming a Platinum Spire is the ultimate and we look forward to
							having you join these unique ranks.
						</Label>
						<LabelButton
							look={'containedPrimary'}
							variant={'button'}
							label={'view the spire tiers'}
							onClick={() => {
								router.navigate('/signup').catch(console.error);
							}}
						/>
					</Box>
					<img src={require('../../images/aboutSpirePage/couple-beach.png')} alt={'Key Chain'} />
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default AboutSpirePage;
