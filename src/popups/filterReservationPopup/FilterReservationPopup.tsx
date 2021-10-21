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
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import RegionService from '../../services/region/region.service';
import DestinationService from '../../services/destination/destination.service';
import serviceFactory from '../../services/serviceFactory';
import router from '../../utils/router';

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

	const [isValid, setIsValid] = useState<boolean>(true);
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const regionService = serviceFactory.get<RegionService>('RegionService');
	const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
	const [endDate, setEndDate] = useState<moment.Moment | null>(moment().add(7, 'd'));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDate(startDate);
		setEndDate(endDate);
	}

	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('regionIds', [], []),
			new RsFormControl('propertyTypeIds', setPropertyTypeIds(), []),
			new RsFormControl('adultCount', params.adultCount || 2, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Adults Required')
			]),
			new RsFormControl('childCount', params.childCount || 0, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Children Required')
			]),
			new RsFormControl('priceRangeMax', StringUtils.addCommasToNumber(params.priceRangeMax), []),
			new RsFormControl('priceRangeMin', StringUtils.addCommasToNumber(params.priceRangeMin), []),
			new RsFormControl('rateCode', params.rateCode || '', [])
		])
	);
	const [propertyTypeOptions, setPropertyTypeOptions] = useState<OptionType[]>([]);
	const [regionOptions, setRegionOptions] = useState<OptionType[]>([]);

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

	function setPropertyTypeIds() {
		if (params.propertyTypeIds.length > 0) {
			let propertyTypeArray = params.propertyTypeIds.split(',');
			return propertyTypeArray.map((item) => {
				return parseInt(item);
			});
		}
		return [];
	}

	function formatOptions(options: Api.Destination.Res.PropertyType[] | Api.Region.Res.Get[]) {
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
	}

	function isFormFilledOut(): boolean {
		return (
			!!filterForm.get('adultCount').value.toString().length &&
			!!filterForm.get('childCount').value.toString().length
		);
	}

	function saveFilter() {
		let filterObject: Misc.FilterFormPopupOptions = filterForm.toModel();
		props.onClickApply(
			startDate,
			endDate,
			filterObject.adultCount,
			filterObject.childCount,
			StringUtils.removeAllExceptNumbers(filterObject.priceRangeMin),
			StringUtils.removeAllExceptNumbers(filterObject.priceRangeMax),
			filterObject.propertyTypeIds,
			filterObject.rateCode,
			filterObject.regionIds
		);
		popupController.close(FilterReservationPopup);
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
								control={filterForm.get('adultCount')}
								updateControl={updateFilterForm}
							/>
							<LabelInput
								className="numberOfChildren"
								inputType="text"
								title="# of Children"
								control={filterForm.get('childCount')}
								updateControl={updateFilterForm}
							/>
						</div>
						<div className={'minMaxDiv'}>
							<LabelInput
								className="priceMin"
								inputType="text"
								title="Price Min"
								control={filterForm.get('priceRangeMin')}
								updateControl={updateFilterForm}
							/>
							<LabelInput
								className="priceMax"
								inputType="text"
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
						<LabelInput
							className={'rateCode'}
							inputType={'text'}
							title={'Rate Code'}
							control={filterForm.get('rateCode')}
							updateControl={updateFilterForm}
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
								className={isValid ? 'applyButton' : 'applyButton disabled'}
								look={'containedPrimary'}
								variant={'button'}
								label={'Apply'}
								onClick={() => {
									saveFilter();
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
