import * as React from 'react';
import { useEffect, useState } from 'react';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import './FilterReservationPopup.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
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
import LabelCheckboxV2 from '../../components/labelCheckbox/LabelCheckboxV2';
import Slider, { SliderMode } from '@bit/redsky.framework.rs.slider';
import LabelInputV2 from '../../components/labelInput/LabelInputV2';

export interface FilterReservationPopupProps extends PopupProps {
	searchRegion?: boolean;
	onClickApply: (adults: number, priceRangeMin: string, priceRangeMax: string, propertyTypeIds: number[]) => void;
	className?: string;
}

const FilterReservationPopup: React.FC<FilterReservationPopupProps> = (props) => {
	const params = router.getPageUrlParams<{
		adultCount: number;
		priceRangeMax: string;
		priceRangeMin: string;
		propertyTypeIds: string;
	}>([
		{ key: 'adultCount', default: 1, type: 'integer', alias: 'adultCount' },
		{ key: 'priceRangeMax', default: '', type: 'string', alias: 'priceRangeMax' },
		{ key: 'priceRangeMin', default: '', type: 'string', alias: 'priceRangeMin' },
		{ key: 'propertyTypeIds', default: '', type: 'string', alias: 'propertyTypeIds' }
	]);

	const [sortBySelection, setSortBySelection] = useState<number>();
	const [redeemCodeToggle, setRedeemCodeToggle] = useState<boolean>(false);
	const [accommodationToggle, setAccommodationToggle] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(true);
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const regionService = serviceFactory.get<RegionService>('RegionService');

	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('propertyTypeIds', setPropertyTypeIds(), []),
			new RsFormControl('adultCount', params.adultCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Adults Required')
			]),
			new RsFormControl('bedroomCount', params.adultCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Bedrooms Required')
			]),
			new RsFormControl('bathroomCount', params.adultCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Bathrooms Required')
			]),
			new RsFormControl('priceRangeMax', StringUtils.addCommasToNumber(params.priceRangeMax), []),
			new RsFormControl('priceRangeMin', StringUtils.addCommasToNumber(params.priceRangeMin), []),
			new RsFormControl('accommodationType', [], [])
		])
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

	async function updateFilterForm(control: RsFormControl | undefined) {
		if (!control) return;
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
			filterObject.adultCount,
			StringUtils.removeAllExceptNumbers(filterObject.priceRangeMin),
			StringUtils.removeAllExceptNumbers(filterObject.priceRangeMax),
			filterObject.propertyTypeIds
		);
		popupController.close(FilterReservationPopup);
	}

	function renderAccommodationCheckboxes() {
		return (
			<>
				{propertyTypeOptions.map((item, idx) => (
					<Box marginY={10}>
						<LabelCheckboxV2
							key={item.value}
							value={item.value}
							text={item.label}
							onSelect={() => {
								let tempControl = filterForm.get('accommodationType');
								tempControl.value = [...(tempControl.value as number[]), item.value as number];
								updateFilterForm(tempControl);
							}}
							isChecked={(filterForm.get('accommodationType').value as number[]).includes(
								item.value as number
							)}
							onDeselect={() => {
								filterForm.get('accommodationType').value = (filterForm.get('accommodationType')
									.value as number[]).filter((type) => type !== item.value);
								updateFilterForm(filterForm.get('accommodationType'));
							}}
						/>
					</Box>
				))}
			</>
		);
	}

	function renderResortExperiences() {
		return (
			<>
				{destinationService.resortExperiences.map((item, idx) => (
					<Box marginY={10}>
						<LabelCheckboxV2
							key={item.value}
							value={item.value}
							text={item.label}
							onSelect={() => console.log('selected')}
							isChecked={accommodationToggle}
							onDeselect={() => console.log('Deselected')}
							isDisabled={true}
						/>
					</Box>
				))}
			</>
		);
	}

	function renderInUnitAmenities() {
		return (
			<>
				{destinationService.inUnitAmenities.map((item, idx) => (
					<Box marginY={10}>
						<LabelCheckboxV2
							key={item.value}
							value={item.value}
							text={item.label}
							onSelect={() => console.log('selected')}
							isChecked={accommodationToggle}
							onDeselect={() => console.log('Deselected')}
							isDisabled={true}
						/>
					</Box>
				))}
			</>
		);
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<div className={'rsFilterReservationPopup'}>
				<Paper className={'paperWrapper'}>
					<Box className="paperHeader">
						<Label className={'filtersLabel'} variant={'h5'}>
							Filters
						</Label>
						<Label onClick={() => popupController.closeLast()}>
							<Icon iconImg="icon-close" size={20} className="closeIcon" />
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
									checked={sortBySelection === 0}
									text="Highest Price"
									onSelect={() => {
										setSortBySelection(0);
									}}
									labelSize="body2"
									isDisabled={true}
								/>
							</Box>
							<Box marginBottom={15}>
								<LabelRadioButton
									radioName="lowestRadioBtn"
									value="sortLow"
									checked={sortBySelection === 1}
									text="Lowest Price"
									onSelect={() => {
										setSortBySelection(1);
									}}
									labelSize="body2"
									isDisabled={true}
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
									minCount={1}
									labelMarginRight={5}
								/>
							</Box>
							<Box marginBottom={15}>
								<Counter
									title="Bedrooms"
									control={filterForm.get('bedroomCount')}
									updateControl={updateFilterForm}
									className={'filterCounter'}
									minCount={1}
									labelMarginRight={5}
								/>
							</Box>
							<Box marginBottom={15}>
								<Counter
									title="Bathrooms"
									control={filterForm.get('bathroomCount')}
									updateControl={updateFilterForm}
									className={'filterCounter'}
									minCount={1}
									labelMarginRight={5}
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
								<Box>
									<Slider
										range={[1, 1000]}
										minControl={filterForm.get('priceRangeMin')}
										maxControl={filterForm.get('priceRangeMax')}
										sliderIcons={'icon-hamburger-menu'}
										rotate={90}
										updateMinControl={updateFilterForm}
										updateMaxControl={updateFilterForm}
										mode={SliderMode.COLLISION}
										handleStyle={{ border: '1px solid black', borderRadius: '50%' }}
										railClass="priceSliderRail"
										sliderClass="priceSlider"
									/>
								</Box>
								<div className={'minMaxDiv'}>
									<LabelInputV2
										className="priceMin"
										inputType="text"
										title="min price"
										control={filterForm.get('priceRangeMin')}
										updateControl={updateFilterForm}
									/>
									<hr className="divider" />
									<LabelInputV2
										className="priceMax"
										inputType="text"
										title="max price"
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
							<Box marginBottom={15} id="accommodationList">
								{renderAccommodationCheckboxes()}
							</Box>
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
							<Box marginBottom={60}>{renderInUnitAmenities()}</Box>
						</div>
					</Box>
					<div className={'paperFooter'}>
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
