import React, { useState } from 'react';
import './RedeemableRewardsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelLinkImage from '../../components/labelLinkImage/LabelLinkImage';
import { SelectOptions } from '../../components/Select/Select';
import CheckboxList from '../../components/checkboxList/CheckboxList';
import LabelRadioButton from '../../components/labelRadioButton/LabelRadioButton';
import IconLabel from '../../components/iconLabel/IconLabel';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';
import RewardCategoryCard from '../../components/rewardCategoryCard/RewardCategoryCard';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';

const RedeemableRewardsPage: React.FC = () => {
	const [featuredCategory, setFeaturedCategory] = useState<{ imgPath: string; name: string; localPath: string }[]>();
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<(string | number)[]>([]);
	const [selectedDestination, setSelectedDestination] = useState<number>();
	const [showAllDestinations, setShowAllDestinations] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [perPage] = useState<number>(9);
	const [categoryTotal, setCategory] = useState<number>(12);

	// this info will come from database
	const hardFeatureCategory = [
		{ imagePath: '../../images/redeemableRewardPage/manicure.jpg', name: 'Check out other perks', localPath: '/' },
		{
			imagePath: '../../images/redeemableRewardPage/glassBuilding.jpg',
			name: 'Use points for resort stays',
			localPath: '/'
		},
		{ imagePath: '../../images/redeemableRewardPage/house.jpg', name: 'Buy a house with points', localPath: '/' }
	];
	const hardCategoryList = [
		{ value: 1, title: 'Popular Items', imgPath: '../../images/redeemableRewardPage/poolDrink.jpg' },
		{ value: 2, title: 'Electronics', imgPath: '../../images/redeemableRewardPage/electronics.jpg' },
		{ value: 3, title: 'Travel Accessories', imgPath: '../../images/redeemableRewardPage/luggage.jpg' },
		{ value: 4, title: 'Lyft Credit', imgPath: '../../images/redeemableRewardPage/rideService.jpg' },
		{ value: 5, title: 'Merchandise', imgPath: '../../images/redeemableRewardPage/watches.jpg' },
		{ value: 6, title: 'Merchandise1', imgPath: '../../images/redeemableRewardPage/bags.jpg' },
		{ value: 7, title: 'Merchandise2', imgPath: '../../images/redeemableRewardPage/suitCoat.jpg' },
		{ value: 8, title: 'Merchandise3', imgPath: '../../images/redeemableRewardPage/earbuds.jpg' },
		{ value: 9, title: 'Merchandise4', imgPath: '../../images/redeemableRewardPage/perfume.jpg' },
		{ value: 10, title: 'Merchandise5', imgPath: '../../images/redeemableRewardPage/perfume.jpg' },
		{ value: 11, title: 'Merchandise6', imgPath: '../../images/redeemableRewardPage/perfume.jpg' },
		{ value: 12, title: 'Merchandise7', imgPath: '../../images/redeemableRewardPage/perfume.jpg' }
	];

	const [hardCategorySelectList, setHardCategorySelectList] = useState<SelectOptions[]>([
		{ value: 1, text: 'Popular Items', selected: false },
		{ value: 2, text: 'Electronics', selected: false },
		{ value: 3, text: 'Travel Accessories', selected: false },
		{ value: 4, text: 'Lyft Credit', selected: false },
		{ value: 5, text: 'Merchandise', selected: false },
		{ value: 6, text: 'Merchandise', selected: false },
		{ value: 7, text: 'Merchandise', selected: false },
		{ value: 8, text: 'Merchandise', selected: false },
		{ value: 9, text: 'Merchandise', selected: false },
		{ value: 9, text: 'Merchandise', selected: false }
	]);

	const hardDestinationList: { id: number; title: string }[] = [
		{ id: 1, title: 'Resort1' },
		{ id: 2, title: 'Resort2' },
		{ id: 3, title: 'Resort3' },
		{ id: 4, title: 'Resort4' },
		{ id: 5, title: 'Resort5' },
		{ id: 6, title: 'Resort6' },
		{ id: 7, title: 'Resort7' },
		{ id: 8, title: 'Resort8' }
	];

	function renderCards() {
		return hardCategoryList.map((category, index) => {
			return (
				<RewardCategoryCard
					key={index}
					value={category.value}
					title={category.title}
					imgPath={category.imgPath}
					onClick={(value) => console.log('Category Selected from card', value)}
				/>
			);
		});
	}
	function renderSeeAllIcon() {
		return (
			<IconLabel
				className={'seeAllDestinations'}
				labelName={showAllDestinations ? 'see less resorts' : 'see all resorts'}
				iconImg={'icon-chevron-right'}
				iconPosition={'right'}
				iconSize={7}
				labelVariant={'caption'}
				onClick={() => setShowAllDestinations(!showAllDestinations)}
			/>
		);
	}

	function renderDestinationRadioButtons() {
		if (!hardDestinationList) return '';
		let destinations = [];
		let firstRun = true;
		let displayAmount = showAllDestinations ? hardDestinationList.length : 5;
		for (let i = 0; i < displayAmount; i++) {
			if (firstRun && !selectedDestination) {
				setSelectedDestination(hardDestinationList[i].id);
				firstRun = false;
			}
			if (!selectedDestination) return '';
			destinations.push(
				<LabelRadioButton
					radioName={'layout'}
					value={hardDestinationList[i].title}
					checked={selectedDestination === hardDestinationList[i].id}
					text={hardDestinationList[i].title}
					onSelect={(value) => {
						setSelectedDestination(hardDestinationList[i].id);
					}}
				/>
			);
		}
		return destinations;
	}

	function renderFeaturedCategory() {
		return hardFeatureCategory.map((category, index) => {
			return (
				<LabelLinkImage
					key={index}
					mainImg={category.imagePath}
					textOnImg={category.name}
					linkPath={category.localPath}
				/>
			);
		});
	}

	return (
		<Page className={'rsRedeemableRewardsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'heroImgTextFeatured'}>
					<Label className={'pageTitle'} variant={'h1'}>
						Redeem Your Points
					</Label>
					<div className={'featuredCategories'}>{renderFeaturedCategory()}</div>
					<div className={'pageWrapper'}>
						<div className={'querySideBar'}>
							<div className={'rewardCategoryCheckboxList'}>
								<Label className={'queryTitle'} variant={'h4'}>
									Reward Categories
								</Label>
								<CheckboxList
									onChange={(value, options) => {
										setSelectedCategoryIds(value);
										setHardCategorySelectList(options);
									}}
									options={hardCategorySelectList}
								/>
							</div>
							<div className={'resortRadioSelect'}>
								<Label className={'resortTitle queryTitle'} variant={'h4'}>
									Resort
								</Label>
								<div className={'radioButtonContainer'}>
									{renderDestinationRadioButtons()}
									{renderSeeAllIcon()}
								</div>
							</div>
							<div className={'pointCostFilters'}>
								<Label className={'queryTitle'} variant={'h4'}>
									Point Cost
								</Label>
								<div className={'minMaxContainer'}>
									<LabelInput title={'MIN'} inputType={'text'} />
									<LabelInput title={'MAX'} inputType={'text'} />
								</div>
							</div>
							<div className={'filterButtonContainer'}>
								<LabelButton look={'containedPrimary'} variant={'button'} label={'Apply Filters'} />
							</div>
						</div>
						<div className={'pagedCategoryCards'}>
							<div className={'rightSideHeaderContainer'}>
								<Label className={'categoriesTitle'} variant={'h4'}>
									Categories
								</Label>
								<div className={'availablePendingPointsContainer'}>
									<div className={'availablePointsContainer'}>
										<Label variant={'h4'}>Available Points</Label>
										<Label className={'availablePointsNumber'} variant={'h1'}>
											14,165
										</Label>
									</div>
									<div className={'pendingPointsContainer'}>
										<Label variant={'h4'}>Points Pending</Label>
										<Label className={'pendingPointsNumber'} variant={'h1'}>
											951
										</Label>
									</div>
								</div>
							</div>
							<div className={'cardContainer'}>{renderCards()}</div>
							<div className={'paginationContainer'}>
								<PaginationButtons
									selectedRowsPerPage={perPage}
									currentPageNumber={page}
									setSelectedPage={(page) => setPage(page)}
									total={categoryTotal}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Page>
	);
};

export default RedeemableRewardsPage;
