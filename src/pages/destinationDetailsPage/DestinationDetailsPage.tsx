import * as React from 'react';
import './DestinationDetailsPage.scss';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import { useEffect, useRef, useState } from 'react';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';
import LoadingPage from '../loadingPage/LoadingPage';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { WebUtils } from '../../utils/utils';
import FilterBar from '../../components/filterBar/FilterBar';
import AccommodationSearchResultCard from '../../components/accommodationSearchResultCard/AccommodationSearchResultCard';
import AccommodationService from '../../services/accommodation/accommodation.service';
import LoginOrCreateAccountPopup, {
	LoginOrCreateAccountPopupProps
} from '../../popups/loginOrCreateAccountPopup/LoginOrCreateAccountPopup';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import PaginationViewMore from '../../components/paginationViewMore/PaginationViewMore';
import SubNavMenu from '../../components/subNavMenu/SubNavMenu';
import DestinationImageGallery from '../../components/destinationImageGallery/DestinationImageGallery';
import LightBoxCarouselPopup, {
	TabbedCarouselPopupProps
} from '../../popups/lightBoxCarouselPopup/LightBoxCarouselPopup';
import CarouselV2 from '../../components/carouselV2/CarouselV2';
import ComparisonService from '../../services/comparison/comparison.service';
import MobileLightBox, { MobileLightBoxProps } from '../../popups/mobileLightBox/MobileLightBox';
import MinMaxDestinationDetailsBar from '../../components/minMaxDestinationDetailsBar/MinMaxDestinationDetailsBar';
import DestinationExperienceImageGallery from '../../components/destinationExperienceImageGallery/DestinationExperienceImageGallery';
import Icon from '@bit/redsky.framework.rs.icon';
import { Loader, LoaderOptions } from 'google-maps';

interface DestinationDetailsPageProps {}

const DestinationDetailsPage: React.FC<DestinationDetailsPageProps> = () => {
	const galleryRef = useRef<HTMLElement>(null);
	const overviewRef = useRef<HTMLElement>(null);
	const experiencesRef = useRef<HTMLElement>(null);
	const availableStaysRef = useRef<HTMLElement>(null);
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const size = useWindowResizeChange();
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();
	const [availabilityStayList, setAvailabilityStayList] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [totalResults, setTotalResults] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const perPage = 10;

	useEffect(() => {
		const filtersFromUrl = WebUtils.parseURLParamsToFilters();
		setReservationFilters(filtersFromUrl);
	}, []);

	useEffect(() => {
		(async () => {
			if (!destinationDetails) return;

			const poiToHide: google.maps.MapTypeStyle[] = [
				{
					featureType: 'poi',
					stylers: [{ visibility: 'off' }]
				}
			];

			const loader = new Loader('AIzaSyAU3SZ6DiPSbxHck1AKgG8nRDarltdep7g');
			const google = await loader.load();
			let mapElement: HTMLElement | null = document.getElementById('GoogleMap');
			if (!mapElement) return;

			let destinationLocation = { lat: 28.289728, lng: -81.594499 }; // this needs to be dynamic.

			//Render Map
			let googleMap = new google.maps.Map(mapElement, {
				center: destinationLocation,
				zoom: 16
			});

			let infoWindowContent = renderInfoWindowContent();
			//Hide All POI
			googleMap.setOptions({ styles: poiToHide });

			//Info Window
			const infoWindow: any = new google.maps.InfoWindow({
				content: infoWindowContent
			});

			//Place Marker;
			const marker = new google.maps.Marker({
				position: destinationLocation,
				map: googleMap,
				title: destinationDetails.name
			});

			marker.addListener('click', () => {
				infoWindow.open({
					anchor: marker,
					googleMap
				});
			});
		})();
	}, [destinationDetails]);

	useEffect(() => {
		if (!reservationFilters.destinationId) return;
		async function getDestinationDetails(id: number) {
			try {
				let dest = await destinationService.getDestinationDetails(id);
				setDestinationDetails(dest);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Cannot get details for this destination.'),
					'Server Error'
				);
			}
		}
		getDestinationDetails(reservationFilters.destinationId).catch(console.error);
	}, [reservationFilters.destinationId]);

	useEffect(() => {
		async function getAvailableStays() {
			if (!reservationFilters.destinationId) return;
			try {
				popupController.open(SpinningLoaderPopup);
				const searchQueryObj: Misc.ReservationFilters = { ...reservationFilters };
				let key: keyof Misc.ReservationFilters;
				for (key in searchQueryObj) {
					if (searchQueryObj[key] === undefined) delete searchQueryObj[key];
				}
				searchQueryObj.pagination = { page, perPage };
				if (searchQueryObj.priceRangeMin) searchQueryObj.priceRangeMin *= 100;
				if (searchQueryObj.priceRangeMax) searchQueryObj.priceRangeMax *= 100;
				let result = await accommodationService.availability(reservationFilters.destinationId, searchQueryObj);
				setTotalResults(result.total || 0);
				setAvailabilityStayList((prev) => {
					return [
						...prev.filter((accommodation) => {
							return !result.data
								.map((newList: Api.Accommodation.Res.Availability) => newList.id)
								.includes(accommodation.id);
						}),
						...result.data
					];
				});
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				popupController.close(SpinningLoaderPopup);
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get available accommodations.'),
					'Server Error'
				);
			}
		}
		getAvailableStays().catch(console.error);
	}, [reservationFilters, page]);

	function renderInfoWindowContent() {
		if (!destinationDetails) return;
		return `
				<h3 style="color: #333333; margin-bottom: 10px">${destinationDetails.name}</h3>
				<div>
				${destinationDetails.address1} ${destinationDetails.address2 || ''}
				<br />
				${destinationDetails.city}, ${destinationDetails.state} ${destinationDetails.zip}
				</div>
				<div class="view-link">
					<a style='color: #427fed; text-decoration: none'
					 href="${renderMapSource()}" target="_blank">View on Google Maps</a>
				</div>
				`;
	}

	function renderFeatureCarousel() {
		if (!destinationDetails || !ObjectUtils.isArrayWithData(destinationDetails.experiences)) return;
		let carouselItems: any = [];
		for (let item of destinationDetails.experiences) {
			let imagePath = '';
			if (ObjectUtils.isArrayWithData(item.media)) {
				const mainImg = item.media.find((image) => image.isPrimary);
				imagePath = mainImg?.urls.imageKit || item.media[0].urls.imageKit;
			}
			carouselItems.push({
				name: item.title,
				title: item.title,
				imagePath: imagePath,
				description: item.description,
				buttonLabel: 'View Photos',
				otherMedia: item.media
			});
		}
		return carouselItems;
	}

	function renderMapSource() {
		if (!destinationDetails) return;
		let address = `${destinationDetails.address1} ${destinationDetails.city} ${destinationDetails.state} ${destinationDetails.zip}`;
		address = address.replace(/ /g, '+');
		return encodeURI(`https://www.google.com/maps/dir/?api=1&destination=${address}`);
	}

	function renderAccommodations() {
		if (!ObjectUtils.isArrayWithData(availabilityStayList)) return;
		return availabilityStayList.map((item) => {
			return (
				<AccommodationSearchResultCard
					key={item.id}
					id={item.id}
					name={item.name}
					accommodationType="Suite"
					description={item.longDescription}
					pointsRatePerNight={item.pointsPerNight}
					pointsEarnable={item.pointsEarned}
					ratePerNightInCents={item.costPerNightCents}
					squareFeet={item.size ? item.size.max : null}
					maxSleeps={item.maxSleeps}
					onBookNowClick={() => {
						if (!destinationDetails) return;
						const newRoom: Misc.StayParams = {
							uuid: Date.now(),
							accommodationId: item.id,
							adults: reservationFilters.adultCount,
							children: 0,
							arrivalDate: reservationFilters.startDate.toString(),
							departureDate: reservationFilters.endDate.toString(),
							packages: [],
							rateCode: ''
						};
						const data = JSON.stringify({ destinationId: destinationDetails.id, newRoom });
						if (!user) {
							popupController.open<LoginOrCreateAccountPopupProps>(LoginOrCreateAccountPopup, {
								query: data
							});
						} else {
							router.navigate(`/booking/packages?data=${data}`).catch(console.error);
						}
					}}
					onViewDetailsClick={() => {
						const dates =
							!!reservationFilters.startDate && !!reservationFilters.endDate
								? `&startDate=${reservationFilters.startDate}&endDate=${reservationFilters.endDate}`
								: '';
						router.navigate(`/accommodation/details?ai=${item.id}${dates}`).catch(console.error);
					}}
					roomStats={[
						{
							label: 'Sleeps',
							datum: item.maxSleeps
						},
						{
							label: 'Max Occupancy',
							datum: item.maxOccupantCount
						},
						{
							label: 'Accessible',
							datum: item.adaCompliant ? 'Yes' : 'No'
						},
						{
							label: 'Extra Bed',
							datum: item.extraBeds ? 'Yes' : 'No'
						}
					]}
					amenityIconNames={item.amenities.map((amenity) => {
						return amenity.icon;
					})}
					carouselImagePaths={item.media}
				/>
			);
		});
	}

	function renderExperiencesSection() {
		if (!destinationDetails?.experiences) return null;
		if (!ObjectUtils.isArrayWithData(destinationDetails.experiences) || destinationDetails.experiences.length < 6)
			return <></>;
		return <DestinationExperienceImageGallery experiences={destinationDetails.experiences} />;
	}

	function getImageUrls(destination: Api.Destination.Res.Details): string[] {
		if (destination.media) {
			let images = destination.media;
			images.sort((a, b) => {
				return b.isPrimary - a.isPrimary;
			});
			return images.map((urlObj) => {
				return urlObj.urls.imageKit?.toString() || urlObj.urls.thumb;
			});
		}
		return [];
	}
	return !destinationDetails ? (
		<LoadingPage />
	) : (
		<Page className={'rsDestinationDetailsPage'}>
			<div className={'rs-page-content-wrapper'}>
				{size !== 'small' && (
					<SubNavMenu
						pageRefs={{
							galleryRef: galleryRef,
							overviewRef: overviewRef,
							experiencesRef: experiencesRef,
							availableStaysRef: availableStaysRef
						}}
					/>
				)}
				<Box boxRef={galleryRef} className={'gallerySection'}>
					{size === 'small' ? (
						<CarouselV2
							path={window.location.href}
							imgPaths={getImageUrls(destinationDetails)}
							onAddCompareClick={() => {
								comparisonService.addToComparison(destinationDetails.id).catch(console.error);
							}}
							onRemoveCompareClick={() => {
								comparisonService.removeFromComparison(destinationDetails.id);
							}}
							onGalleryClick={() => {
								popupController.open<MobileLightBoxProps>(MobileLightBox, {
									imageData: destinationDetails.media
								});
							}}
						/>
					) : (
						<DestinationImageGallery
							imageData={destinationDetails.media}
							onGalleryClick={() => {
								if (!destinationDetails) return;
								popupController.open<TabbedCarouselPopupProps>(LightBoxCarouselPopup, {
									imageData: destinationDetails.media
								});
							}}
						/>
					)}
				</Box>
				<Box boxRef={overviewRef} className={'overviewSection'}>
					<Box className={'titleAndPriceContainer'}>
						<Box className={'logoNameContainer'}>
							<img
								className="destinationLogo"
								src={destinationDetails.logoUrl}
								alt={destinationDetails.name + ' logo'}
							/>
							<Label variant={'destinationDetailsCustomThree'}>{destinationDetails.name}</Label>
						</Box>
						<Box className={'destinationPricingContainer'}>
							<Label variant={'destinationDetailsCustomFour'}>from</Label>
							<Label className={'price'} variant={'destinationDetailsCustomFive'}>
								$300
							</Label>
							<Label variant={'destinationDetailsCustomFour'}>per night</Label>
						</Box>
					</Box>
					<Box className={'destinationDetailsWrapper'}>
						<Box className={'minMaxDescription'}>
							<Box className={'minMaxContainer'}>
								<MinMaxDestinationDetailsBar
									minBed={destinationDetails.minBedroom}
									maxBed={destinationDetails.maxBedroom}
									minBath={destinationDetails.minBathroom}
									maxBath={destinationDetails.maxBathroom}
									minArea={0}
									maxArea={0}
								/>
								<Box className={'cityStateContainer'}>
									<Icon
										className={'locationIcon'}
										iconImg={'icon-location'}
										size={25}
										color={'#FF6469'}
									/>
									<Label variant={'destinationDetailsCustomTwo'}>
										{destinationDetails.city},{' '}
										{destinationDetails.state === ''
											? destinationDetails.zip
											: destinationDetails.state}
									</Label>
								</Box>
							</Box>
							{destinationDetails.description ? (
								<Label variant={'body2'}>{destinationDetails.description}</Label>
							) : (
								<div />
							)}
						</Box>
						<Box
							width={size === 'small' ? '300px' : '766px'}
							height={size === 'small' ? '300px' : '430px'}
							id={'GoogleMap'}
						></Box>
					</Box>
				</Box>
				<hr />
				<Box boxRef={experiencesRef} className={'experienceSection'} mb={63}>
					<Label
						variant={size === 'small' ? 'destinationDetailsCustomOne' : 'tabbedImageCarouselCustomOne'}
						mb={size === 'small' ? 25 : 50}
					>
						Experiences
					</Label>
					{renderExperiencesSection()}
				</Box>

				{!destinationDetails.isActive ? (
					<div ref={availableStaysRef}>
						<Label variant={'h2'} color={'red'} className={'noDestinations'}>
							This destination is currently not accepting reservations from this site.
						</Label>
					</div>
				) : (
					<div className={'sectionFive'} ref={availableStaysRef}>
						<hr />
						<Label variant={'h1'} className={'chooseYourAccommodation'}>
							Choose your accommodation
						</Label>
						<FilterBar destinationId={destinationDetails.id} isMobile={size === 'small'} />
						<hr />
						<div className={'accommodationCardWrapper'}>
							{availabilityStayList.length <= 0 ? (
								<Label variant={'h2'}>No available options.</Label>
							) : (
								renderAccommodations()
							)}
						</div>
						<PaginationViewMore
							selectedRowsPerPage={perPage}
							total={totalResults}
							currentPageNumber={page}
							viewMore={(page) => setPage(page)}
						/>
					</div>
				)}
			</div>
		</Page>
	);
};

export default DestinationDetailsPage;
