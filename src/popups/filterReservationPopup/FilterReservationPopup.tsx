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
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Icon from '@bit/redsky.framework.rs.icon';
import LabelRadioButton from '../../components/labelRadioButton/LabelRadioButton';
import Counter from '../../components/counter/Counter';
import Switch from '@bit/redsky.framework.rs.switch';
import LabelCheckboxV2 from '../../components/labelCheckbox/LabelCheckboxV2';
import Slider, { SliderMode } from '@bit/redsky.framework.rs.slider';
import LabelInputV2 from '../../components/labelInput/LabelInputV2';
import globalState from '../../state/globalState';
import { useRecoilState } from 'recoil';
import PropertyType = Api.Destination.Res.PropertyType;

export interface FilterReservationPopupProps extends PopupProps {
	searchRegion?: boolean;
	className?: string;
	accommodationOptions: PropertyType[];
	resortExperiencesOptions: OptionType[];
	inUnitAmenitiesOptions: OptionType[];
}

const FilterReservationPopup: React.FC<FilterReservationPopupProps> = (props) => {
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const [sortBySelection, setSortBySelection] = useState<number>();
	const [redeemCodeToggle, setRedeemCodeToggle] = useState<boolean>(false);
	const [accommodationToggle, setAccommodationToggle] = useState<boolean>(false);

	const [filterForm, setFilterForm] = useState<RsFormGroup>(
		new RsFormGroup([
			//propertyTypeIds are the text accommodationType on the front end.
			//We already have accommodationType and this was already listed as propertyType on the backend.
			new RsFormControl('propertyTypeIds', reservationFilters.propertyTypeIds || [], []),
			new RsFormControl('adultCount', reservationFilters.adultCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Adults Required')
			]),
			new RsFormControl('bedroomCount', reservationFilters.bedroomCount || 1, [
				new RsValidator(RsValidatorEnum.REQ, '# Of Bedrooms Required')
			]),
			new RsFormControl('bathroomCount', reservationFilters.bathroomCount || 1, [
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

	useEffect(() => {
		WebUtils.updateUrlParams(reservationFilters);
	}, [reservationFilters]);

	async function updateFilterForm(control: RsFormControl | undefined) {
		if (!control) return;
		if (control.key === 'priceRangeMax' || control.key === 'priceRangeMin') {
			let newValue = StringUtils.addCommasToNumber(StringUtils.removeAllExceptNumbers(control.value.toString()));
			control.value = newValue;
		}
		filterForm.update(control);
		setFilterForm(filterForm.clone());
	}
	function saveFilter() {
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
		popupController.close(FilterReservationPopup);
	}

	function renderAccommodationCheckboxes() {
		return props.accommodationOptions.map((item) => (
			<LabelCheckboxV2
				className="listCheckboxes"
				key={item.id}
				value={item.id}
				text={item.name}
				onSelect={() => {
					let tempControl = filterForm.get('accommodationType');
					tempControl.value = [...(tempControl.value as number[]), item.id as number];
					updateFilterForm(tempControl);
				}}
				isChecked={(filterForm.get('accommodationType').value as number[]).includes(item.id as number)}
				onDeselect={() => {
					filterForm.get('accommodationType').value = (filterForm.get('accommodationType')
						.value as number[]).filter((type) => type !== item.id);
					updateFilterForm(filterForm.get('accommodationType'));
				}}
			/>
		));
	}

	function renderResortExperiences() {
		return props.resortExperiencesOptions.map((item) => (
			<Box marginY={10}>
				<LabelCheckboxV2
					key={item.value}
					value={item.value}
					text={item.label}
					onSelect={() => {
						let tempControl = filterForm.get('experienceIds');
						tempControl.value = [...(tempControl.value as number[]), item.value as number];
						updateFilterForm(tempControl);
					}}
					isChecked={accommodationToggle}
					onDeselect={() => {
						filterForm.get('experienceIds').value = (filterForm.get('experienceIds')
							.value as number[]).filter((type) => type !== item.value);
						updateFilterForm(filterForm.get('experienceIds'));
					}}
				/>
			</Box>
		));
	}

	function renderInUnitAmenities() {
		return props.inUnitAmenitiesOptions.map((item) => (
			<Box marginY={10}>
				<LabelCheckboxV2
					key={item.value}
					value={item.value}
					text={item.label}
					onSelect={() => {
						let tempControl = filterForm.get('amenityIds');
						tempControl.value = [...(tempControl.value as number[]), item.value as number];
						updateFilterForm(tempControl);
					}}
					isChecked={accommodationToggle}
					onDeselect={() => {
						filterForm.get('amenityIds').value = (filterForm.get('amenityIds').value as number[]).filter(
							(type) => type !== item.value
						);
						updateFilterForm(filterForm.get('amenityIds'));
					}}
				/>
			</Box>
		));
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
							<LabelRadioButton
								radioName="highestRadioBtn"
								value="sortHigh"
								checked={sortBySelection === 0}
								text="Highest Price"
								onSelect={() => {
									setSortBySelection(0);
								}}
								labelSize="body2"
								className="labelRadio"
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
								className="labelRadio"
								isDisabled={true}
							/>
						</div>
						<div className="formDiv" id="guestsDiv">
							<Counter
								title="Guests"
								control={filterForm.get('adultCount')}
								updateControl={updateFilterForm}
								className={'filterCounter'}
								minCount={1}
								labelMarginRight={5}
							/>
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
						</div>
						<div className="formDiv" id="accommodationDiv">
							<Label className="accommodationLabel" variant="body1" marginY={15}>
								Accommodation
							</Label>
							{renderAccommodationCheckboxes()}
						</div>
						<div className="formDiv" id="resortExperiencesDiv">
							<Label className="accommodationLabel" variant="body1" marginY={15}>
								Resort Experiences
							</Label>
							{renderResortExperiences()}
						</div>
						<div className="formDiv bottomForm" id="resortExperiencesDiv">
							<Label className="accommodationLabel" variant="body1" marginY={15}>
								In Unit Amenities
							</Label>
							{renderInUnitAmenities()}
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
							className={'applyButton'}
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
