import * as React from 'react';
import './FilterBarV2.scss';
import { StringUtils } from '../../utils/utils';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import FilterBarDropDown from '../filterBarDropDown/FilterBarDropDown';
import LabelCheckboxV2 from '../labelCheckbox/LabelCheckboxV2';
import { useState } from 'react';
import Slider, { SliderMode } from '@bit/redsky.framework.rs.slider';
import LabelInputV2 from '../labelInput/LabelInputV2';
import Counter from '../counter/Counter';
import LabelRadioButton from '../labelRadioButton/LabelRadioButton';
import Label from '@bit/redsky.framework.rs.label';
import Switch from '@bit/redsky.framework.rs.switch';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import DestinationService from '../../services/destination/destination.service';
import PropertyType = Model.PropertyType;
import OptionType = Misc.OptionType;

interface FilterBarV2Props {
	destinationService: DestinationService;
	accommodationToggle: boolean;
	redeemCodeToggle: boolean;
	accommodationOptions: PropertyType[];
	resortExperiencesOptions: OptionType[];
	inUnitAmenitiesOptions: OptionType[];
}

const FilterBarV2: React.FC<FilterBarV2Props> = (props) => {
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const [sortBySelection, setSortBySelection] = useState<number>();
	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			//propertyTypeIds are the text accommodationType on the front end.
			//We already have accommodationType and this was already listed as propertyType on the backend.
			new RsFormControl('propertyTypeIds', reservationFilters.propertyTypeIds || [], []),
			new RsFormControl('adultCount', reservationFilters.adultCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Adults Required')
			]),
			new RsFormControl('bedroomCount', reservationFilters.adultCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Bedrooms Required')
			]),
			new RsFormControl('bathroomCount', reservationFilters.adultCount || 1, [
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
			new RsFormControl('amenityIds', reservationFilters.amenityIds || [], [])
		])
	);
	function updateFilterForm(control: RsFormControl | undefined) {
		if (!control) return;
		if (control.key === 'priceRangeMax' || control.key === 'priceRangeMin') {
			let newValue = StringUtils.addCommasToNumber(StringUtils.removeAllExceptNumbers(control.value.toString()));
			control.value = newValue;
		}
		filterForm.update(control);
		setFilterForm(filterForm.clone());
	}

	function onApplyClick() {
		setReservationFilters((prev) => {
			const form: {
				propertyTypeIds: number[];
				adultCount: number;
				bedroomCount: number;
				bathroomCount: number;
				priceRangeMax: number;
				priceRangeMin: number;
				experienceIds: number[];
				amenityIds: number[];
			} = filterForm.toModel();
			return { ...prev, ...form };
		});
	}

	function renderAccommodationList() {
		if (!props.accommodationOptions) return;
		return props.accommodationOptions.map((item) => (
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
					filterForm.get('propertyTypeIds').value = (filterForm.get('propertyTypeIds')
						.value as number[]).filter((type) => type !== item.id);
					updateFilterForm(filterForm.get('propertyTypeIds'));
				}}
			/>
		));
	}

	function renderResortExperiencesOptionsList() {
		return props.resortExperiencesOptions.map((item) => (
			<LabelCheckboxV2
				key={item.value}
				value={item.value}
				text={item.label}
				onSelect={() => {
					let tempControl = filterForm.get('experienceIds');
					tempControl.value = [...(tempControl.value as number[]), item.value as number];
					updateFilterForm(tempControl);
				}}
				isChecked={props.accommodationToggle}
				onDeselect={() => {
					filterForm.get('experienceIds').value = (filterForm.get('experienceIds').value as number[]).filter(
						(type) => type !== item.value
					);
					updateFilterForm(filterForm.get('experienceIds'));
				}}
			/>
		));
	}

	function renderInUnitAmenitiesOptionsList() {
		return props.inUnitAmenitiesOptions.map((item) => (
			<LabelCheckboxV2
				key={item.value}
				value={item.value}
				text={item.label}
				onSelect={() => {
					let tempControl = filterForm.get('amenityIds');
					tempControl.value = [...(tempControl.value as number[]), item.value as number];
					updateFilterForm(tempControl);
				}}
				isChecked={props.accommodationToggle}
				onDeselect={() => {
					filterForm.get('amenityIds').value = (filterForm.get('amenityIds').value as number[]).filter(
						(type) => type !== item.value
					);
					updateFilterForm(filterForm.get('amenityIds'));
				}}
			/>
		));
	}

	return (
		<div className="rsFilterBarV2">
			<Box className="largeCol">
				<Box className="subRow rightBorder">
					<Box id="priceDropdown" className="priceCol">
						<FilterBarDropDown
							onChangeCallBack={onApplyClick}
							onClearCallback={() => console.log('Clear Form')}
							title="Price"
							className="dropdownMarginX"
							dropdownContentClassName="destinationFilterDropdown"
						>
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
							<div className="minMaxDiv">
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
						</FilterBarDropDown>
					</Box>
					<Box id="accommodationCol" className="filterCol">
						<FilterBarDropDown
							onChangeCallBack={onApplyClick}
							onClearCallback={() => console.log('Clear Form')}
							title="Accommodation"
							className="dropdownMarginX"
							dropdownContentClassName="destinationFilterDropdown"
						>
							{renderAccommodationList()}
						</FilterBarDropDown>
					</Box>
					<Box id="bedroomsCol" className="filterCol">
						<FilterBarDropDown
							onChangeCallBack={() => console.log('Bedroom Dropdown')}
							onClearCallback={() => console.log('Clear Form')}
							title="Bedrooms"
							className="dropdownMarginX"
							dropdownContentClassName="destinationFilterDropdown"
						>
							<Counter
								title="Bedrooms"
								control={filterForm.get('bedroomCount')}
								updateControl={updateFilterForm}
								className={'filterCounter'}
								minCount={1}
								labelMarginRight={5}
							/>
							<Counter
								title="Bathrooms"
								control={filterForm.get('bathroomCount')}
								updateControl={updateFilterForm}
								className={'filterCounter'}
								minCount={1}
								labelMarginRight={5}
							/>
						</FilterBarDropDown>
					</Box>
					<Box id="resortExpCol" className="filterCol">
						<FilterBarDropDown
							onChangeCallBack={onApplyClick}
							onClearCallback={() => console.log('Clear Form')}
							title="Resort Experiences"
							className="dropdownMarginX"
							dropdownContentClassName="destinationFilterDropdown"
						>
							{renderResortExperiencesOptionsList()}
						</FilterBarDropDown>
					</Box>
					<Box id="otherFilter" className="filterCol">
						<FilterBarDropDown
							onChangeCallBack={onApplyClick}
							onClearCallback={() => console.log('Clear Form')}
							title="Other Filters"
							className="dropdownMarginX"
							dropdownContentClassName="inUnitAmenitiesCheckboxContentBody"
						>
							<Label variant="body1" paddingTop={10} paddingLeft={10}>
								In Unit Amenities
							</Label>
							<Box className="inUnitAmenitiesWrapper">{renderInUnitAmenitiesOptionsList()}</Box>
						</FilterBarDropDown>
					</Box>
				</Box>
			</Box>
			<Box className="smallCol">
				<Box className="subRow">
					<Box className="halfCol">
						<FilterBarDropDown
							onChangeCallBack={onApplyClick}
							onClearCallback={() => console.log('Clear Form')}
							title="Lowest Prices"
							className="dropdownMarginX"
						>
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
						</FilterBarDropDown>
					</Box>
					<Box className="halfCol redeemToggle">
						<Box
							display={'flex'}
							flexDirection={'column'}
							alignItems={'center'}
							justifyContent={'flex-start'}
						>
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
			</Box>
		</div>
	);
};

export default FilterBarV2;
