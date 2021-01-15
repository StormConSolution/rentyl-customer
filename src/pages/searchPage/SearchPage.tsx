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
import ReservationsService from '../../services/reservations/reservations.service';
import serviceFactory from '../../services/serviceFactory';
import rsToasts from '@bit/redsky.framework.toast';
import DestinationCardComponent from '../../components/destinationCardComponent/DestinationCardComponent';

const form = new RsFormGroup([
	new RsFormControl('adults', '', [
		new RsValidator(RsValidatorEnum.REQ, 'Number of adults is required'),
		new RsValidator(RsValidatorEnum.NUM, 'Must be a number')
	]),
	new RsFormControl('children', '', [new RsValidator(RsValidatorEnum.NUM, 'must enter a number')]),
	new RsFormControl('currencyCode', '', [new RsValidator(RsValidatorEnum.MIN, 'enter valid currency code')]),
	new RsFormControl('roomClass', '', [new RsValidator(RsValidatorEnum.MAX, 'enter valid room class')]),
	new RsFormControl('priceRangeMin', '', [new RsValidator(RsValidatorEnum.NUM, 'must enter a number')]),
	new RsFormControl('priceRangeMax', '', [new RsValidator(RsValidatorEnum.NUM, 'must enter a number')])
]);

const SearchPage: React.FC = () => {
	let reservationService: ReservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	/*let momentObj = moment();*/
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(null);
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
		if (!(await form.isValid())) return rsToasts.error('Missing data');
		if (!startDateControl) throw rsToasts.error('Missing data');
		if (!endDateControl) throw rsToasts.error('Missing data');
		let data: Api.Reservation.Req.Availability = form.toModel();
		data.startDate = startDateControl.format();
		data.endDate = endDateControl.format();
		let tempData: any = data;
		for (const key in tempData) {
			if (!tempData[key]) delete tempData[key];
		}
		console.log(data);
		try {
			let response = await reservationService.searchAvailableReservations(data);
			setAvailableReservations(response.data.data);
		} catch (e) {
			console.log(e);
		}
	}

	function renderReservations() {
		if (!availableReservations || !availableReservations.accommodations)
			return (
				<Label className="placeholder">No Reservations Available. Try changing your search parameters.</Label>
			);
		return availableReservations.accommodations.map((item, index) => {
			return (
				<DestinationCardComponent
					name={item.name}
					code={item.code}
					maxOccupancy={item.maxOccupancy}
					maxSleeps={item.maxSleeps}
					roomClass={item.roomClass}
					adaCompliant={item.adaCompliant}
					totalCost={item.price[0].total}
					currencyCode={item.price[0].currencyCode}
					quantityAvailable={item.price[0].qtyAvailable}
					status={item.status}
					key={index}
				/>
			);
		});
	}

	return (
		<Page className="rsSearchPage">
			<Box className="pageBox">
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
						<Box className="filterInputs" display={'flex'} bgcolor={'white'} ml={20}>
							<Box className="datePicker" display={'flex'}>
								<DateRangePicker
									startDate={startDateControl}
									startDateId="startDate"
									endDate={endDateControl}
									endDateId="endDate"
									onDatesChange={({ startDate, endDate }) => onDatesChange(startDate, endDate)}
									focusedInput={focusedInput}
									onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
									orientation="vertical"
									numberOfMonths={1}
									noBorder
								/>
							</Box>
							<Box className="adults" display={'flex'} bgcolor={'inherit'}>
								<Input
									className="adultsInput"
									placeholder="number of adults"
									type={'number'}
									look={'outlined'}
									control={form.get('adults')}
									updateControl={updateHandler}
								/>
							</Box>
							<Box className="children" display={'flex'} bgcolor={'inherit'}>
								<Input
									className="childrenInput"
									placeholder="number of children"
									type={'number'}
									look={'outlined'}
									control={form.get('children')}
									updateControl={updateHandler}
								/>
							</Box>
							<Box className="roomClass" display={'flex'} bgcolor={'inherit'}>
								<Input
									className="roomClassInput"
									placeholder="room class"
									type={'number'}
									look={'outlined'}
									control={form.get('roomClass')}
									updateControl={updateHandler}
								/>
							</Box>
							<Box className="currencyCode" display={'flex'} bgcolor={'inherit'}>
								<Input
									className="currencyCodeInput"
									placeholder="currency code"
									type={'number'}
									look={'outlined'}
									control={form.get('currencyCode')}
									updateControl={updateHandler}
								/>
							</Box>
							<Box className="priceRangeMin" display={'flex'} bgcolor={'inherit'}>
								<Input
									className="priceRangeMinInput"
									placeholder="min price"
									type={'number'}
									look={'outlined'}
									control={form.get('priceRangeMin')}
									updateControl={updateHandler}
								/>
							</Box>
							<Box className="priceRangeMax" display={'flex'} bgcolor={'inherit'}>
								<Input
									className="priceRangeMaxInput"
									placeholder="max price"
									type={'number'}
									look={'outlined'}
									control={form.get('priceRangeMax')}
									updateControl={updateHandler}
								/>
							</Box>
						</Box>
						<Box className="searchButtonBox" display="flex">
							<Button
								onClick={() => {
									submit();
								}}
								look="containedSecondary"
							>
								Search
							</Button>
						</Box>
					</form>
				</Box>
				{!!availableReservations && renderReservations()}
			</Box>
		</Page>
	);
};

export default SearchPage;
