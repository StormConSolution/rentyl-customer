import React, { ReactText, useEffect, useState } from 'react';
import './ReservationAvailabilityPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Label from '@bit/redsky.framework.rs.label';
import serviceFactory from '../../services/serviceFactory';
import moment from 'moment';
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
import RegionService from '../../services/region/region.service';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import PointsOrLogin from '../../components/pointsOrLogin/PointsOrLogin';
import TopSearchBar from '../../components/topSearchBar/TopSearchBar';
import FilterBarV2 from '../../components/filterBar/FilterBarV2';

const ReservationAvailabilityPage: React.FC = () => {
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{
		startDate: string;
		endDate: string;
		adultCount: number;
		childCount: number;
		region: string;
		rateCode: string;
		priceRangeMax: string;
		priceRangeMin: string;
		propertyTypeIds: string;
	}>([
		{ key: 'startDate', default: '', type: 'string', alias: 'startDate' },
		{ key: 'endDate', default: '', type: 'string', alias: 'endDate' },
		{ key: 'adultCount', default: 2, type: 'integer', alias: 'adultCount' },
		{ key: 'childCount', default: 0, type: 'integer', alias: 'childCount' },
		{ key: 'region', default: '', type: 'string', alias: 'region' },
		{ key: 'rateCode', default: '', type: 'string', alias: 'rateCode' },
		{ key: 'priceRangeMax', default: '', type: 'string', alias: 'priceRangeMax' },
		{ key: 'priceRangeMin', default: '', type: 'string', alias: 'priceRangeMin' },
		{ key: 'propertyTypeIds', default: '', type: 'string', alias: 'propertyTypeIds' }
	]);
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const regionService = serviceFactory.get<RegionService>('RegionService');
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const recoilComparisonState = useRecoilState<Misc.ComparisonCardInfo[]>(globalState.destinationComparison);
	const perPage = 5;
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(0);
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(moment(new Date()));
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(moment(new Date()).add(2, 'days'));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [rateCode, setRateCode] = useRecoilState<string>(globalState.userRateCode);
	const [validCode, setValidCode] = useState<boolean>(true);
	const [accommodationToggle, setAccommodationToggle] = useState<boolean>(false);
	const [destinations, setDestinations] = useState<Api.Destination.Res.Availability[]>([]);
	const [regionOptions, setRegionOptions] = useState<OptionType[]>([]);
	const [propertyTypeOptions, setPropertyTypeOptions] = useState<OptionType[]>([]);
	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('propertyTypeIds', setPropertyTypeIds(), []),
			new RsFormControl('adultCount', params.adultCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Adults Required')
			]),
			new RsFormControl('bedroomCount', params.adultCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Bedrooms Required')
			]),
			new RsFormControl('bathroomCount', params.adultCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Bathrooms Required')
			]),
			new RsFormControl('priceRangeMax', StringUtils.addCommasToNumber(params.priceRangeMax), []),
			new RsFormControl('priceRangeMin', StringUtils.addCommasToNumber(params.priceRangeMin), []),
			new RsFormControl('accommodationType', [], [])
		])
	);
	const [searchQueryObj, setSearchQueryObj] = useState<Api.Destination.Req.Availability>({
		startDate: moment().format('YYYY-MM-DD'),
		endDate: moment().add(2, 'day').format('YYYY-MM-DD'),
		adultCount: params.adultCount || 2,
		childCount: params.childCount || 0,
		pagination: { page: 1, perPage: 5 }
	});

	useEffect(() => {
		async function getFilterOptions() {
			let regions: Api.Region.Res.Get[] = await regionService.getAllRegions();
			setRegionOptions(
				regions.map((region) => {
					return { value: region.id, label: region.name };
				})
			);
			if (params.region) {
				const region = regions.find((region) => region.name.toLowerCase() === params.region.toLowerCase());
				if (region) {
					const regionControl = filterForm.getClone('regions');
					regionControl.value = [region.id];
					setFilterForm(filterForm.clone().update(regionControl));
				}
			}
			let propertyTypes = await destinationService.getAllPropertyTypes();
			setPropertyTypeOptions(
				propertyTypes.map((propertyType) => {
					return { value: propertyType.id, label: propertyType.name };
				})
			);
		}
		getFilterOptions().catch(console.error);
	}, []);

	useEffect(() => {
		/**
		 * This useEffect grabs the current url params on first page load and sets the search Query Object.
		 */
		let urlParams: any = { ...params };
		setSearchQueryObj((pre) => {
			let createSearchQueryObj: any = { ...pre };
			for (let i in urlParams) {
				if (!!urlParams[i].toString().length) {
					if (i === 'region' || i === 'propertyTypeIds') {
						createSearchQueryObj[i] = convertUrlParamRegionOrPropertyType(urlParams[i]);
						continue;
					}
					createSearchQueryObj[i] = urlParams[i];
				}
			}
			return createSearchQueryObj;
		});
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
			if (!!newSearchQueryObj.priceRangeMin) {
				newSearchQueryObj.priceRangeMin *= 100;
			}
			if (!!newSearchQueryObj.priceRangeMax) {
				newSearchQueryObj.priceRangeMax *= 100;
			}
			if (!rateCode) {
				delete newSearchQueryObj.rateCode;
			} else {
				newSearchQueryObj.rateCode = rateCode;
			}
			updateParams(newSearchQueryObj);
			try {
				popupController.open(SpinningLoaderPopup);
				let res = await destinationService.searchAvailableReservations(newSearchQueryObj);
				setDestinations(res.data);
				setAvailabilityTotal(res.total || 0);
				setValidCode(rateCode === '' || (!!res.data && res.data.length > 0));
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find available reservations.'), 'Server Error');
				setValidCode(rateCode === '');
				popupController.close(SpinningLoaderPopup);
			}
		}

		getReservations().catch(console.error);
	}, [searchQueryObj]);

	function setPropertyTypeIds() {
		if (params.propertyTypeIds.length > 0) {
			let propertyTypeArray = params.propertyTypeIds.split(',');
			return propertyTypeArray.map((item) => {
				return parseInt(item);
			});
		}
		return [];
	}

	async function updateFilterForm(control: RsFormControl | undefined) {
		if (!control) return;
		if (control.key === 'priceRangeMax' || control.key === 'priceRangeMin') {
			let newValue = StringUtils.addCommasToNumber(StringUtils.removeAllExceptNumbers(control.value.toString()));
			control.value = newValue;
		}
		filterForm.update(control);
		let isFormValid = await filterForm.isValid();
		setValidCode(isFormValid);
		setFilterForm(filterForm.clone());
	}

	function saveFilter() {
		let filterObject: Misc.FilterFormPopupOptions = filterForm.toModel();
		popupSearch(
			filterObject.adultCount,
			StringUtils.removeAllExceptNumbers(filterObject.priceRangeMin),
			StringUtils.removeAllExceptNumbers(filterObject.priceRangeMax),
			filterObject.propertyTypeIds
		);
	}

	function convertUrlParamRegionOrPropertyType(numberString: string) {
		let regionOrPropertyTypeArray = numberString.split(',');
		return regionOrPropertyTypeArray.map((item: string) => {
			return parseInt(item);
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
			| 'regionIds'
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
			if (value === '' || value === undefined) delete createSearchQueryObj[key];
			else createSearchQueryObj[key] = value;
			if (key === 'regionIds' || key === 'propertyTypeIds') {
				if (!ObjectUtils.isArrayWithData(value)) delete createSearchQueryObj[key];
			}
			updateParams(createSearchQueryObj);
			return createSearchQueryObj;
		});
	}

	function updateParams(searchQueryObj: any) {
		let newUrlParams = { ...searchQueryObj };
		delete newUrlParams['pagination'];
		router.updateUrlParams(newUrlParams);
	}

	function popupSearch(adultCount: number, priceRangeMin: string, priceRangeMax: string, propertyTypeIds: number[]) {
		setSearchQueryObj((prev) => {
			let createSearchQueryObj: Api.Destination.Req.Availability = { ...prev };
			createSearchQueryObj['adultCount'] = adultCount;
			createSearchQueryObj['adultCount'] = adultCount;
			if (ObjectUtils.isArrayWithData(propertyTypeIds)) {
				createSearchQueryObj['propertyTypeIds'] = propertyTypeIds;
			} else delete createSearchQueryObj['regionIds'];

			if (rateCode !== '') createSearchQueryObj['rateCode'] = rateCode;
			else delete createSearchQueryObj['rateCode'];

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
			rateCode: rateCode,
			propertyTypeIds: propertyTypeIds.join(',')
		};

		for (let i in newUrlParams) {
			if (!newUrlParams[i].toString().length) {
				delete newUrlParams[i];
			}
		}

		router.updateUrlParams({
			...newUrlParams
		});
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
					unfilteredAccommodations={destination.accommodations}
					destinationDescription={destination.description}
					destinationName={destination.name}
					destinationFeatures={destination.features}
					address={StringUtils.buildAddressString(addressData)}
					picturePaths={urls}
					destinationDetailsPath={
						!!params.startDate && !!params.endDate
							? `/destination/details?di=${destination.id}&startDate=${params.startDate}&endDate=${params.endDate}`
							: `/destination/details?di=${destination.id}`
					}
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
							!!searchQueryObj.startDate && !!searchQueryObj.endDate
								? `&startDate=${searchQueryObj.startDate}&endDate=${searchQueryObj.endDate}`
								: '';
						router.navigate(`/accommodation/details?ai=${accommodationId}${dates}`).catch(console.error);
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
						if (rateCode) newRoom.rateCode = rateCode;
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
				<HeroImage
					className={'heroImage'}
					image={require('../../images/destinationResultsPage/momDaughterHero.jpg')}
					height={'200px'}
					mobileHeight={'100px'}
				/>

				<TopSearchBar
					onSearch={(data) => {
						console.log(data);
					}}
				/>
				<Box className={'pointsDisplay'}>
					<PointsOrLogin />
				</Box>
				<Box
					className={'filterResultsWrapper'}
					bgcolor={'#ffffff'}
					padding={size === 'small' ? '0px 30px 20px 10px' : '20px 0 60px 0'}
					boxSizing={'border-box'}
				>
					{size !== 'small' ? (
						<>
							<FilterBarV2
								filterForm={filterForm}
								updateFilterForm={updateFilterForm}
								destinationService={destinationService}
								accommodationToggle={accommodationToggle}
								accommodationList={propertyTypeOptions}
								redeemCodeToggle={false}
								onApplyClick={saveFilter}
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
									onClickApply: (adults, priceRangeMin, priceRangeMax, propertyTypeIds) => {
										popupSearch(adults, priceRangeMin, priceRangeMax, propertyTypeIds);
									},
									className: 'filterPopup'
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
