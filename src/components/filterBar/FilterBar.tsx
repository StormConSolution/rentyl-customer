import React, { useEffect, useState } from 'react';
import moment from 'moment';
import DateRangeSelector from '../dateRangeSelector/DateRangeSelector';
import LabelInput from '../labelInput/LabelInput';
import './FilterBar.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { formatFilterDateForServer, ObjectUtils } from '../../utils/utils';
import LabelSelect from '../labelSelect/LabelSelect';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
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
	const [isFilterFormValid, setIsFilterFormValid] = useState<boolean>(true);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('regions', searchQueryObj.regionIds || [], []),
			new RsFormControl('propertyType', searchQueryObj.propertyTypeIds || [], []),
			new RsFormControl('adultCount', searchQueryObj.adultCount, []),
			new RsFormControl('childCount', searchQueryObj.childCount, []),
			new RsFormControl('priceRangeMin', searchQueryObj.priceRangeMin || 0, []),
			new RsFormControl('priceChangeMax', searchQueryObj.priceRangeMax || 0, [])
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

	useEffect(() => {
		async function validateForm() {
			let isValid = await filterForm.isValid();
			setIsFilterFormValid(isValid);
		}
		validateForm().catch(console.error);
	}, [filterForm]);

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
		if (!isFilterFormValid) return;
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

	function updateFilterForm(
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
		setFilterForm(filterForm.clone().update(control));
		if (key === 'adultCount' || key === 'childCount' || key === 'priceRangeMin' || key === 'priceRangeMax') {
			updateSearchQueryObj(key, +control.value);
		} else {
			updateSearchQueryObj(key, control.value);
		}
	}

	return (
		<Box className={`rsFilterBar`}>
			<LabelSelect
				title={'Regions'}
				updateControl={(control) => updateFilterForm('regionIds', control)}
				options={regionOptions}
				control={filterForm.get('regions')}
				isMulti
				isSearchable
			/>
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
				control={filterForm.get('priceChangeMax')}
				updateControl={(control) => updateFilterForm('priceRangeMax', control)}
				className="priceMax"
				inputType="number"
				title="Price Max"
			/>
			<LabelSelect
				title="Property Type"
				control={filterForm.get('propertyType')}
				updateControl={(control) => updateFilterForm('propertyTypeIds', control)}
				options={propertyTypeOptions}
				isMulti={true}
			/>
		</Box>
	);
};

export default FilterBar;
