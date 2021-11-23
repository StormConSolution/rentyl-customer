import * as React from 'react';
import './DestinationDetailsPage.scss';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import { useEffect, useRef, useState } from 'react';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';
import LoadingPage from '../loadingPage/LoadingPage';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import DestinationInfoCard from '../../components/destinationInfoCard/DestinationInfoCard';
import { FooterLinks } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import Label from '@bit/redsky.framework.rs.label';
import LabelImage from '../../components/labelImage/LabelImage';
import TabbedImageCarousel from '../../components/tabbedImageCarousel/TabbedImageCarousel';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Carousel from '../../components/carousel/Carousel';
import { StringUtils, WebUtils } from '../../utils/utils';
import FilterBar from '../../components/filterBar/FilterBar';
import AccommodationSearchResultCard from '../../components/accommodationSearchResultCard/AccommodationSearchResultCard';
import AccommodationService from '../../services/accommodation/accommodation.service';
import LoginOrCreateAccountPopup, {
	LoginOrCreateAccountPopupProps
} from '../../popups/loginOrCreateAccountPopup/LoginOrCreateAccountPopup';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import ComparisonService from '../../services/comparison/comparison.service';
import FilterReservationPopup, {
	FilterReservationPopupProps
} from '../../popups/filterReservationPopup/FilterReservationPopup';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import IconLabel from '../../components/iconLabel/IconLabel';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import PaginationViewMore from '../../components/paginationViewMore/PaginationViewMore';
interface DestinationDetailsPageProps {}

const DestinationDetailsPage: React.FC<DestinationDetailsPageProps> = () => {
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const size = useWindowResizeChange();
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const availableStaysRef = useRef<HTMLElement>(null);
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	// const recoilComparisonState = useRecoilState<Misc.ComparisonState>(globalState.destinationComparison);
	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();
	const [availabilityStayList, setAvailabilityStayList] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [totalResults, setTotalResults] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const perPage = 10;
	const [comparisonId, setComparisonId] = useState<number>(1);

	useEffect(() => {
		const filtersFromUrl = WebUtils.parseURLParamsToFilters();
		setReservationFilters(filtersFromUrl);
	}, []);

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

	function popupSearch(adultCount: number, priceRangeMin: string, priceRangeMax: string, propertyTypeIds: number[]) {
		setReservationFilters((prev) => {
			let createSearchQueryObj: any = { ...prev };
			createSearchQueryObj['adultCount'] = adultCount;
			createSearchQueryObj['adultCount'] = adultCount;
			if (ObjectUtils.isArrayWithData(propertyTypeIds)) {
				createSearchQueryObj['propertyTypeIds'] = propertyTypeIds;
			} else delete createSearchQueryObj['regionIds'];

			if (priceRangeMin !== '') createSearchQueryObj['priceRangeMin'] = parseInt(priceRangeMin);
			else delete createSearchQueryObj['priceRangeMin'];

			if (priceRangeMax !== '') createSearchQueryObj['priceRangeMax'] = parseInt(priceRangeMax);
			else delete createSearchQueryObj['priceRangeMax'];

			return createSearchQueryObj;
		});
		const newUrlParams: any = {
			adultCount: adultCount,
			priceRangeMax: priceRangeMax,
			priceRangeMin: priceRangeMin,
			propertyTypeIds: propertyTypeIds.join(',')
		};

		for (let i in newUrlParams) {
			if (!newUrlParams[i].toString().length) {
				delete newUrlParams[i];
			}
		}
	}

	function renderFeatures() {
		if (!destinationDetails || !destinationDetails.experiences) return;
		let featureArray: any = [];
		destinationDetails.experiences.forEach((item) => {
			let primaryMedia: any = '';
			for (let value of item.media) {
				if (!value.isPrimary) continue;
				primaryMedia = value.urls.imageKit;
				break;
			}
			if (primaryMedia === '') return false;
			featureArray.push(<LabelImage key={item.id} mainImg={primaryMedia} textOnImg={item.title} />);
		});
		return featureArray;
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
		return <TabbedImageCarousel tabs={carouselItems} />;
	}

	function renderMapSource() {
		if (!destinationDetails) return;
		let address = `${destinationDetails.address1} ${destinationDetails.city} ${destinationDetails.state} ${destinationDetails.zip}`;
		address = address.replace(/ /g, '+');
		return `https://www.google.com/maps/embed/v1/place?q=${address}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
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
							packages: []
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
					onCompareClick={() => {
						if (!destinationDetails) return;
						let selectedRoom = destinationDetails.accommodations.filter((value) => value.id === item.id);
						setComparisonId(comparisonId + 1);
						// comparisonService.addToComparison(recoilComparisonState, {
						// 	comparisonId: comparisonId,
						// 	destinationId: Date.now(),
						// 	logo: destinationDetails.logoUrl,
						// 	title: destinationDetails.name,
						// 	roomTypes: destinationDetails.accommodations
						// 		.sort((room1, room2) => room2.maxOccupantCount - room1.maxOccupantCount)
						// 		.map((value) => {
						// 			return {
						// 				value: value.id,
						// 				label: value.name
						// 			};
						// 		}),
						// 	selectedRoom: selectedRoom[0].id || destinationDetails.accommodations[0].id
						// });
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

	function renderSectionTwo() {
		return (
			<Box className={'sectionTwo'} marginBottom={'120px'}>
				<Label variant={'h1'}>Features</Label>
				<Box display={'flex'} justifyContent={'center'} width={'100%'} flexWrap={'wrap'}>
					{size === 'small' ? <Carousel children={renderFeatures()} /> : renderFeatures()}
				</Box>
			</Box>
		);
	}

	function renderSectionThree() {
		if (!destinationDetails?.experiences) return null;
		return (
			<Box className={'sectionThree'} marginBottom={'190px'}>
				{renderFeatureCarousel()}
				{ObjectUtils.isArrayWithData(destinationDetails.experiences) && <div className={'yellowSquare'} />}
			</Box>
		);
	}

	function renderSectionFour() {
		if (!destinationDetails) return null;
		const addressData = {
			address1: destinationDetails.address1,
			address2: destinationDetails.address2,
			city: destinationDetails.city,
			state: destinationDetails.state,
			zip: destinationDetails.zip
		};
		return (
			<Box
				className={'sectionFour'}
				marginBottom={'124px'}
				display={'flex'}
				justifyContent={'center'}
				alignItems={'center'}
				flexWrap={'wrap'}
			>
				<Box width={size === 'small' ? '300px' : '420px'} marginRight={size === 'small' ? '0px' : '100px'}>
					<Label variant={'h1'}>Location</Label>
					{destinationDetails.locationDescription ? (
						<Label variant={'body2'}>{destinationDetails.locationDescription}</Label>
					) : (
						<div></div>
					)}
					<Label variant={'caption'}>{StringUtils.buildAddressString(addressData)}</Label>
				</Box>
				<Box width={size === 'small' ? '300px' : '570px'} height={size === 'small' ? '300px' : '450px'}>
					<iframe frameBorder="0" src={renderMapSource()} />
				</Box>
			</Box>
		);
	}

	return !destinationDetails ? (
		<LoadingPage />
	) : (
		<Page className={'rsDestinationDetailsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box className={'sectionOne'}>
					<HeroImage image={destinationDetails.heroUrl} height={'420px'} mobileHeight={'420px'} />
					<Box className={'headerWrapper'}>
						<Box className={'destinationInfoCardWrapper'}>
							<DestinationInfoCard
								destinationId={destinationDetails.id}
								destinationName={destinationDetails.name}
								destinationImage={destinationDetails.logoUrl}
								address={destinationDetails.address1}
								city={destinationDetails.city}
								state={destinationDetails.state}
								zip={destinationDetails.zip}
								rating={destinationDetails.reviewRating}
								longDescription={destinationDetails.description}
								onViewAvailableStaysClick={() => {
									let availableStaysSection = availableStaysRef.current!.offsetTop;
									window.scrollTo({ top: availableStaysSection, behavior: 'smooth' });
								}}
							/>
						</Box>
					</Box>
				</Box>
				{renderSectionTwo()}
				{renderSectionThree()}
				{renderSectionFour()}
				{!destinationDetails.isActive ? (
					<div ref={availableStaysRef}>
						<Label variant={'h2'} color={'red'} className={'noDestinations'}>
							This destination is currently not accepting reservations from this site.
						</Label>
					</div>
				) : (
					<div className={'sectionFive'} ref={availableStaysRef}>
						<Label variant={'h1'} mb={20}>
							Available Stays
						</Label>
						{size !== 'small' ? (
							<>
								<FilterBar destinationId={destinationDetails.id} />
							</>
						) : (
							<IconLabel
								className={'moreFiltersLink'}
								labelName={'More Filters'}
								iconImg={'icon-chevron-right'}
								iconPosition={'right'}
								iconSize={8}
								labelVariant={'caption'}
								onClick={() => {
									popupController.open<FilterReservationPopupProps>(FilterReservationPopup, {
										className: 'filterPopup'
									});
								}}
							/>
						)}
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
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default DestinationDetailsPage;
