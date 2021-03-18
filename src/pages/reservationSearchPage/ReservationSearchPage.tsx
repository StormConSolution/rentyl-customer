import React, { useEffect, useState } from 'react';
import './ReservationSearchPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import FilterBar from '../../components/filterBar/FilterBar';
import { SelectOptions } from '../../components/Select/Select';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../../components/paper/Paper';
import rsToasts from '@bit/redsky.framework.toast';
import ReservationsService from '../../services/reservations/reservations.service';
import serviceFactory from '../../services/serviceFactory';
import moment from 'moment';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import Box from '../../components/box/Box';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

const ReservationSearchPage: React.FC = () => {
	const size = useWindowResizeChange();
	let reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [selectOptions, setSelectOptions] = useState<SelectOptions[]>([]);
	const [checkInDate, setCheckInDate] = useState<moment.Moment | null>(null);
	const [checkOutDate, setCheckOutDate] = useState<moment.Moment | null>(null);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
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
		(document.querySelector('.priceMin > input') as HTMLInputElement).value = input.value.toString();
	};

	const [priceMax, setPriceMax] = useState<string>('');
	const [priceMaxControl] = useState<RsFormControl>(new RsFormControl('priceMax', priceMax));
	const updatePriceMax = (input: RsFormControl) => {
		setPriceMax(input.value.toString());
		(document.querySelector('.priceMax > input') as HTMLInputElement).value = input.value.toString();
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
						onFocusChange={(focusedInput) => {
							setFocusedInput(focusedInput);
						}}
						monthsToShow={2}
						numberOfAdultsControl={numberOfAdultsControl}
						numberOfAdultsUpdateControl={(updateControl) => updateNumberOfAdults(updateControl)}
						priceMinControl={priceMinControl}
						priceMinUpdateControl={(updateControl) => updatePriceMin(updateControl)}
						priceMaxControl={priceMaxControl}
						priceMaxUpdateControl={(updateControl) => updatePriceMax(updateControl)}
					/>

					{/*{renderAccommodationSearchResultCards()}*/}
					{/*<AccommodationSearchResultCard
						id={1}
						name={'test Name'}
						accommodationType={'test'}
						bedrooms={2}
						squareFeet={1}
						description={'test description'}
						ratePerNightInCents={200}
						pointsRatePerNight={200}
						pointsEarnable={200}
						starRating={4.5}
						roomStats={[{label: 'label', datum: 'datum'}]}
						carouselImagePaths={[`../../images/landingPage/travel2x.png`]}
						amenityIconNames={['icon-laundry']}
						onBookNowClick={() => {}}
						onCompareClick={() => {}}
						onViewDetailsClick={() => {}}
					/>*/}
				</Box>
			</div>
		</Page>
	);
};

export default ReservationSearchPage;
