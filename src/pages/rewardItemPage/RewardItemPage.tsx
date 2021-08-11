import React, { useEffect, useState } from 'react';
import './RewardItemPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import FeaturedCategoryCard from './featuredCategoryCard/FeaturedCategoryCard';
import { SelectOptions } from '../../components/Select/Select';
import CheckboxList from '../../components/checkboxList/CheckboxList';
import rsToasts from '@bit/redsky.framework.toast';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';
import RewardCategoryCard from './rewardCategoryCard/RewardCategoryCard';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import PointsOrLogin from '../../components/pointsOrLogin/PointsOrLogin';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import RewardService from '../../services/reward/reward.service';
import LoadingPage from '../loadingPage/LoadingPage';
import RewardItemCard from './rewardItemCard/RewardItemCard';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

const RewardItemPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	let user = userService.getCurrentUser();
	const size = useWindowResizeChange();
	const rewardService = serviceFactory.get<RewardService>('RewardService');
	const [waitToLoad, setWaitToLoad] = useState<boolean>(true);
	const [showCategoryOrRewardCards, setShowCategoryOrRewardCards] = useState<'category' | 'reward'>('category');
	const [applyFilterToggle, setApplyFilterToggle] = useState<boolean>(true);
	const [featuredCategory, setFeaturedCategory] = useState<Misc.FeaturedCategory[]>();
	const [categoryPagedList, setCategoryPagedList] = useState<Api.Reward.Category.Res.Get[]>([]);
	const [categorySelectList, setCategorySelectList] = useState<SelectOptions[]>([]);
	const [destinationSelectList, setDestinationSelectList] = useState<SelectOptions[]>([]);
	const [rewardList, setRewardList] = useState<Api.Reward.Res.Get[]>([]);
	const [pointCostMin, setPointCostMin] = useState<number>();
	const [pointCostMax, setPointCostMax] = useState<number>();
	const [page, setPage] = useState<number>(1);
	const perPage = 9;
	const [cardTotal, setCardTotal] = useState<number>(0);
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
					rsToasts.error('Cannot get a list of categories.');
				}
				let allActiveCategories = await rewardService.getAllActiveCategories();
				let data = await rewardService.getAllForRewardItemPage();
				let selectCategories = allActiveCategories.map((category) => {
					return {
						value: category.id,
						selected: urlSelectedCategories.includes(Number(category.id)),
						text: category.name
					};
				});
				setCategorySelectList(selectCategories);
				setFeaturedCategory(data.featuredCategories);
				setDestinationSelectList(data.destinationSelect);
				setWaitToLoad(false);
			} catch (e) {
				console.error(e);
			}
		}
		getAllCategories().catch(console.error);
	}, []);

	useEffect(() => {
		async function getCategoriesOrRewardItems() {
			setCardTotal(0);
			if (ObjectUtils.isArrayWithData(params.categories) || params.categories === '') {
				try {
					let pagedCategories = await rewardService.getPagedCategories(
						page,
						perPage,
						'name',
						'ASC',
						'exact',
						[
							{
								column: 'isActive',
								value: 1
							}
						]
					);
					setCategoryPagedList(pagedCategories.data.data);
					setCardTotal(pagedCategories.data.total ? pagedCategories.data.total : 0);
				} catch (e) {
					rsToasts.error('Cannot get the list of rewards.');
				}
			} else {
				let filter = formatFilterQuery();
				try {
					let res = await rewardService.getPagedRewards({
						pagination: { page: page, perPage: perPage },
						filter: { matchType: 'exact', searchTerm: filter }
					});
					setShowCategoryOrRewardCards('reward');
					setCardTotal(res.total ? res.total : 0);
					setRewardList(res.data);
				} catch (e) {
					console.error(e.message);
				}
			}
		}
		getCategoriesOrRewardItems().catch(console.error);
	}, [page, applyFilterToggle]);

	function formatFilterQuery(): RedSky.FilterQueryValue[] {
		let selectedDestinationIds = getSelectedIds([...destinationSelectList]);
		let filter: RedSky.FilterQueryValue[] = [];
		if (ObjectUtils.isArrayWithData(selectedDestinationIds)) {
			let destinationIds: number[] = [];
			let affiliateIds: number[] = [];
			for (let destination of selectedDestinationIds) {
				const aOrD = destination.toString().slice(0, 1);
				const vendorId: number = parseInt(destination.toString().slice(1));
				if (aOrD === 'd') destinationIds.push(vendorId);
				if (aOrD === 'a') affiliateIds.push(vendorId);
			}
			if (ObjectUtils.isArrayWithData(destinationIds)) {
				filter.push({
					column: 'destinationId',
					value: destinationIds,
					matchType: 'exact',
					conjunction: 'OR'
				});
			}
			if (ObjectUtils.isArrayWithData(affiliateIds)) {
				filter.push({
					column: 'affiliateId',
					value: affiliateIds,
					conjunction: 'OR',
					matchType: 'exact'
				});
			}
		}
		let selectedCategoryIds = JSON.parse(params.categories);
		if (ObjectUtils.isArrayWithData(selectedCategoryIds)) {
			filter.push({
				column: 'map.CategoryId',
				value: selectedCategoryIds,
				matchType: 'exact',
				conjunction: 'AND'
			});
		}
		if (pointCostMin) {
			filter.push({
				column: 'pointCost',
				value: pointCostMin,
				matchType: 'greaterThanEqual',
				conjunction: 'AND'
			});
		}
		if (pointCostMax) {
			filter.push({
				column: 'pointCost',
				value: pointCostMax,
				matchType: 'lessThanEqual',
				conjunction: 'AND'
			});
		}
		filter.push({
			column: 'isActive',
			value: 1,
			matchType: 'exact',
			conjunction: 'AND'
		});
		return filter;
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

	function handleSidebarFilters(selectedFromCategoryTile: boolean) {
		if (!params.categories && !selectedFromCategoryTile) {
			rsToasts.error('Must have at least one category selected.');
			return;
		}
		setShowCategoryOrRewardCards('reward');
		setApplyFilterToggle(!applyFilterToggle);
	}

	function getPrimaryRewardImg(medias: Api.Media[]): string {
		if (!ObjectUtils.isArrayWithData(medias)) return '';
		let primary = medias.find((item) => item.isPrimary);
		if (primary) return primary.urls.small;
		else return medias[0].urls.small;
	}

	function getRedeemableVoucherCode(vouchers: Api.Reward.Voucher.Res.Get[]) {
		for (let i in vouchers) {
			if (vouchers[i].isActive === 1 && vouchers[i].isRedeemed === 0 && vouchers[i].customerUserId === 0) {
				return vouchers[i].code;
			}
		}
		return 'noneAvailable';
	}

	function renderCards() {
		if (showCategoryOrRewardCards === 'category') {
			return categoryPagedList.map((category, index) => {
				return (
					<RewardCategoryCard
						key={index}
						value={category.id}
						title={category.name}
						imgPath={category.media[0] ? category.media[0].urls.small : ''}
						onClick={(categoryId) => {
							handleCategoryOnClick(categoryId);
						}}
					/>
				);
			});
		}
		if (!ObjectUtils.isArrayWithData(rewardList)) return;
		return rewardList.map((reward, index) => {
			let primaryImg = getPrimaryRewardImg(reward.media);
			let voucherCode = getRedeemableVoucherCode(reward.vouchers);
			return (
				<RewardItemCard
					key={index}
					imgPath={primaryImg}
					title={reward.name}
					points={reward.pointCost}
					description={reward.description}
					rewardId={reward.id}
					voucherCode={voucherCode}
				/>
			);
		});
	}

	function handleCategoryOnClick(categoryId: number | string) {
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
						handleCategoryOnClick(categoryId);
					}}
				/>
			);
		});
	}

	function renderPaginationOrNoRewardsMsg() {
		if (cardTotal === 0) {
			return <Label variant={'body1'}>There are no rewards available matching your filters.</Label>;
		} else {
			return (
				<PaginationButtons
					selectedRowsPerPage={perPage}
					currentPageNumber={page}
					setSelectedPage={(page) => setPage(page)}
					total={cardTotal}
				/>
			);
		}
	}

	function renderQuerySidebar() {
		return (
			<div className={'querySideBar'}>
				<div className={'rewardCategoryCheckboxList'}>
					<Label className={'queryTitle'} variant={'h4'}>
						Business Categories
					</Label>
					<CheckboxList
						onChange={(value, options) => {
							if (value.length === 0) {
								router.updateUrlParams({});
								setShowCategoryOrRewardCards('category');
							} else {
								router.updateUrlParams({
									cids: JSON.stringify(value)
								});
								setShowCategoryOrRewardCards('reward');
								setApplyFilterToggle(!applyFilterToggle);
							}
							setCategorySelectList(options);
						}}
						options={categorySelectList}
						name={'categories'}
						className={'categoryCheckboxList'}
					/>
				</div>
				<Box
					className={'resortAndPointFilters'}
					display={showCategoryOrRewardCards === 'category' ? 'none' : 'block'}
				>
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
								onChange={(value) => {
									setPointCostMin(value);
								}}
							/>
							<LabelInput title={'MAX'} inputType={'text'} onChange={(value) => setPointCostMax(value)} />
						</div>
					</div>
				</Box>
				<div className={'filterButtonContainer'}>
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Apply Filters'}
						onClick={() => handleSidebarFilters(false)}
					/>
				</div>
			</div>
		);
	}

	return waitToLoad ? (
		<LoadingPage />
	) : size === 'small' ? (
		<Page className={'rsRewardItemPage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'heroImgTextFeatured'}>
					<Label className={'pageTitle'} variant={'h2'}>
						Redeem Your Points
					</Label>
				</div>
				<Box className={'pageWrapper'}>
					<div className={'pointOrLoginContainer'}>
						<PointsOrLogin />
					</div>
					{renderQuerySidebar()}
					<Label className={'categoriesTitle'} variant={'h4'}>
						{showCategoryOrRewardCards === 'category' ? 'Categories' : 'Available Rewards'}
					</Label>
					<div className={'cardContainer'}>{renderCards()}</div>
					<div className={'paginationContainer'}>{renderPaginationOrNoRewardsMsg()}</div>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
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
						{renderQuerySidebar()}
						<Box className={'pagedCategoryCards'} marginTop={user ? 0 : 35}>
							<div className={'rightSideHeaderContainer'}>
								<Label className={'categoriesTitle'} variant={'h4'}>
									{showCategoryOrRewardCards === 'category' ? 'Categories' : 'Available Rewards'}
								</Label>
								<div className={'pointOrLoginContainer'}>
									<PointsOrLogin />
								</div>
							</div>
							<div className={'cardContainer'}>{renderCards()}</div>
							<div className={'paginationContainer'}>{renderPaginationOrNoRewardsMsg()}</div>
						</Box>
					</Box>
					<Footer links={FooterLinkTestData} />
				</div>
			</div>
		</Page>
	);
};

export default RewardItemPage;
