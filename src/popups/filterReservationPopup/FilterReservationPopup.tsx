import * as React from 'react';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import './FilterReservationPopup.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import LabelInput from '../../components/labelInput/LabelInput';
import moment from 'moment';
import { useEffect, useState } from 'react';
import LabelButton from '../../components/labelButton/LabelButton';
import { StringUtils, WebUtils } from '../../utils/utils';
import { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import RegionService from '../../services/region/region.service';
import DestinationService from '../../services/destination/destination.service';
import serviceFactory from '../../services/serviceFactory';
import router from '../../utils/router';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Icon from '@bit/redsky.framework.rs.icon';
import LabelRadioButton from '../../components/labelRadioButton/LabelRadioButton';
import Counter from '../../components/counter/Counter';
import Switch from '@bit/redsky.framework.rs.switch';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';

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

	const [sortByHighestToggle, setSortByHighestToggle] = useState<boolean>(false);
	const [sortByLowestToggle, setSortByLowestToggle] = useState<boolean>(false);
	const [redeemCodeToggle, setRedeemCodeToggle] = useState<boolean>(false);
	const [accommodationToggle, setAccommodationToggle] = useState<boolean>(false);
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
			new RsFormControl('adultCount', params.adultCount || 1, [
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
	const [averagePrice, setAveragePrice] = useState(0);
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

	function setPropertyTypeIds() {
		if (params.propertyTypeIds.length > 0) {
			let propertyTypeArray = params.propertyTypeIds.split(',');
			return propertyTypeArray.map((item) => {
				return parseInt(item);
			});
		}
		return [];
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
		}
		filterForm.update(control);
		let isFormValid = await filterForm.isValid();
		setIsValid(isFormValid);
		setFilterForm(filterForm.clone());
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

	function renderAccommodationCheckboxes() {
		return (
			<>
				{propertyTypeOptions.map((item, idx) => (
					<LabelCheckbox
						value={item.value}
						text={item.label}
						onSelect={() => setAccommodationToggle(true)}
						isChecked={accommodationToggle}
						onDeselect={() => setAccommodationToggle(false)}
					/>
				))}
			</>
		);
	}

	function renderResortExperiences() {
		return (
			<>
				{destinationService.resortExperiences.map((item, idx) => (
					<LabelCheckbox
						value={item.value}
						text={item.label}
						onSelect={() => setAccommodationToggle(true)}
						isChecked={accommodationToggle}
						onDeselect={() => setAccommodationToggle(false)}
					/>
				))}
			</>
		);
	}

	function renderInUnitAmenities() {
		return (
			<>
				{destinationService.inUnitAmenities.map((item, idx) => (
					<LabelCheckbox
						value={item.value}
						text={item.label}
						onSelect={() => setAccommodationToggle(true)}
						isChecked={accommodationToggle}
						onDeselect={() => setAccommodationToggle(false)}
					/>
				))}
			</>
		);
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<div className={'rsFilterReservationPopup'}>
				<Paper className={'paperWrapper'} backgroundColor={'#fcfbf8'}>
					<Box className="paperHeader">
						<Label className={'filtersLabel'} variant={'h5'}>
							Filters
						</Label>
						<Label onClick={() => popupController.closeLast()}>
							<Icon iconImg="icon-close" color="#797979" size={20} className="closeIcon" />
						</Label>
					</Box>
					<Box className="paperBody">
						<div className="formDiv" id="sortByDiv">
							<Label className="sortByLabel" variant="body1" marginBottom={15}>
								Sort by
							</Label>
							<Box marginBottom={15}>
								<LabelRadioButton
									radioName="highestRadioBtn"
									value="sortHigh"
									checked={sortByHighestToggle}
									text="Highest Price"
									onSelect={() => {
										setSortByHighestToggle(!sortByHighestToggle);
										console.log('Sort High');
									}}
									labelSize="body2"
								/>
							</Box>
							<Box marginBottom={15}>
								<LabelRadioButton
									radioName="lowestRadioBtn"
									value="sortLow"
									checked={sortByLowestToggle}
									text="Lowest Price"
									onSelect={() => {
										setSortByLowestToggle(!sortByLowestToggle);
										console.log('Sort Low');
									}}
									labelSize="body2"
								/>
							</Box>
						</div>
						<div className="formDiv" id="guestsDiv">
							<Box marginY={15}>
								<Counter
									title="Guests"
									control={filterForm.get('adultCount')}
									updateControl={updateFilterForm}
									className={'filterCounter'}
								/>
							</Box>
							<Box marginBottom={15}>
								<Counter
									title="Bedrooms"
									control={filterForm.get('childCount')}
									updateControl={updateFilterForm}
									className={'filterCounter'}
								/>
							</Box>
							<Box marginBottom={15}>
								<Counter
									title="Bathrooms"
									control={filterForm.get('childCount')}
									updateControl={updateFilterForm}
									className={'filterCounter'}
								/>
							</Box>
						</div>
						<div className="formDiv" id="redeemPointsDiv">
							<Box className="redeemPointsContainer">
								<Label className="redeemPointsLabel" variant="body1">
									Redeem Points
								</Label>
								<Switch checked={redeemCodeToggle} label={'{"left":"" }'} />
							</Box>
						</div>
						<div className="formDiv" id="priceSliderDiv">
							<Label className="priceLabel" variant="body1" marginY={15}>
								Price
							</Label>
							<Box marginBottom={15}>
								<Label marginTop={22} marginBottom={15}>
									The average nightly price is ${isNaN(averagePrice) ? '0' : averagePrice}
								</Label>
								<div className={'minMaxDiv'}>
									<LabelInput
										className="priceMin"
										inputType="text"
										title="Price Min"
										control={filterForm.get('priceRangeMin')}
										updateControl={updateFilterForm}
									/>
									<hr className="divider" />
									<LabelInput
										className="priceMax"
										inputType="text"
										title="Price Max"
										control={filterForm.get('priceRangeMax')}
										updateControl={updateFilterForm}
									/>
								</div>
							</Box>
						</div>
						<div className="formDiv" id="accommodationDiv">
							<Label className="accommodationLabel" variant="body1" marginY={15}>
								Accommodation
							</Label>
							<Box marginBottom={15}>{renderAccommodationCheckboxes()}</Box>
						</div>
						<div className="formDiv" id="resortExperiencesDiv">
							<Label className="accommodationLabel" variant="body1" marginY={15}>
								Resort Experiences
							</Label>
							<Box marginBottom={15}>{renderResortExperiences()}</Box>
						</div>
						<div className="formDiv" id="resortExperiencesDiv">
							<Label className="accommodationLabel" variant="body1" marginY={15}>
								In Unit Amenities
							</Label>
							<Box marginBottom={15}>{renderInUnitAmenities()}</Box>
						</div>
						<div className={'formWrapper'}>
							{/*<LabelSelect*/}
							{/*	title={'Property Type'}*/}
							{/*	control={filterForm.get('propertyTypeIds')}*/}
							{/*	updateControl={updateFilterForm}*/}
							{/*	options={propertyTypeOptions}*/}
							{/*	isMulti={true}*/}
							{/*/>*/}
						</div>
					</Box>
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
				</Paper>
			</div>
		</Popup>
	);
};

export default FilterReservationPopup;
