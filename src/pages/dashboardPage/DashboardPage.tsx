import React from 'react';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import './DashboardPage.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import TabbedImageGallery from '../../components/tabbedImageGallery/TabbedImageGallery';
import AmenitiesGalleryTabs from './AmenitiesGalleryTabs';
import LabelButton from '../../components/labelButton/LabelButton';
import LightboxPopup, { LightboxPopupProps } from '../../popups/lightboxPopup/LightboxPopup';
import LightboxPopupItems from './LightboxPopupItems';
import IconLabel from '../../components/iconLabel/IconLabel';
import HeroImage from '../../components/heroImage/HeroImage';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import StarRating from '../../components/starRating/StarRating';
import FeatureRoomCard from '../../components/featureRoomCard/FeatureRoomCard';
import LabelImage from '../../components/labelImage/LabelImage';
import RoomAdditionalDetails from '../../components/roomAdditionalDetails/RoomAdditionalDetails';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import AccommodationSearchCallToActionCard from '../../components/accommodationSearchCallToActionCard/AccommodationSearchCallToActionCard';
import serviceFactory from '../../services/serviceFactory';
import ComparisonService from '../../services/comparison/comparison.service';
import { useRecoilState } from 'recoil';
import globalState, { ComparisonCardInfo } from '../../models/globalState';
import DestinationSearchResultCard from '../../components/destinationSearchResultCard/DestinationSearchResultCard';
import AccommodationSearchResultCard from '../../components/accommodationSearchResultCard/AccommodationSearchResultCard';

const DashboardPage: React.FC = () => {
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const recoilComparisonState = useRecoilState<ComparisonCardInfo[]>(globalState.destinationComparison);

	const roomTypes: { value: string | number; text: string | number; selected: boolean }[] = [
		{ selected: false, value: '1', text: 'Basic Suite' },
		{ selected: false, value: '2', text: 'Full Suite' },
		{ selected: false, value: '3', text: 'Master Suite' },
		{ selected: false, value: '4', text: '3 Bedroom Villa' },
		{ selected: false, value: '5', text: '5 Bedroom Villa' },
		{ selected: false, value: '6', text: '6 Bedroom Villa' }
	];

	function emptyFunction() {}

	return (
		<Page className="rsDashboardPage">
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					image={require('../../images/signInPage/signIn-background.png')}
					height={'760px'}
					mobileHeight={'300px'}
				/>

				<Box width="1440px" height="640px" margin={'40px 0'}>
					<TabbedImageGallery tabs={AmenitiesGalleryTabs} />
				</Box>
				<Box margin={'40px 0'}>
					<LabelButton
						label="Lightbox"
						look="containedSecondary"
						variant="sectionHeader"
						onClick={() =>
							popupController.open<LightboxPopupProps>(LightboxPopup, { items: LightboxPopupItems })
						}
					/>
				</Box>

				<Box margin={'40px 0'} width={'100%'} display={'flex'} justifyContent={'space-evenly'}>
					<IconLabel
						iconImg={'icon-wifi'}
						labelName={'24/7 staff support'}
						labelVariant={'caption'}
						iconPosition={'left'}
						iconSize={14}
					/>
					<IconLabel
						iconImg={'icon-wifi'}
						labelName={'24/7 staff support'}
						labelVariant={'caption'}
						iconPosition={'top'}
						iconSize={14}
					/>
					<IconLabel
						iconImg={'icon-wifi'}
						labelName={'24/7 staff support'}
						labelVariant={'caption'}
						iconPosition={'right'}
						iconSize={14}
					/>
					<IconLabel
						iconImg={'icon-wifi'}
						labelName={'24/7 staff support'}
						labelVariant={'caption'}
						iconPosition={'bottom'}
						iconSize={14}
					/>
				</Box>
				<Box m={'40px 0'}>
					<StarRating size={'small16px'} rating={3.5} />
				</Box>
				<Box margin={'40px 0'}>
					<FeatureRoomCard
						mainImg={require('../../images/landingPage/Margaritaville-Drinks-for-Two.png')}
						title={'8 bedroom villa'}
						discountAmount={150}
						limitedOffer
						bookNowPath={() => {
							console.log('book now');
						}}
					/>
				</Box>
				<Box m={'40px 0'}>
					<LabelImage
						mainImg={require('../../images/resortLandingPage/Disney-World.jpg')}
						textOnImg={'5 Minutes from Disney World'}
					/>
				</Box>

				<Box margin={'40px 0'} width={'500px'}>
					<RoomAdditionalDetails
						typeOfRoom={'Suite'}
						description={
							'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et'
						}
						detailList={[
							'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
							'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
							'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
							'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
							'Lorem ipsum dolor sit amet, consetetur sadipscing elitr'
						]}
					/>
				</Box>
				<Box margin={'40px 0'}>
					<ResortComparisonCard
						logo={require('../../images/encore-resort.png')}
						title={'Encore Resort'}
						roomTypes={roomTypes}
						onChange={(value) => {
							console.log(value);
						}}
						onClose={() => {
							console.log('close this comparison');
						}}
					/>
				</Box>
				<Box margin={'40px 0'} height={'350px'}>
					<AccommodationSearchCallToActionCard
						points={2500}
						squareFeet={'2,300-3,200 sq/ft'}
						bedrooms={6}
						compareOnClick={() => {
							comparisonService.addToComparison(recoilComparisonState, {
								destinationId: Date.now(),
								logo: '../../images/encore-resort.png',
								title: 'Encore Resort',
								roomTypes: [
									{ value: 'villa', text: 'Villa', selected: false },
									{ value: 'vip_suite', text: 'VIP Suite', selected: false }
								]
							});
						}}
					/>
				</Box>
				<Box margin={'40px 0'}>
					<DestinationSearchResultCard
						destinationName="Encore Resort"
						address="7635 Fairfax Dr, Reunion, FL 34747"
						starRating={4.5}
						logoImagePath="src\images\spire-logo.png"
						onAddCompareClick={emptyFunction}
						reviewPath=""
						destinationDetailsPath=""
						summaryTabs={[
							{
								label: 'Overview',
								content: {
									text:
										'Located close to Orlando’s best attractions, Encore Resort is the perfect spot for your stay in Central Florida. Each luxury vacation home rental includes a private pool, access to amazing amenities and in-home services, plus so much more! Keep your whole party under one roof so you can spend less time planning and more time taking advantage of the same service and amenities you’d get from a high-end resort.',
									amenities: [
										{
											iconName: 'icon-wine',
											label: 'Booze'
										}
									],
									finePrint:
										'By staying here, you grant parental rights to Encore Resort over any resultant children.'
								}
							},
							{
								label: 'More info',
								content: 'Yep, this exists!'
							}
						]}
						picturePaths={[
							'../images/dashboardPage/AdobeStock_70559163.png',
							'../images/dashboardPage/bearsden.png',
							'../images/dashboardPage/margaritaville.png'
						]}
					/>
				</Box>
				<Box margin={'40px 0'}>
					<AccommodationSearchResultCard
						id="1"
						name="VIP Suite"
						accommodationType="Suite"
						description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
						pointsRatePerNight={5300}
						ratePerNightInCents={98234}
						starRating={4.5}
						bedrooms={6}
						squareFeet={'2.800-3,200sq/ft'}
						pointsEarnable={2500}
						onBookNowClick={emptyFunction}
						onViewDetailsClick={emptyFunction}
						onCompareClick={emptyFunction}
						roomStats={[
							{
								label: 'Sleeps',
								datum: 12
							},
							{
								label: 'Bedrooms',
								datum: 6
							},
							{
								label: 'Various Bed Types',
								datum: '3'
							},
							{
								label: 'Maximum Capacity',
								datum: '4'
							},
							{
								label: 'Size',
								datum: '2,800-32,000 sq/ft'
							}
						]}
						amenityIconNames={['icon-food-plate', 'icon-wine', 'icon-tea-cup']}
						carouselImagePaths={['../images/dashboardPage/luxury-suite.jpg']}
					/>
				</Box>
			</div>
		</Page>
	);
};

export default DashboardPage;
