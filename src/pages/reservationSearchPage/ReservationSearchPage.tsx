import React, { ReactText, useEffect, useState } from 'react';
import './ReservationSearchPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import FilterBar, { Filter, FilterBarProps } from '../../components/filterBar/FilterBar';
import { SelectOptions } from '../../components/Select/Select';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../../components/paper/Paper';

const ReservationSearchPage: React.FC = () => {
	const [filter, setFilter] = useState<Filter>({ keyword: '', checkIn: null, checkOut: null, guests: null });
	const [filterBar, setFilterBar] = useState<FilterBarProps>();
	const [selectOptions, setSelectOptions] = useState<SelectOptions[]>([]);
	return (
		<Page className={'rsReservationSearchPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					className={'heroImage'}
					image={require('../../images/destinationResultsPage/momDaughterHero.jpg')}
					height={'200px'}
					mobileHeight={'100px'}
				/>
				<Paper className={'filterPaper'} backgroundColor={'#ffffff'} width={'1165px'}>
					<Label className={'filterLabel'} variant={'h1'}>
						Filter by
					</Label>
					<FilterBar
						className={'filterBar'}
						filter={filter}
						onFilterChange={(filter) => {
							console.log(filter);
						}}
						sortOptions={selectOptions}
						onSortChange={(newValue) => {
							console.log(newValue);
						}}
						monthsToShow={2}
					/>
				</Paper>
			</div>
		</Page>
	);
};

export default ReservationSearchPage;
