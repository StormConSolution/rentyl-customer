import React, { useEffect, useState } from 'react';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import moment from 'moment';
import FilterBar from '../../../components/filterBar/FilterBar';
import IconLabel from '../../../components/iconLabel/IconLabel';
import RateCodeSelect from '../../../components/rateCodeSelect/RateCodeSelect';
import useWindowResizeChange from '../../../customHooks/useWindowResizeChange';
import serviceFactory from '../../../services/serviceFactory';
import DestinationService from '../../../services/destination/destination.service';
import { useRecoilValue } from 'recoil';
import globalState from '../../../models/globalState';
import rsToasts from '@bit/redsky.framework.toast';
import AccommodationSearchResultCard from '../../../components/accommodationSearchResultCard/AccommodationSearchResultCard';
import AccommodationFeatures = Model.AccommodationFeatures;

interface BookingAvailabilityProps {
	destinationId: number;
	startDate: moment.Moment;
	endDate: moment.Moment;
	adults: number;
	children: number;
	rateCode?: string;
}
const BookingAvailability: React.FC<BookingAvailabilityProps> = (props) => {
	const size = useWindowResizeChange();
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const [waitToLoad, setWaitToLoad] = useState<boolean>(false);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [startDate, setStartDate] = useState<moment.Moment>(props.startDate);
	const [endDate, setEndDate] = useState<moment.Moment>(props.endDate);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(0);
	const [destinations, setDestinations] = useState<Api.Accommodation.Res.Availability[]>([]);
	const [showRateCode, setShowRateCode] = useState<boolean>(false);
	const [searchQueryObj, setSearchQueryObj] = useState<Api.Accommodation.Req.Availability>({
		startDate: props.startDate.format('YYYY-MM-DD'),
		endDate: props.endDate.format('YYYY-MM-DD'),
		adults: props.adults,
		children: props.children,
		pagination: { page: 1, perPage: 5 },
		destinationId: props.destinationId
	});
	const [rateCode, setRateCode] = useState<string>(props.rateCode ? props.rateCode : '');

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

	function onDatesChange(start: moment.Moment | null, end: moment.Moment | null) {
		setStartDate(start ? start : moment());
		setEndDate(end ? end : moment());
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

	function getAccommodationList(destination: Api.Accommodation.Res.Availability) {
		// return destination.accommodations.map((accommodationDetails) => {
		// 	let amenityIconNames: string[] = getAmenityIconNames(accommodationDetails.features);
		// 	return {
		// 		id: accommodationDetails.id,
		// 		name: accommodationDetails.name,
		// 		amenityIconNames: amenityIconNames,
		// 		bedrooms: accommodationDetails.roomCount,
		// 		beds: accommodationDetails.bedDetails.length,
		// 		ratePerNight: 0,
		// 		pointsPerNight: 0
		// 	};
		// });
	}

	function getSummaryTabs(destination: Api.Accommodation.Res.Availability) {
		let accommodationsList = getAccommodationList(destination);
		return [
			{ label: 'Overview', content: { text: '' } },
			{ label: 'Available Suites', content: { text: '' } }
		];
		// return [
		// 	{ label: 'Overview', content: { text: ''} },
		// 	{
		// 		label: 'Available Suites',
		// 		content: {
		// 			accommodationType: 'Suites',
		// 			accommodations: accommodationsList,
		// 			onDetailsClick: (accommodationId: number) => {
		// 				router.navigate(`/accommodation/details?ai=${accommodationId}`).catch(console.error);
		// 			},
		// 			onBookNowClick(accommodationId: number
		// 				let data: any = {...searchQueryObj};
		// 				data.accommodationId = accommodationId;
		// 				data.arrivalDate = data.startDate;
		// 				data.departureDate = data.endDate;
		// 				data.destinationId = destination.id;
		// 				delete data.pagination;
		// 				delete data.startDate;
		// 				delete data.endDate;
		// 				data = JSON.stringify(data);
		//
		// 				if (!user) {
		// 					popupController.open<LoginOrCreateAccountPopupProps>(LoginOrCreateAccountPopup, {
		// 						query: data
		// 					});
		// 				} else {
		// 					router.navigate(`/booking?data=${data}`).catch(console.error);
		// 				}
		// 			}
		// 		}
		// 	}
		// ];
	}

	function getAmenityIconNames(features: AccommodationFeatures[]): string[] {
		return features.map((feature) => {
			return feature.icon;
		});
	}

	function getImageUrls(destination: Api.Accommodation.Res.Availability): string[] {
		if (destination.media) {
			return destination.media.map((urlObj) => {
				return urlObj.urls.large.toString();
			});
		}
		return [];
	}

	function renderDestinationSearchResultCards() {
		if (!destinations) return;
		return destinations.map((destination, index) => {
			let urls: string[] = getImageUrls(destination);
			let summaryTabs = getSummaryTabs(destination);
			return (
				<AccommodationSearchResultCard
					key={index}
					id={destination.id}
					name={destination.name}
					accommodationType={''}
					maxSleeps={4}
					squareFeet={2500}
					description={'some description here'}
					ratePerNightInCents={50}
					pointsRatePerNight={100}
					amenityIconNames={['as', 'bc']}
					pointsEarnable={12}
					roomStats={[]}
					onBookNowClick={() => {}}
					onCompareClick={() => {}}
					onViewDetailsClick={() => {}}
					carouselImagePaths={['ab', 'cd']}
				/>
			);
		});
	}

	return (
		<Box>
			<Label variant={'h1'}>Filter by</Label>
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
					{/*{showRateCode && (*/}
					{/*	<RateCodeSelect*/}
					{/*		apply={(value) => {*/}
					{/*			setRateCode(value);*/}
					{/*			updateSearchQueryObj('rate', value);*/}
					{/*			setShowRateCode(false);*/}
					{/*		}}*/}
					{/*		code={rateCode}*/}
					{/*		valid={true}*/}
					{/*	/>*/}
					{/*)}*/}
				</Box>
				{renderDestinationSearchResultCards()}
			</Box>
		</Box>
	);
};

export default BookingAvailability;
