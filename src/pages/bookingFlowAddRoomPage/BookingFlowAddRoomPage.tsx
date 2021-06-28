import React, { useEffect, useState } from 'react';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import moment from 'moment';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import DestinationService from '../../services/destination/destination.service';
import serviceFactory from '../../services/serviceFactory';
import rsToasts from '@bit/redsky.framework.toast';
import { formatFilterDateForServer } from '../../utils/utils';
import FilterBar from '../../components/filterBar/FilterBar';
import IconLabel from '../../components/iconLabel/IconLabel';
import RateCodeSelect from '../../components/rateCodeSelect/RateCodeSelect';
import SearchResultCard from './searchResultCard/SearchResultCard';
import LoginOrCreateAccountPopup, {
	LoginOrCreateAccountPopupProps
} from '../../popups/loginOrCreateAccountPopup/LoginOrCreateAccountPopup';

interface AccommodationFeatures {
	id: number;
	title: string;
	icon: string;
}

interface BookingAvailabilityProps {
	destinationId: number;
	startDate: moment.Moment;
	endDate: moment.Moment;
	adults: number;
	children: number;
	rateCode?: string;
	bookNow: (data: Api.Reservation.Req.Verification) => void;
}

const BookingFlowAddRoomPage = () => {
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);

	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');

	const [waitToLoad, setWaitToLoad] = useState<boolean>(false);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [destinations, setDestinations] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [searchQueryObj, setSearchQueryObj] = useState<Api.Accommodation.Req.Availability>({
		startDate: moment(params.data.stays[0].arrivalDate).format('YYYY-MM-DD'),
		endDate: moment(params.data.stays[0].departureDate).format('YYYY-MM-DD'),
		adults: params.data.stays[0].adults,
		children: params.data.stays[0].children,
		pagination: { page: 1, perPage: 5 },
		destinationId: params.data.destinationId,
		rate: params.data.stays[0].rateCode
	});
	const [showRateCode, setShowRateCode] = useState<boolean>(false);
	const [rateCode, setRateCode] = useState<string>(params.data.stays[0].rate);

	useEffect(() => {
		async function getReservations() {
			try {
				let res = await destinationService.searchAvailableAccommodationsByDestination(searchQueryObj);
				setDestinations(res);
			} catch (e) {
				rsToasts.error('An unexpected error has occurred on the server.');
			}
			setWaitToLoad(false);
		}
		getReservations().catch(console.error);
	}, [searchQueryObj]);

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
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
			| 'rate',
		value: any
	) {
		if (key === 'adults' && value === 0) throw rsToasts.error('There must be at least one adult.');
		if (key === 'adults' && isNaN(value)) throw rsToasts.error('# of adults must be a number');
		if (key === 'children' && isNaN(value)) throw rsToasts.error('# of children must be a number');
		if (key === 'priceRangeMin' && isNaN(value)) throw rsToasts.error('Price min must be a number');
		if (key === 'priceRangeMax' && isNaN(value)) throw rsToasts.error('Price max must be a number');
		setSearchQueryObj((prev) => {
			let createSearchQueryObj: any = { ...prev };
			if (value === '') delete createSearchQueryObj[key];
			else createSearchQueryObj[key] = value;
			return createSearchQueryObj;
		});
	}

	function getImageUrls(destination: Api.Accommodation.Res.Availability): string[] {
		if (destination.media) {
			return destination.media.map((urlObj) => {
				return urlObj.urls.large?.toString() || '';
			});
		}
		return [];
	}

	function bookNow(id: number) {
		let data = JSON.stringify({
			destinationId: params.data.destinationId,
			stays: params.data.stays,
			newRoom: {
				adults: searchQueryObj.adults,
				children: searchQueryObj.children,
				rate: searchQueryObj.rate,
				accommodationId: id,
				arrivalDate: searchQueryObj.startDate,
				departureDate: searchQueryObj.endDate
			}
		});
		router.navigate(`/booking/packages?data=${data}`).catch(console.error);
	}

	function renderDestinationSearchResultCards() {
		if (!destinations) return;
		return destinations.map((destination, index) => {
			let urls: string[] = getImageUrls(destination);
			return (
				<SearchResultCard
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
						bookNow(destination.id);
					}}
					carouselImagePaths={urls}
				/>
			);
		});
	}

	return (
		<Page>
			<div className={'rs-page-content-wrapper'}>
				<Box
					className={'filterResultsWrapper'}
					bgcolor={'#ffffff'}
					width={size === 'small' ? '100%' : '1165px'}
					padding={size === 'small' ? '20px 30px' : '60px 140px'}
					boxSizing={'border-box'}
				>
					<Label className={'filterLabel'} variant={'h1'}>
						Filter by
					</Label>

					<FilterBar
						className={'filterBar'}
						startDate={moment(searchQueryObj.startDate)}
						endDate={moment(searchQueryObj.endDate)}
						onDatesChange={onDatesChange}
						focusedInput={focusedInput}
						onFocusChange={setFocusedInput}
						monthsToShow={2}
						onChangeAdults={(value) => {
							if (value === '') value = 0;
							updateSearchQueryObj('adults', parseInt(value));
						}}
						onChangeChildren={(value) => {
							if (value !== '') updateSearchQueryObj('children', parseInt(value));
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
						adultsInitialInput={searchQueryObj.adults.toString()}
						childrenInitialInput={searchQueryObj.children.toString()}
						initialPriceMax={!!searchQueryObj.priceRangeMax ? searchQueryObj.priceRangeMax.toString() : ''}
						initialPriceMin={!!searchQueryObj.priceRangeMin ? searchQueryObj.priceRangeMin.toString() : ''}
					/>
					<Box>
						<IconLabel
							labelName={'toggle rate code'}
							iconImg={!showRateCode ? 'icon-chevron-down' : 'icon-chevron-up'}
							iconPosition={'right'}
							iconSize={16}
							onClick={() => setShowRateCode(!showRateCode)}
						/>
						{showRateCode && (
							<RateCodeSelect
								apply={(value) => {
									setRateCode(value);
									updateSearchQueryObj('rate', value);
									setShowRateCode(false);
								}}
								code={rateCode}
								valid={false}
							/>
						)}
					</Box>
					<hr />
					{renderDestinationSearchResultCards()}
				</Box>
			</div>
		</Page>
	);
};

export default BookingFlowAddRoomPage;
