import * as React from 'react';
import './EditReservationDetailsPopup.scss';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import LabelButton from '../../components/labelButton/LabelButton';
import LabelInput from '../../components/labelInput/LabelInput';
import { useEffect, useState } from 'react';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import moment from 'moment';
import { DateUtils, formatFilterDateForServer } from '../../utils/utils';
import DateRangeSelector from '../../components/dateRangeSelector/DateRangeSelector';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import SpinningLoaderPopup from '../spinningLoaderPopup/SpinningLoaderPopup';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

export interface EditDetailsObj {
	adults: number;
	children: number;
	arrivalDate: string;
	departureDate: string;
}

export interface EditReservationDetailsPopupProps extends PopupProps {
	accommodationId: number;
	destinationId: number;
	arrivalDate: string | Date;
	departureDate: string | Date;
	adultCount: number;
	childCount: number;
	onApplyChanges: (data: EditDetailsObj) => void;
}

const EditReservationDetailsPopup: React.FC<EditReservationDetailsPopupProps> = (props) => {
	const reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const size = useWindowResizeChange();
	const [canUpdateDetails, setCanUpdateDetails] = useState<boolean>(false);
	const [isInvalidDates, setIsInvalidDates] = useState<boolean>(false);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(
		moment(new Date(DateUtils.displayUserDate(props.arrivalDate)))
	);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(
		moment(new Date(DateUtils.displayUserDate(props.departureDate)))
	);
	const [editDetailsForm, setEditDetailsForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('adults', props.adultCount, [
				new RsValidator(RsValidatorEnum.REQ, 'Number of Adults is required')
			]),
			new RsFormControl('children', props.childCount, []),
			new RsFormControl('arrivalDate', formatPropsDate(props.arrivalDate.toString()), []),
			new RsFormControl('departureDate', formatPropsDate(props.departureDate.toString()), [])
		])
	);

	function formatPropsDate(date: string) {
		if (date.includes('T')) {
			return date.split('T')[0];
		} else return date;
	}

	useEffect(() => {
		let startDate = formatFilterDateForServer(
			moment(new Date(DateUtils.displayUserDate(props.arrivalDate))),
			'start'
		);
		let endDate = formatFilterDateForServer(
			moment(new Date(DateUtils.displayUserDate(props.departureDate))),
			'end'
		);

		if (editDetailsForm.isModified()) setCanUpdateDetails(true);
		else return setCanUpdateDetails(false);

		if (
			editDetailsForm.get('departureDate').value.toString().includes(endDate) &&
			editDetailsForm.get('arrivalDate').value.toString().includes(startDate)
		)
			return;

		if (editDetailsForm.get('arrivalDate').value.toString().includes(startDate)) setCanUpdateDetails(false);
		else setCanUpdateDetails(true);

		if (editDetailsForm.get('departureDate').value.toString().includes(endDate)) setCanUpdateDetails(false);
		else setCanUpdateDetails(true);
	}, [editDetailsForm]);

	useEffect(() => {
		let startDate = formatFilterDateForServer(
			moment(new Date(DateUtils.displayUserDate(props.arrivalDate))),
			'start'
		);
		let endDate = formatFilterDateForServer(
			moment(new Date(DateUtils.displayUserDate(props.departureDate))),
			'end'
		);
		if (
			editDetailsForm.get('departureDate').value.toString().includes(endDate) &&
			editDetailsForm.get('arrivalDate').value.toString().includes(startDate)
		)
			return;
		async function checkAvailability() {
			popupController.open(SpinningLoaderPopup);
			setIsInvalidDates(false);
			let data: Api.Reservation.Req.Verification = editDetailsForm.toModel();
			data.accommodationId = props.accommodationId;
			data.destinationId = props.destinationId;
			data.numberOfAccommodations = 1;
			try {
				let res = await reservationsService.verifyAvailability(data);
				popupController.close(SpinningLoaderPopup);
				setCanUpdateDetails(true);
			} catch (e) {
				console.log(e.message);
				popupController.close(SpinningLoaderPopup);
				setCanUpdateDetails(false);
				setIsInvalidDates(true);
			}
		}
		checkAvailability().catch(console.error);
	}, [endDateControl]);

	function updateEditDetailsForm(control: RsFormControl) {
		if (control.key === 'adults' || control.key === 'children') {
			if (!!Number(control.value)) {
				control.value = Number(control.value);
			}
		}
		setEditDetailsForm(editDetailsForm.clone().update(control));
	}

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDateControl(startDate);
		setEndDateControl(endDate);
		let newArrivalDate = editDetailsForm.get('arrivalDate');
		newArrivalDate.value = formatFilterDateForServer(startDate, 'start');
		let newDepartureDate = editDetailsForm.get('departureDate');
		newDepartureDate.value = formatFilterDateForServer(endDate, 'end');
		updateEditDetailsForm(newArrivalDate);
		updateEditDetailsForm(newDepartureDate);
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper className={'rsEditReservationDetailsPopup'}>
				<Icon
					iconImg={'icon-close'}
					onClick={() => {
						popupController.close(EditReservationDetailsPopup);
					}}
					cursorPointer
				/>
				<Label variant={'h2'} mb={40}>
					EDIT DETAILS
				</Label>
				<Box width={210} margin={'0 auto'}>
					<Box mb={40}>
						<Label variant={'h3'}>DATES</Label>
						<DateRangeSelector
							startDate={startDateControl}
							endDate={endDateControl}
							onDatesChange={onDatesChange}
							monthsToShow={size === 'small' ? 1 : 2}
							focusedInput={focusedInput}
							onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
							startDateLabel={'CHECK IN'}
							endDateLabel={'CHECK OUT'}
							labelVariant={'body1'}
						/>
						{isInvalidDates && (
							<Label mt={5} variant={'caption'} color={'red'}>
								SELECTED DATES ARE UNAVAILABLE
							</Label>
						)}
					</Box>
					<Box mb={40} className={'guestWrapper'}>
						<Label variant={'h3'}>GUESTS</Label>
						<Box display={'flex'} justifyContent={'space-between'}>
							<LabelInput
								title={'ADULTS'}
								inputType={'number'}
								labelVariant={'body1'}
								control={editDetailsForm.get('adults')}
								updateControl={updateEditDetailsForm}
							/>
							<LabelInput
								title={'CHILDREN'}
								inputType={'number'}
								labelVariant={'body1'}
								control={editDetailsForm.get('children')}
								updateControl={updateEditDetailsForm}
							/>
						</Box>
					</Box>
				</Box>
				<Box display={'flex'} margin={'30px auto 0'} width={'100%'} justifyContent={'space-between'}>
					<LabelButton
						look={canUpdateDetails ? 'containedPrimary' : 'containedSecondary'}
						disabled={!canUpdateDetails}
						variant={'button'}
						label={'Apply changes'}
						onClick={() => props.onApplyChanges({ ...editDetailsForm.toModel() })}
					/>
					<LabelButton
						look={'containedSecondary'}
						variant={'button'}
						label={'Cancel'}
						onClick={() => {
							popupController.close(EditReservationDetailsPopup);
						}}
					/>
				</Box>
			</Paper>
		</Popup>
	);
};

export default EditReservationDetailsPopup;
