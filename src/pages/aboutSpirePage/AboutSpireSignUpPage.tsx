import * as React from 'react';
import './AboutSpireSignUpPage.scss';
import { Box, Link, Page, popupController } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import InfoCard from '../../components/infoCard/InfoCard';
import LabelLink from '../../components/labelLink/LabelLink';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import { useEffect, useRef, useState } from 'react';
import CarouselButtons from '../../components/carouselButtons/CarouselButtons';
import BookNowImage from '../../components/bookNowImage/BookNowImage';
import Carousel from '../../components/carousel/Carousel';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import promotionWheelData, { IPromotionWheel } from './PromotionWheelData';
import LinkButton from '../../components/linkButton/LinkButton';
import SignUpSteps from './signUpSteps/SignUpSteps';
import SignUpForm from './signUpForm/SignUpForm';

const AboutSpireSignUpPage: React.FC = () => {
	const parentRef = useRef<HTMLElement>(null);
	const size = useWindowResizeChange();
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const [mainImage, setMainImage] = useState<string>();
	const [mainTitleDescription, setMainTitleDescription] = useState<React.ReactNode>();
	const [imageIndex, setImageIndex] = useState<number>(0);

	useEffect(() => {
		setMainImage(promotionWheelData[imageIndex].imgUrl);
		setMainTitleDescription(
			<Box maxWidth={445}>
				<Label variant={'caption'} mb={20}>
					Featured points promotion
				</Label>
				<Label variant={'h1'} mb={20}>
					{promotionWheelData[imageIndex].title}
				</Label>
				<Label variant={'body1'} mb={30}>
					{promotionWheelData[imageIndex].description}
				</Label>
				<LinkButton look={'containedPrimary'} label={'Book Now'} path={'/reservation/availability'} />
			</Box>
		);
	}, [imageIndex]);

	function moveImagesRight() {
		if (parentRef.current!.childElementCount === imageIndex) {
			setImageIndex(0);
			return (parentRef.current!.style.transform = `translateX(0px)`);
		} else {
			setImageIndex(imageIndex + 1);
		}

		//@ts-ignore
		let childWidth = parentRef.current!.children[0].offsetWidth;
		parentRef.current!.style.transform = `translateX(-${(imageIndex + 1) * childWidth}px)`;
	}

	function moveImagesLeft() {
		if (imageIndex === 0) return;
		setImageIndex(imageIndex - 1);
		//@ts-ignore
		let childWidth = parentRef.current!.children[0].offsetWidth;
		parentRef.current!.style.transform = `translateX(-${(imageIndex - 1) * childWidth}px)`;
	}

	function renderPromotionImage() {
		return { backgroundImage: `url(${mainImage})` };
	}

	function renderBookNowImages() {
		let images: IPromotionWheel[] = promotionWheelData.filter((item) => item.imgUrl !== mainImage);
		return images.map((item, index) => {
			return (
				<div key={index}>
					<BookNowImage
						width={'270px'}
						height={'200px'}
						title={item.description}
						linkPath={'/reservation/availability'}
						imgUrl={item.imgUrl}
					/>
				</div>
			);
		});
	}

	return (
		<Page className={'rsAboutSpireSignUpPage'}>
			<HeroImage
				image={
					'https://image.redskytech.io/AboutSpireSignUp/Mask_Group_8_abAPMoIhd.jpg?updatedAt=1632324815926&tr=w-1920'
				}
				height={'100%'}
				mobileHeight={'100%'}
			>
				<Box className={'columnOne'}>
					<Label variant={'h1'} mb={25}>
						Sign up with Spire today
						<br />
						<span>It's as easy as 1,2,3</span>
					</Label>
					<SignUpSteps
						stepNumber={1}
						title={'Earn'}
						description={
							'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod temporinvidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et'
						}
					/>
					<SignUpSteps
						stepNumber={2}
						title={'Explore'}
						description={
							'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod temporinvidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et'
						}
					/>
					<SignUpSteps
						stepNumber={3}
						title={'Redeem'}
						description={
							'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod temporinvidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et'
						}
					/>
					<LinkButton
						yellow
						look={'containedPrimary'}
						label={'Features and benefits'}
						path={'/features-and-benefits'}
					/>
				</Box>
				{!user && <SignUpForm />}
			</HeroImage>
			<div className={'rs-page-content-wrapper'}>
				<Box className={'sectionOne'} mb={120}>
					<img src={require('../../images/aboutSpirePage/key-chain.png')} alt={'Key Chain'} />
					<Box className={'textBox'}>
						<h1>History of Spire</h1>
						<Label variant={'body1'} mb={'20px'}>
							Spire was born out of desire to reward people for some of the most important transactions in
							our lives. We know that through Spire our members will be able to aspire to new heights. As
							a technology company, we are committed to creating unique and seamless ways for our partners
							and members to achieve their goals.
						</Label>
						<LinkButton look={'containedPrimary'} label={'Be part of our history'} path={'/signup'} />
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
									path={'/reservation/availability'}
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
									path={'/buy-points'}
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
								{renderBookNowImages()}
							</div>
						</Box>

						<div className={'imageWrapper'} style={renderPromotionImage()}>
							{mainTitleDescription || ''}
						</div>
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
						<Label variant={'body1'} mb={'20px'}>
							As you earn points by making purchases, or taking part in inspiring events, you are on your
							way to greater things. Becoming a Platinum Spire Member is the ultimate and we look forward
							to having you join these unique ranks.
						</Label>
						<LinkButton look={'containedPrimary'} label={'view the spire tiers'} path={'/signup'} />
					</Box>
					<img src={require('../../images/aboutSpirePage/couple-beach.png')} alt={'Key Chain'} />
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default AboutSpireSignUpPage;