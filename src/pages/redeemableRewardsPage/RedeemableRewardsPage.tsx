import React, { useState } from 'react';
import './RedeemableRewardsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelLinkImage from '../../components/labelLinkImage/LabelLinkImage';
import { SelectOptions } from '../../components/Select/Select';
import CheckboxList from '../../components/checkboxList/CheckboxList';

const RedeemableRewardsPage: React.FC = () => {
	const [featuredCategory, setFeaturedCategory] = useState<{ imgPath: string; name: string; localPath: string }[]>();
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
		{ id: 1, text: 'Popular Items', imgPath: '../../images/redeemableRewardPage/poolDrink.jpg' },
		{ id: 2, text: 'Electronics', imgPath: '../../images/redeemableRewardPage/electronics.jpg' },
		{ id: 3, text: 'Travel Accessories', imgPath: '../../images/redeemableRewardPage/luggage.jpg' },
		{ id: 4, text: 'Lyft Credit', imgPath: '../../images/redeemableRewardPage/rideService.jpg' },
		{ id: 5, text: 'Merchandise', imgPath: '../../images/redeemableRewardPage/watches.jpg' },
		{ id: 6, text: 'Merchandise', imgPath: '../../images/redeemableRewardPage/bags.jpg' },
		{ id: 7, text: 'Merchandise', imgPath: '../../images/redeemableRewardPage/suitCoat.jpg' },
		{ id: 8, text: 'Merchandise', imgPath: '../../images/redeemableRewardPage/earbuds.jpg' },
		{ id: 9, text: 'Merchandise', imgPath: '../../images/redeemableRewardPage/perfume.jpg' }
	];

	const hardCategorySelectList: SelectOptions[] = [
		{ value: 1, text: 'Popular Items', selected: false },
		{ value: 2, text: 'Electronics', selected: false },
		{ value: 3, text: 'Travel Accessories', selected: false },
		{ value: 4, text: 'Lyft Credit', selected: false },
		{ value: 5, text: 'Merchandise', selected: false },
		{ value: 6, text: 'Merchandise', selected: false },
		{ value: 7, text: 'Merchandise', selected: false },
		{ value: 8, text: 'Merchandise', selected: false },
		{ value: 9, text: 'Merchandise', selected: false }
	];

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
							<Label variant={'h4'}>Reward Categories</Label>
							<CheckboxList
								onChange={(value) => console.log('RedeemableRewardsPage value', value)}
								options={hardCategorySelectList}
							/>
						</div>
						<div className={'pagedCategoryTiles'}></div>
					</div>
				</div>
			</div>
		</Page>
	);
};

export default RedeemableRewardsPage;
