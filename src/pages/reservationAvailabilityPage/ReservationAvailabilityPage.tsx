import React, { ReactText, useEffect, useState } from 'react';
import './ReservationAvailabilityPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import FilterBar from '../../components/filterBar/FilterBar';
import Label from '@bit/redsky.framework.rs.label';
import serviceFactory from '../../services/serviceFactory';
import moment from 'moment';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import globalState from '../../state/globalState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { formatFilterDateForServer, StringUtils, WebUtils } from '../../utils/utils';
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
import RateCodeSelect from '../../components/rateCodeSelect/RateCodeSelect';
import Accordion from '@bit/redsky.framework.rs.accordion';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';

const ReservationAvailabilityPage: React.FC = () => {
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ startDate: string; endDate: string }>([
		{ key: 'startDate', default: '', type: 'string', alias: 'startDate' },
		{ key: 'endDate', default: '', type: 'string', alias: 'endDate' }
	]);
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	let comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const recoilComparisonState = useRecoilState<Misc.ComparisonCardInfo[]>(globalState.destinationComparison);
	const perPage = 5;
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(0);
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(moment(new Date()));
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(moment(new Date()).add(2, 'days'));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [destinations, setDestinations] = useState<Api.Destination.Res.Availability[]>([]);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [rateCode, setRateCode] = useState<string>('');
	const [validCode, setValidCode] = useState<boolean>(true);
	const [options, setOptions] = useState<OptionType[]>([]);
	const [propertyType, setPropertyType] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('propertyType', [], [])])
	);
	const [searchQueryObj, setSearchQueryObj] = useState<Api.Destination.Req.Availability>({
		startDate: moment().format('YYYY-MM-DD'),
		endDate: moment().add(2, 'day').format('YYYY-MM-DD'),
		adultCount: 2,
		childCount: 0,
		pagination: { page: 1, perPage: 5 }
	});

	useEffect(() => {
		if (!params.startDate && !params.endDate) return;
		onDatesChange(moment(params.startDate), moment(params.endDate));
	}, []);

	useEffect(() => {
		async function getReservations() {
			if (
				searchQueryObj['priceRangeMin'] &&
				searchQueryObj['priceRangeMax'] &&
				searchQueryObj['priceRangeMin'] > searchQueryObj['priceRangeMax']
			)
				return;
			if (
				searchQueryObj['startDate'] &&
				searchQueryObj['endDate'] &&
				new Date(searchQueryObj['startDate']) > new Date(searchQueryObj['endDate'])
			)
				return;
			let newSearchQueryObj = { ...searchQueryObj };
			if (
				(!!newSearchQueryObj.priceRangeMin || newSearchQueryObj.priceRangeMin === 0) &&
				(!!newSearchQueryObj.priceRangeMax || newSearchQueryObj.priceRangeMax === 0)
			) {
				newSearchQueryObj.priceRangeMax *= 100;
				newSearchQueryObj.priceRangeMin *= 100;
			}
			try {
				popupController.open(SpinningLoaderPopup);
				let res = await destinationService.searchAvailableReservations(newSearchQueryObj);
				setDestinations(res.data);
				setAvailabilityTotal(res.total || 0);
				setValidCode(rateCode === '' || (!!res.data && res.data.length > 0));
				if (rateCode !== '' && !!res.data && res.data.length > 0) {
					rsToastify.success('Rate code successfully applied.', 'Success!');
				}
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find available reservations.'), 'Server Error');
				setValidCode(rateCode === '');
				popupController.close(SpinningLoaderPopup);
			}
		}

		getReservations().catch(console.error);
	}, [searchQueryObj]);

	useEffect(() => {
		async function getAllPropertyTypes() {
			try {
				let response = await destinationService.getAllPropertyTypes();
				let newOptions = formatOptions(response);
				setOptions(newOptions);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'An unexpected server error has occurred'),
					'Server Error'
				);
			}
		}
		getAllPropertyTypes().catch(console.error);
	}, []);

	function formatOptions(options: Api.Destination.Res.PropertyType[]) {
		return options.map((value) => {
			return { value: value.id, label: value.name };
		});
	}

	function updateSearchQueryObj(
		key:
			| 'startDate'
			| 'endDate'
			| 'adultCount'
			| 'childCount'
			| 'priceRangeMin'
			| 'priceRangeMax'
			| 'pagination'
			| 'rateCode'
			| 'propertyTypeIds',
		value: any
	) {
		if (key === 'adultCount' && value === 0) {
			//this should never evaluate to true with current implementations.
			throw rsToastify.error('Must have at least 1 adult', 'Missing or Incorrect Information');
		}
		if (key === 'adultCount' && isNaN(value)) {
			throw rsToastify.error('# of adults must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'childCount' && isNaN(value)) {
			throw rsToastify.error('# of children must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'priceRangeMin' && isNaN(parseInt(value))) {
			throw rsToastify.error('Price min must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'priceRangeMax' && isNaN(parseInt(value))) {
			throw rsToastify.error('Price max must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'priceRangeMin' && searchQueryObj['priceRangeMax'] && value > searchQueryObj['priceRangeMax']) {
			setErrorMessage('Price min must be lower than the max');
		} else if (
			key === 'priceRangeMax' &&
			searchQueryObj['priceRangeMin'] &&
			value < searchQueryObj['priceRangeMin']
		) {
			setErrorMessage('Price max must be greater than the min');
		} else {
			setErrorMessage('');
		}
		setSearchQueryObj((prev) => {
			let createSearchQueryObj: any = { ...prev };
			if (value === '' || value === undefined || value.length <= 0) delete createSearchQueryObj[key];
			else createSearchQueryObj[key] = value;
			return createSearchQueryObj;
		});
	}

	function popupSearch(
		checkinDate: moment.Moment | null,
		checkoutDate: moment.Moment | null,
		adultCount: string,
		childCount: string,
		priceRangeMin: string,
		priceRangeMax: string,
		propertyTypeIds: number[]
	) {
		setSearchQueryObj((prev) => {
			let createSearchQueryObj: any = { ...prev };
			createSearchQueryObj['startDate'] = formatFilterDateForServer(checkinDate, 'start');
			createSearchQueryObj['endDate'] = formatFilterDateForServer(checkoutDate, 'end');
			createSearchQueryObj['adultCount'] = parseInt(adultCount);
			if (propertyTypeIds.length >= 1) {
				createSearchQueryObj['propertyTypeIds'] = propertyTypeIds;
			} else {
				delete createSearchQueryObj['propertyTypeIds'];
			}
			if (childCount !== '') {
				createSearchQueryObj['childCount'] = parseInt(childCount);
			}
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMin'] = parseInt(priceRangeMin);
			}
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMax'] = parseInt(priceRangeMax);
			}
			return createSearchQueryObj;
		});
		const dates: Misc.DateRange = {
			startDate: formatFilterDateForServer(checkinDate, 'start'),
			endDate: formatFilterDateForServer(checkoutDate, 'end')
		};
		router.updateUrlParams({
			...dates
		});
	}

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDateControl(startDate);
		setEndDateControl(endDate);
		updateSearchQueryObj('startDate', formatFilterDateForServer(startDate, 'start'));
		updateSearchQueryObj('endDate', formatFilterDateForServer(endDate, 'end'));
		router.updateUrlParams({
			startDate: formatFilterDateForServer(startDate, 'start'),
			endDate: formatFilterDateForServer(endDate, 'end')
		});
	}

	function renderDestinationSearchResultCards() {
		if (!destinations) return;
		return destinations.map((destination, index) => {
			let urls: string[] = getImageUrls(destination);
			let summaryTabs = getSummaryTabs(destination);
			let roomTypes: Misc.SelectOptions[] = formatCompareRoomTypes(destination, -1);
			return (
				<DestinationSearchResultCard
					key={index}
					destinationName={destination.name}
					address={`${destination.city}, ${destination.state}`}
					logoImagePath={destination.logoUrl}
					picturePaths={urls}
					starRating={destination.reviewRating}
					reviewPath={`/destination/reviews?di=${destination.id}`}
					destinationDetailsPath={
						!!params.startDate && !!params.endDate
							? `/destination/details?di=${destination.id}&startDate=${params.startDate}&endDate=${params.endDate}`
							: `/destination/details?di=${destination.id}`
					}
					summaryTabs={summaryTabs}
					onAddCompareClick={() => {
						let selectedRoom = roomTypes.filter((value) => value.selected);
						comparisonService.addToComparison(recoilComparisonState, {
							destinationId: destination.id,
							logo: destination.logoUrl,
							title: destination.name,
							roomTypes: roomTypes,
							selectedRoom: 0
						});
					}}
				/>
			);
		});
	}

	function formatCompareRoomTypes(
		destination: Api.Destination.Res.Availability,
		accommodationIdSelected: number | string
	): Misc.SelectOptions[] {
		if (!destination.accommodationTypes) return [];
		return destination.accommodations
			.sort((room1, room2) => room2.maxOccupantCount - room1.maxOccupantCount)
			.map((room) => {
				if (accommodationIdSelected === room.id) {
					return { value: room.id, text: room.name, selected: true };
				}
				return { value: room.id, text: room.name, selected: false };
			});
	}

	function getSummaryTabs(destination: Api.Destination.Res.Availability): DestinationSummaryTab[] {
		let propertyTypes = [{ name: 'All Available', id: 0 }, ...destination.propertyTypes];
		const summaryTabs = propertyTypes.reduce(
			(acc: DestinationSummaryTab[], propertyType) => {
				let accommodationList = handleAccommodationList(destination.accommodations, propertyType);
				let destinationSummaryTab: DestinationSummaryTab = {
					label: propertyType.name,
					content: {
						accommodationType: 'Available',
						accommodations: accommodationList,
						onDetailsClick: (accommodationId: ReactText) => {
							let dates =
								!!searchQueryObj.startDate && !!searchQueryObj.endDate
									? `&startDate=${searchQueryObj.startDate}&endDate=${searchQueryObj.endDate}`
									: '';
							router
								.navigate(`/accommodation/details?ai=${accommodationId}${dates}`)
								.catch(console.error);
						},
						onBookNowClick: (accommodationId: number) => {
							let data: any = { ...searchQueryObj };
							let newRoom: Misc.StayParams = {
								uuid: Date.now(),
								adults: data.adultCount,
								children: data.childCount,
								accommodationId: accommodationId,
								arrivalDate: data.startDate,
								departureDate: data.endDate,
								packages: []
							};
							if (data.rateCode) newRoom.rateCode = data.rateCode;
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
							let roomTypes: Misc.SelectOptions[] = formatCompareRoomTypes(destination, accommodationId);
							let selectedRoom = roomTypes.filter((value) => value.selected);
							comparisonService.addToComparison(recoilComparisonState, {
								destinationId: destination.id,
								logo: destination.logoUrl,
								title: destination.name,
								roomTypes: roomTypes,
								selectedRoom: +selectedRoom[0].value
							});
						}
					}
				};
				if (accommodationList.length <= 0) {
					return [...acc];
				} else {
					return [...acc, destinationSummaryTab];
				}
			},
			[{ label: 'Overview', content: { text: destination.description } }]
		);
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
			return destination.media.map((urlObj) => {
				return urlObj.urls.imageKit?.toString() || '';
			});
		}
		return [];
	}

	function onChangePropertyType(control: RsFormControl) {
		setPropertyType(propertyType.clone().update(control));
	}

	return (
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
					padding={size === 'small' ? '20px 30px' : '60px 140px'}
					boxSizing={'border-box'}
				>
					<Label className={'filterLabel'} variant={'h1'}>
						Filter by
					</Label>

					{size !== 'small' ? (
						<>
							<FilterBar
								className={'filterBar'}
								startDate={startDateControl}
								endDate={endDateControl}
								onDatesChange={onDatesChange}
								focusedInput={focusedInput}
								onFocusChange={setFocusedInput}
								monthsToShow={2}
								onChangeAdults={(value) => {
									if (value === '' || isNaN(parseInt(value))) return;
									updateSearchQueryObj('adultCount', parseInt(value));
								}}
								onChangeChildren={(value) => {
									if (value !== '') updateSearchQueryObj('childCount', parseInt(value));
								}}
								onChangePriceMin={(value) => {
									if (value !== '') {
										updateSearchQueryObj('priceRangeMin', value);
									}
								}}
								onChangePriceMax={(value) => {
									if (value !== '') {
										updateSearchQueryObj('priceRangeMax', value);
									}
								}}
								onChangePropertyType={(control) => {
									setPropertyType(propertyType.clone().update(control));
									updateSearchQueryObj('propertyTypeIds', control.value);
								}}
								adultsInitialInput={searchQueryObj.adultCount.toString()}
								childrenInitialInput={searchQueryObj.childCount.toString()}
								initialPriceMax={
									!!searchQueryObj.priceRangeMax ? searchQueryObj.priceRangeMax.toString() : ''
								}
								initialPriceMin={
									!!searchQueryObj.priceRangeMin ? searchQueryObj.priceRangeMin.toString() : ''
								}
								options={options}
								control={propertyType.get('propertyType')}
							/>
							<Label variant={'body1'} color={'red'}>
								{errorMessage}
							</Label>
							<Accordion
								hideHoverEffect
								hideChevron
								children={
									<RateCodeSelect
										apply={(value) => {
											setRateCode(value);
											updateSearchQueryObj('rateCode', value);
										}}
										code={rateCode}
										valid={!validCode}
									/>
								}
								titleReact={<Label variant={'button'}>toggle rate code</Label>}
							/>
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
									onClickApply: (
										startDate,
										endDate,
										adults,
										children,
										priceRangeMin,
										priceRangeMax,
										propertyTypeIds: number[]
									) => {
										popupSearch(
											startDate,
											endDate,
											adults,
											children,
											priceRangeMin,
											priceRangeMax,
											propertyTypeIds
										);
									},
									className: 'filterPopup',
									options: options,
									control: propertyType.get('propertyType'),
									onChangePropertyType: onChangePropertyType
								});
							}}
						/>
					)}

					<div className={'bottomBorderDiv'} />
				</Box>
				<Box
					className={'searchResultsWrapper'}
					bgcolor={'#ffffff'}
					width={size === 'small' ? '100%' : '1165px'}
					padding={size === 'small' ? '0 10px 20px' : '0 140px 60px'}
					boxSizing={'border-box'}
				>
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
							updateSearchQueryObj('pagination', { page: newPage, perPage: perPage });
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
