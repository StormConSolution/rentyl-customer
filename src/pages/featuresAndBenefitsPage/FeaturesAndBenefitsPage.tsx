import * as React from 'react';
import './FeaturesAndBenefitsPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Carousel from '../../components/carousel/Carousel';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface FeaturesAndBenefitsPageProps {}

const FeaturesAndBenefitsPage: React.FC<FeaturesAndBenefitsPageProps> = (props) => {
	const size = useWindowResizeChange();
	return (
		<Page className={'rsFeaturesAndBenefitsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					image={require('../../images/featureAndBenefits/hero.jpg')}
					height={'420px'}
					mobileHeight={'403px'}
				>
					<Box textAlign={'center'}>
						<h1>
							<span>Features and Benefits</span> of Spire Loyalty
						</h1>
						<Label variant={'body1'} width={'clamp(293px, 90%, 500px)'} m={'15px auto 0'}>
							As a member of Spire Loyalty, you can increase your points earnings by leveling up. Earning
							points is easier with our linked credit card system allowing you to earn points easily while
							using your own credit card and transacting with our ecosystem of partner merchants and
							properties.
						</Label>
					</Box>
				</HeroImage>
				<Box className={'sectionOne'}>
					<Box className={'imageText'}>
						<img
							src={require('../../images/featureAndBenefits/looking-at-phone.png')}
							alt={'looking-at-phone.png'}
						/>
						<Label variant={size === 'small' ? 'h4' : 'h2'}>Earn More and Level UP</Label>
					</Box>
					<Box className={'imageText'}>
						<img src={require('../../images/featureAndBenefits/bumper-cars.png')} alt={'bumper-cars.png'} />
						<Label variant={size === 'small' ? 'h4' : 'h2'}>
							Earn in Ways Never Before Available to Loyalty Programs
						</Label>
					</Box>
					<Box className={'imageText'}>
						<img
							src={require('../../images/featureAndBenefits/family-traveling.png')}
							alt={'family-traveling.png'}
						/>
						<Label variant={size === 'small' ? 'h4' : 'h2'}>
							Redeem for Vacation Stays to Property Purchases
						</Label>
					</Box>
				</Box>
				<h1 style={{ textAlign: 'center', marginBottom: `${size === 'small' ? '20px' : ''}` }}>Experiences</h1>
				<Box className={'sectionTwo'} mb={120}>
					<div className={'infoBox'}>
						<div className={'infoWrapper'}>
							<Box className={'textBox'}>
								<h1>Real Estate</h1>
								<Label variant={'body1'} mb={'20px'}>
									The power of Spire Loyalty membership can maximize your property purchasing
									experience, rewarding you for one of life's biggest purchases
								</Label>
							</Box>
							<img src={require('../../images/featureAndBenefits/house.png')} alt={'House'} />
						</div>
					</div>
					<div className={'infoBox'}>
						<div className={'infoWrapper flipped'}>
							<Box className={'textBox'}>
								<h1>More than just a rental</h1>
								<Label variant={'body1'} mb={'20px'}>
									Members get to experience the rewards of paying rent and participating in their
									rental community - reward the way you rent
								</Label>
							</Box>
							<img
								src={require('../../images/featureAndBenefits/family-traveling.png')}
								alt={'family traveling'}
							/>
						</div>
					</div>
					<div className={'infoBox'}>
						<div className={'infoWrapper'}>
							<Box className={'textBox'}>
								<h1>Create long lasting memories</h1>
								<Label variant={'body1'} mb={'20px'}>
									Spire is all about rewarding the way you live work and play - these rewards will
									enhance all your experiences
								</Label>
							</Box>
							<img src={require('../../images/featureAndBenefits/biking.png')} alt={'Biking'} />
						</div>
					</div>
					<div className={'infoBox'}>
						<div className={'infoWrapper flipped'}>
							<Box className={'textBox'}>
								<h1>Find your dream home</h1>
								<Label variant={'body1'} mb={'20px'}>
									With Spire you can access unique properties and experiences that will be available
									first to our upper tier membership levels
								</Label>
							</Box>
							<img
								src={require('../../images/featureAndBenefits/splash-pool.png')}
								alt={'Splashing Pool'}
							/>
						</div>
					</div>
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default FeaturesAndBenefitsPage;
