import * as React from 'react';
import './TopSearchBarMobile.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import DateRangeSelector from '../../dateRangeSelector/DateRangeSelector';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { formatFilterDateForServer, ObjectUtils } from '../../../utils/utils';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import serviceFactory from '../../../services/serviceFactory';
import RegionService from '../../../services/region/region.service';
import Paper from '../../paper/Paper';

interface TopSearchBarMobileProps {
	onFilterClick?: () => void;
	onChangeCallBack: (data: { regionId?: number; startDate?: string; endDate?: string }) => void;
}

const TopSearchBarMobile: React.FC<TopSearchBarMobileProps> = (props) => {
	const boxRef = useRef<HTMLDivElement>(null);
	const regionService = serviceFactory.get<RegionService>('RegionService');
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(null);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(null);
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [regionList, setRegionList] = useState<Api.Region.Res.Get[]>([]);

	const [topSearchBarForm, setTopSearchBarForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('regionId', '', []),
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

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (boxRef && boxRef.current && !boxRef.current.contains(event.target)) {
				let test = boxRef.current;
				test.style.display = 'none';
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setStartDateControl(startDate);
		setEndDateControl(endDate);
		updateDatesForSearchBarForm('startDate', formatFilterDateForServer(startDate, 'start'));
		updateDatesForSearchBarForm('endDate', formatFilterDateForServer(endDate, 'end'));
		onChangeCallback();
	}

	function updateDatesForSearchBarForm(key: 'startDate' | 'endDate', value: any) {
		let newControl = topSearchBarForm.get(key);
		newControl.value = value;
		setTopSearchBarForm(topSearchBarForm.clone().update(newControl));
	}

	function renderRegionLabel() {
		let regionId = topSearchBarForm.get('regionId').value;
		if (!regionId.toString().length) return 'Select Location';

		let regionName = regionList.filter((item) => item.id === regionId);
		return regionName[0].name;
	}

	function regionListBuilder() {
		if (!ObjectUtils.isArrayWithData(regionList)) return;

		return regionList.map((item, index) => {
			let isSelected = topSearchBarForm.get('regionId').value === item.id;

			return (
				<Box
					key={item.id}
					className={`regionItem ${isSelected ? 'selected' : ''}`}
					onClick={() => {
						let newControl = topSearchBarForm.get('regionId');
						newControl.value = item.id;
						setTopSearchBarForm(topSearchBarForm.clone().update(newControl));
						setTimeout(() => {
							boxRef.current!.style.display = 'none';
						}, 50);
						onChangeCallback();
					}}
					display={'flex'}
					alignItems={'center'}
				>
					<Icon iconImg={'icon-pin'} color={'#FF6469'} />
					<Label ml={25} variant={'subtitle1'}>
						{item.name}
					</Label>
				</Box>
			);
		});
	}

	function onChangeCallback() {
		let data: any = topSearchBarForm.toModel();
		for (let i in data) {
			if (!data[i].toString().length) delete data[i];
		}
		props.onChangeCallBack(data);
	}

	return (
		<div className={'rsTopSearchBarMobile'}>
			<Label
				variant={'custom1'}
				textOverflow={'ellipsis'}
				whiteSpace={'nowrap'}
				overflow={'hidden'}
				width={'12ch'}
				onClick={() => {
					boxRef.current!.style.display = 'block';
				}}
			>
				{renderRegionLabel()}
			</Label>
			<Box display={'flex'} alignItems={'center'}>
				<DateRangeSelector
					isMobile
					startDate={startDateControl}
					endDate={endDateControl}
					onDatesChange={onDatesChange}
					monthsToShow={1}
					focusedInput={focusedInput}
					onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
					startDateLabel={'Check in'}
					endDateLabel={'Check out'}
					startDatePlaceholderText={'Start'}
					endDatePlaceholderText={'End'}
					labelVariant={'caption3'}
				/>
				<hr />
				<Icon iconImg={'icon-slider'} size={24} onClick={props.onFilterClick} cursorPointer />

				<Box boxRef={boxRef} className={'popoutBox'}>
					<Paper boxShadow borderRadius={'20px'} padding={'13px 23px'} backgroundColor={'#ffffff'}>
						<Label variant={'caption3'} mb={10}>
							Location
						</Label>
						<Label variant={'subtitle3'}>Where are you going?</Label>
					</Paper>
					<Paper
						boxShadow
						borderRadius={'20px'}
						padding={'13px 23px'}
						backgroundColor={'#ffffff'}
						className={'regionList'}
					>
						{regionListBuilder()}
					</Paper>
				</Box>
			</Box>
		</div>
	);
};

export default TopSearchBarMobile;
