import * as React from 'react';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import './FilterReservationPopup.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import DateRangeSelector from '../../components/dateRangeSelector/DateRangeSelector';
import LabelInput from '../../components/labelInput/LabelInput';
import moment from 'moment';
import { useEffect, useState } from 'react';
import LabelButton from '../../components/labelButton/LabelButton';
import { StringUtils, WebUtils } from '../../utils/utils';
import LabelSelect from '../../components/labelSelect/LabelSelect';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

export interface FilterReservationPopupProps extends PopupProps {
	onClickApply: (
		startDate: moment.Moment | null,
		endDate: moment.Moment | null,
		adults: string,
		children: string,
		priceRangeMin: string,
		priceRangeMax: string,
		propertyTypeIds: number[] | string[],
		rateCode: string
	) => void;
	className?: string;
}

const FilterReservationPopup: React.FC<FilterReservationPopupProps> = (props) => {
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
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
	const [rateCode, setRateCode] = useState<string>('');
	const [options, setOptions] = useState<OptionType[]>([]);
	const [propertyTypeFormGroup, setPropertyTypeFormGroup] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('propertyType', '', [])])
	);
	const [propertyTypeIds, setPropertyTypeIds] = useState<number[] | string[]>([]);

	useEffect(() => {
		async function getAllPropertyTypes() {
			try {
				let response = await destinationService.getAllPropertyTypes();
				let newOptions = formatOptions(response.data);
				setOptions(newOptions);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'An unexpected server error has occurred'),
					'Server Error'
				);
			}
		}
		getAllPropertyTypes().catch(console.error);
	}, []);

	function formatOptions(options: Api.Destination.Res.PropertyType[]) {
		return options.map((value) => {
			return { value: value.id, label: value.name };
		});
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<div className={'rsFilterReservationPopup'}>
				<Paper className={'paperWrapper'} width={'330px'} backgroundColor={'#fcfbf8'}>
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
								initialValue={adults}
							/>
							<LabelInput
								className="numberOfChildren"
								inputType="text"
								title="# of Children"
								onChange={(value) => setChildren(value)}
								initialValue={children}
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
									) as HTMLInputElement).value = StringUtils.addCommasToNumber(
										('' + value).replace(/\D/g, '')
									);
								}}
								initialValue={priceRangeMin}
							/>
							<LabelInput
								className="priceMax"
								inputType="text"
								title="Price Max"
								onChange={(value) => {
									setPriceRangeMax(value);
									(document.querySelector(
										'.rsFilterReservationPopup .priceMax > input'
									) as HTMLInputElement).value = StringUtils.addCommasToNumber(
										('' + value).replace(/\D/g, '')
									);
								}}
								initialValue={priceRangeMax}
							/>
						</div>
						<LabelSelect
							title={'Property Type'}
							control={propertyTypeFormGroup.get('propertyType')}
							updateControl={(control) => {
								setPropertyTypeIds(control.value);
								setPropertyTypeFormGroup(propertyTypeFormGroup.clone().update(control));
							}}
							selectOptions={options}
						/>
						<LabelInput
							className={'rateCode'}
							inputType={'text'}
							title={'Rate Code'}
							onChange={(value) => {
								setRateCode(value);
								(document.querySelector(
									'.rsFilterReservationPopup .rateCode > input'
								) as HTMLInputElement).value = value;
							}}
							initialValue={rateCode}
						/>
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
										priceRangeMax,
										propertyTypeIds,
										rateCode
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
