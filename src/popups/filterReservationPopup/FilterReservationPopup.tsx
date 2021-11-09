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
import router from '../../utils/router';
import globalState from '../../state/globalState';
import { useRecoilState } from 'recoil';

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
	const params = router.getPageUrlParams<{
		startDate: string;
		endDate: string;
		adultCount: number;
		childCount: number;
		region: string;
		rateCode: string;
		priceRangeMax: string;
		priceRangeMin: string;
		propertyTypeIds: string;
	}>([
		{ key: 'startDate', default: '', type: 'string', alias: 'startDate' },
		{ key: 'endDate', default: '', type: 'string', alias: 'endDate' },
		{ key: 'adultCount', default: 2, type: 'integer', alias: 'adultCount' },
		{ key: 'childCount', default: 0, type: 'integer', alias: 'childCount' },
		{ key: 'region', default: '', type: 'string', alias: 'region' },
		{ key: 'rateCode', default: '', type: 'string', alias: 'rateCode' },
		{ key: 'priceRangeMax', default: '', type: 'string', alias: 'priceRangeMax' },
		{ key: 'priceRangeMin', default: '', type: 'string', alias: 'priceRangeMin' },
		{ key: 'propertyTypeIds', default: '', type: 'string', alias: 'propertyTypeIds' }
	]);

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
		if (!params.startDate && !params.endDate) return;
		onDatesChange(moment(params.startDate), moment(params.endDate));
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

	async function updateFilterForm(control: RsFormControl) {
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
		setIsValid(isFormValid && _isFormFilledOut);
		setFilterForm(filterForm.clone());
		if (isFormValid && _isFormFilledOut) {
			updateSearchQueryObj(control.key, control.value);
		}
	}

	function updateSearchQueryObj(key: string, value: any) {
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

	function isFormFilledOut(): boolean {
		return (
			!!filterForm.get('adultCount').value.toString().length &&
			!!filterForm.get('childCount').value.toString().length
		);
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
								inputType="number"
								title="# of Adults"
								control={filterForm.get('adultCount')}
								updateControl={updateFilterForm}
							/>
							<LabelInput
								className="numberOfChildren"
								inputType="number"
								title="# of Children"
								control={filterForm.get('childCount')}
								updateControl={updateFilterForm}
							/>
						</div>
						<div className={'minMaxDiv'}>
							<LabelInput
								className="priceMin"
								inputType="number"
								title="Price Min"
								control={filterForm.get('priceRangeMin')}
								updateControl={updateFilterForm}
							/>
							<LabelInput
								className="priceMax"
								inputType="number"
								title="Price Max"
								control={filterForm.get('priceRangeMax')}
								updateControl={updateFilterForm}
							/>
						</div>
						<LabelSelect
							title={'Property Type'}
							control={filterForm.get('propertyTypeIds')}
							updateControl={updateFilterForm}
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
