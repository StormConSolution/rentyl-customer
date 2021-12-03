import * as React from 'react';
import './DestinationDetailsMobilePopup.scss';
import { Box, Popup, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import { useEffect, useState } from 'react';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../../utils/utils';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';
import AccommodationService from '../../services/accommodation/accommodation.service';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import MobileLightBox, { MobileLightBoxProps } from '../mobileLightBox/MobileLightBox';
import CarouselV2 from '../../components/carouselV2/CarouselV2';
import ComparisonService from '../../services/comparison/comparison.service';
import LoadingPage from '../../pages/loadingPage/LoadingPage';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import DestinationExperienceImageGallery from '../../components/destinationExperienceImageGallery/DestinationExperienceImageGallery';
import ImageLabel from '../../components/imageLabel/ImageLabel';
import { Loader } from 'google-maps';
import FilterBar from '../../components/filterBar/FilterBar';
import PaginationViewMore from '../../components/paginationViewMore/PaginationViewMore';

export interface DestinationDetailsMobilePopupProps extends PopupProps {}

const DestinationDetailsMobilePopup: React.FC<DestinationDetailsMobilePopupProps> = (props) => {
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();
	const [availabilityStayList, setAvailabilityStayList] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [destinationAvailability, setDestinationAvailability] = useState<Api.Destination.Res.Availability>();
	const [totalResults, setTotalResults] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const perPage = 10;

	useEffect(() => {
		const filtersFromUrl = WebUtils.parseURLParamsToFilters();
		setReservationFilters(filtersFromUrl);
	}, []);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		document.body.style.position = 'fixed';
		document.body.style.top = '0';

		return () => {
			document.body.style.overflow = 'unset';
			document.body.style.position = 'unset';
			document.body.style.top = 'unset';
		};
	}, []);

	useEffect(() => {
		(async () => {
			if (!destinationDetails) return;
			let address = `${destinationDetails.address1} ${destinationDetails.city} ${destinationDetails.state} ${destinationDetails.zip}`;

			const poiToHide: google.maps.MapTypeStyle[] = [
				{
					featureType: 'poi',
					stylers: [{ visibility: 'off' }]
				}
			];

			const loader = new Loader('AIzaSyAU3SZ6DiPSbxHck1AKgG8nRDarltdep7g');
			const google = await loader.load();
			const geocoder = new google.maps.Geocoder();
			let mapElement: HTMLElement | null = document.getElementById('GoogleMap');
			if (!mapElement) return;

			let destinationLocation = { lat: 28.289728, lng: -81.594499 }; // this needs to be dynamic.

			//Render Map
			let googleMap = new google.maps.Map(mapElement, {
				center: destinationLocation,
				zoom: 16,
				disableDefaultUI: true
			});

			let infoWindowContent = renderInfoWindowContent();
			//Hide All POI
			googleMap.setOptions({ styles: poiToHide });

			if (geocoder) {
				geocoder.geocode({ address: address }, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						googleMap.setCenter(results[0].geometry.location);

						//Info Window
						const infoWindow: any = new google.maps.InfoWindow({
							content: infoWindowContent
						});

						//Place Marker;
						const marker = new google.maps.Marker({
							position: results[0].geometry.location,
							map: googleMap,
							title: destinationDetails.name
						});

						google.maps.event.addListener(marker, 'click', function () {
							infoWindow.open(googleMap, marker);
						});
					} else {
						rsToastify.error('Could not load google map location');
						console.error(status);
					}
				});
			}
		})();
	}, [destinationDetails]);

	useEffect(() => {
		(async () => {
			if (!reservationFilters.destinationId) return;
			let id = reservationFilters.destinationId;
			try {
				let dest = await destinationService.getDestinationDetails(id);
				setDestinationDetails(dest);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Cannot get details for this destination.'),
					'Server Error'
				);
			}
		})();
	}, [reservationFilters.destinationId]);

	useEffect(() => {
		async function getReservations() {
			try {
				const searchQueryObj: Misc.ReservationFilters = { ...reservationFilters };
				let key: keyof Misc.ReservationFilters;
				for (key in searchQueryObj) {
					if (searchQueryObj[key] === undefined) delete searchQueryObj[key];
				}
				searchQueryObj.pagination = { page, perPage };
				let res = await destinationService.searchAvailableReservations(searchQueryObj);
				setDestinationAvailability(
					res.data.find(
						(destination: Api.Destination.Res.Availability) =>
							destination.id === reservationFilters.destinationId
					)
				);
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find available reservations.'), 'Server Error');
			}
		}

		getReservations().catch(console.error);
	}, [reservationFilters]);

	useEffect(() => {
		async function getAvailableStays() {
			if (!reservationFilters.destinationId) return;
			try {
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
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get available accommodations.'),
					'Server Error'
				);
			}
		}
		getAvailableStays().catch(console.error);
	}, [reservationFilters, page]);

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

	function renderMapSource() {
		if (!destinationDetails) return;
		let address = `${destinationDetails.address1} ${destinationDetails.city} ${destinationDetails.state} ${destinationDetails.zip}`;
		address = address.replace(/ /g, '+');
		return encodeURI(`https://www.google.com/maps/dir/?api=1&destination=${address}`);
	}

	function renderExperiencesSection() {
		if (!destinationDetails?.experiences) return null;
		if (!ObjectUtils.isArrayWithData(destinationDetails.experiences) || destinationDetails.experiences.length < 6)
			return <></>;
		return <DestinationExperienceImageGallery experiences={destinationDetails.experiences} />;
	}

	function renderMinMaxLabels(min: number, max: number): string {
		if (min === max) return min.toString();
		if (min === 0) return `1-${max}`;
		return `${min}-${max}`;
	}

	function renderAccommodations() {
		if (!ObjectUtils.isArrayWithData(availabilityStayList) && destinationAvailability) return;
		return availabilityStayList.map((accommodationAvailability) => {
			const destinationAccommodation:
				| Api.Destination.Res.Accommodation
				| undefined = destinationAvailability?.accommodations.find(
				(accommodation) => accommodation.id === accommodationAvailability.id
			);
			if (reservationFilters.destinationId && destinationAccommodation) {
				return (
					<AccommodationSearchCard
						key={accommodationAvailability.id}
						accommodation={destinationAccommodation}
						destinationId={reservationFilters.destinationId}
						pointsEarnable={accommodationAvailability.pointsEarned}
						onClickInfoIcon={handleOnInfoClick}
						showInfoIcon
					/>
				);
			}
		});
	}

	async function handleOnInfoClick(accommodationId: number) {
		let accommodationDetails = await accommodationService.getAccommodationDetails(accommodationId);
		popupController.open<MobileAccommodationOverviewPopupProps>(MobileAccommodationOverviewPopup, {
			accommodationDetails: accommodationDetails
		});
	}

	return !destinationDetails ? (
		<LoadingPage />
	) : (
		<Popup opened={props.opened}>
			<div className={'rsDestinationDetailsMobilePopup'}>
				<div className={'topNav'}>
					<Label variant={'destinationDetailsMobileCustomOne'}>Resort Overview</Label>
					<Icon
						iconImg={'icon-close'}
						color={'#797979'}
						size={20}
						onClick={() => {
							popupController.close(DestinationDetailsMobilePopup);
						}}
					/>
				</div>
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
				<Label variant={'destinationDetailsMobileCustomTwo'}>{destinationDetails.name}</Label>
				<Box display={'flex'} m={'15px 0'} justifyContent={'space-between'}>
					<ImageLabel
						labelName={renderMinMaxLabels(destinationDetails.minBedroom, destinationDetails.maxBedroom)}
						imgSrc={'sleep.png'}
						imgWidth={'30px'}
						imgHeight={'20px'}
						iconPosition={'left'}
					/>
					<ImageLabel
						labelName={renderMinMaxLabels(destinationDetails.minBathroom, destinationDetails.maxBathroom)}
						imgSrc={'shower.png'}
						imgWidth={'30px'}
						imgHeight={'20px'}
						iconPosition={'left'}
					/>
					<ImageLabel
						labelName={'SQUARE FOOT'}
						imgSrc={'square-foot.png'}
						imgWidth={'30px'}
						imgHeight={'20px'}
						iconPosition={'left'}
					/>
				</Box>
				<Label variant={'destinationDetailsMobileCustomThree'}>{destinationDetails.description}</Label>
				<hr />
				<Label variant={'destinationDetailsCustomOne'} mb={25}>
					Experiences
				</Label>
				{renderExperiencesSection()}
				<hr />
				<Label variant={'destinationDetailsCustomOne'} mb={25}>
					Location
				</Label>
				<Box height={'200px'} width={'100%'} id={'GoogleMap'} mb={20} />
				<Label variant={'destinationDetailsMobileCustomThree'}>{destinationDetails.locationDescription}</Label>
				<hr />
				<Label variant={'destinationDetailsCustomOne'} mb={15}>
					Choose Your Accommodation
				</Label>
				{!destinationDetails.isActive ? (
					<div>
						<Label variant={'h2'} color={'red'} className={'noDestinations'}>
							This destination is currently not accepting reservations from this site.
						</Label>
					</div>
				) : (
					<div className={'availableStays'}>
						<hr />
						<Label variant={'h1'} className={'chooseYourAccommodation'}>
							Choose your accommodation
						</Label>
						<FilterBar destinationId={destinationDetails.id} isMobile={true} />
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
		</Popup>
	);
};

export default DestinationDetailsMobilePopup;
