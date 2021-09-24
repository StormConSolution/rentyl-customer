import React, { useEffect, useState } from 'react';
import './EditFlowModifyRoomPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import moment from 'moment';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import serviceFactory from '../../services/serviceFactory';
import { DateUtils, formatFilterDateForServer, WebUtils } from '../../utils/utils';
import FilterBar from '../../components/filterBar/FilterBar';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import AccommodationSearchResultCard from '../../components/accommodationSearchResultCard/AccommodationSearchResultCard';
import FilterReservationPopup, {
	FilterReservationPopupProps
} from '../../popups/filterReservationPopup/FilterReservationPopup';
import IconLabel from '../../components/iconLabel/IconLabel';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import ReservationsService from '../../services/reservations/reservations.service';
import ConfirmChangeRoomPopup, {
	ConfirmChangeRoomPopupProps
} from '../../popups/confirmChangeRoomPopup/ConfirmChangeRoomPopup';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import AccommodationService from '../../services/accommodation/accommodation.service';
import DestinationService from '../../services/destination/destination.service';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';

const EditFlowModifyRoomPage = () => {
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ reservationId: number; destinationId: number }>([
		{ key: 'ri', default: 0, type: 'integer', alias: 'reservationId' },
		{ key: 'di', default: 0, type: 'integer', alias: 'destinationId' }
	]);
	let reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const perPage = 5;
	const [page, setPage] = useState<number>(1);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(5);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [reservation, setReservation] = useState<Api.Reservation.Res.Get>();
	const [destinations, setDestinations] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(null);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(null);
	const [options, setOptions] = useState<OptionType[]>([]);
	const [propertyType, setPropertyType] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('propertyType', [], [])])
	);
	const [searchQueryObj, setSearchQueryObj] = useState<Api.Accommodation.Req.Availability>({
		startDate: moment(reservation?.arrivalDate).format('YYYY-MM-DD'),
		endDate: !!reservation
			? moment(reservation.departureDate).format('YYYY-MM-DD')
			: moment().add(2, 'day').format('YYYY-MM-DD'),
		adults: reservation?.adultCount || 1,
		children: reservation?.childCount || 0,
		pagination: { page: 1, perPage: 5 },
		destinationId: params.destinationId
	});

	useEffect(() => {
		async function getReservationData(id: number) {
			try {
				let res = await reservationsService.get(id);
				setReservation(res);
				updateSearchQueryObj('rateCode', res.rateCode);
				onDatesChange(
					moment(DateUtils.displayUserDate(res.arrivalDate)),
					moment(DateUtils.displayUserDate(res.departureDate))
				);
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find reservation.'), 'Server Error');
				router.navigate('/reservations').catch(console.error);
			}
		}
		getReservationData(params.reservationId).catch(console.error);
	}, []);

	useEffect(() => {
		async function getReservations() {
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
				if (newSearchQueryObj.rateCode === '' || newSearchQueryObj.rateCode === undefined)
					delete newSearchQueryObj.rateCode;
				let res = await accommodationService.availability(newSearchQueryObj);
				setAvailabilityTotal(res.total || 0);
				setDestinations(res.data);
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get available accommodations.'),
					'Server Error'
				);
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

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDateControl(startDate);
		setEndDateControl(endDate);
		updateSearchQueryObj('startDate', formatFilterDateForServer(startDate, 'start'));
		updateSearchQueryObj('endDate', formatFilterDateForServer(endDate, 'end'));
	}

	function updateSearchQueryObj(
		key:
			| 'startDate'
			| 'endDate'
			| 'adults'
			| 'children'
			| 'priceRangeMin'
			| 'priceRangeMax'
			| 'pagination'
			| 'rateCode'
			| 'propertyTypeIds',
		value: any
	) {
		if (key === 'adults' && value === 0)
			throw rsToastify.error('There must be at least one adult.', 'Missing or Incorrect Information');
		if (key === 'adults' && isNaN(value))
			throw rsToastify.error('# of adults must be a number', 'Missing or Incorrect Information');
		if (key === 'children' && isNaN(value))
			throw rsToastify.error('# of children must be a number', 'Missing or Incorrect Information');
		if (key === 'priceRangeMin' && isNaN(value))
			throw rsToastify.error('Price min must be a number', 'Missing or Incorrect Information');
		if (key === 'priceRangeMax' && isNaN(value))
			throw rsToastify.error('Price max must be a number', 'Missing or Incorrect Information');
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
		adults: string,
		children: string,
		priceRangeMin: string,
		priceRangeMax: string,
		propertyTypeIds: number[],
		rateCode: string
	) {
		setSearchQueryObj((prev) => {
			let createSearchQueryObj: any = { ...prev };
			createSearchQueryObj['startDate'] = formatFilterDateForServer(checkinDate, 'start');
			createSearchQueryObj['endDate'] = formatFilterDateForServer(checkoutDate, 'end');
			createSearchQueryObj['adults'] = parseInt(adults);
			if (children !== '') {
				createSearchQueryObj['children'] = parseInt(children);
			}
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMin'] = parseInt(priceRangeMin);
			}
			if (priceRangeMax !== '') {
				createSearchQueryObj['priceRangeMax'] = parseInt(priceRangeMax);
			}
			if (propertyTypeIds.length >= 1) {
				createSearchQueryObj['propertyTypeIds'] = propertyTypeIds;
			} else {
				delete createSearchQueryObj['propertyTypeIds'];
			}
			if (rateCode !== '' || rateCode !== undefined) {
				createSearchQueryObj['rateCode'] = reservation?.rateCode;
			}
			return createSearchQueryObj;
		});
	}

	function getImageUrls(
		destination: Api.Accommodation.Res.Availability | Api.Reservation.AccommodationDetails
	): string[] {
		if (destination.media) {
			return destination.media.map((urlObj) => {
				return urlObj.urls.imageKit?.toString() || '';
			});
		}
		return [];
	}

	async function bookNow(id: number) {
		if (reservation) {
			popupController.open(SpinningLoaderPopup);
			let stay: Api.Reservation.Req.Update = {
				id: reservation.id,
				paymentMethodId: reservation.paymentMethod?.id,
				guest: reservation.guest,
				accommodationId: id,
				adultCount: Number(searchQueryObj.adults),
				childCount: Number(searchQueryObj.children),
				arrivalDate: moment(searchQueryObj.startDate).format('YYYY-MM-DD'),
				departureDate: moment(searchQueryObj.endDate).format('YYYY-MM-DD'),
				numberOfAccommodations: 1,
				rateCode: searchQueryObj.rateCode
			};
			try {
				await reservationsService.updateReservation(stay);
				router.navigate(`/reservations`).catch(console.error);
				popupController.closeAll();
			} catch (e) {
				popupController.closeAll();
				setErrorMessage(e.message);
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Cannot get details for this destination.'),
					'Server Error'
				);
			}
		}
	}

	function renderDestinationSearchResultCards() {
		if (!destinations) return;
		return destinations.map((destination, index) => {
			let urls: string[] = getImageUrls(destination);
			return (
				<>
					<AccommodationSearchResultCard
						key={index}
						id={destination.id}
						name={destination.name}
						maxSleeps={destination.maxSleeps}
						squareFeet={2500}
						description={destination.longDescription}
						ratePerNightInCents={destination.costPerNightCents}
						pointsRatePerNight={destination.pointsPerNight}
						amenityIconNames={destination.featureIcons}
						pointsEarnable={destination.pointsEarned}
						hideButtons={true}
						roomStats={[
							{
								label: 'Sleeps',
								datum: destination.maxSleeps
							},
							{
								label: 'Max Occupancy',
								datum: destination.maxOccupantCount
							},
							{
								label: 'ADA Compliant',
								datum: destination.adaCompliant ? 'Yes' : 'No'
							},
							{
								label: 'Extra Bed',
								datum: destination.extraBeds ? 'Yes' : 'No'
							}
						]}
						onBookNowClick={() => {
							popupController.open<ConfirmChangeRoomPopupProps>(ConfirmChangeRoomPopup, {
								onUpdateRoomClick: () => bookNow(destination.id)
							});
						}}
						carouselImagePaths={urls}
					/>
					<hr />
				</>
			);
		});
	}

	function getReservationCostPerNight(): number {
		if (!reservation) return 0;
		let costPerNightAvg: number = 0;
		Object.keys(reservation.priceDetail.accommodationDailyCostsInCents).forEach((item) => {
			costPerNightAvg += reservation.priceDetail.accommodationDailyCostsInCents[item];
		});
		return costPerNightAvg / Object.keys(reservation.priceDetail.accommodationDailyCostsInCents).length;
	}

	function onChangePropertyType(control: RsFormControl) {
		setPropertyType(propertyType.clone().update(control));
	}

	return (
		<Page className={'rsEditFlowModifyRoomPage'}>
			<div className={'rs-page-content-wrapper'}>
				{!!reservation && (
					<>
						<Label className={'filterLabel'} variant={'h1'} mb={20}>
							Current Room/Property
						</Label>
						<Label className={'error'} color={'red'} variant={'h4'}>
							{errorMessage}
						</Label>
						<hr />
						<AccommodationSearchResultCard
							currentRoom={true}
							id={reservation.destination.id}
							name={reservation.accommodation.name}
							maxSleeps={reservation.accommodation.maxSleeps}
							squareFeet={2500}
							description={reservation.accommodation.longDescription}
							ratePerNightInCents={getReservationCostPerNight()}
							pointsRatePerNight={0}
							hideButtons={true}
							roomStats={[
								{
									label: 'Sleeps',
									datum: reservation.accommodation.maxSleeps
								},
								{
									label: 'Max Occupancy',
									datum: reservation.accommodation.maxOccupantCount
								},
								{
									label: 'ADA Compliant',
									datum: reservation.accommodation.adaCompliant === 1 ? 'Yes' : 'No'
								},
								{
									label: 'Extra Bed',
									datum: reservation.accommodation.extraBed ? 'Yes' : 'No'
								}
							]}
							carouselImagePaths={getImageUrls(reservation.accommodation)}
							amenityIconNames={reservation.accommodation.featureIcons}
							onBookNowClick={() => {
								router.navigate(
									`/reservations/itinerary/reservation/details?ri=${params.reservationId}`
								);
							}}
							pointsEarnable={0}
						/>
						<hr />
					</>
				)}
				<Label className={'filterLabel'} variant={'h1'} mb={20}>
					Filter by
				</Label>

				{size === 'small' ? (
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
									propertyTypeIds,
									rateCode
								) => {
									popupSearch(
										startDate,
										endDate,
										adults,
										children,
										priceRangeMin,
										priceRangeMax,
										propertyTypeIds,
										rateCode
									);
								},
								className: 'filterPopup',
								options: options,
								control: propertyType.get('propertyType'),
								onChangePropertyType: onChangePropertyType
							});
						}}
					/>
				) : (
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
								if (value === '') value = 0;
								updateSearchQueryObj('adults', value);
							}}
							onChangeChildren={(value) => {
								if (value !== '') updateSearchQueryObj('children', value);
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
							adultsInitialInput={searchQueryObj.adults.toString()}
							childrenInitialInput={searchQueryObj.children.toString()}
							initialPriceMax={
								!!searchQueryObj.priceRangeMax ? searchQueryObj.priceRangeMax.toString() : ''
							}
							initialPriceMin={
								!!searchQueryObj.priceRangeMin ? searchQueryObj.priceRangeMin.toString() : ''
							}
							options={options}
							control={propertyType.get('propertyType')}
						/>
					</>
				)}
				<Box
					className={'filterResultsWrapper'}
					bgcolor={'#ffffff'}
					width={size === 'small' ? '100%' : '1165px'}
					margin={'85px auto'}
					boxSizing={'border-box'}
				>
					{destinations.length <= 0 ? (
						<Label variant={'h2'}>No available options.</Label>
					) : (
						renderDestinationSearchResultCards()
					)}
				</Box>
				<PaginationButtons
					selectedRowsPerPage={perPage}
					currentPageNumber={page}
					setSelectedPage={(newPage) => {
						updateSearchQueryObj('pagination', { page: newPage, perPage: perPage });
						setPage(newPage);
					}}
					total={availabilityTotal}
				/>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default EditFlowModifyRoomPage;
