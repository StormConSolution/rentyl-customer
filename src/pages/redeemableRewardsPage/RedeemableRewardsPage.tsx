import React, { useEffect, useState } from 'react';
import './RedeemableRewardsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelLinkImage from '../../components/labelLinkImage/LabelLinkImage';
import { SelectOptions } from '../../components/Select/Select';
import CheckboxList from '../../components/checkboxList/CheckboxList';
import rsToasts from '@bit/redsky.framework.toast';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';
import RewardCategoryCard from '../../components/rewardCategoryCard/RewardCategoryCard';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import useLoginState, { LoginStatus } from '../../customHooks/useLoginState';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import router from '../../utils/router';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';

const RedeemableRewardsPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [user, setUser] = useState<Api.User.Res.Get>();
	const loginStatus = useLoginState();
	const [featuredCategory, setFeaturedCategory] = useState<{ imgPath: string; name: string; localPath: string }[]>();
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<(string | number)[]>([]);
	const [selectedDestinationIds, setSelectedDestinationIds] = useState<(string | number)[]>([]);
	const [page, setPage] = useState<number>(1);
	const perPage = 9;
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
	const [hardDestinationList, setHardDestinationList] = useState<SelectOptions[]>([
		{ value: 'd1', text: 'Resort1', selected: false },
		{ value: 'd2', text: 'Resort2', selected: false },
		{ value: 'a3', text: 'Resort3', selected: false },
		{ value: 'd4', text: 'Resort4', selected: false },
		{ value: 'a5', text: 'Resort5', selected: false },
		{ value: 'a6', text: 'Resort6', selected: false },
		{ value: 'd7', text: 'Resort7', selected: false },
		{ value: 'a8', text: 'Resort8', selected: false }
	]);

	useEffect(() => {
		if (loginStatus === LoginStatus.LOGGED_IN) setUser(userService.getCurrentUser());
	}, [loginStatus]);

	function applyFilters() {
		if (!ObjectUtils.isArrayWithData(selectedCategoryIds)) {
			rsToasts.error('please select at least one category.');
			return;
		}
		document.querySelector<HTMLElement>('.resortAndPointFilters')!.style.display = 'block';
		console.log('selected Category Ids', selectedCategoryIds);
		// todo call the endpoint for the reward
	}

	function renderPointsOrLoginButton() {
		if (user) {
			return (
				<div className={'availablePendingPointsContainer'}>
					<div className={'availablePointsContainer'}>
						<Label variant={'h4'}>Available Points</Label>
						<Label className={'availablePointsNumber'} variant={'h1'}>
							{user.availablePoints}
						</Label>
					</div>
					<div className={'pendingPointsContainer'}>
						<Label variant={'h4'}>Points Pending</Label>
						<Label className={'pendingPointsNumber'} variant={'h1'}>
							951
						</Label>
					</div>
				</div>
			);
		} else {
			return (
				<div className={'signinButtonContainer'}>
					<LabelButton
						look={'containedSecondary'}
						variant={'button'}
						label={'Sign In'}
						onClick={() => router.navigate('/signin')}
					/>
					<LabelButton
						className={'signupButton'}
						look={'containedPrimary'}
						variant={'button'}
						label={'Sign Up'}
						onClick={() => router.navigate('/signup')}
					/>
				</div>
			);
		}
	}

	function renderCards() {
		return hardCategoryList.map((category, index) => {
			return (
				<RewardCategoryCard
					key={index}
					value={category.value}
					title={category.title}
					imgPath={category.imgPath}
				/>
			);
		});
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
									name={'categories'}
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
											setHardDestinationList(options);
										}}
										options={hardDestinationList}
										name={'resorts'}
									/>
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
							</div>
							<div className={'filterButtonContainer'}>
								<LabelButton
									look={'containedPrimary'}
									variant={'button'}
									label={'Apply Filters'}
									onClick={() => applyFilters()}
								/>
							</div>
						</div>
						<div className={'pagedCategoryCards'}>
							<div className={'rightSideHeaderContainer'}>
								<Label className={'categoriesTitle'} variant={'h4'}>
									Categories
								</Label>
								<div className={'pointOrLoginContainer'}>{renderPointsOrLoginButton()}</div>
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
