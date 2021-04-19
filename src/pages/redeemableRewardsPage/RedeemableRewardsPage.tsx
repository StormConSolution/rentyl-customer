import React, { useEffect, useState } from 'react';
import './RedeemableRewardsPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import FeaturedCategoryCard from '../../components/featureCategoryCard/FeaturedCategoryCard';
import { SelectOptions } from '../../components/Select/Select';
import CheckboxList from '../../components/checkboxList/CheckboxList';
import rsToasts from '@bit/redsky.framework.toast';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';
import RewardCategoryCard from '../../components/rewardCategoryCard/RewardCategoryCard';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import PointsOrLogin from '../../components/pointsOrLogin/PointsOrLogin';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import RewardService from '../../services/reward/reward.service';
import LoadingPage from '../loadingPage/LoadingPage';
import RewardItemCard from '../../components/rewardItemCard/RewardItemCard';
import router from '../../utils/router';

import FilterQueryValue = RedSky.FilterQueryValue;
import FilterQuery = RedSky.FilterQuery;

const RedeemableRewardsPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	let user = userService.getCurrentUser();

	const rewardService = serviceFactory.get<RewardService>('RewardService');
	const [waitToLoad, setWaitToLoad] = useState<boolean>(true);
	const [showCategoryCards, setShowCategoryCards] = useState<boolean>(true);
	const [featuredCategory, setFeaturedCategory] = useState<Model.FeaturedCategory[]>();
	const [categoryList, setCategoryList] = useState<Api.Reward.Category.Res.Get[]>([]);
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<(string | number)[]>([]);
	const [categorySelectList, setCategorySelectList] = useState<SelectOptions[]>([]);
	const [selectedDestinationIds, setSelectedDestinationIds] = useState<(string | number)[]>([]);
	const [destinationSelectList, setDestinationSelectList] = useState<SelectOptions[]>([]);
	const [rewardList, setRewardList] = useState<Api.Reward.Res.Get[]>([]);
	const [pointCostMin, setPointCostMin] = useState<number>();
	const [pointCostMax, setPointCostMax] = useState<number>();
	const [page, setPage] = useState<number>(1);
	const perPage = 9;
	const [rewardCardTotal, setRewardCardTotal] = useState<number>(12);

	const params = router.getPageUrlParams<{ categories: string }>([
		{ key: 'cids', default: 0, type: 'string', alias: 'categories' }
	]);

	useEffect(() => {
		async function getAllCategories() {
			try {
				let urlSelectedCategories: number[] = [];
				try {
					if (params.categories) urlSelectedCategories = JSON.parse(params.categories);
				} catch (e) {}

				let data = await rewardService.getAllForRedeemableRewardsPage();
				data.selectCategories = data.selectCategories.map((category) => {
					return {
						value: category.value,
						selected: urlSelectedCategories.includes(Number(category.value)),
						text: category.text
					};
				});
				setCategorySelectList(data.selectCategories);
				setCategoryList(data.allCategories);
				setFeaturedCategory(data.featuredCategories);
				setDestinationSelectList(data.destinationSelect);
				setWaitToLoad(false);
			} catch (e) {
				console.error(e);
			}
		}
		getAllCategories().catch(console.error);
	}, []);

	function buildFilterQuery(): FilterQuery {
		if (!ObjectUtils.isArrayWithData(selectedDestinationIds)) return { matchType: 'like', searchTerm: [] };
		let filter: FilterQueryValue[] = [];
		let isFirst: boolean = true;
		for (let destination of selectedDestinationIds) {
			const aOrD = destination.toString().slice(0, 1);
			const vendorId: number = parseInt(destination.toString().slice(1));
			if (isFirst) {
				filter.push({
					column: aOrD === 'd' ? 'destinationId' : 'affiliateId',
					value: vendorId,
					matchType: 'exact'
				});
				isFirst = false;
			} else {
				filter.push({
					column: aOrD === 'd' ? 'destinationId' : 'affiliateId',
					value: vendorId,
					conjunction: 'OR',
					matchType: 'exact'
				});
			}
		}
		return { matchType: 'exact', searchTerm: filter };
	}

	async function getRedeemableRewards() {
		let data: Api.Reward.Req.Paged = {
			categories: selectedCategoryIds as number[],
			pagination: { page: page, perPage: perPage }
		};
		if (selectedDestinationIds) {
			data.filter = buildFilterQuery();
		}
		if (pointCostMin) data.pointCostMin = pointCostMin;
		if (pointCostMax) data.pointCostMax = pointCostMax;
		try {
			let res = await rewardService.getPagedRewards(data);
			// console.log('res', res.data);
			setShowCategoryCards(false);
			setRewardList(res.data.data);
		} catch (e) {
			console.error(e.message);
		}
	}

	function applyFilters(newFilters: SelectOptions[]) {
		if (!ObjectUtils.isArrayWithData(selectedCategoryIds) && !ObjectUtils.isArrayWithData(newFilters)) {
			rsToasts.error('please select at least one category.');
			return false;
		}
		setShowCategoryCards(false);
		document.querySelector<HTMLElement>('.resortAndPointFilters')!.style.display = 'block';
		getRedeemableRewards().catch(console.error);
	}

	function getPrimaryRewardImg(medias: Model.Media[]): string {
		if (!ObjectUtils.isArrayWithData(medias)) return '';
		let primary = medias.find((item) => item.isPrimary);
		if (primary) return primary.urls.small;
		else return medias[0].urls.small;
	}

	function renderCards() {
		// console.log('renderCards showCategoryCards', showCategoryCards);
		if (showCategoryCards) {
			return categoryList.map((category, index) => {
				return (
					<RewardCategoryCard
						key={index}
						value={category.id}
						title={category.name}
						imgPath={category.media[0].urls.small}
					/>
				);
			});
		}
		// console.log('renderCards function rewardList', rewardList);
		if (!ObjectUtils.isArrayWithData(rewardList)) return;
		return rewardList.map((reward, index) => {
			let primaryImg = getPrimaryRewardImg(reward.media);
			return (
				<RewardItemCard
					key={index}
					imgPath={primaryImg}
					title={reward.name}
					points={reward.pointCost}
					description={reward.description}
					rewardId={reward.id}
				/>
			);
		});
	}

	function selectFeaturedCategory(categoryId: number | string) {
		router.updateUrlParams({ cids: JSON.stringify([categoryId]) });
		setSelectedCategoryIds([categoryId]);
		let selectedCategories = [...categorySelectList];
		selectedCategories = selectedCategories.map((category) => {
			if (category.value === categoryId) {
				return { value: category.value, text: category.text, selected: true };
			} else {
				return { value: category.value, text: category.text, selected: false };
			}
		});
		setCategorySelectList(selectedCategories);
		applyFilters(selectedCategories);
	}

	function renderFeaturedCategory() {
		if (!featuredCategory) return;
		return featuredCategory.map((category, index) => {
			return (
				<FeaturedCategoryCard
					key={index}
					category={{
						categoryId: category.categoryId,
						imagePath: category.imagePath,
						name: category.name
					}}
					onClick={(categoryId) => {
						selectFeaturedCategory(categoryId);
					}}
				/>
			);
		});
	}

	return waitToLoad ? (
		<LoadingPage />
	) : (
		<Page className={'rsRedeemableRewardsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'heroImgTextFeatured'}>
					<Label className={'pageTitle'} variant={'h1'}>
						Redeem Your Points
					</Label>
					<div className={'featuredCategories'}>{renderFeaturedCategory()}</div>
					<Box
						className={'pageWrapper'}
						padding={ObjectUtils.isArrayWithData(featuredCategory) ? ' 50px 140px' : '120px 140px 50px'}
					>
						<div className={'querySideBar'}>
							<div className={'rewardCategoryCheckboxList'}>
								<Label className={'queryTitle'} variant={'h4'}>
									Reward Categories
								</Label>
								<CheckboxList
									onChange={(value, options) => {
										// console.log(value);
										// console.log(options);
										router.updateUrlParams({ cids: JSON.stringify(value) });
										setSelectedCategoryIds(value);
										setCategorySelectList(options);
									}}
									options={categorySelectList}
									name={'categories'}
									className={'categoryCheckboxList'}
								/>
							</div>
							<div className={'resortAndPointFilters'}>
								<div className={'resortSelectFilter'}>
									<Label className={'resortTitle queryTitle'} variant={'h4'}>
										Resort
									</Label>
									<CheckboxList
										onChange={(value, options) => {
											setSelectedDestinationIds(value);
											setDestinationSelectList(options);
										}}
										options={destinationSelectList}
										name={'resorts'}
									/>
								</div>
								<div className={'pointCostFilters'}>
									<Label className={'queryTitle'} variant={'h4'}>
										Point Cost
									</Label>
									<div className={'minMaxContainer'}>
										<LabelInput
											title={'MIN'}
											inputType={'text'}
											onChange={(value) => setPointCostMin(value)}
										/>
										<LabelInput
											title={'MAX'}
											inputType={'text'}
											onChange={(value) => setPointCostMax(value)}
										/>
									</div>
								</div>
							</div>
							<div className={'filterButtonContainer'}>
								<LabelButton
									look={'containedPrimary'}
									variant={'button'}
									label={'Apply Filters'}
									onClick={() => applyFilters([])}
								/>
							</div>
						</div>
						<Box className={'pagedCategoryCards'} marginTop={user ? 0 : 35}>
							<div className={'rightSideHeaderContainer'}>
								<Label className={'categoriesTitle'} variant={'h4'}>
									Categories
								</Label>
								<div className={'pointOrLoginContainer'}>
									<PointsOrLogin user={user} />
								</div>
							</div>
							<div className={'cardContainer'}>{renderCards()}</div>
							<div className={'paginationContainer'}>
								<PaginationButtons
									selectedRowsPerPage={perPage}
									currentPageNumber={page}
									setSelectedPage={(page) => setPage(page)}
									total={rewardCardTotal}
								/>
							</div>
						</Box>
					</Box>
				</div>
			</div>
		</Page>
	);
};

export default RedeemableRewardsPage;
