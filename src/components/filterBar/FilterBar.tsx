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
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const [regionOptions, setRegionOptions] = useState<OptionType[]>([]);
	const [propertyTypeOptions, setPropertyTypeOptions] = useState<OptionType[]>([]);
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(
		moment(reservationFilters.startDate)
	);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(moment(reservationFilters.endDate));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('regionIds', reservationFilters.regionIds || [], []),
			new RsFormControl('propertyTypeIds', reservationFilters.propertyTypeIds || [], []),
			new RsFormControl('adultCount', reservationFilters.adultCount || 2, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Adults Required'),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Required', (control) => {
					return control.value !== 0;
				})
			]),
			new RsFormControl('childCount', reservationFilters.childCount || 0, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Children Required')
			]),
			new RsFormControl('priceRangeMax', reservationFilters.priceRangeMax || 0, []),
			new RsFormControl('priceRangeMin', reservationFilters.priceRangeMin || 0, [])
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
			}
		}
		getDropdownOptions().catch(console.error);
	}, []);

	async function updateFilterForm(control: RsFormControl) {
		if (control.key === 'adultCount' || control.key === 'priceRangeMax' || control.key === 'priceRangeMin') {
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
			updateSearchQueryObj(control.key, control.value);
		}
	}

	function isFormFilledOut(): boolean {
		return !!filterForm.get('adultCount').value.toString().length;
	}

	function updateSearchQueryObj(key: string, value: any) {
		if (key === 'adultCount' && value === 0) {
			//this should never evaluate to true with current implementations.
			throw rsToastify.error('Must have at least 1 adult', 'Missing or Incorrect Information');
		}
		if (key === 'adultCount' && isNaN(value)) {
			throw rsToastify.error('# of adults must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'priceRangeMin' && isNaN(parseInt(value))) {
			throw rsToastify.error('Price min must be a number', 'Missing or Incorrect Information');
		}
		if (key === 'priceRangeMax' && isNaN(parseInt(value))) {
			throw rsToastify.error('Price max must be a number', 'Missing or Incorrect Information');
		}
		if (
			key === 'priceRangeMin' &&
			reservationFilters['priceRangeMax'] &&
			value > reservationFilters['priceRangeMax']
		) {
			setErrorMessage('Price min must be lower than the max');
		} else if (
			key === 'priceRangeMax' &&
			reservationFilters['priceRangeMin'] &&
			value < reservationFilters['priceRangeMin']
		) {
			setErrorMessage('Price max must be greater than the min');
		} else {
			setErrorMessage('');
		}
		setReservationFilters((prev) => {
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
					updateControl={updateFilterForm}
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
				updateControl={updateFilterForm}
				className="numberOfAdults"
				inputType="number"
				title="# of Adults"
			/>
			<LabelInput
				control={filterForm.get('priceRangeMin')}
				updateControl={updateFilterForm}
				className="priceMin"
				inputType="number"
				title="Price Min"
			/>
			<LabelInput
				control={filterForm.get('priceRangeMax')}
				updateControl={updateFilterForm}
				className="priceMax"
				inputType="number"
				title="Price Max"
			/>
			<LabelSelect
				title="Property Type"
				control={filterForm.get('propertyTypeIds')}
				updateControl={updateFilterForm}
				options={propertyTypeOptions}
				isMulti={true}
			/>
		</Box>
	);
};

export default FilterBar;
