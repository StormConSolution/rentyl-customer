import React, { useEffect, useState } from 'react';
import './ReservationAvailabilityPage.scss';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import FilterBar from '../../components/filterBar/FilterBar';
import Label from '@bit/redsky.framework.rs.label';
import rsToasts from '@bit/redsky.framework.toast';
import serviceFactory from '../../services/serviceFactory';
import moment from 'moment';
import debounce from 'lodash.debounce';
import { RsFormControl } from '@bit/redsky.framework.rs.form';
import router from '../../utils/router';
import Box from '../../components/box/Box';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import globalState, { ComparisonCardInfo } from '../../models/globalState';
import { useRecoilState } from 'recoil';
import { addCommasToNumber } from '../../utils/utils';
import FilterReservationPopup, {
	FilterReservationPopupProps
} from '../../popups/filterReservationPopup/FilterReservationPopup';
import IconLabel from '../../components/iconLabel/IconLabel';
import DestinationSearchResultCard from '../../components/destinationSearchResultCard/DestinationSearchResultCard';
import DestinationService from '../../services/destination/destination.service';
import ComparisonService from '../../services/comparison/comparison.service';
import LoadingPage from '../loadingPage/LoadingPage';
import { DestinationSummaryTab } from '../../components/tabbedDestinationSummary/TabbedDestinationSummary';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import { SelectOptions } from '../../components/Select/Select';
import useLoginState, { LoginStatus } from '../../customHooks/useLoginState';
import LoginOrCreateAccountPopup, {
	LoginOrCreateAccountPopupProps
} from '../../popups/loginOrCreateAccountPopup/LoginOrCreateAccountPopup';
import AccommodationFeatures = Model.AccommodationFeatures;

const ReservationAvailabilityPage: React.FC = () => {
	const size = useWindowResizeChange();
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	let comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const loginStatus = useLoginState();
	const recoilComparisonState = useRecoilState<ComparisonCardInfo[]>(globalState.destinationComparison);
	const [waitToLoad, setWaitToLoad] = useState<boolean>(true);
	const [page, setPage] = useState<number>(1);
	const [perPage] = useState<number>(5);
	const [availabilityTotal, setAvailability] = useState<number>(32);
	const [checkInDate, setCheckInDate] = useState<moment.Moment | null>(moment());
	const [checkOutDate, setCheckOutDate] = useState<moment.Moment | null>(moment().add(7, 'd'));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [destinations, setDestinations] = useState<Api.Destination.Res.Availability[]>();
	const [numberOfAdults, setNumberOfAdults] = useState<string>('2');
	const [numberOfAdultsControl] = useState<RsFormControl>(new RsFormControl('numberOfAdults', numberOfAdults));
	const updateNumberOfAdults = debounce(async (input: RsFormControl) => {
		let newNumber = parseInt(input.value.toString());
		if (isNaN(newNumber) || newNumber < 1) newNumber = 1;
		setNumberOfAdults(newNumber.toString());
		(document.querySelector('.numberOfAdults > input') as HTMLInputElement).value = newNumber.toString();
	}, 1000);
	const [numberOfChildren, setNumberOfChildren] = useState<string>('0');
	const [numberOfChildrenControl] = useState<RsFormControl>(new RsFormControl('numberOfChildren', numberOfChildren));
	const updateNumberOfChildren = debounce(async (input: RsFormControl) => {
		let newNumber = parseInt(input.value.toString());
		if (isNaN(newNumber) || newNumber < 1) newNumber = 0;
		setNumberOfChildren(newNumber.toString());
		(document.querySelector('.numberOfChildren > input') as HTMLInputElement).value = newNumber.toString();
	}, 1000);
	const [priceMin, setPriceMin] = useState<string>('');
	const [priceMinControl] = useState<RsFormControl>(new RsFormControl('priceMin', priceMin));
	const updatePriceMin = debounce(async (input: RsFormControl) => {
		setPriceMin(input.value.toString());
		let formattedNum = addCommasToNumber(('' + input.value).replace(/\D/g, ''));
		if (size === 'small') {
			(document.querySelector(
				'.rsFilterReservationPopup .priceMin > input'
			) as HTMLInputElement).value = formattedNum;
		}
		(document.querySelector('.priceMin > input') as HTMLInputElement).value = formattedNum;
	}, 1000);
	const [priceMax, setPriceMax] = useState<string>('');
	const [priceMaxControl] = useState<RsFormControl>(new RsFormControl('priceMax', priceMax));
	const updatePriceMax = debounce(async (input: RsFormControl) => {
		setPriceMax(input.value.toString());
		let formattedNum = addCommasToNumber(('' + input.value).replace(/\D/g, ''));
		if (size === 'small') {
			(document.querySelector(
				'.rsFilterReservationPopup .priceMax > input'
			) as HTMLInputElement).value = formattedNum;
		}
		(document.querySelector('.priceMax > input') as HTMLInputElement).value = formattedNum;
	}, 1000);

	useEffect(() => {
		async function getReservations() {
			let data: Api.Destination.Req.Availability = getDataForSearchQuery();
			try {
				let res = await destinationService.searchAvailableReservations(data);
				setDestinations(res.data.data);
				if (res.data.data) setAvailability(res.data.data.length);
			} catch (e) {
				rsToasts.error('An unexpected error has occurred on the server.');
			}
			setWaitToLoad(false);
		}
		getReservations().catch(console.error);
	}, [checkInDate, checkOutDate, numberOfAdults, numberOfChildren, priceMin, priceMax, page]);

	function getDataForSearchQuery() {
		let startDate: string;
		let endDate: string;
		if (checkInDate) {
			startDate = checkInDate.format('YYYY-MM-DD');
		} else {
			startDate = moment().format('YYYY-MM-DD');
		}
		if (checkOutDate) {
			endDate = checkOutDate.format('YYYY-MM-DD');
		} else {
			endDate = moment().add(1, 'day').format('YYYY-MM-DD');
		}
		let dataQuery: Api.Destination.Req.Availability = {
			startDate: startDate,
			endDate: endDate,
			adults: parseInt(numberOfAdults),
			children: parseInt(numberOfChildren),
			pagination: {
				page: page,
				perPage: perPage
			}
		};
		if (priceMin) dataQuery.priceRangeMin = parseInt(priceMin);
		if (priceMax) dataQuery.priceRangeMax = parseInt(priceMax);
		return dataQuery;
	}

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setCheckInDate(startDate);
		setCheckOutDate(endDate);
	}

	function renderDestinationSearchResultCards() {
		if (!destinations) return;
		return destinations.map((destination, index) => {
			let urls: string[] = getImageUrls(destination);
			let summaryTabs = getSummaryTabs(destination);
			let roomTypes: SelectOptions[] = formatCompareRoomTypes(destination, -1);
			return (
				<DestinationSearchResultCard
					key={index}
					destinationName={destination.name}
					address={`${destination.city}, ${destination.state}`}
					logoImagePath={destination.logoUrl}
					picturePaths={urls}
					starRating={4.5}
					reviewPath={''}
					destinationDetailsPath={`/destination/details?di=${destination.id}`}
					summaryTabs={summaryTabs}
					onAddCompareClick={() => {
						comparisonService.addToComparison(recoilComparisonState, {
							destinationId: destination.id,
							logo: destination.logoUrl,
							title: destination.name,
							roomTypes: roomTypes
						});
					}}
				/>
			);
		});
	}

	function formatCompareRoomTypes(
		destination: Api.Destination.Res.Availability,
		accommodationIdSelected: number | string
	): SelectOptions[] {
		if (!destination.accommodationTypes) return [];
		return destination.accommodationTypes.map((type) => {
			if (accommodationIdSelected === type.id) {
				return { value: type.id, text: type.name, selected: true };
			}
			return { value: type.id, text: type.name, selected: false };
		});
	}

	function getSummaryTabs(destination: Api.Destination.Res.Availability): DestinationSummaryTab[] {
		let accommodationsList = getAccommodationList(destination);
		return [
			{ label: 'Overview', content: { text: destination.description } },
			{
				label: 'Available Suites',
				content: {
					accommodationType: 'Suites',
					accommodations: accommodationsList,
					onDetailsClick: (accommodationId) => {
						router.navigate(`/accommodation/details?ai=${accommodationId}`).catch(console.error);
					},
					onBookNowClick: (accommodationId) => {
						let data: any = getDataForSearchQuery();
						data.accommodationId = accommodationId;
						delete data.pagination;
						data = JSON.stringify(data);

						if (loginStatus === LoginStatus.LOGGED_OUT || loginStatus === LoginStatus.UNKNOWN) {
							popupController.open<LoginOrCreateAccountPopupProps>(LoginOrCreateAccountPopup, {
								query: data
							});
						} else {
							router.navigate(`/booking?data=${data}`).catch(console.error);
						}
					},
					onAddCompareClick: (accommodationId) => {
						let roomTypes: SelectOptions[] = formatCompareRoomTypes(destination, accommodationId);
						comparisonService.addToComparison(recoilComparisonState, {
							destinationId: destination.id,
							logo: destination.logoUrl,
							title: destination.name,
							roomTypes: roomTypes
						});
					}
				}
			}
		];
	}

	function getAccommodationList(destination: Api.Destination.Res.Availability) {
		return destination.accommodations.map((accommodationDetails) => {
			let amenityIconNames: string[] = getAmenityIconNames(accommodationDetails.features);
			return {
				id: accommodationDetails.id,
				name: accommodationDetails.name,
				amenityIconNames: amenityIconNames,
				bedrooms: accommodationDetails.roomCount,
				beds: accommodationDetails.bedDetails.length,
				ratePerNight: 0,
				pointsPerNight: 0
			};
		});
	}

	function getAmenityIconNames(features: AccommodationFeatures[]): string[] {
		return features.map((feature) => {
			return feature.icon;
		});
	}

	function getImageUrls(destination: Api.Destination.Res.Availability): string[] {
		if (destination.media) {
			return destination.media.map((urlObj) => {
				return urlObj.urls.small.toString();
			});
		}
		return [];
	}

	return waitToLoad ? (
		<LoadingPage />
	) : (
		<Page className={'rsReservationAvailabilityPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					className={'heroImage'}
					image={require('../../images/destinationResultsPage/momDaughterHero.jpg')}
					height={'200px'}
					mobileHeight={'100px'}
				/>
				<Box
					className={'filterResultsWrapper'}
					bgcolor={'#ffffff'}
					width={'1165px'}
					padding={size === 'small' ? '20px 30px' : '60px 140px'}
				>
					<Label className={'filterLabel'} variant={'h1'}>
						Filter by
					</Label>

					<FilterBar
						className={'filterBar'}
						startDate={checkInDate}
						endDate={checkOutDate}
						onDatesChange={onDatesChange}
						focusedInput={focusedInput}
						onFocusChange={setFocusedInput}
						monthsToShow={2}
						numberOfAdultsControl={numberOfAdultsControl}
						numberOfAdultsUpdateControl={(updateControl) => updateNumberOfAdults(updateControl)}
						numberOfChildrenControl={numberOfChildrenControl}
						numberOfChildrenUpdateControl={(updateControl) => updateNumberOfChildren(updateControl)}
						priceMinControl={priceMinControl}
						priceMinUpdateControl={(updateControl) => updatePriceMin(updateControl)}
						priceMaxControl={priceMaxControl}
						priceMaxUpdateControl={(updateControl) => updatePriceMax(updateControl)}
					/>
					<IconLabel
						className={'moreFiltersLink'}
						labelName={'More Filters'}
						iconImg={'icon-chevron-right'}
						iconPosition={'right'}
						iconSize={8}
						labelVariant={'caption'}
						onClick={() => {
							popupController.open<FilterReservationPopupProps>(FilterReservationPopup, {
								onClickApply: (startDate, endDate) => {
									setCheckInDate(startDate);
									setCheckOutDate(endDate);
								},
								numberOfAdultsControl: numberOfAdultsControl,
								numberOfAdultsUpdateControl: (updateControl) => updateNumberOfAdults(updateControl),
								numberOfChildrenControl: numberOfChildrenControl,
								numberOfChildrenUpdateControl: (updateControl) => updateNumberOfChildren(updateControl),
								priceMinControl: priceMinControl,
								priceMinUpdateControl: (updateControl) => updatePriceMin(updateControl),
								priceMaxControl: priceMaxControl,
								priceMaxUpdateControl: (updateControl) => updatePriceMax(updateControl),
								className: 'filterPopup'
							});
						}}
					/>
					<div className={'bottomBorderDiv'} />
				</Box>
				<Box
					className={'searchResultsWrapper'}
					bgcolor={'#ffffff'}
					width={'1165px'}
					padding={size === 'small' ? '0 30px 20px' : '0 140px 60px'}
				>
					{renderDestinationSearchResultCards()}
				</Box>
				<div className={'paginationDiv'}>
					<PaginationButtons
						selectedRowsPerPage={perPage}
						currentPageNumber={page}
						setSelectedPage={(page) => setPage(page)}
						total={availabilityTotal}
					/>
				</div>
			</div>
		</Page>
	);
};

export default ReservationAvailabilityPage;
