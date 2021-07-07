import * as React from 'react';
import { useEffect, useState } from 'react';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import './EditAccommodationPopup.scss';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Box from '../../components/box/Box';
import Paper from '../../components/paper/Paper';
import LabelInput from '../../components/labelInput/LabelInput';
import DateRangeSelector from '../../components/dateRangeSelector/DateRangeSelector';
import moment from 'moment';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';
import rsToasts from '@bit/redsky.framework.toast';
import DestinationPackageTile from '../../pages/bookingFlowAddPackagePage/destinationPackageTile/DestinationPackageTile';
import ReservationsService from '../../services/reservations/reservations.service';
import { DateUtils, StringUtils } from '../../utils/utils';
import LabelButton from '../../components/labelButton/LabelButton';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

export interface EditAccommodationPopupProps extends PopupProps {
	adults: number;
	children: number;
	startDate: Date | string;
	endDate: Date | string;
	packages: Api.Package.Res.Get[];
	onApplyChanges: (
		adults: number,
		children: number,
		checkinDate: string | Date,
		checkoutDate: string | Date,
		packages: Api.Package.Res.Get[]
	) => void;
	destinationId: number;
	accommodationId: number;
}

const EditAccommodationPopup: React.FC<EditAccommodationPopupProps> = (props) => {
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [availablePackages, setAvailablePackages] = useState<Api.Package.Res.Get[]>([]);
	const [addedPackages, setAddedPackages] = useState<Api.Package.Res.Get[]>(props.packages);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [startDate, setStartDate] = useState<moment.Moment | null>(moment(props.startDate));
	const [endDate, setEndDate] = useState<moment.Moment | null>(moment(props.endDate));
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
				// const response = await destinationService.getAvailablePackages(props.destinationId);
				// setAvailablePackages(response.data);
			} catch (e) {
				rsToasts.error('Something unexpected happened on the server!');
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
				await reservationService.verifyAvailability(data);
				setAvailable(true);
			} catch {
				setAvailable(false);
			}
		}
		checkAvailability();
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
					startDate={moment(startDate)}
					endDate={moment(endDate)}
					onDatesChange={onDatesChange}
					monthsToShow={2}
					focusedInput={focusedInput}
					onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
					startDateLabel={'check in'}
					endDateLabel={'check out'}
				/>
				<Box className={'addedPackages'}>
					{addedPackages.map((item) => (
						<DestinationPackageTile
							title={item.title}
							description={item.description}
							priceCents={100}
							imgUrl={item.media[0].urls.large || ''}
						/>
					))}
				</Box>
				<Box className={'availablePackages'}>
					{availablePackages
						.filter((item) => !addedPackages.map((added) => added.id).includes(item.id))
						.map((item) => (
							<DestinationPackageTile
								title={item.title}
								description={item.description}
								priceCents={100}
								imgUrl={item.media[0].urls.large || ''}
								onAddPackage={() => setAddedPackages([...addedPackages, item])}
							/>
						))}
				</Box>
				{!available && (
					<Label variant={'body1'} color={'red'}>
						These dates are unavailable, please pick new dates
					</Label>
				)}
				<Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
					<LabelButton
						look={'containedSecondary'}
						variant={'button'}
						label={'Cancel'}
						onClick={() => popupController.closeAll()}
					/>
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Apply Changes'}
						disabled={!available}
						onClick={() => {
							props.onApplyChanges(
								parseInt(guestForm.get('adults').value.toString()),
								parseInt(guestForm.get('children').value.toString()),
								DateUtils.displayDate(startDate?.toDate() || ''),
								DateUtils.displayDate(endDate?.toDate() || ''),
								addedPackages
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
