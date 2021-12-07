import * as React from 'react';
import './FilterBarV2.scss';
import { ObjectUtils, StringUtils, WebUtils } from '../../utils/utils';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import FilterBarDropDown from '../filterBarDropDown/FilterBarDropDown';
import LabelCheckboxV2 from '../labelCheckbox/LabelCheckboxV2';
import { useEffect, useState } from 'react';
import Slider, { SliderMode } from '@bit/redsky.framework.rs.slider';
import LabelInputV2 from '../labelInput/LabelInputV2';
import Counter from '../counter/Counter';
import LabelRadioButton from '../labelRadioButton/LabelRadioButton';
import Label from '@bit/redsky.framework.rs.label';
import serviceFactory from '../../services/serviceFactory';
import Switch from '@bit/redsky.framework.rs.switch';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import DestinationService from '../../services/destination/destination.service';
import AccommodationService from '../../services/accommodation/accommodation.service';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import LabelButton from '../labelButton/LabelButton';
import Icon from '@bit/redsky.framework.rs.icon';

interface FilterBarV2Props {}

const TIMEOUT_INTERVAL = 500;

const FilterBarV2: React.FC<FilterBarV2Props> = () => {
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const [propertyTypes, setPropertyTypes] = useState<Model.PropertyType[]>([]);
	const [experienceOptions, setExperienceOptions] = useState<Misc.OptionType[]>([]);
	const [amenityOptions, setAmenityOptions] = useState<Misc.OptionType[]>([]);
	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			//propertyTypeIds are the text accommodationType on the front end.
			//We already have accommodationType and this was already listed as propertyType on the backend.
			new RsFormControl('propertyTypeIds', reservationFilters.propertyTypeIds || [], []),
			new RsFormControl('bedroomCount', reservationFilters.bedroomCount || 0, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Bedrooms Required')
			]),
			new RsFormControl('bathroomCount', reservationFilters.bathroomCount || 0, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Bathrooms Required')
			]),
			new RsFormControl(
				'priceRangeMax',
				StringUtils.addCommasToNumber(reservationFilters.priceRangeMax) || 1000,
				[]
			),
			new RsFormControl(
				'priceRangeMin',
				StringUtils.addCommasToNumber(reservationFilters.priceRangeMin) || 1,
				[]
			),
			new RsFormControl('experienceIds', reservationFilters.experienceIds || [], []),
			new RsFormControl('amenityIds', reservationFilters.amenityIds || [], []),
			new RsFormControl('sortOrder', reservationFilters.sortOrder || 'ASC', [])
		])
	);
	let timeout: number;

	useEffect(() => {
		/**
		 * This useEffect grabs the current url params on first page load and sets the search Query Object.
		 */
		//get all filterForm controls to update
		let {
			propertyTypeControl,
			bedroomCountControl,
			bathroomCountControl,
			priceRangeMinControl,
			priceRangeMaxControl,
			experienceIdsControl,
			amenityIdsControl,
			sortOrderControl
		} = getAllControls();

		//set values from the url params
		const filters = WebUtils.parseURLParamsToFilters();
		propertyTypeControl.value = filters.propertyTypeIds || [];
		bedroomCountControl.value = filters.bedroomCount || 0;
		bathroomCountControl.value = filters.bathroomCount || 0;
		priceRangeMinControl.value = filters.priceRangeMin || 10;
		priceRangeMaxControl.value = filters.priceRangeMax || 1000;
		experienceIdsControl.value = filters.experienceIds || [];
		amenityIdsControl.value = filters.amenityIds || [];
		sortOrderControl.value = filters.sortOrder || 'ASC';

		updateAllControls([
			propertyTypeControl,
			bedroomCountControl,
			bathroomCountControl,
			priceRangeMinControl,
			priceRangeMaxControl,
			experienceIdsControl,
			amenityIdsControl,
			sortOrderControl
		]);

		setReservationFilters(filters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		async function getFilterBarOptions() {
			try {
				const propertyTypes = await destinationService.getAllPropertyTypes();
				const amenities = await accommodationService.getAllAmenities();
				const experiences = await destinationService.getExperienceTypes();

				setPropertyTypes(propertyTypes);
				setAmenityOptions(
					amenities.map((amenity) => {
						return { value: amenity.id, label: amenity.title };
					})
				);
				setExperienceOptions(
					experiences.map((experience) => {
						return { value: experience.id, label: experience.title };
					})
				);
			} catch (e) {
				rsToastify.error(
					'An unexpected error occurred on the server, unable to get all the options.',
					'Server Error!'
				);
			}
		}
		getFilterBarOptions().catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		/**
		 * This is used to update the url parameters anytime the recoil state changes
		 */
		WebUtils.updateUrlParams(reservationFilters);
	}, [reservationFilters]);

	function sanitizePriceFieldsAndUpdate(control: RsFormControl) {
		if (!control) return;
		control.value = control.value.toString().replaceAll(/[^0-9]/g, '');
		updateFilterFormWithTimeout(control);
	}

	function updateFilterFormWithTimeout(control: RsFormControl | undefined) {
		if (timeout) window.clearTimeout(timeout);
		timeout = window.setTimeout(() => updateFilterForm(control), TIMEOUT_INTERVAL);
	}

	function updateFilterForm(control: RsFormControl | undefined) {
		if (!control) return;
		filterForm.update(control);
		setFilterForm(filterForm.clone());
	}

	function onApplyClick() {
		setReservationFilters((prev) => {
			const form: {
				propertyTypeIds: number[];
				bedroomCount: number;
				bathroomCount: number;
				priceRangeMax: number;
				priceRangeMin: number;
				experienceIds: number[];
				amenityIds: number[];
				sortOrder: 'ASC' | 'DESC';
			} = filterForm.toModel();
			return { ...prev, ...form };
		});
	}

	function checkForFilters(): boolean {
		let {
			propertyTypeControl,
			bedroomCountControl,
			bathroomCountControl,
			priceRangeMinControl,
			priceRangeMaxControl,
			experienceIdsControl,
			amenityIdsControl,
			sortOrderControl
		} = getAllControls();

		if (ObjectUtils.isArrayWithData(propertyTypeControl.value as number[])) {
			return true;
		}
		if ((bedroomCountControl.value as number) > 0) return true;
		if ((bathroomCountControl.value as number) > 0) return true;
		if ((priceRangeMinControl.value as number) > 10) return true;
		if ((priceRangeMaxControl.value as number) < 1000) return true;
		if (ObjectUtils.isArrayWithData(experienceIdsControl.value as number[])) {
			return true;
		}
		if (ObjectUtils.isArrayWithData(amenityIdsControl.value as number[])) {
			return true;
		}

		return sortOrderControl?.value !== 'ASC';
	}

	function clearAll() {
		let {
			propertyTypeControl,
			bedroomCountControl,
			bathroomCountControl,
			priceRangeMinControl,
			priceRangeMaxControl,
			experienceIdsControl,
			amenityIdsControl,
			sortOrderControl
		} = getAllControls();

		propertyTypeControl.value = [];
		bedroomCountControl.value = 0;
		bathroomCountControl.value = 0;
		priceRangeMinControl.value = 10;
		priceRangeMaxControl.value = 1000;
		experienceIdsControl.value = [];
		amenityIdsControl.value = [];
		sortOrderControl.value = 'ASC';

		updateAllControls([
			propertyTypeControl,
			bedroomCountControl,
			bathroomCountControl,
			priceRangeMinControl,
			priceRangeMaxControl,
			experienceIdsControl,
			amenityIdsControl,
			sortOrderControl
		]);
		//update all controls
		setTimeout(() => {
			onApplyClick();
		}, 300);
	}

	function getAllControls(): { [key: string]: RsFormControl } {
		let propertyTypeControl = filterForm.get('propertyTypeIds');
		let bedroomCountControl = filterForm.get('bedroomCount');
		let bathroomCountControl = filterForm.get('bathroomCount');
		let priceRangeMinControl = filterForm.get('priceRangeMin');
		let priceRangeMaxControl = filterForm.get('priceRangeMax');
		let experienceIdsControl = filterForm.get('experienceIds');
		let amenityIdsControl = filterForm.get('amenityIds');
		let sortOrderControl = filterForm.get('sortOrder');
		return {
			propertyTypeControl,
			bedroomCountControl,
			bathroomCountControl,
			priceRangeMinControl,
			priceRangeMaxControl,
			experienceIdsControl,
			amenityIdsControl,
			sortOrderControl
		};
	}

	function updateAllControls(controls: RsFormControl[]) {
		let formClone = filterForm.clone();
		controls.forEach((control) => {
			formClone.update(control);
		});
		setFilterForm(formClone);
	}

	function renderAccommodationList() {
		return propertyTypes.map((item) => (
			<LabelCheckboxV2
				key={item.name}
				value={item.id}
				text={item.name}
				onSelect={() => {
					let tempControl = filterForm.get('propertyTypeIds');
					tempControl.value = [...(tempControl.value as number[]), item.id as number];
					updateFilterForm(tempControl);
				}}
				isChecked={(filterForm.get('propertyTypeIds').value as number[]).includes(item.id as number)}
				onDeselect={() => {
					filterForm.get('propertyTypeIds').value = (
						filterForm.get('propertyTypeIds').value as number[]
					).filter((type) => type !== item.id);
					updateFilterForm(filterForm.get('propertyTypeIds'));
				}}
				className="filterCheckbox"
				textColor="#001933"
			/>
		));
	}

	function renderResortExperiencesOptionsList() {
		return experienceOptions.map((item) => (
			<LabelCheckboxV2
				key={item.value}
				value={item.value}
				text={item.label}
				onSelect={() => {
					let tempControl = filterForm.get('experienceIds');
					tempControl.value = [...(tempControl.value as number[]), item.value as number];
					updateFilterForm(tempControl);
				}}
				isChecked={(filterForm.get('experienceIds').value as number[]).includes(item.value as number)}
				onDeselect={() => {
					filterForm.get('experienceIds').value = (filterForm.get('experienceIds').value as number[]).filter(
						(type) => type !== item.value
					);
					updateFilterForm(filterForm.get('experienceIds'));
				}}
				className="filterCheckbox"
				textColor="#001933"
			/>
		));
	}

	function renderInUnitAmenitiesOptionsList() {
		return amenityOptions.map((item) => (
			<LabelCheckboxV2
				key={item.value}
				value={item.value}
				text={item.label}
				onSelect={() => {
					let tempControl = filterForm.get('amenityIds');
					tempControl.value = [...(tempControl.value as number[]), item.value as number];
					updateFilterForm(tempControl);
				}}
				isChecked={(filterForm.get('amenityIds').value as number[]).includes(item.value as number)}
				onDeselect={() => {
					filterForm.get('amenityIds').value = (filterForm.get('amenityIds').value as number[]).filter(
						(type) => type !== item.value
					);
					updateFilterForm(filterForm.get('amenityIds'));
				}}
				className="filterCheckbox"
				textColor="#001933"
			/>
		));
	}

	return (
		<div className="rsFilterBarV2">
			<Box className={'filterRow'}>
				<Box className="filterDropdownArea">
					<FilterBarDropDown
						onChangeCallBack={onApplyClick}
						onClearCallback={() => {
							let minPrice = filterForm.get('priceRangeMin');
							let maxPrice = filterForm.get('priceRangeMax');
							minPrice.value = 10;
							maxPrice.value = 1000;
							let formCopy = filterForm.clone();
							formCopy.update(minPrice);
							formCopy.update(maxPrice);
							setFilterForm(formCopy);
						}}
						title="Price"
						dropdownContentClassName="destinationFilterDropdown"
					>
						<Slider
							range={[10, 1000]}
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
						<div className="minMaxDiv">
							<LabelInputV2
								className={`priceMin ${
									Number(filterForm.get('priceRangeMin').value) >= 1000 ? 'andGreater' : ''
								}`}
								inputType="text"
								title="min price"
								control={filterForm.get('priceRangeMin')}
								updateControl={sanitizePriceFieldsAndUpdate}
							/>
							<hr className="divider" />
							<LabelInputV2
								className={`priceMax ${
									Number(filterForm.get('priceRangeMax').value) >= 1000 ? 'andGreater' : ''
								}`}
								inputType="text"
								title="max price"
								control={filterForm.get('priceRangeMax')}
								updateControl={sanitizePriceFieldsAndUpdate}
							/>
						</div>
					</FilterBarDropDown>
					<FilterBarDropDown
						onChangeCallBack={onApplyClick}
						onClearCallback={() => {
							let tempControl = filterForm.get('propertyTypeIds');
							tempControl.value = [];
							updateFilterForm(tempControl);
						}}
						title={
							!ObjectUtils.isArrayWithData(filterForm.get('propertyTypeIds').value)
								? 'Accommodations'
								: `Accommodations( ${(filterForm.get('propertyTypeIds').value as number[]).length} )`
						}
						dropdownContentClassName="destinationFilterDropdown"
					>
						{renderAccommodationList()}
					</FilterBarDropDown>
					<FilterBarDropDown
						onChangeCallBack={onApplyClick}
						onClearCallback={() => {
							let bedroom = filterForm.get('bedroomCount');
							bedroom.value = 0;
							let bathroom = filterForm.get('bathroomCount');
							bathroom.value = 0;
							let copyForm = filterForm.clone();
							copyForm.update(bedroom);
							copyForm.update(bathroom);
							setFilterForm(copyForm);
						}}
						title={
							(filterForm.get('bathroomCount').value || filterForm.get('bedroomCount').value)! > 0
								? `Bedrooms( ${
										(filterForm.get('bedroomCount').value as number) +
										(filterForm.get('bathroomCount').value as number)
								  } )`
								: 'Bedrooms'
						}
						dropdownContentClassName="destinationFilterDropdown"
					>
						<Counter
							title="Bedrooms"
							control={filterForm.get('bedroomCount')}
							updateControl={updateFilterForm}
							className={'filterCounter'}
							minCount={0}
							maxCount={15}
							labelMarginRight={5}
						/>
						<Counter
							title="Bathrooms"
							control={filterForm.get('bathroomCount')}
							updateControl={updateFilterForm}
							className={'filterCounter'}
							minCount={0}
							maxCount={15}
							labelMarginRight={5}
						/>
					</FilterBarDropDown>
					<FilterBarDropDown
						onChangeCallBack={onApplyClick}
						onClearCallback={() => {
							let tempControl = filterForm.get('experienceIds');
							tempControl.value = [];
							updateFilterForm(tempControl);
						}}
						title={
							!ObjectUtils.isArrayWithData(filterForm.get('experienceIds').value)
								? 'Resort Experiences'
								: `Resort Experiences( ${(filterForm.get('experienceIds').value as number[]).length} )`
						}
						dropdownContentClassName="destinationFilterDropdown"
					>
						{renderResortExperiencesOptionsList()}
					</FilterBarDropDown>
					<FilterBarDropDown
						onChangeCallBack={onApplyClick}
						onClearCallback={() => {
							let tempControl = filterForm.get('amenityIds');
							tempControl.value = [];
							updateFilterForm(tempControl);
						}}
						title={
							<Label variant="destinationAvailabilityCustomOne">
								{!ObjectUtils.isArrayWithData(filterForm.get('amenityIds').value)
									? 'Other Filters'
									: `Other Filters( ${(filterForm.get('amenityIds').value as number[]).length} )`}
							</Label>
						}
						dropdownContentClassName="inUnitAmenitiesCheckboxContentBody"
						icon="icon-slider"
						removeFilterByLabel
					>
						<Label variant="body1" paddingTop={10} paddingLeft={10}>
							In Unit Amenities
						</Label>
						<Box className="inUnitAmenitiesWrapper">{renderInUnitAmenitiesOptionsList()}</Box>
					</FilterBarDropDown>
				</Box>
				<hr />
				<Box>
					<FilterBarDropDown
						onChangeCallBack={onApplyClick}
						isSortField
						onClearCallback={() => {
							let tempControl = filterForm.get('sortOrder');
							tempControl.value = 'ASC';
							updateFilterForm(tempControl);
						}}
						title={reservationFilters.sortOrder === 'DESC' ? 'Highest Prices' : 'Lowest Prices'}
						dropdownContentClassName="pricesDropdown"
					>
						<LabelRadioButton
							radioName="highestRadioBtn"
							value="sortHigh"
							checked={reservationFilters.sortOrder === 'DESC'}
							text={`Highest Prices`}
							onSelect={() => {
								setReservationFilters({
									...reservationFilters,
									sortOrder: 'DESC'
								});
							}}
							labelSize="body1"
							className="priceHighRadio"
						/>
						<LabelRadioButton
							radioName="lowestRadioBtn"
							value="sortLow"
							checked={reservationFilters.sortOrder === 'ASC'}
							text="Lowest Prices"
							onSelect={() => {
								setReservationFilters({
									...reservationFilters,
									sortOrder: 'ASC'
								});
							}}
							labelSize="body1"
						/>
					</FilterBarDropDown>
				</Box>
				<Box className="redeemToggle">
					<Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'flex-start'}>
						<Label variant={'caption1'}>Redeem Points</Label>
						<Switch
							labelPosition={'top'}
							className={'toggleButton'}
							onChange={() =>
								setReservationFilters({
									...reservationFilters,
									redeemPoints: !reservationFilters.redeemPoints
								})
							}
						/>
					</Box>
				</Box>
			</Box>
			<Box className={'clearFilter'}>
				{checkForFilters() && (
					<LabelButton
						look={'none'}
						label={'Clear all filters'}
						className={'clearAllButton'}
						variant={'body1'}
						onClick={clearAll}
					/>
				)}
			</Box>
		</div>
	);
};

export default FilterBarV2;
