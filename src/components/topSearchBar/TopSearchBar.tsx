import * as React from 'react';
import './TopSearchBar.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import TopSearchBarMobile from './topSearchBarMobile/TopSearchBarMobile';
import TopSearchBarResponsive from './topSearchBarResponsive/TopSearchBarResponsive';

interface TopSearchBarProps {
	onFilterClick?: () => void;
}

interface DatePickerCardProps {}

const TopSearchBar: React.FC<TopSearchBarProps> = (props) => {
	const size = useWindowResizeChange();

	return size === 'small' ? <TopSearchBarMobile onFilterClick={props.onFilterClick} /> : <TopSearchBarResponsive />;
};

export default TopSearchBar;
