import { RsFormControl } from '@bit/redsky.framework.rs.form';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import debounce from 'lodash.debounce';
import moment from 'moment';
import React, { ReactText, useEffect, useState } from 'react';
import Box from '../box/Box';
import DateRangeSelector from '../dateRangeSelector/DateRangeSelector';
import LabelInput from '../labelInput/LabelInput';
import Select, { SelectOptions } from '../Select/Select';
import './FilterBar.scss';
import IconLabel from '../iconLabel/IconLabel';

export interface FilterBarProps {
	filter: Filter;
	onFilterChange: (filter: Filter) => void;
	sortOptions: SelectOptions[];
	onSortChange: (newValue: ReactText | null) => void;
	monthsToShow: number;
	showKeyword?: boolean;
	keywordFieldIcon?: string;
	showDisplayOptions?: boolean;
	displayOptions?: DisplayOption[];
	activeDisplayOption?: ReactText;
	onDisplayOptionChange?: (option: ReactText | null) => void;
	className?: string;
}

export interface Filter {
	keyword: string | null;
	checkIn: Date | null;
	checkOut: Date | null;
	guests: number | null;
}

interface DisplayOption {
	iconName: string;
	value: ReactText;
}

const FilterBar: React.FC<FilterBarProps> = (props) => {
	const [checkinDate, setCheckinDate] = useState<moment.Moment | null>(
		!!props.filter.checkIn ? moment(props.filter.checkIn) : moment()
	);
	const [checkoutDate, setCheckoutDate] = useState<moment.Moment | null>(
		!!props.filter.checkOut ? moment(props.filter.checkOut) : moment().add(1, 'd')
	);
	const [keyword, setKeyword] = useState<string>(!!props.filter.keyword ? props.filter.keyword : '');
	const [keywordControl] = useState<RsFormControl>(new RsFormControl('keyword', keyword));
	const [numberOfGuests, setNumberOfGuests] = useState<number>(
		!!props.filter.guests && props.filter.guests > 0 ? props.filter.guests : 1
	);
	const [numberOfGuestsControl] = useState<RsFormControl>(new RsFormControl('numberOfGuests', numberOfGuests));
	const passUpFilter = props.onFilterChange;

	useEffect(() => {
		const newFilter: Filter = {
			keyword: keyword,
			guests: numberOfGuests,
			checkOut: checkoutDate?.toDate() || null,
			checkIn: checkinDate?.toDate() || null
		};
		passUpFilter(newFilter);
	}, [checkinDate, checkoutDate, keyword, numberOfGuests, passUpFilter]);

	function onDatesChange(startDate: moment.Moment | null, endDate: moment.Moment | null): void {
		setCheckinDate(startDate);
		setCheckoutDate(endDate);
	}

	const updateKeywordDebounced = debounce((input: RsFormControl) => {
		setKeyword(input.value.toString());
	}, 500);

	const updateNumberOfGuests = (input: RsFormControl) => {
		let newNumber = parseInt(input.value.toString());
		if (isNaN(newNumber) || newNumber < 1) newNumber = 1;
		setNumberOfGuests(newNumber);
		(document.querySelector('.numberOfGuests > input') as HTMLInputElement).value = newNumber.toString();
	};

	function renderDisplayOptions(
		options: Array<DisplayOption>,
		handler: (optionValue: ReactText | null) => void
	): Array<JSX.Element> {
		return options.map((option: DisplayOption) => {
			return (
				<Icon
					iconImg={option.iconName}
					cursorPointer
					key={option.value}
					onClick={() => {
						handler(option.value);
					}}
				/>
			);
		});
	}

	return (
		<Box className={`rsFilterBar ${props.className || ''}`}>
			<DateRangeSelector
				startDate={checkinDate}
				endDate={checkoutDate}
				onDatesChange={onDatesChange}
				monthsToShow={props.monthsToShow}
				focusedInput={null}
				label1={'check in'}
				label2={'check out'}
			/>
			<LabelInput
				className="numberOfGuests"
				inputType="number"
				title="# of Guests"
				initialValue={props.filter.guests || 1}
				control={numberOfGuestsControl}
				updateControl={updateNumberOfGuests}
			/>
			<IconLabel
				className={'moreFiltersLink'}
				labelName={'More Filters'}
				iconImg={'icon-chevron-right'}
				iconPosition={'right'}
				iconSize={8}
				labelVariant={'caption'}
				onClick={() => {}}
			/>
			{!!props.showKeyword && (
				<LabelInput
					className="keyword"
					inputType="text"
					title=""
					control={keywordControl}
					updateControl={updateKeywordDebounced}
					iconImage={props.keywordFieldIcon}
				/>
			)}
			<Select
				className="sortOption"
				options={props.sortOptions}
				onChange={props.onSortChange}
				placeHolder="Sort by"
			/>
			<Box className="displayOptions">
				{!!props.showDisplayOptions &&
					!!props.displayOptions &&
					!!props.onDisplayOptionChange &&
					renderDisplayOptions(props.displayOptions, props.onDisplayOptionChange)}
			</Box>
		</Box>
	);
};

export default FilterBar;
