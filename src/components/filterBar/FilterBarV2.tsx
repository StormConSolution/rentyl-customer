import * as React from 'react';
import './FilterBarV2.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import FilterBarDropDown from '../filterBarDropDown/FilterBarDropDown';
import LabelCheckboxV2 from '../labelCheckbox/LabelCheckboxV2';
import { useState } from 'react';
import { OptionType } from '@bit/redsky.framework.rs.select';
import Slider, { SliderMode } from '@bit/redsky.framework.rs.slider';
import LabelInputV2 from '../labelInput/LabelInputV2';
import Counter from '../counter/Counter';
import LabelRadioButton from '../labelRadioButton/LabelRadioButton';
import Label from '@bit/redsky.framework.rs.label';
import Switch from '@bit/redsky.framework.rs.switch';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import DestinationService from '../../services/destination/destination.service';

interface FilterBarV2Props {
	onApplyClick: () => void;
	accommodationList: OptionType[];
	filterForm: RsFormGroup;
	updateFilterForm: (control: RsFormControl | undefined) => void;
	destinationService: DestinationService;
	accommodationToggle: boolean;
	redeemCodeToggle: boolean;
}

const FilterBarV2: React.FC<FilterBarV2Props> = (props) => {
	const [sortBySelection, setSortBySelection] = useState<number>();

	function renderAccommodationList() {
		if (!props.accommodationList) return;
		return (
			<Box padding="1rem">
				{props.accommodationList.map((item) => (
					<Box marginY={10}>
						<LabelCheckboxV2
							key={item.value}
							value={item.value}
							text={item.label}
							onSelect={() => {
								let tempControl = props.filterForm.get('accommodationType');
								tempControl.value = [...(tempControl.value as number[]), item.value as number];
								props.updateFilterForm(tempControl);
							}}
							isChecked={(props.filterForm.get('accommodationType').value as number[]).includes(
								item.value as number
							)}
							onDeselect={() => {
								props.filterForm.get('accommodationType').value = (props.filterForm.get(
									'accommodationType'
								).value as number[]).filter((type) => type !== item.value);
								props.updateFilterForm(props.filterForm.get('accommodationType'));
							}}
						/>
					</Box>
				))}
			</Box>
		);
	}

	function renderResortExperiences() {
		return (
			<Box padding="1rem">
				{props.destinationService.resortExperiences.map((item) => (
					<Box marginY={10}>
						<LabelCheckboxV2
							key={item.value}
							value={item.value}
							text={item.label}
							onSelect={() => console.log('selected')}
							isChecked={props.accommodationToggle}
							onDeselect={() => console.log('Deselected')}
							isDisabled={true}
						/>
					</Box>
				))}
			</Box>
		);
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
						>
							<Box padding="1rem">
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
							</Box>
						</FilterBarDropDown>
					</Box>
					<Box id="accommodationCol" className="filterCol">
						<FilterBarDropDown
							onChangeCallBack={props.onApplyClick}
							onClearCallback={() => console.log('Clear Form')}
							title="Accommodation"
							className="dropdownMarginX"
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
						>
							<Box padding="1rem">
								<Counter
									title="Bedrooms"
									control={props.filterForm.get('bedroomCount')}
									updateControl={props.updateFilterForm}
									className={'filterCounter'}
									minCount={1}
								/>
								<Counter
									title="Bathrooms"
									control={props.filterForm.get('bathroomCount')}
									updateControl={props.updateFilterForm}
									className={'filterCounter'}
									minCount={1}
								/>
							</Box>
						</FilterBarDropDown>
					</Box>
					<Box id="resortExpCol" className="filterCol">
						<FilterBarDropDown
							onChangeCallBack={props.onApplyClick}
							onClearCallback={() => console.log('Clear Form')}
							title="Resort Experiences"
							className="dropdownMarginX"
						>
							{renderResortExperiences()}
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
							<Box padding="1rem">
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
							</Box>
						</FilterBarDropDown>
					</Box>
					<Box className="halfCol">
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
