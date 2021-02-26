import React from 'react';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import './DashboardPage.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Box from '../../components/box/Box';
import TabbedImageGallery from '../../components/tabbedImageGallery/TabbedImageGallery';
import AmenitiesGalleryTabs from './AmenitiesGalleryTabs';
import LabelButton from '../../components/labelButton/LabelButton';
import LightboxPopup, { LightboxPopupProps } from '../../popups/lightboxPopup/LightboxPopup';
import LightboxPopupItems from './LightboxPopupItems';
import DestinationSearchResultCard from '../../components/destinationSearchResultCard/DestinationSearchResultCard';
import AccommodationSearchResultCard from '../../components/accommodationSearchResultCard/AccommodationSearchResultCard';

const DashboardPage: React.FC = () => {
	const emptyFunction: () => void = () => {};

	return (
		<Page className="rsDashboardPage">
			<Box>
				<Label>Dashboard</Label>
			</Box>

			<DestinationSearchResultCard
				destinationName="Encore Resort"
				address="7635 Fairfax Dr, Reunion, FL 34747"
				starRating={4.5}
				logoImagePath="src\images\dashboardPage\encore-logo.png"
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
									iconName: 'icon-food-plate',
									label: 'dining'
								},
								{
									iconName: 'icon-wine',
									label: 'Booze'
								},
								{
									iconName: 'icon-wifi',
									label: 'intertubes'
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
					'../images/dashboardPage/luxury-suite.jpg',
					'../images/dashboardPage/three-bed-villa.jpg',
					'../images/dashboardPage/five-bed-villa.jpg'
				]}
			/>

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
				carouselImagePaths={[
					'../images/dashboardPage/luxury-suite.jpg',
					'../images/dashboardPage/five-bed-villa.jpg'
				]}
			/>

			<Label>Plots Go Here</Label>
			<Box width="1440px" height="640px">
				<TabbedImageGallery tabs={AmenitiesGalleryTabs} />
			</Box>
			<Box>
				<LabelButton
					label="Lightbox"
					look="containedSecondary"
					variant="sectionHeader"
					onClick={() =>
						popupController.open<LightboxPopupProps>(LightboxPopup, { items: LightboxPopupItems })
					}
				/>
			</Box>

			<TabbedImageGallery tabs={AmenitiesGalleryTabs} />
		</Page>
	);
};

export default DashboardPage;
