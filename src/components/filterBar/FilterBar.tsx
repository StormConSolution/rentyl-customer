import React, { useEffect, useState } from 'react';
import moment from 'moment';
import DateRangeSelector from '../dateRangeSelector/DateRangeSelector';
import LabelInput from '../labelInput/LabelInput';
import './FilterBar.scss';
import debounce from 'lodash.debounce';
import { Box } from '@bit/redsky.framework.rs.996';
import { StringUtils, WebUtils } from '../../utils/utils';
import LabelSelect from '../labelSelect/LabelSelect';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

export interface SelectOptionControls {
	options: OptionType[];
	control: RsFormControl;
	updateControl: (control: RsFormControl) => void;
}
export interface FilterBarProps {
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
	focusedInput: 'startDate' | 'endDate' | null;
	onFocusChange: (focusedInput: 'startDate' | 'endDate' | null) => void;
	monthsToShow: number;
	onChangeAdults: (value: any) => void;
	onChangeChildren: (value: any) => void;
	onChangePriceMin: (value: any) => void;
	onChangePriceMax: (value: any) => void;
	onChangePropertyType: (control: RsFormControl) => void;
	regionSelect?: SelectOptionControls;
	adultsInitialInput: number;
	childrenInitialInput: number;
	initialPriceMin?: string;
	initialPriceMax?: string;
	className?: string;
	display?: string;
}

const FilterBar: React.FC<FilterBarProps> = (props) => {
	let destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const [options, setOptions] = useState<OptionType[]>([]);
	const [propertyType, setPropertyType] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('propertyType', '', [])])
	);

	useEffect(() => {
		async function getAllFilterOptions() {
			try {
				let propertyTypes = await destinationService.getAllPropertyTypes();
				let newOptions = formatOptions(propertyTypes);
				setOptions(newOptions);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'An unexpected server error has occurred'),
					'Server Error'
				);
			}
		}
		getAllFilterOptions().catch(console.error);
	}, []);

	function formatOptions(options: Api.Destination.Res.PropertyType[] | Api.Region.Res.Get[]) {
		return options.map((value) => {
			return { value: value.id, label: value.name };
		});
	}

	return (
		<Box className={`rsFilterBar ${props.className || ''}`}>
			{props.regionSelect && (
				<LabelSelect
					title={'Regions'}
					updateControl={props.regionSelect.updateControl}
					selectOptions={props.regionSelect.options}
					control={props.regionSelect.control}
					isMulti
					isSearchable
				/>
			)}
			<DateRangeSelector
				startDate={props.startDate}
				endDate={props.endDate}
				onDatesChange={props.onDatesChange}
				monthsToShow={props.monthsToShow}
				focusedInput={props.focusedInput}
				onFocusChange={(focusedInput) => props.onFocusChange(focusedInput)}
				startDateLabel={'check in'}
				endDateLabel={'check out'}
			/>
			<LabelInput
				className="numberOfAdults"
				inputType="text"
				title="# of Adults"
				initialValue={'' + props.adultsInitialInput}
				onChange={debounce(async (value) => {
					if (!isNaN(parseInt(value)) && parseInt(value) < 1) {
						value = 1;
					}
					props.onChangeAdults(value);
				}, 300)}
			/>
			<LabelInput
				className="numberOfChildren"
				inputType="text"
				title="# of Children"
				initialValue={'' + props.childrenInitialInput}
				onChange={debounce(async (value) => {
					props.onChangeChildren(value);
				}, 300)}
			/>
			<LabelInput
				className="priceMin"
				inputType="text"
				title="Price Min"
				initialValue={`$${StringUtils.addCommasToNumber(props.initialPriceMin)}` || ''}
				onChange={debounce(async (value) => {
					props.onChangePriceMin(
						value === '' ? 0 : StringUtils.removeLineEndings(value.replace(/[,$]/g, ''))
					);
				}, 500)}
			/>
			<LabelInput
				className="priceMax"
				inputType="text"
				title="Price Max"
				initialValue={`$${StringUtils.addCommasToNumber(props.initialPriceMax)}` || ''}
				onChange={debounce(async (value) => {
					props.onChangePriceMax(
						value === '' ? 0 : StringUtils.removeLineEndings(value.replace(/[,$]/g, ''))
					);
				}, 500)}
			/>
			<LabelSelect
				className={props.display}
				title="Property Type"
				control={propertyType.get('propertyType')}
				updateControl={(control) => {
					setPropertyType(propertyType.clone().update(control));
					props.onChangePropertyType(control);
				}}
				selectOptions={options}
				isMulti={true}
			/>
		</Box>
	);
};

export default FilterBar;
