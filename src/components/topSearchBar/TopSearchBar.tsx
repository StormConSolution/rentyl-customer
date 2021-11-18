import * as React from 'react';
import './TopSearchBar.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import TopSearchBarMobile from './topSearchBarMobile/TopSearchBarMobile';
import TopSearchBarResponsive from './topSearchBarResponsive/TopSearchBarResponsive';

interface DatePickerCardProps {}

const TopSearchBar: React.FC<DatePickerCardProps> = (props) => {
	const size = useWindowResizeChange();

	return size === 'small' ? <TopSearchBarMobile /> : <TopSearchBarResponsive />;
};

export default TopSearchBar;
