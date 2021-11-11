import * as React from 'react';
import './TopSearchBar.scss';
import Paper from '../paper/Paper';
import DateRangeSelector from '../dateRangeSelector/DateRangeSelector';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { formatFilterDateForServer, ObjectUtils } from '../../utils/utils';
import TitleLabel from './titleLabel/TitleLabel';
import Button from '@bit/redsky.framework.rs.button';
import Icon from '@bit/redsky.framework.rs.icon';
import Counter from '../counter/Counter';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import RegionService from '../../services/region/region.service';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { Box } from '@bit/redsky.framework.rs.996';

interface DatePickerCardProps {
	onSearch: (data: { regionId: number; guest: number; startDate: string; endDate: string }) => void;
}

const TopSearchBar: React.FC<DatePickerCardProps> = (props) => {
	const regionService = serviceFactory.get<RegionService>('RegionService');
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(null);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(null);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [regionList, setRegionList] = useState<Api.Region.Res.Get[]>([]);

	const [topSearchBarForm, setTopSearchBarForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('regionId', '', []),
			new RsFormControl('guest', 1, []),
			new RsFormControl('startDate', '', []),
			new RsFormControl('endDate', '', [])
		])
	);

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
			let isSelected = topSearchBarForm.get('regionId').value === item.id;

			return (
				<Box
					className={`regionItem ${isSelected ? 'selected' : ''}`}
					onClick={() => {
						let newControl = topSearchBarForm.get('regionId');
						newControl.value = item.id;
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
		let regionId = topSearchBarForm.get('regionId').value;
		if (!regionId.toString().length) return 'Where are you going?';

		let regionName = regionList.filter((item) => item.id === regionId);
		return regionName[0].name;
	}

	return (
		<Paper boxShadow borderRadius={'20px'} className={'rsTopSearchBar'}>
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
				label={'Add guests'}
				popoutBoxContent={
					<Counter
						title={'Guests'}
						control={topSearchBarForm.get('guest')}
						updateControl={updateTopSearchBarForm}
						minCount={1}
						labelMarginRight={84}
					/>
				}
			/>
			<Button
				className={'searchButton'}
				look={'none'}
				onClick={() => {
					let data: any = topSearchBarForm.toModel();
					router.updateUrlParams(data);
					props.onSearch(data);
				}}
			>
				<Icon iconImg={'icon-search'} color={'#ffffff'} size={36} />
			</Button>
		</Paper>
	);
};

export default TopSearchBar;
