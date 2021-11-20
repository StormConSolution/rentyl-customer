import * as React from 'react';
import './TopSearchBarResponsive.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Button from '@bit/redsky.framework.rs.button';
import Icon from '@bit/redsky.framework.rs.icon';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { Box } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../../services/serviceFactory';
import RegionService from '../../../services/region/region.service';
import { formatFilterDateForServer, ObjectUtils, WebUtils } from '../../../utils/utils';
import DateRangeSelector from '../../dateRangeSelector/DateRangeSelector';
import TitleLabel from '../titleLabel/TitleLabel';
import Paper from '../../paper/Paper';
import Counter from '../../counter/Counter';
import { useRecoilState } from 'recoil';
import globalState from '../../../state/globalState';

interface DatePickerCardProps {}

const TopSearchBarResponsive: React.FC<DatePickerCardProps> = (props) => {
	const regionService = serviceFactory.get<RegionService>('RegionService');
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(
		moment(reservationFilters.startDate)
	);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(moment(reservationFilters.endDate));
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [regionList, setRegionList] = useState<Api.Region.Res.Get[]>([]);
	const [topSearchBarForm, setTopSearchBarForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('regionIds', reservationFilters.regionIds || [], []),
			new RsFormControl('adultCount', reservationFilters.adultCount || 1, []),
			new RsFormControl('startDate', (reservationFilters.startDate as string) || '', []),
			new RsFormControl('endDate', (reservationFilters.endDate as string) || '', [])
		])
	);

	useEffect(() => {
		/**
		 * This is used to update the url parameters anytime the recoil state changes
		 */
		WebUtils.updateUrlParams(reservationFilters);
	}, [reservationFilters]);

	useEffect(() => {
		(async () => {
			try {
				let regions: Api.Region.Res.Get[] = await regionService.getAllRegions();
				setRegionList(regions);
			} catch (e) {
				rsToastify.error('There was an issue getting regions');
			}
		})();
	}, []);

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
				regionIds: number[];
				startDate: string;
				endDate: string;
				sortOrder: 'ASC' | 'DESC';
			} = topSearchBarForm.toModel();
			return { ...prev, ...form };
		});
	}

	function updateTopSearchBarForm(control: RsFormControl) {
		setTopSearchBarForm(topSearchBarForm.clone().update(control));
	}

	function updateDatesForSearchBarForm(key: 'startDate' | 'endDate', value: any) {
		let newControl = topSearchBarForm.get(key);
		newControl.value = value;
		setTopSearchBarForm(topSearchBarForm.clone().update(newControl));
	}

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDateControl(startDate);
		setEndDateControl(endDate);
		updateDatesForSearchBarForm('startDate', formatFilterDateForServer(startDate, 'start'));
		updateDatesForSearchBarForm('endDate', formatFilterDateForServer(endDate, 'end'));
	}

	function regionListBuilder() {
		if (!ObjectUtils.isArrayWithData(regionList)) return;

		return regionList.map((item, index) => {
			let isSelected = topSearchBarForm.get('regionIds').value === item.id;

			return (
				<Box
					key={item.id}
					className={`regionItem ${isSelected ? 'selected' : ''}`}
					onClick={() => {
						let newControl = topSearchBarForm.get('regionIds');
						newControl.value = [item.id];
						setTopSearchBarForm(topSearchBarForm.clone().update(newControl));
					}}
					display={'flex'}
					alignItems={'center'}
				>
					<Icon iconImg={'icon-pin'} color={'#FF6469'} />
					<Label ml={25} variant={'caption3'}>
						{item.name}
					</Label>
				</Box>
			);
		});
	}

	function renderRegionLabel() {
		let regionId = topSearchBarForm.get('regionIds').value as number[];
		if (!ObjectUtils.isArrayWithData(regionId)) return 'Where are you going?';

		let regionName = regionList.filter((item) => item.id === regionId[0]);
		return regionName[0].name;
	}

	return (
		<Paper boxShadow borderRadius={'20px'} className={'rsTopSearchBarResponsive'}>
			<TitleLabel
				title={'Location'}
				label={renderRegionLabel()}
				popoutBoxContent={<div className={'regionList'}>{regionListBuilder()}</div>}
			/>
			<hr />
			<DateRangeSelector
				startDate={startDateControl}
				endDate={endDateControl}
				onDatesChange={onDatesChange}
				monthsToShow={2}
				focusedInput={focusedInput}
				onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
				startDateLabel={'Check in'}
				endDateLabel={'Check out'}
				startDatePlaceholderText={'Add dates'}
				endDatePlaceholderText={'Add dates'}
				labelVariant={'caption3'}
			/>
			<hr />
			<TitleLabel
				title={'Guests'}
				label={`Add guests (${reservationFilters.adultCount})`}
				popoutBoxContent={
					<Counter
						title={'Guests'}
						control={topSearchBarForm.get('adultCount')}
						updateControl={updateTopSearchBarForm}
						minCount={1}
						maxCount={28}
						labelMarginRight={84}
					/>
				}
			/>
			<Button
				className={'searchButton'}
				look={'none'}
				onClick={() => {
					onApplyClick();
				}}
			>
				<Icon iconImg={'icon-search'} color={'#ffffff'} size={36} />
			</Button>
		</Paper>
	);
};

export default TopSearchBarResponsive;
