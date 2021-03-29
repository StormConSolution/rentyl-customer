import * as React from 'react';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import './FilterReservationPopup.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import DateRangeSelector from '../../components/dateRangeSelector/DateRangeSelector';
import LabelInput from '../../components/labelInput/LabelInput';
import moment from 'moment';
import { RsFormControl } from '@bit/redsky.framework.rs.form';
import { useState } from 'react';
import LabelButton from '../../components/labelButton/LabelButton';

export interface FilterReservationPopupProps extends PopupProps {
	numberOfAdultsControl: RsFormControl;
	numberOfAdultsUpdateControl: (updateControl: RsFormControl) => void;
	numberOfChildrenControl: RsFormControl;
	numberOfChildrenUpdateControl: (updateControl: RsFormControl) => void;
	priceMinControl: RsFormControl;
	priceMinUpdateControl: (updateControl: RsFormControl) => void;
	priceMaxControl: RsFormControl;
	priceMaxUpdateControl: (updateControl: RsFormControl) => void;
	onClickApply: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	className?: string;
}

const FilterReservationPopup: React.FC<FilterReservationPopupProps> = (props) => {
	const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
	const [endDate, setEndDate] = useState<moment.Moment | null>(moment().add(7, 'd'));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDate(startDate);
		setEndDate(endDate);
	}
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<div className={'rsFilterReservationPopup'}>
				<Paper className={'paperWrapper'} height={'430px'} width={'335px'} backgroundColor={'#fcfbf8'}>
					<Label className={'filtersLabel'} variant={'h2'}>
						Filters
					</Label>
					<div className={'formWrapper'}>
						<DateRangeSelector
							startDate={startDate}
							endDate={endDate}
							onDatesChange={onDatesChange}
							monthsToShow={1}
							focusedInput={focusedInput}
							onFocusChange={setFocusedInput}
							startDateLabel={'check in'}
							endDateLabel={'check out'}
						/>
						<div className={'numberOfGuestDiv'}>
							<LabelInput
								className="numberOfAdults"
								inputType="text"
								title="# of Adults"
								control={props.numberOfAdultsControl}
								updateControl={props.numberOfAdultsUpdateControl}
							/>
							<LabelInput
								className="numberOfChildren"
								inputType="text"
								title="# of Children"
								control={props.numberOfChildrenControl}
								updateControl={props.numberOfChildrenUpdateControl}
							/>
						</div>
						<div className={'minMaxDiv'}>
							<LabelInput
								className="priceMin"
								inputType="text"
								title="Price Min"
								control={props.priceMinControl}
								updateControl={props.priceMinUpdateControl}
							/>
							<LabelInput
								className="priceMax"
								inputType="text"
								title="Price Max"
								control={props.priceMaxControl}
								updateControl={props.priceMaxUpdateControl}
							/>
						</div>
						<div className={'buttons'}>
							<LabelButton
								className={'cancelButton'}
								look={'containedSecondary'}
								variant={'button'}
								label={'Cancel'}
								onClick={() => popupController.close(FilterReservationPopup)}
							/>
							<LabelButton
								className={'applyButton'}
								look={'containedPrimary'}
								variant={'button'}
								label={'Apply'}
								onClick={() => {
									props.onClickApply(startDate, endDate);
									popupController.close(FilterReservationPopup);
								}}
							/>
						</div>
					</div>
				</Paper>
			</div>
		</Popup>
	);
};

export default FilterReservationPopup;
