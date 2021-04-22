import React, { useEffect, useRef, useState } from 'react';
import './RewardItemPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import FeaturedCategoryCard from './FeaturedCategoryCard';
import { SelectOptions } from '../../components/Select/Select';
import CheckboxList from '../../components/checkboxList/CheckboxList';
import rsToasts from '@bit/redsky.framework.toast';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';
import RewardCategoryCard from './RewardCategoryCard';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import PointsOrLogin from '../../components/pointsOrLogin/PointsOrLogin';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import RewardService from '../../services/reward/reward.service';
import LoadingPage from '../loadingPage/LoadingPage';
import RewardItemCard from './RewardItemCard';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import router from '../../utils/router';

import FilterQueryValue = RedSky.FilterQueryValue;
import FilterQuery = RedSky.FilterQuery;

const RewardItemPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	let user = userService.getCurrentUser();

	const rewardService = serviceFactory.get<RewardService>('RewardService');
	const filterRef = useRef<HTMLElement>(null);
	const [waitToLoad, setWaitToLoad] = useState<boolean>(true);

	const [showCategoryOrRewardCards, setShowCategoryOrRewardCards] = useState<'category' | 'reward'>('category');
	const [featuredCategory, setFeaturedCategory] = useState<Model.FeaturedCategory[]>();
	const [categoryList, setCategoryList] = useState<Api.Reward.Category.Res.Get[]>([]);
	const [categorySelectList, setCategorySelectList] = useState<SelectOptions[]>([]);
	const [destinationSelectList, setDestinationSelectList] = useState<SelectOptions[]>([]);
	const [rewardList, setRewardList] = useState<Api.Reward.Res.Get[]>([]);
	const [pointCostMin, setPointCostMin] = useState<number>();
	const [pointCostMax, setPointCostMax] = useState<number>();
	const [page, setPage] = useState<number>(1);
	const perPage = 9;
	const [cardTotal, setCardTotal] = useState<number>(12);

	const params = router.getPageUrlParams<{ categories: string }>([
		{ key: 'cids', default: '', type: 'string', alias: 'categories' }
	]);

	useEffect(() => {
		async function getAllCategories() {
			try {
				let urlSelectedCategories: number[] = [];
				try {
					if (params.categories) urlSelectedCategories = JSON.parse(params.categories);
				} catch (e) {
					rsToasts.error('An unexpected error occurred on the server.');
				}

				let data = await rewardService.getAllForRewardItemPage();
				let selectCategories = data.allCategories.map((category) => {
					return {
						value: category.id,
						selected: urlSelectedCategories.includes(Number(category.id)),
						text: category.name
					};
				});
				setCategorySelectList(selectCategories);
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

	function formatFilterQuery(): FilterQuery {
		let selectedDestinationIds = getSelectedIds([...destinationSelectList]);
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

	function getSelectedIds(options: SelectOptions[]): (string | number)[] {
		return options
			.filter((option) => {
				return option.selected;
			})
			.map((option) => {
				return option.value;
			});
	}

	async function getRewardItem() {
		let data: Api.Reward.Req.Paged = {
			categories: JSON.parse(params.categories),
			pagination: { page: page, perPage: perPage }
		};
		data.filter = formatFilterQuery();
		if (pointCostMin) data.pointCostMin = pointCostMin;
		if (pointCostMax) data.pointCostMax = pointCostMax;
		try {
			let res = await rewardService.getPagedRewards(data);
			setShowCategoryOrRewardCards('reward');
			// setCardTotal(res.data.total);
			setRewardList(res.data.data);
		} catch (e) {
			console.error(e.message);
		}
	}

	function handleSidebarFilters(selectedFromCategoryTile: boolean) {
		if (!params.categories && !selectedFromCategoryTile) {
			rsToasts.error('Must have at least one category selected.');
			return;
		}
		setShowCategoryOrRewardCards('reward');
		if (filterRef.current) filterRef.current.style.display = 'block';
		getRewardItem().catch(console.error);
	}

	function getPrimaryRewardImg(medias: Model.Media[]): string {
		if (!ObjectUtils.isArrayWithData(medias)) return '';
		let primary = medias.find((item) => item.isPrimary);
		if (primary) return primary.urls.small;
		else return medias[0].urls.small;
	}

	function renderCards() {
		if (showCategoryOrRewardCards === 'category') {
			return categoryList.map((category, index) => {
				return (
					<RewardCategoryCard
						key={index}
						value={category.id}
						title={category.name}
						imgPath={category.media[0] ? category.media[0].urls.small : ''}
					/>
				);
			});
		}
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

	function handleFeaturedCategoryOnClick(categoryId: number | string) {
		router.updateUrlParams({ cids: JSON.stringify([categoryId]) });
		let selectedCategories = [...categorySelectList];
		selectedCategories = selectedCategories.map((category) => {
			if (category.value === categoryId) {
				return { value: category.value, text: category.text, selected: true };
			} else {
				return { value: category.value, text: category.text, selected: false };
			}
		});
		setCategorySelectList(selectedCategories);
		handleSidebarFilters(true);
	}

	function renderFeaturedCategory() {
		if (!featuredCategory || showCategoryOrRewardCards === 'reward') return;
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
						handleFeaturedCategoryOnClick(categoryId);
					}}
				/>
			);
		});
	}

	return waitToLoad ? (
		<LoadingPage />
	) : (
		<Page className={'rsRewardItemPage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'heroImgTextFeatured'}>
					<Label className={'pageTitle'} variant={'h1'}>
						Redeem Your Points
					</Label>
					<div className={'featuredCategories'}>{renderFeaturedCategory()}</div>
					<Box
						className={'pageWrapper'}
						padding={
							!ObjectUtils.isArrayWithData(featuredCategory) || showCategoryOrRewardCards === 'reward'
								? '120px 140px 50px'
								: '50px 140px'
						}
					>
						<div className={'querySideBar'}>
							<div className={'rewardCategoryCheckboxList'}>
								<Label className={'queryTitle'} variant={'h4'}>
									Reward Categories
								</Label>
								<CheckboxList
									onChange={(value, options) => {
										router.updateUrlParams({
											cids: JSON.stringify(value)
										});
										setCategorySelectList(options);
									}}
									options={categorySelectList}
									name={'categories'}
									className={'categoryCheckboxList'}
								/>
							</div>
							<div ref={filterRef} className={'resortAndPointFilters'}>
								<div className={'resortSelectFilter'}>
									<Label className={'resortTitle queryTitle'} variant={'h4'}>
										Resort
									</Label>
									<CheckboxList
										onChange={(value, options) => {
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
									onClick={() => handleSidebarFilters(false)}
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
									total={cardTotal}
								/>
							</div>
						</Box>
					</Box>
					<Footer links={FooterLinkTestData} />
				</div>
			</div>
		</Page>
	);
};

export default RewardItemPage;
