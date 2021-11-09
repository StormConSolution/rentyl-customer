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
import { formatFilterDateForServer, ObjectUtils, StringUtils, WebUtils } from '../../utils/utils';
import LabelSelect from '../../components/labelSelect/LabelSelect';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import RegionService from '../../services/region/region.service';
import DestinationService from '../../services/destination/destination.service';
import serviceFactory from '../../services/serviceFactory';
import globalState from '../../state/globalState';
import { useRecoilState } from 'recoil';

export interface FilterReservationPopupProps extends PopupProps {
	searchRegion?: boolean;
	className?: string;
}

const FilterReservationPopup: React.FC<FilterReservationPopupProps> = (props) => {
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const regionService = serviceFactory.get<RegionService>('RegionService');
	const [searchQueryObj, setSearchQueryObj] = useRecoilState<Misc.ReservationFilters>(globalState.reservationFilters);
	const [isValid, setIsValid] = useState<boolean>(true);
	const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
	const [endDate, setEndDate] = useState<moment.Moment | null>(moment().add(7, 'd'));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [propertyTypeOptions, setPropertyTypeOptions] = useState<OptionType[]>([]);
	const [regionOptions, setRegionOptions] = useState<OptionType[]>([]);
	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('regionIds', searchQueryObj.regionIds || [], []),
			new RsFormControl('propertyTypeIds', searchQueryObj.propertyTypeIds || [], []),
			new RsFormControl('adultCount', searchQueryObj.adultCount || 2, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Adults Required')
			]),
			new RsFormControl('childCount', searchQueryObj.childCount || 0, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Children Required')
			]),
			new RsFormControl('priceRangeMax', StringUtils.addCommasToNumber(searchQueryObj.priceRangeMax), []),
			new RsFormControl('priceRangeMin', StringUtils.addCommasToNumber(searchQueryObj.priceRangeMin), [])
		])
	);

	useEffect(() => {
		if (!searchQueryObj.startDate && !searchQueryObj.endDate) return;
		onDatesChange(moment(searchQueryObj.startDate), moment(searchQueryObj.endDate));
	}, []);

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

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDate(startDate);
		setEndDate(endDate);
		updateSearchQueryObj('startDate', formatFilterDateForServer(startDate, 'start'));
		updateSearchQueryObj('endDate', formatFilterDateForServer(endDate, 'end'));
	}

	function formatOptions(options: any[]) {
		return options.map((value) => {
			return { value: value.id, label: value.name };
		});
	}

	async function updateFilterForm(
		key:
			| 'startDate'
			| 'endDate'
			| 'adultCount'
			| 'childCount'
			| 'priceRangeMin'
			| 'priceRangeMax'
			| 'pagination'
			| 'rateCode'
			| 'regionIds'
			| 'propertyTypeIds',
		control: RsFormControl
	) {
		if (control.key === 'priceRangeMax' || control.key === 'priceRangeMin') {
			let newValue = StringUtils.addCommasToNumber(StringUtils.removeAllExceptNumbers(control.value.toString()));
			control.value = newValue;
		} else if (control.key === 'adultCount' || control.key === 'childCount') {
			let newValue: string | number = '';
			if (control.value.toString().length > 0) {
				let value = StringUtils.removeAllExceptNumbers(control.value.toString());
				if (value.length !== 0) {
					newValue = parseInt(value);
				}

				control.value = newValue;
			}
		}
		filterForm.update(control);
		let isFormValid = await filterForm.isValid();
		let _isFormFilledOut = isFormFilledOut();
		setFilterForm(filterForm.clone());
		if (isFormValid && _isFormFilledOut) {
			if (control.key === 'priceRangeMax' || control.key === 'priceRangeMin') {
				let newValue: string | number = '';
				if (control.value.toString().length > 0) {
					let value = StringUtils.removeAllExceptNumbers(control.value.toString());
					if (value.length !== 0) {
						newValue = parseInt(value);
					}

					control.value = newValue;
				}
			}
			updateSearchQueryObj(key, control.value);
		}
	}

	function isFormFilledOut(): boolean {
		return (
			!!filterForm.get('adultCount').value.toString().length &&
			!!filterForm.get('childCount').value.toString().length
		);
	}

	function updateSearchQueryObj(
		key:
			| 'startDate'
			| 'endDate'
			| 'adultCount'
			| 'childCount'
			| 'priceRangeMin'
			| 'priceRangeMax'
			| 'pagination'
			| 'rateCode'
			| 'regionIds'
			| 'propertyTypeIds',
		value: any
	) {
		if (key === 'adultCount' && value === 0) {
			//this should never evaluate to true with current implementations.
			throw rsToastify.error('Must have at least 1 adult', 'Missing or Incorrect Information');
		}
		if (key === 'adultCount' && isNaN(value)) {
			throw rsToastify.error('# of adults must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'childCount' && isNaN(value)) {
			throw rsToastify.error('# of children must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'priceRangeMin' && isNaN(parseInt(value))) {
			throw rsToastify.error('Price min must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'priceRangeMax' && isNaN(parseInt(value))) {
			throw rsToastify.error('Price max must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'priceRangeMin' && searchQueryObj['priceRangeMax'] && value > searchQueryObj['priceRangeMax']) {
			setErrorMessage('Price min must be lower than the max');
		} else if (
			key === 'priceRangeMax' &&
			searchQueryObj['priceRangeMin'] &&
			value < searchQueryObj['priceRangeMin']
		) {
			setErrorMessage('Price max must be greater than the min');
		} else {
			setErrorMessage('');
		}
		setSearchQueryObj((prev) => {
			let createSearchQueryObj: any = { ...prev };
			if (value === '' || value === undefined) delete createSearchQueryObj[key];
			else createSearchQueryObj[key] = value;
			if (key === 'regionIds' || key === 'propertyTypeIds') {
				if (!ObjectUtils.isArrayWithData(value)) delete createSearchQueryObj[key];
			}
			return createSearchQueryObj;
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
							updateControl={(control) => updateFilterForm('adultCount', control)}
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
								inputType="number"
								title="# of Adults"
								control={filterForm.get('adultCount')}
								updateControl={(control) => updateFilterForm('adultCount', control)}
							/>
							<LabelInput
								className="numberOfChildren"
								inputType="number"
								title="# of Children"
								control={filterForm.get('childCount')}
								updateControl={(control) => updateFilterForm('childCount', control)}
							/>
						</div>
						<div className={'minMaxDiv'}>
							<LabelInput
								className="priceMin"
								inputType="number"
								title="Price Min"
								control={filterForm.get('priceRangeMin')}
								updateControl={(control) => updateFilterForm('priceRangeMin', control)}
							/>
							<LabelInput
								className="priceMax"
								inputType="number"
								title="Price Max"
								control={filterForm.get('priceRangeMax')}
								updateControl={(control) => updateFilterForm('priceRangeMax', control)}
							/>
						</div>
						<LabelSelect
							title={'Property Type'}
							control={filterForm.get('propertyTypeIds')}
							updateControl={(control) => updateFilterForm('propertyTypeIds', control)}
							options={propertyTypeOptions}
							isMulti={true}
						/>
						<div className={'buttons'}>
							<LabelButton
								className={isValid ? 'applyButton' : 'applyButton disabled'}
								look={'containedPrimary'}
								variant={'button'}
								label={'Apply'}
								onClick={() => {
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
