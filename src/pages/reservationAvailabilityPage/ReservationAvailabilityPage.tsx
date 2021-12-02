import React, { ReactText, useEffect, useState } from 'react';
import './ReservationAvailabilityPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import serviceFactory from '../../services/serviceFactory';
import router from '../../utils/router';
import ComparisonDrawer from '../../popups/comparisonDrawer/ComparisonDrawer';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import globalState from '../../state/globalState';
import { useRecoilValue } from 'recoil';
import { StringUtils, WebUtils } from '../../utils/utils';
import FilterReservationPopup, {
	FilterReservationPopupProps
} from '../../popups/filterReservationPopup/FilterReservationPopup';
import DestinationSearchResultCard from '../../components/destinationSearchResultCard/DestinationSearchResultCard';
import DestinationService from '../../services/destination/destination.service';
import ComparisonService from '../../services/comparison/comparison.service';
import { DestinationSummaryTab } from '../../components/tabbedDestinationSummary/TabbedDestinationSummary';
import LoginOrCreateAccountPopup, {
	LoginOrCreateAccountPopupProps
} from '../../popups/loginOrCreateAccountPopup/LoginOrCreateAccountPopup';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import TopSearchBar from '../../components/topSearchBar/TopSearchBar';
import FilterBarV2 from '../../components/filterBar/FilterBarV2';
import PaginationViewMore from '../../components/paginationViewMore/PaginationViewMore';
import MobileLightBox, { MobileLightBoxProps } from '../../popups/mobileLightBox/MobileLightBox';
import LightBoxCarouselPopup, {
	TabbedCarouselPopupProps
} from '../../popups/lightBoxCarouselPopup/LightBoxCarouselPopup';
import RsPagedResponseData = RedSky.RsPagedResponseData;

const ReservationAvailabilityPage: React.FC = () => {
	const size = useWindowResizeChange();
	const reservationFilters = useRecoilValue<Misc.ReservationFilters>(globalState.reservationFilters);
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const perPage = 10;
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(0);
	const [destinations, setDestinations] = useState<Api.Destination.Res.Availability[]>([]);

	useEffect(() => {
		WebUtils.updateUrlParams(reservationFilters);
		async function getReservations() {
			let res = await getPagedReservations();
			setDestinations(res.data);
			setAvailabilityTotal(res.total || 0);
			popupController.close(SpinningLoaderPopup);
		}

		getReservations().catch(console.error);
	}, [reservationFilters]);

	useEffect(() => {
		async function getReservations() {
			let res = await getPagedReservations();
			setDestinations((prev) => {
				let newList = [
					...prev.filter((destination) => {
						return !res.data
							.map((newDestination: Api.Destination.Res.Availability) => newDestination.id)
							.includes(destination.id);
					}),
					...res.data
				];
				return newList;
			});
			setAvailabilityTotal(res.total || 0);
			popupController.close(SpinningLoaderPopup);
		}

		getReservations().catch(console.error);
	}, [page]);

	async function getPagedReservations(): Promise<RsPagedResponseData<Api.Destination.Res.Availability[]>> {
		try {
			popupController.open(SpinningLoaderPopup);
			const searchQueryObj: Misc.ReservationFilters = { ...reservationFilters };
			let key: keyof Misc.ReservationFilters;
			for (key in searchQueryObj) {
				if (searchQueryObj[key] === undefined) delete searchQueryObj[key];
			}
			searchQueryObj.pagination = { page, perPage };
			let res = await destinationService.searchAvailableReservations(searchQueryObj);
			return res;
		} catch (e) {
			rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find available reservations.'), 'Server Error');
			popupController.close(SpinningLoaderPopup);
			return { data: [], total: 0 };
		}
	}

	function renderDestinationSearchResultCards() {
		if (!destinations) return;
		return destinations.map((destination, index) => {
			let urls: string[] = getImageUrls(destination);
			let summaryTabs = getSummaryTabs(destination);
			let roomTypes: Misc.OptionType[] = formatCompareRoomTypes(destination);
			const addressData = {
				city: destination.city,
				state: destination.state
			};
			return (
				<DestinationSearchResultCard
					key={destination.id}
					destinationId={destination.id}
					minPoints={destination.minAccommodationPoints}
					minPrice={destination.minAccommodationPrice}
					destinationDescription={destination.description}
					destinationName={destination.name}
					destinationExperiences={destination.experiences}
					address={StringUtils.buildAddressString(addressData)}
					picturePaths={urls}
					summaryTabs={summaryTabs}
					onAddCompareClick={() => {
						comparisonService.addToComparison(destination.id).catch(console.error);
					}}
					onRemoveCompareClick={() => {
						comparisonService.removeFromComparison(destination.id);
					}}
					onGalleryClick={() => {
						if (size === 'small') {
							popupController.open<MobileLightBoxProps>(MobileLightBox, {
								imageData: destination.media
							});
						} else {
							popupController.open<TabbedCarouselPopupProps>(LightBoxCarouselPopup, {
								imageData: destination.media
							});
						}
					}}
				/>
			);
		});
	}

	function formatCompareRoomTypes(destination: Api.Destination.Res.Availability): Misc.OptionType[] {
		if (!destination.accommodationTypes) return [];
		return destination.accommodations
			.sort((room1, room2) => room2.maxOccupantCount - room1.maxOccupantCount)
			.map((room) => {
				return { value: room.id, label: room.name };
			});
	}

	function getSummaryTabs(destination: Api.Destination.Res.Availability): DestinationSummaryTab[] {
		let propertyTypes = destination.propertyTypes;
		const summaryTabs = propertyTypes.reduce((acc: DestinationSummaryTab[], propertyType) => {
			let accommodationList = handleAccommodationList(destination.accommodations, propertyType);
			let destinationSummaryTab: DestinationSummaryTab = {
				label: propertyType.name,
				content: {
					accommodationType: 'Available',
					accommodations: accommodationList,
					onDetailsClick: (accommodationId: ReactText) => {
						let dates =
							!!reservationFilters.startDate && !!reservationFilters.endDate
								? `&startDate=${reservationFilters.startDate}&endDate=${reservationFilters.endDate}`
								: '';
						router.navigate(`/accommodation/details?ai=${accommodationId}${dates}`).catch(console.error);
					},
					onBookNowClick: (accommodationId: number) => {
						let data: any = { ...reservationFilters };
						let newRoom: Misc.StayParams = {
							uuid: Date.now(),
							adults: data.adultCount,
							children: data.childCount || 0,
							accommodationId: accommodationId,
							arrivalDate: data.startDate,
							departureDate: data.endDate,
							rateCode: data.rateCode,
							packages: []
						};
						data = StringUtils.setAddPackagesParams({ destinationId: destination.id, newRoom });
						if (!user) {
							popupController.open<LoginOrCreateAccountPopupProps>(LoginOrCreateAccountPopup, {
								query: data
							});
						} else {
							router.navigate(`/booking/packages?data=${data}`).catch(console.error);
						}
					}
				}
			};
			return [...acc, destinationSummaryTab];
		}, []);
		return summaryTabs;
	}

	function handleAccommodationList(
		accommodationsList: Api.Destination.Res.Accommodation[],
		propertyType: Api.Destination.Res.PropertyType
	) {
		const accommodationsByPropertyType = accommodationsList.filter(
			(accommodation) => propertyType.id === 0 || accommodation.propertyTypeId === propertyType.id
		);

		return accommodationsByPropertyType;
	}

	function getImageUrls(destination: Api.Destination.Res.Availability): string[] {
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

	return (
		<Page className={'rsReservationAvailabilityPage'}>
			<div className={'rs-page-content-wrapper'}>
				<TopSearchBar
					onFilterClick={() =>
						popupController.open<FilterReservationPopupProps>(FilterReservationPopup, {
							className: 'filterPopup'
						})
					}
				/>
				<Box
					className={'filterResultsWrapper'}
					padding={size === 'small' ? '0px 30px 20px 10px' : '20px 20px 20px 20px'}
				>
					{size !== 'small' && (
						<>
							<FilterBarV2 />
						</>
					)}
				</Box>
				<Box className={'searchResultsWrapper'}>
					{destinations.length <= 0 ? (
						<Label variant={'h2'}>No available options.</Label>
					) : (
						renderDestinationSearchResultCards()
					)}
				</Box>
				<PaginationViewMore
					selectedRowsPerPage={perPage}
					total={availabilityTotal}
					currentPageNumber={page}
					viewMore={(page) => {
						setPage(page);
					}}
				/>
				<ComparisonDrawer />
			</div>
		</Page>
	);
};

export default ReservationAvailabilityPage;
