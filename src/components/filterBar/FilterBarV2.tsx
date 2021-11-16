import * as React from 'react';
import './FilterBarV2.scss';
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
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import DestinationService from '../../services/destination/destination.service';
import PropertyType = Model.PropertyType;
import OptionType = Misc.OptionType;

interface FilterBarV2Props {
	onApplyClick: () => void;
	filterForm: RsFormGroup;
	updateFilterForm: (control: RsFormControl | undefined) => void;
	destinationService: DestinationService;
	accommodationToggle: boolean;
	redeemCodeToggle: boolean;
	accommodationOptions: PropertyType[];
	resortExperiencesOptions: OptionType[];
	inUnitAmenitiesOptions: OptionType[];
	viewOptions: OptionType[];
}

const FilterBarV2: React.FC<FilterBarV2Props> = (props) => {
	const [sortBySelection, setSortBySelection] = useState<number>();

	function renderAccommodationList() {
		if (!props.accommodationOptions) return;
		return props.accommodationOptions.map((item) => (
			<LabelCheckboxV2
				key={item.name}
				value={item.id}
				text={item.name}
				onSelect={() => {
					let tempControl = props.filterForm.get('accommodationType');
					tempControl.value = [...(tempControl.value as number[]), item.id as number];
					props.updateFilterForm(tempControl);
				}}
				isChecked={(props.filterForm.get('accommodationType').value as number[]).includes(item.id as number)}
				onDeselect={() => {
					props.filterForm.get('accommodationType').value = (props.filterForm.get('accommodationType')
						.value as number[]).filter((type) => type !== item.id);
					props.updateFilterForm(props.filterForm.get('accommodationType'));
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
				onSelect={() => console.log('selected')}
				isChecked={props.accommodationToggle}
				onDeselect={() => console.log('Deselected')}
				isDisabled={true}
			/>
		));
	}

	function renderViewOptionsList() {
		return props.viewOptions.map((item) => (
			<LabelCheckboxV2
				key={item.value}
				value={item.value}
				text={item.label}
				onSelect={() => console.log('selected')}
				isChecked={props.accommodationToggle}
				onDeselect={() => console.log('Deselected')}
				isDisabled={true}
			/>
		));
	}

	function renderInUnitAmenitiesOptionsList() {
		return props.inUnitAmenitiesOptions.map((item) => (
			<LabelCheckboxV2
				key={item.value}
				value={item.value}
				text={item.label}
				onSelect={() => console.log('selected')}
				isChecked={props.accommodationToggle}
				onDeselect={() => console.log('Deselected')}
				isDisabled={true}
			/>
		));
	}

	return (
		<div className="rsFilterBarV2">
			<Box className="largeCol">
				<Box className="subRow rightBorder">
					<Box id="priceDropdown" className="priceCol">
						<FilterBarDropDown
							onChangeCallBack={props.onApplyClick}
							onClearCallback={() => console.log('Clear Form')}
							title="Price"
							className="dropdownMarginX"
							dropdownContentClassName="destinationFilterDropdown"
						>
							<Slider
								range={[1, 1000]}
								minControl={props.filterForm.get('priceRangeMin')}
								maxControl={props.filterForm.get('priceRangeMax')}
								sliderIcons={'icon-hamburger-menu'}
								rotate={90}
								updateMinControl={props.updateFilterForm}
								updateMaxControl={props.updateFilterForm}
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
									control={props.filterForm.get('priceRangeMin')}
									updateControl={props.updateFilterForm}
								/>
								<hr className="divider" />
								<LabelInputV2
									className="priceMax"
									inputType="text"
									title="max price"
									control={props.filterForm.get('priceRangeMax')}
									updateControl={props.updateFilterForm}
								/>
							</div>
						</FilterBarDropDown>
					</Box>
					<Box id="accommodationCol" className="filterCol">
						<FilterBarDropDown
							onChangeCallBack={props.onApplyClick}
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
								control={props.filterForm.get('bedroomCount')}
								updateControl={props.updateFilterForm}
								className={'filterCounter'}
								minCount={1}
								labelMarginRight={5}
							/>
							<Counter
								title="Bathrooms"
								control={props.filterForm.get('bathroomCount')}
								updateControl={props.updateFilterForm}
								className={'filterCounter'}
								minCount={1}
								labelMarginRight={5}
							/>
						</FilterBarDropDown>
					</Box>
					<Box id="resortExpCol" className="filterCol">
						<FilterBarDropDown
							onChangeCallBack={props.onApplyClick}
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
							onChangeCallBack={props.onApplyClick}
							onClearCallback={() => console.log('Clear Form')}
							title="Other Filters"
							className="dropdownMarginX"
							dropdownContentClassName="inUnitAmenitiesCheckboxContentBody"
						>
							<Label variant="body1" paddingTop={10} paddingLeft={10}>
								In Unit Amenities
							</Label>
							<Box className="inUnitAmenitiesWrapper">{renderInUnitAmenitiesOptionsList()}</Box>
							<Label variant="body1" paddingTop={10} paddingLeft={10}>
								View
							</Label>
							<Box className="viewOptionsWrapper">{renderViewOptionsList()}</Box>
						</FilterBarDropDown>
					</Box>
				</Box>
			</Box>
			<Box className="smallCol">
				<Box className="subRow">
					<Box className="halfCol">
						<FilterBarDropDown
							onChangeCallBack={props.onApplyClick}
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
						<Label className="redeemPointsLabel" variant="body1">
							Redeem Points
						</Label>
						<Switch checked={props.redeemCodeToggle} label={'{"left":"" }'} />
					</Box>
				</Box>
			</Box>
		</div>
	);
};

export default FilterBarV2;
