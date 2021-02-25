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
			<div>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias autem commodi consequatur delectus,
				deleniti deserunt et id illo labore libero nam obcaecati odit optio possimus quasi rerum sunt vitae?
			</div>
			<div>
				Aliquam, aperiam dolor dolore doloribus eaque eligendi, explicabo in itaque, nihil pariatur quo rem sunt
				tempore? At deserunt illum minima, nihil praesentium quas quia recusandae repudiandae sequi suscipit
				veritatis voluptas.
			</div>
			<div>
				Animi architecto, at aut corporis deserunt eaque eos exercitationem illum incidunt iste labore libero
				natus nisi nulla omnis optio quam, repellendus repudiandae rerum tenetur, ullam unde voluptate
				voluptatem? Perferendis, sint?
			</div>
			<div>
				Aspernatur assumenda at aut commodi delectus deleniti dicta dignissimos dolor eius eligendi explicabo
				facilis illo illum nam necessitatibus nemo nobis numquam, odio quidem quo tenetur voluptates
				voluptatibus. Dolorum, officia, qui.
			</div>
			<div>
				Accusantium consectetur cupiditate dignissimos dolore dolorem doloremque illum incidunt laboriosam nam
				necessitatibus neque omnis porro provident quae quos sit, totam. Accusamus alias aut delectus fugiat
				impedit magni quis quod rerum!
			</div>
			<div>
				Alias commodi cumque dolor, dolore dolores error fuga, in ipsum labore laboriosam minima molestias
				necessitatibus neque, nobis omnis perferendis placeat possimus quasi reiciendis sapiente sint sunt
				suscipit ullam veniam vitae?
			</div>
			<div>
				Ab dignissimos ducimus et eveniet, impedit laudantium, minus molestias placeat quis repellat ut voluptas
				voluptatibus? Ad, quo, sit! Aspernatur eum facere ipsa nihil porro sapiente sequi soluta? Illo, illum
				ratione?
			</div>
			<div>
				Cupiditate, eligendi, similique. A amet asperiores corporis delectus dignissimos distinctio dolores
				eligendi excepturi explicabo, hic laboriosam laborum nam necessitatibus nulla omnis sapiente tenetur
				voluptates. Fugiat iste nam natus numquam ut?
			</div>
			<div>
				Praesentium qui sunt vel? Animi cupiditate laudantium nisi nostrum numquam perspiciatis sapiente vel
				voluptatum! Ad at deleniti, distinctio hic modi qui quidem voluptas. Amet ea, fugiat magnam porro quae
				soluta?
			</div>
			<div>
				Culpa, deserunt doloribus explicabo laborum magni nihil repudiandae sed temporibus totam veniam? Commodi
				culpa dignissimos fugiat, iusto nihil nobis quae quasi, quia quibusdam, recusandae rem repellendus
				sapiente sed vel veritatis.
			</div>
			<div>
				Ab aliquid, aperiam cumque doloremque dolores doloribus eveniet in, maxime nemo nulla odio quam quasi
				rerum saepe suscipit unde vel? Aliquam autem dignissimos et ipsa libero mollitia possimus quibusdam
				repudiandae?
			</div>
			<div className={'show-on-scroll'}>
				<h1>Hello World!</h1>
			</div>
			<div>
				Assumenda culpa cupiditate deserunt dignissimos dolor earum, eveniet magnam magni molestiae nobis
				nostrum placeat possimus praesentium quaerat quam quas quia quidem reiciendis saepe sed soluta sunt
				tempora ullam vero voluptates?
			</div>
			<div>
				Aliquid deleniti deserunt distinctio doloremque, dolores expedita hic odio pariatur sit, tempora vitae
				voluptates. Cupiditate doloremque doloribus illum natus nesciunt nulla praesentium sit temporibus ullam
				unde! Debitis dolorem laboriosam officiis.
			</div>
			<div>
				Animi asperiores id minus nisi! Consequuntur cumque cupiditate deserunt dolores eius eligendi ex
				excepturi, facere illo in nulla veniam voluptatem voluptatibus. Consectetur culpa debitis, doloribus
				excepturi molestias nostrum omnis quia!
			</div>
			<div>
				Ad consequatur facilis nemo odit porro reiciendis sit totam unde voluptatem? Aperiam aspernatur dicta
				excepturi maxime vero! Accusamus accusantium architecto deserunt itaque minima nam nulla, odit officiis
				pariatur repellat sit.
			</div>
			<div>
				Alias aperiam autem consequuntur cumque fuga fugiat ipsa labore minus similique veritatis. Autem beatae
				consectetur cum doloremque error est magni maxime officia optio possimus quae, quas quisquam saepe
				veritatis vitae!
			</div>
			<div>
				Ab adipisci amet atque corporis dignissimos distinctio dolor earum esse est fugit, illo laudantium modi
				nisi nulla odio omnis possimus quos recusandae repellendus rerum sequi soluta suscipit tempora, tenetur
				voluptatibus.
			</div>
			<div>
				Architecto at culpa debitis dolor, est eveniet expedita explicabo ipsam itaque laborum libero obcaecati
				odio perferendis quae quia reprehenderit veritatis vitae voluptates? Aperiam commodi cupiditate delectus
				fuga nobis optio unde.
			</div>
			<div>
				Aliquid asperiores consequuntur, cumque dicta dolore dolorem ea error eum ex harum iure minima minus
				nemo, nihil officiis quod quos, reprehenderit unde veritatis voluptatum! Error iure magnam nihil omnis
				voluptate.
			</div>
			<div>
				Assumenda consequatur consequuntur corporis culpa cum debitis ea eius eligendi eos excepturi fugit harum
				inventore itaque laudantium minus natus nobis nulla perferendis provident quisquam repellat,
				repudiandae, saepe, sed veniam voluptate.
			</div>
		</Page>
	);
};

export default DashboardPage;
