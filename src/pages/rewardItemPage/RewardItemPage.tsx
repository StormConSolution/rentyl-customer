import React, { useEffect, useState } from 'react';
import './RewardItemPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import FeaturedCategoryCard from './featuredCategoryCard/FeaturedCategoryCard';
import CheckboxList from '../../components/checkboxList/CheckboxList';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';
import RewardCategoryCard from './rewardCategoryCard/RewardCategoryCard';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import PointsOrLogin from '../../components/pointsOrLogin/PointsOrLogin';
import serviceFactory from '../../services/serviceFactory';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import RewardService from '../../services/reward/reward.service';
import LoadingPage from '../loadingPage/LoadingPage';
import RewardItemCard from './rewardItemCard/RewardItemCard';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import router from '../../utils/router';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { useRecoilValue } from 'recoil';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import globalState from '../../state/globalState';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';

const RewardItemPage: React.FC = () => {
	let user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ categories: string; vendors: string }>([
		{ key: 'cids', default: '', type: 'string', alias: 'categories' },
		{ key: 'vids', default: '', type: 'string', alias: 'vendors' }
	]);
	const rewardService = serviceFactory.get<RewardService>('RewardService');
	const [waitToLoad, setWaitToLoad] = useState<boolean>(true);
	const [vendors, setVendors] = useState<Misc.SelectOptions[]>([]);
	const [featuredCategories, setFeaturedCategories] = useState<Api.Reward.Category.Res.Get[]>([]);
	const [categories, setCategories] = useState<Api.Reward.Category.Res.Get[]>([]);
	const [rewards, setRewards] = useState<Api.Reward.Res.Get[]>([]);
	const [rewardTotal, setRewardTotal] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const perPage = 9;
	const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
	const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
	const [pointCostRange, setPointCostRange] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('min', 0, []), new RsFormControl('max', 0, [])])
	);

	useEffect(() => {
		async function getAllRewardInfo() {
			const categoryIds = ObjectUtils.smartParse(params.categories);
			const vendorIds = ObjectUtils.smartParse(params.vendors);
			if (ObjectUtils.isArrayWithData(categoryIds)) {
				setSelectedCategories(categoryIds);
			}
			if (ObjectUtils.isArrayWithData(vendorIds)) {
				setSelectedVendors(vendorIds);
			}
			const vendorResponse = await rewardService.getAllVendors();
			setVendors(
				vendorResponse
					.filter((vendor) => !!vendor.brandId || !!vendor.destinationId)
					.map((vendor) => {
						return {
							value: vendor.brandId ? 'b' + vendor.brandId : 'd' + vendor.destinationId,
							text: vendor.name,
							selected:
								ObjectUtils.isArrayWithData(vendorIds) &&
								(vendorIds.includes('b' + vendor.brandId) ||
									vendorIds.includes('d' + vendor.destinationId))
						};
					})
			);
			const categoryResponse = await rewardService.getAllActiveCategories();
			setCategories(categoryResponse.data);
			setFeaturedCategories(
				categoryResponse.data.filter((category: Api.Reward.Category.Res.Get) => !!category.isFeatured)
			);
			setWaitToLoad(false);
		}
		getAllRewardInfo().catch(console.error);
	}, []);

	useEffect(() => {
		async function getRewardItems() {
			const searchTerm = formatFilterQuery();
			const pageQuery: RedSky.PageQuery = {
				pagination: { page, perPage: 9 },
				filter: {
					matchType: 'exact',
					searchTerm
				}
			};
			const response = await rewardService.getPagedRewards(pageQuery);
			setRewardTotal(response.total || 0);
			setRewards(response.data);
		}
		getRewardItems().catch(console.error);
	}, [page, selectedCategories, selectedVendors, pointCostRange]);

	function formatFilterQuery(): RedSky.FilterQueryValue[] {
		let filter: RedSky.FilterQueryValue[] = [];
		if (ObjectUtils.isArrayWithData(selectedVendors)) {
			let brands = selectedVendors.filter((vendor) => vendor.startsWith('b'));
			let destinations = selectedVendors.filter((vendor) => vendor.startsWith('d'));
			if (ObjectUtils.isArrayWithData(destinations)) {
				filter.push({
					column: 'vendor.destinationId',
					value: destinations.map((destination) => parseInt(destination.slice(1))),
					matchType: 'exact',
					conjunction: 'OR'
				});
			}
			if (ObjectUtils.isArrayWithData(brands)) {
				filter.push({
					column: 'vendor.brandId',
					value: brands.map((brand) => parseInt(brand.slice(1))),
					conjunction: 'OR',
					matchType: 'exact'
				});
			}
		}
		if (ObjectUtils.isArrayWithData(selectedCategories)) {
			filter.push({
				column: 'map.categoryId',
				value: selectedCategories,
				matchType: 'exact',
				conjunction: 'AND'
			});
		}
		const minMax: { min: number; max: number } = pointCostRange.toModel<{ min: number; max: number }>();
		if (minMax.max > 0 && minMax.max < minMax.min) {
			rsToastify.error('Make sure the max is greater than the minimum', 'Price Range Error');
		} else {
			if (minMax.min > 0) {
				filter.push({
					column: 'pointCost',
					value: minMax.min,
					matchType: 'greaterThanEqual',
					conjunction: 'AND'
				});
			}
			if (minMax.max > 0 && minMax.max > minMax.min) {
				filter.push({
					column: 'pointCost',
					value: minMax.max,
					matchType: 'lessThanEqual',
					conjunction: 'AND'
				});
			}
		}
		filter.push({
			column: 'isActive',
			value: 1,
			matchType: 'exact',
			conjunction: 'AND'
		});
		return filter;
	}

	function getPrimaryRewardImg(medias: Api.Media[]): string {
		if (!ObjectUtils.isArrayWithData(medias)) return '';
		let primary = medias.find((item) => item.isPrimary);
		if (primary) return primary.urls.imageKit;
		else return medias[0].urls.imageKit;
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
		if (!ObjectUtils.isArrayWithData(selectedCategories)) {
			return categories.map((category: Api.Reward.Category.Res.Get, index) => {
				let media;
				if (category.media.length >= 1) {
					let img = category.media.find((image) => image.isPrimary);
					if (img) {
						media = img.urls.imageKit?.toString() || img.urls.thumb;
					} else {
						media = category.media[0].urls.imageKit?.toString() || category.media[0].urls.thumb;
					}
				} else {
					media = '';
				}
				return (
					<RewardCategoryCard
						key={index}
						value={category.id}
						title={category.name}
						imgPath={media}
						onClick={(categoryId) => {
							handleCategoryOnClick(categoryId);
						}}
					/>
				);
			});
		}
		if (!ObjectUtils.isArrayWithData(rewards)) return;
		return rewards.map((reward, index) => {
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

	function handleCategoryOnClick(categoryId: number) {
		router.updateUrlParams({ cids: JSON.stringify([categoryId]) });
		setSelectedCategories([categoryId]);
	}

	function renderFeaturedCategory() {
		if (!ObjectUtils.isArrayWithData(featuredCategories) || ObjectUtils.isArrayWithData(selectedCategories)) return;
		return featuredCategories.map((category, index) => {
			const media = category.media;
			let imagePath = '';
			if (ObjectUtils.isArrayWithData(media)) {
				const primary = media.find((image) => image.isPrimary);
				if (!primary || media.length === 1) {
					imagePath = media[0].urls.imageKit;
				} else {
					imagePath = primary.urls.imageKit;
				}
			}
			return (
				<FeaturedCategoryCard
					key={index}
					category={{
						categoryId: category.id,
						imagePath,
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
		if (rewardTotal < 1 || !ObjectUtils.isArrayWithData(categories)) {
			return <Label variant={'body1'}>There are no rewards available matching your filters.</Label>;
		} else {
			return (
				<PaginationButtons
					selectedRowsPerPage={perPage}
					currentPageNumber={page}
					setSelectedPage={(page) => setPage(page)}
					total={rewardTotal}
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
								setSelectedCategories([]);
							} else {
								router.updateUrlParams({
									cids: JSON.stringify(value),
									vids: JSON.stringify(selectedVendors)
								});
								setSelectedCategories(value as number[]);
							}
						}}
						options={categories.map((category) => {
							return {
								value: category.id,
								text: category.name,
								selected: selectedCategories.includes(category.id)
							};
						})}
						name={'categories'}
						className={'categoryCheckboxList'}
					/>
				</div>
				<Box
					className={'resortAndPointFilters'}
					display={!ObjectUtils.isArrayWithData(selectedCategories) ? 'none' : 'block'}
				>
					<div className={'resortSelectFilter'}>
						<Label className={'resortTitle queryTitle'} variant={'h4'}>
							Vendors
						</Label>
						<CheckboxList
							onChange={(value, options) => {
								router.updateUrlParams({
									cids: JSON.stringify(selectedCategories),
									vids: JSON.stringify(value)
								});
								setSelectedVendors(value as string[]);
								setVendors(
									vendors.map((vendor) => {
										return {
											value: vendor.value,
											text: vendor.text,
											selected:
												ObjectUtils.isArrayWithData(value) &&
												value.includes(vendor.value as string)
										};
									})
								);
							}}
							options={vendors}
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
								control={pointCostRange.get('min')}
								updateControl={(control) => setPointCostRange(pointCostRange.clone().update(control))}
							/>
							<LabelInput
								title={'MAX'}
								inputType={'text'}
								control={pointCostRange.get('max')}
								updateControl={(control) => setPointCostRange(pointCostRange.clone().update(control))}
							/>
						</div>
					</div>
				</Box>
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
						{!ObjectUtils.isArrayWithData(selectedCategories) ? 'Categories' : 'Available Rewards'}
					</Label>
					<div className={'cardContainer'}>{renderCards()}</div>
					<div className={'paginationContainer'}>{renderPaginationOrNoRewardsMsg()}</div>
				</Box>
				<Footer links={FooterLinks} />
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
							!ObjectUtils.isArrayWithData(featuredCategories) ||
							ObjectUtils.isArrayWithData(selectedCategories)
								? '120px 140px 50px'
								: '50px 140px'
						}
					>
						{renderQuerySidebar()}
						<Box className={'pagedCategoryCards'} marginTop={user ? 0 : 35}>
							<div className={'rightSideHeaderContainer'}>
								<Label className={'categoriesTitle'} variant={'h4'}>
									{!ObjectUtils.isArrayWithData(selectedCategories)
										? 'Categories'
										: 'Available Rewards'}
								</Label>
								<div className={'pointOrLoginContainer'}>
									<PointsOrLogin />
								</div>
							</div>
							<div className={'cardContainer'}>{renderCards()}</div>
							<div className={'paginationContainer'}>{renderPaginationOrNoRewardsMsg()}</div>
						</Box>
					</Box>
					<Footer links={FooterLinks} />
				</div>
			</div>
		</Page>
	);
};

export default RewardItemPage;
