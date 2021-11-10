import React, { useEffect, useState } from 'react';
import moment from 'moment';
import DateRangeSelector from '../dateRangeSelector/DateRangeSelector';
import LabelInput from '../labelInput/LabelInput';
import './FilterBar.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { formatFilterDateForServer, ObjectUtils, StringUtils } from '../../utils/utils';
import LabelSelect from '../labelSelect/LabelSelect';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import serviceFactory from '../../services/serviceFactory';
import RegionService from '../../services/region/region.service';
import DestinationService from '../../services/destination/destination.service';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

export interface FilterBarProps {
	destinationId?: number;
	hide?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = (props) => {
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const regionService = serviceFactory.get<RegionService>('RegionService');
	const [searchQueryObj, setSearchQueryObj] = useRecoilState<Misc.ReservationFilters>(globalState.reservationFilters);
	const [regionOptions, setRegionOptions] = useState<OptionType[]>([]);
	const [propertyTypeOptions, setPropertyTypeOptions] = useState<OptionType[]>([]);
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(moment(new Date().getTime()));
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(moment(new Date()).add(2, 'days'));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('regionIds', searchQueryObj.regionIds || [], []),
			new RsFormControl('propertyTypeIds', searchQueryObj.propertyTypeIds || [], []),
			new RsFormControl('adultCount', searchQueryObj.adultCount || 2, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Adults Required'),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Required', (control) => {
					return control.value !== 0;
				})
			]),
			new RsFormControl('childCount', searchQueryObj.childCount || 0, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Children Required')
			]),
			new RsFormControl('priceRangeMax', searchQueryObj.priceRangeMax || 0, []),
			new RsFormControl('priceRangeMin', searchQueryObj.priceRangeMin || 0, [])
		])
	);

	useEffect(() => {
		async function getDropdownOptions() {
			let regions: Api.Region.Res.Get[] = await regionService.getAllRegions();
			setRegionOptions(
				regions.map((region) => {
					return { value: region.id, label: region.name };
				})
			);
			if (props.destinationId) {
				let propertyTypes = await destinationService.getAllPropertyTypes();
				setPropertyTypeOptions(
					propertyTypes.map((propertyType) => {
						return { value: propertyType.id, label: propertyType.name };
					})
				);
			} else {
				let propertyTypes = await destinationService.getAllPropertyTypes();
				setPropertyTypeOptions(
					propertyTypes.map((propertyType) => {
						return { value: propertyType.id, label: propertyType.name };
					})
				);
			}
		}
		getDropdownOptions().catch(console.error);
	}, [searchQueryObj]);

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
		if (
			control.key === 'adultCount' ||
			control.key === 'childCount' ||
			control.key === 'priceRangeMax' ||
			control.key === 'priceRangeMin'
		) {
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
		if (await (isFormValid && _isFormFilledOut)) {
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

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDateControl(startDate);
		setEndDateControl(endDate);
		updateSearchQueryObj('startDate', formatFilterDateForServer(startDate, 'start'));
		updateSearchQueryObj('endDate', formatFilterDateForServer(endDate, 'end'));
	}

	return (
		<Box className={`rsFilterBar`}>
			{!props.destinationId && (
				<LabelSelect
					title={'Regions'}
					updateControl={(control) => updateFilterForm('regionIds', control)}
					options={regionOptions}
					control={filterForm.get('regionIds')}
					isMulti
					isSearchable
				/>
			)}
			<DateRangeSelector
				startDate={startDateControl}
				endDate={endDateControl}
				onDatesChange={onDatesChange}
				monthsToShow={2}
				focusedInput={focusedInput}
				onFocusChange={(newFocusedInput) => setFocusedInput(newFocusedInput)}
				startDateLabel={'check in'}
				endDateLabel={'check out'}
			/>
			<LabelInput
				control={filterForm.get('adultCount')}
				updateControl={(control) => updateFilterForm('adultCount', control)}
				className="numberOfAdults"
				inputType="number"
				title="# of Adults"
			/>
			<LabelInput
				control={filterForm.get('childCount')}
				updateControl={(control) => updateFilterForm('childCount', control)}
				className="numberOfChildren"
				inputType="number"
				title="# of Children"
			/>
			<LabelInput
				control={filterForm.get('priceRangeMin')}
				updateControl={(control) => updateFilterForm('priceRangeMin', control)}
				className="priceMin"
				inputType="number"
				title="Price Min"
			/>
			<LabelInput
				control={filterForm.get('priceRangeMax')}
				updateControl={(control) => updateFilterForm('priceRangeMax', control)}
				className="priceMax"
				inputType="number"
				title="Price Max"
			/>
			<LabelSelect
				title="Property Type"
				control={filterForm.get('propertyTypeIds')}
				updateControl={(control) => updateFilterForm('propertyTypeIds', control)}
				options={propertyTypeOptions}
				isMulti={true}
			/>
		</Box>
	);
};

export default FilterBar;
