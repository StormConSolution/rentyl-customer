import React, { useState } from 'react';
import './ReservationSearchPage.scss';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import FilterBar from '../../components/filterBar/FilterBar';
import Label from '@bit/redsky.framework.rs.label';
import rsToasts from '@bit/redsky.framework.toast';
import ReservationsService from '../../services/reservations/reservations.service';
import serviceFactory from '../../services/serviceFactory';
import moment from 'moment';
import { RsFormControl } from '@bit/redsky.framework.rs.form';
import Box from '../../components/box/Box';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { addCommasToNumber } from '../../utils/utils';
import FilterReservationPopup, {
	FilterReservationPopupProps
} from '../../popups/filterReservationPopup/FilterReservationPopup';
import IconLabel from '../../components/iconLabel/IconLabel';
import DestinationSearchResultCard from '../../components/destinationSearchResultCard/DestinationSearchResultCard';

const ReservationSearchPage: React.FC = () => {
	const size = useWindowResizeChange();
	let reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [checkInDate, setCheckInDate] = useState<moment.Moment | null>(moment());
	const [checkOutDate, setCheckOutDate] = useState<moment.Moment | null>(moment().add(7, 'd'));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	//const [popupFocusedInput, setPopupFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [accommodations, setAccommodations] = useState<Redis.Availability>();
	const [numberOfAdults, setNumberOfAdults] = useState<number>(1);
	const [numberOfAdultsControl] = useState<RsFormControl>(new RsFormControl('numberOfAdults', numberOfAdults));
	const updateNumberOfAdults = (input: RsFormControl) => {
		let newNumber = parseInt(input.value.toString());
		if (isNaN(newNumber) || newNumber < 1) newNumber = 1;
		setNumberOfAdults(newNumber);
		(document.querySelector('.numberOfGuests > input') as HTMLInputElement).value = newNumber.toString();
	};
	const [priceMin, setPriceMin] = useState<string>('');
	const [priceMinControl] = useState<RsFormControl>(new RsFormControl('priceMin', priceMin));
	const updatePriceMin = (input: RsFormControl) => {
		setPriceMin(input.value.toString());
		let formattedNum = addCommasToNumber(('' + input.value).replace(/\D/g, ''));
		if (size === 'small') {
			(document.querySelector(
				'.rsFilterReservationPopup .priceMin > input'
			) as HTMLInputElement).value = formattedNum;
		}
		(document.querySelector('.priceMin > input') as HTMLInputElement).value = formattedNum;
	};
	const [priceMax, setPriceMax] = useState<string>('');
	const [priceMaxControl] = useState<RsFormControl>(new RsFormControl('priceMax', priceMax));
	const updatePriceMax = (input: RsFormControl) => {
		setPriceMax(input.value.toString());
		let formattedNum = addCommasToNumber(('' + input.value).replace(/\D/g, ''));
		if (size === 'small') {
			(document.querySelector(
				'.rsFilterReservationPopup .priceMax > input'
			) as HTMLInputElement).value = formattedNum;
		}
		(document.querySelector('.priceMax > input') as HTMLInputElement).value = formattedNum;
	};

	let data: Api.Reservation.Req.Availability = {
		startDate: new Date('2021-03-20'),
		endDate: new Date('2021-03-22'),
		adults: 1
	};

	async function getReservations() {
		try {
			let res = await reservationService.searchAvailableReservations(data);
			console.log('res', res.data.data);
			setAccommodations(res.data.data[0].accommodations);
		} catch (e) {
			rsToasts.error('An unexpected error has occurred on the server.');
		}
	}

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setCheckInDate(startDate);
		setCheckOutDate(endDate);
	}

	return (
		<Page className={'rsReservationSearchPage'}>
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
									getReservations().catch(console.error);
								},
								numberOfAdultsControl: numberOfAdultsControl,
								numberOfAdultsUpdateControl: (updateControl) => updateNumberOfAdults(updateControl),
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
					{/*{renderDestinationSearchResultCards()}*/}
					<DestinationSearchResultCard
						destinationName={'test Name'}
						address={'Orlando, FL'}
						logoImagePath={'../../images/landingPage/travel2x.png'}
						picturePaths={[`../../images/landingPage/travel2x.png`]}
						starRating={4.5}
						reviewPath={''}
						destinationDetailsPath={''}
						summaryTabs={[
							{ label: 'Overview', content: 'Long description. Located next to ....' },
							{ label: 'Available Suites', content: '' },
							{ label: 'Available Villas', content: '' }
						]}
						onAddCompareClick={() => {}}
					/>
					<DestinationSearchResultCard
						destinationName={'Resort Name'}
						address={'Orlando, FL'}
						logoImagePath={'../../images/landingPage/travel2x.png'}
						picturePaths={[`../../images/landingPage/travel2x.png`]}
						starRating={4.5}
						reviewPath={''}
						destinationDetailsPath={''}
						summaryTabs={[
							{ label: 'Overview', content: 'Long description. Located next to ....' },
							{ label: 'Available Suites', content: '' },
							{ label: 'Available Villas', content: '' }
						]}
						onAddCompareClick={() => {}}
					/>
				</Box>
			</div>
		</Page>
	);
};

export default ReservationSearchPage;
