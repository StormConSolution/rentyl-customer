import React, { ReactText, useEffect, useState } from 'react';
import './ReservationAvailabilityPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import serviceFactory from '../../services/serviceFactory';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import globalState from '../../state/globalState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { ObjectUtils, StringUtils, WebUtils } from '../../utils/utils';
import FilterReservationPopup, {
	FilterReservationPopupProps
} from '../../popups/filterReservationPopup/FilterReservationPopup';
import IconLabel from '../../components/iconLabel/IconLabel';
import DestinationSearchResultCard from '../../components/destinationSearchResultCard/DestinationSearchResultCard';
import DestinationService from '../../services/destination/destination.service';
import ComparisonService from '../../services/comparison/comparison.service';
import { DestinationSummaryTab } from '../../components/tabbedDestinationSummary/TabbedDestinationSummary';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import LoginOrCreateAccountPopup, {
	LoginOrCreateAccountPopupProps
} from '../../popups/loginOrCreateAccountPopup/LoginOrCreateAccountPopup';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import TopSearchBar from '../../components/topSearchBar/TopSearchBar';
import FilterBarV2 from '../../components/filterBar/FilterBarV2';
import PropertyType = Api.Destination.Res.PropertyType;

const ReservationAvailabilityPage: React.FC = () => {
	const size = useWindowResizeChange();
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const recoilComparisonState = useRecoilState<Misc.ComparisonCardInfo[]>(globalState.destinationComparison);
	const perPage = 5;
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(0);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [validCode, setValidCode] = useState<boolean>(true);
	const [accommodationToggle, setAccommodationToggle] = useState<boolean>(false);
	const [destinations, setDestinations] = useState<Api.Destination.Res.Availability[]>([]);

	const [propertyTypeOptions, setPropertyTypeOptions] = useState<PropertyType[]>([]);
	const [inUnitAmenities, setInUnitAmenities] = useState<OptionType[]>([]);
	const [resortExperiences, setResortExperiences] = useState<OptionType[]>([]);

	useEffect(() => {
		async function getResortExperiences() {
			let res = await destinationService.getExperienceTypes();
			setResortExperiences(
				res.map((experience) => {
					return {
						value: experience.id,
						label: experience.title
					};
				})
			);
		}
		getResortExperiences().catch(console.error);

		async function getInUnitAmenities() {
			let res = await destinationService.getInUnitAmenities();
			setInUnitAmenities(
				res.map((amenity) => {
					return {
						value: amenity.id,
						label: amenity.title
					};
				})
			);
		}
		getInUnitAmenities().catch(console.error);

		async function getAccommodations() {
			const list = await destinationService.getAllPropertyTypes();
			setPropertyTypeOptions(list);
		}
		getAccommodations().catch(console.error);
	}, []);

	useEffect(() => {
		/**
		 * This useEffect grabs the current url params on first page load and sets the search Query Object.
		 */
		setReservationFilters(WebUtils.parseURLParamsToFilters());
	}, []);

	useEffect(() => {
		async function getReservations() {
			try {
				popupController.open(SpinningLoaderPopup);
				const searchQueryObj: Misc.ReservationFilters = { ...reservationFilters };
				let key: keyof Misc.ReservationFilters;
				for (key in searchQueryObj) {
					if (searchQueryObj[key] === undefined) delete searchQueryObj[key];
				}
				let res = await destinationService.searchAvailableReservations(searchQueryObj);
				setDestinations(res.data);
				setAvailabilityTotal(res.total || 0);
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find available reservations.'), 'Server Error');
				popupController.close(SpinningLoaderPopup);
			}
		}

		getReservations().catch(console.error);
	}, [reservationFilters]);

	useEffect(() => {
		router.updateUrlParams({
			startDate: reservationFilters.startDate.toString(),
			endDate: reservationFilters.endDate.toString(),
			guests: reservationFilters.adultCount,
			region: reservationFilters.regionIds ? reservationFilters.regionIds.join(',') : '',
			priceRangeMax: reservationFilters.priceRangeMax ? reservationFilters.priceRangeMax.toString() : '',
			priceRangeMin: reservationFilters.priceRangeMin ? reservationFilters.priceRangeMin.toString() : '',
			propertyTypeIds: reservationFilters.propertyTypeIds ? reservationFilters.propertyTypeIds.join(',') : ''
		});
	}, [reservationFilters]);

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
					unfilteredAccommodations={destination.accommodations}
					destinationDescription={destination.description}
					destinationName={destination.name}
					destinationExperiences={destination.experiences}
					address={StringUtils.buildAddressString(addressData)}
					picturePaths={urls}
					summaryTabs={summaryTabs}
					onAddCompareClick={() => {
						comparisonService.addToComparison(recoilComparisonState, {
							destinationId: destination.id,
							logo: destination.logoUrl,
							title: destination.name,
							roomTypes: roomTypes,
							selectedRoom: destination.accommodations[0].id
						});
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
					},
					onAddCompareClick: (accommodationId: ReactText) => {
						let roomTypes: Misc.OptionType[] = formatCompareRoomTypes(destination);
						comparisonService.addToComparison(recoilComparisonState, {
							destinationId: destination.id,
							logo: destination.logoUrl,
							title: destination.name,
							roomTypes: roomTypes,
							selectedRoom: accommodationId as number
						});
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
					onSearch={(data) => {
						console.log(data);
					}}
				/>
				<Box
					className={'filterResultsWrapper'}
					padding={size === 'small' ? '0px 30px 20px 10px' : '20px 0 60px 0'}
				>
					{size !== 'small' ? (
						<>
							<FilterBarV2
								destinationService={destinationService}
								accommodationToggle={accommodationToggle}
								accommodationOptions={propertyTypeOptions}
								redeemCodeToggle={false}
								resortExperiencesOptions={resortExperiences}
								inUnitAmenitiesOptions={inUnitAmenities}
							/>
							<Label variant={'body1'} color={'red'}>
								{errorMessage}
							</Label>
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
									className: 'filterPopup',
									resortExperiencesOptions: resortExperiences,
									inUnitAmenitiesOptions: inUnitAmenities,
									accommodationOptions: propertyTypeOptions
								});
							}}
						/>
					)}

					<div className={'bottomBorderDiv'} />
				</Box>
				<Box className={'searchResultsWrapper'}>
					{destinations.length <= 0 ? (
						<Label variant={'h2'}>No available options.</Label>
					) : (
						renderDestinationSearchResultCards()
					)}
				</Box>
				<div className={'paginationDiv'}>
					<PaginationButtons
						selectedRowsPerPage={perPage}
						currentPageNumber={page}
						setSelectedPage={(newPage) => {
							setReservationFilters({
								...reservationFilters,
								pagination: { page: newPage, perPage: 5 }
							});
							setPage(newPage);
						}}
						total={availabilityTotal}
					/>
				</div>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default ReservationAvailabilityPage;
