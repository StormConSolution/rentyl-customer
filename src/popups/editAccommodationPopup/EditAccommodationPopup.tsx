import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import './EditAccommodationPopup.scss';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Paper from '../../components/paper/Paper';
import LabelInput from '../../components/labelInput/LabelInput';
import DateRangeSelector from '../../components/dateRangeSelector/DateRangeSelector';
import moment from 'moment';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import { DateUtils } from '../../utils/utils';
import LabelButton from '../../components/labelButton/LabelButton';
import Icon from '@bit/redsky.framework.rs.icon';
import PackageDetailsPopup, { PackageDetailsPopupProps } from './packageDetailsPopup/PackageDetailsPopup';
import SpinningLoaderPopup from '../spinningLoaderPopup/SpinningLoaderPopup';
import PackageService from '../../services/package/package.service';

export interface EditAccommodationPopupProps extends PopupProps {
	adults: number;
	children: number;
	startDate: Date | string;
	endDate: Date | string;
	onApplyChanges: (
		adults: number,
		children: number,
		rateCode: string,
		checkinDate: string | Date,
		checkoutDate: string | Date,
		originalStartDate: string | Date,
		originalEndDate: string | Date
	) => void;
	destinationId: number;
	accommodationId: number;
	rateCode?: string;
}

const EditAccommodationPopup: React.FC<EditAccommodationPopupProps> = (props) => {
	const reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const packageService = serviceFactory.get<PackageService>('PackageService');
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [startDate, setStartDate] = useState<moment.Moment | null>(
		moment(new Date(DateUtils.displayUserDate(props.startDate)))
	);
	const [endDate, setEndDate] = useState<moment.Moment | null>(
		moment(new Date(DateUtils.displayUserDate(props.endDate)))
	);
	const [guestForm, setGuestForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('adults', props.adults, [new RsValidator(RsValidatorEnum.NUM, 'Must be a number')]),
			new RsFormControl('children', props.children, [new RsValidator(RsValidatorEnum.NUM, 'Must be a number')])
		])
	);
	const [available, setAvailable] = useState<boolean>(true);

	useEffect(() => {
		async function getPackages() {
			try {
				const response = await packageService.getAvailable({
					destinationId: props.destinationId,
					startDate: props.startDate,
					endDate: props.endDate,
					pagination: { page: 1, perPage: 5 }
				});
			} catch {
				console.error('An unexpected error happened on the server.');
			}
		}
		getPackages().catch(console.error);
	}, []);

	useEffect(() => {
		async function checkAvailability() {
			try {
				let data: Api.Reservation.Req.Verification = {
					accommodationId: props.accommodationId,
					destinationId: props.destinationId,
					adults: parseInt(guestForm.get('adults').value.toString()),
					children: parseInt(guestForm.get('children').value.toString()),
					arrivalDate: DateUtils.clientToServerDate(
						startDate ? startDate.toDate() : moment(props.startDate).toDate()
					),
					departureDate: DateUtils.clientToServerDate(
						endDate ? endDate.toDate() : moment(props.endDate).toDate()
					),
					numberOfAccommodations: 1
				};
				if (props.rateCode) data.rateCode = props.rateCode;
				await reservationsService.verifyAvailability(data);
				popupController.close(SpinningLoaderPopup);
				setAvailable(true);
			} catch {
				popupController.close(SpinningLoaderPopup);
				setAvailable(false);
			}
		}
		if (!moment(props.startDate).isSame(startDate) || !moment(props.endDate).isSame(endDate)) {
			popupController.open(SpinningLoaderPopup);
			checkAvailability().catch(console.error);
		} else {
			setAvailable(true);
		}
	}, [startDate, endDate]);

	function onDatesChange(start: moment.Moment | null, end: moment.Moment | null) {
		setStartDate(start);
		setEndDate(end);
	}

	function updateForm(control: RsFormControl) {
		setGuestForm(guestForm.clone().update(control));
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper className={'rsEditAccommodationPopup'}>
				<Box className={'guests'}>
					<LabelInput
						title={'Adults'}
						inputType={'number'}
						control={guestForm.get('adults')}
						updateControl={updateForm}
					/>
					<LabelInput
						title={'Children'}
						inputType={'number'}
						control={guestForm.get('children')}
						updateControl={updateForm}
					/>
				</Box>
				<DateRangeSelector
					startDate={startDate}
					endDate={endDate}
					onDatesChange={onDatesChange}
					monthsToShow={2}
					focusedInput={focusedInput}
					onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
					startDateLabel={'check in'}
					endDateLabel={'check out'}
				/>
				{!available && (
					<Label variant={'body1'} color={'red'}>
						These dates are unavailable, please pick new dates
					</Label>
				)}
				<br />
				<Box display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
					<LabelButton
						look={'containedSecondary'}
						variant={'button'}
						label={'Cancel'}
						onClick={() => popupController.closeAll()}
					/>
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Apply'}
						disabled={!available}
						onClick={() => {
							props.onApplyChanges(
								parseInt(guestForm.get('adults').value.toString()),
								parseInt(guestForm.get('children').value.toString()),
								props.rateCode || '',
								startDate?.format('YYYY-MM-DD') || '',
								endDate?.format('YYYY-MM-DD') || '',
								props.startDate,
								props.endDate
							);
							popupController.closeAll();
						}}
					/>
				</Box>
			</Paper>
		</Popup>
	);
};

export default EditAccommodationPopup;
