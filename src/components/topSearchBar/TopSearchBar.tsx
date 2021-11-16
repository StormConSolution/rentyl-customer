import * as React from 'react';
import './TopSearchBar.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import TopSearchBarMobile from './topSearchBarMobile/TopSearchBarMobile';
import TopSearchBarResponsive from './topSearchBarResponsive/TopSearchBarResponsive';

interface DatePickerCardProps {
	onSearch: (data: { regionId?: number; guest?: number; startDate?: string; endDate?: string }) => void;
}

const TopSearchBar: React.FC<DatePickerCardProps> = (props) => {
	const size = useWindowResizeChange();

	return size === 'small' ? (
		<TopSearchBarMobile
			onChangeCallBack={(data) => {
				props.onSearch(data);
			}}
		/>
	) : (
		<TopSearchBarResponsive
			onSearch={(data) => {
				props.onSearch(data);
			}}
		/>
	);
};

export default TopSearchBar;
