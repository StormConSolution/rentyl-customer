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
import { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import RegionService from '../../services/region/region.service';
import DestinationService from '../../services/destination/destination.service';
import serviceFactory from '../../services/serviceFactory';

export interface FilterReservationPopupProps extends PopupProps {
	searchRegion?: boolean;
	onClickApply: (
		startDate: moment.Moment | null,
		endDate: moment.Moment | null,
		adults: number,
		children: number,
		priceRangeMin: string,
		priceRangeMax: string,
		propertyTypeIds: number[],
		rateCode: string,
		regionIds?: number[]
	) => void;
	className?: string;
}

const FilterReservationPopup: React.FC<FilterReservationPopupProps> = (props) => {
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const regionService = serviceFactory.get<RegionService>('RegionService');
	const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
	const [endDate, setEndDate] = useState<moment.Moment | null>(moment().add(7, 'd'));
	const [adults, setAdults] = useState<number>(2);
	const [children, setChildren] = useState<number>(0);
	const [priceRangeMin, setPriceRangeMin] = useState<string>('');
	const [priceRangeMax, setPriceRangeMax] = useState<string>('');
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDate(startDate);
		setEndDate(endDate);
	}
	const [rateCode, setRateCode] = useState<string>('');
	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('regionIds', [], []), new RsFormControl('propertyTypeIds', [], [])])
	);
	const [propertyTypeOptions, setPropertyTypeOptions] = useState<OptionType[]>([]);
	const [regionOptions, setRegionOptions] = useState<OptionType[]>([]);

	useEffect(() => {
		async function getFilterOptions() {
			try {
				const propertyTypes = await destinationService.getAllPropertyTypes();
				setPropertyTypeOptions(formatOptions(propertyTypes));
				const regions = await regionService.getAllRegions();
				setRegionOptions(formatOptions(regions));
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'An unexpected server error has occurred'),
					'Server Error'
				);
			}
		}
		getFilterOptions().catch(console.error);
	}, []);

	function formatOptions(options: Api.Destination.Res.PropertyType[] | Api.Region.Res.Get[]) {
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
					{props.searchRegion && (
						<LabelSelect
							title={'Region'}
							control={filterForm.get('regionIds')}
							updateControl={(control) => {
								setFilterForm(filterForm.clone().update(control));
							}}
							options={regionOptions}
							isMulti
							isSearchable
						/>
					)}
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
								onChange={(value) => setAdults(parseInt(value))}
								initialValue={'' + adults}
							/>
							<LabelInput
								className="numberOfChildren"
								inputType="text"
								title="# of Children"
								onChange={(value) => setChildren(parseInt(value))}
								initialValue={'' + children}
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
							control={filterForm.get('propertyTypeIds')}
							updateControl={(control) => {
								setFilterForm(filterForm.clone().update(control));
							}}
							options={propertyTypeOptions}
							isMulti={true}
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
										filterForm.get('propertyTypeIds').value as number[],
										rateCode,
										filterForm.get('regionIds').value as number[]
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
