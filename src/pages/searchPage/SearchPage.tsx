import React, { useEffect, useState } from 'react';
import './SearchPage.scss';
import Box from '../../components/box/Box';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import Button from '@bit/redsky.framework.rs.button';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import Input from '@bit/redsky.framework.rs.input';
import rsToasts from '@bit/redsky.framework.toast';
import ReservationsService from '../../services/reservations/reservations.service';
import serviceFactory from '../../services/serviceFactory';

const form = new RsFormGroup([
	new RsFormControl('adults', '', [
		new RsValidator(RsValidatorEnum.REQ, 'Number of adults is required'),
		new RsValidator(RsValidatorEnum.NUM, 'Must be a number')
	]),
	new RsFormControl('children', '', [new RsValidator(RsValidatorEnum.NUM, '')]),
	new RsFormControl('priceRangeMin', '', [new RsValidator(RsValidatorEnum.NUM, '')]),
	new RsFormControl('priceRangeMax', '', [new RsValidator(RsValidatorEnum.NUM, '')])
]);

const SearchPage: React.FC = () => {
	let reservationService: ReservationsService = serviceFactory.get<ReservationsService>('ReservationsService');

	let momentObj = moment();
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(momentObj);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(null);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [availableReservations, setAvailableReservations] = useState<Api.Reservation.Res.Availability>();

	useEffect(() => {
		console.log(availableReservations);
	}, [availableReservations]);

	function onDatesChange(calendarStartDate: moment.Moment | null, calendarEndDate: moment.Moment | null) {
		setStartDateControl(calendarStartDate);
		setEndDateControl(calendarEndDate);
	}

	function updateHandler(control: RsFormControl) {
		form.update(control);
	}

	async function submit() {
		if (!(await form.isValid())) throw rsToasts.error('Missing data');
		if (!startDateControl) throw rsToasts.error('Missing data');
		if (!endDateControl) throw rsToasts.error('Missing data');
		let data: Api.Reservation.Req.Availability = form.toModel();
		data.startDate = startDateControl.format();
		data.endDate = endDateControl.format();
		if (!data.children) delete data.children;
		if (!data.priceRangeMax) delete data.priceRangeMax;
		if (!data.priceRangeMin) delete data.priceRangeMin;
		console.log(data);
		try {
			let response = await reservationService.searchAvailableReservations(data);
			setAvailableReservations(response.data.data);
		} catch (e) {
			console.log(e);
		}
	}

	function renderReservations() {
		if (!availableReservations || !availableReservations.accommodations) return;
		return availableReservations.accommodations.map((item, index) => {
			return (
				<Box key={index}>
					<h1>{item.name}</h1>
					<h3>Code: {item.code}</h3>
					<h3>Status: {item.status}</h3>
					<h3>Max Occupancy: {item.maxOccupancy}</h3>
					<h3>Max Sleeps: {item.maxSleeps}</h3>
					<h3>Room Class: {item.roomClass}</h3>
					<h3>ADA Compliant: {item.adaCompliant}</h3>
					<h3>Total Cost: {item.price[0].total}</h3>
					<h3>Currency Code: {item.price[0].currencyCode}</h3>
					<h3>Quantity Available: {item.price[0].qtyAvailable}</h3>
				</Box>
			);
		});
	}

	return (
		<Page className="rsSearchPage">
			<Box className="searchTitleBar" display={'flex'}>
				<Label className="spireLabel" variant={'h4'}>
					SPIRE
				</Label>
			</Box>

			<Box className="filters" display={'flex'}>
				<Box className="filterBox" display={'flex'}>
					<Label className="filterBy" variant={'h5'}>
						Filter By
					</Label>
				</Box>
				<form>
					<input className="startDateInput" type="date" hidden={true} />
					<Box className="filterInputs" display={'flex'}>
						<Box className="datePicker" display={'flex'}>
							<DateRangePicker
								startDate={startDateControl}
								startDateId="startDate"
								endDate={endDateControl}
								endDateId="endDate"
								onDatesChange={({ startDate, endDate }) => onDatesChange(startDate, endDate)}
								focusedInput={focusedInput}
								onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
							/>
						</Box>
						<Box className="adults" display={'flex'}>
							<Label className="adultsLabel">number of adults</Label>
							<Input
								className="adultsInput"
								placeholder="number of adults"
								type={'number'}
								look={'filled'}
								control={form.get('adults')}
								updateControl={updateHandler}
							/>
						</Box>
						<Box className="children" display={'flex'}>
							<Label className="childrenLabel">number of children</Label>
							<Input
								className="childrenInput"
								type={'number'}
								look={'filled'}
								control={form.get('children')}
								updateControl={updateHandler}
							/>
						</Box>
						<Box className="priceRangeMin" display={'flex'}>
							<Label className="priceRangeMinLabel">Min Price</Label>
							<Input
								className="priceRangeMinInput"
								type={'number'}
								look={'filled'}
								control={form.get('priceRangeMin')}
								updateControl={updateHandler}
							/>
						</Box>
						<Box className="priceRangeMax" display={'flex'}>
							<Label className="PriceRangeMaxLabel">Max Price</Label>
							<Input
								className="priceRangeMaxInput"
								type={'number'}
								look={'filled'}
								control={form.get('priceRangeMax')}
								updateControl={updateHandler}
							/>
						</Box>
						<Box display="block">
							<Button
								onClick={() => {
									submit();
								}}
								look="containedPrimary"
							>
								Click Here
							</Button>
						</Box>
					</Box>
				</form>
			</Box>
			<Box className="searchResults" display={'flex'}>
				{!!availableReservations && renderReservations()}
			</Box>
		</Page>
	);
};

export default SearchPage;
