import * as React from 'react';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import './FilterReservationPopup.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import DateRangeSelector from '../../components/dateRangeSelector/DateRangeSelector';
import LabelInput from '../../components/labelInput/LabelInput';
import moment from 'moment';
import { useState } from 'react';
import LabelButton from '../../components/labelButton/LabelButton';
import { addCommasToNumber } from '../../utils/utils';

export interface FilterReservationPopupProps extends PopupProps {
	onClickApply: (
		startDate: moment.Moment | null,
		endDate: moment.Moment | null,
		adults: string,
		children: string,
		priceRangeMin: string,
		priceRangeMax: string
	) => void;
	className?: string;
}

const FilterReservationPopup: React.FC<FilterReservationPopupProps> = (props) => {
	const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
	const [endDate, setEndDate] = useState<moment.Moment | null>(moment().add(7, 'd'));
	const [adults, setAdults] = useState<string>('2');
	const [children, setChildren] = useState<string>('');
	const [priceRangeMin, setPriceRangeMin] = useState<string>('');
	const [priceRangeMax, setPriceRangeMax] = useState<string>('');
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDate(startDate);
		setEndDate(endDate);
	}
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<div className={'rsFilterReservationPopup'}>
				<Paper className={'paperWrapper'} height={'430px'} width={'330px'} backgroundColor={'#fcfbf8'}>
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
								onChange={(value) => setAdults(value)}
							/>
							<LabelInput
								className="numberOfChildren"
								inputType="text"
								title="# of Children"
								onChange={(value) => setChildren(value)}
							/>
						</div>
						<div className={'minMaxDiv'}>
							<LabelInput
								className="priceMin"
								inputType="text"
								title="Price Min"
								onChange={(value) => {
									setPriceRangeMin(value);
									(document.querySelector(
										'.rsFilterReservationPopup .priceMin > input'
									) as HTMLInputElement).value = addCommasToNumber(('' + value).replace(/\D/g, ''));
								}}
							/>
							<LabelInput
								className="priceMax"
								inputType="text"
								title="Price Max"
								onChange={(value) => {
									setPriceRangeMax(value);
									(document.querySelector(
										'.rsFilterReservationPopup .priceMax > input'
									) as HTMLInputElement).value = addCommasToNumber(('' + value).replace(/\D/g, ''));
								}}
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
									props.onClickApply(
										startDate,
										endDate,
										adults,
										children,
										priceRangeMin,
										priceRangeMax
									);
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
