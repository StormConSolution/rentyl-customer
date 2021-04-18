import { Model } from '../Model';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import StandardOrderTypes = RedSky.StandardOrderTypes;
import MatchTypes = RedSky.MatchTypes;
import FilterQueryValue = RedSky.FilterQueryValue;
import FilterQuery = RedSky.FilterQuery;
import FeaturedCategory = Model.FeaturedCategory;

export default class RewardModel extends Model {
	private allCategory: Api.Reward.Category.Res.Get[] | undefined;

	private categoryList: Api.Reward.Category.Res.Get[] = [
		{
			id: 1,
			name: 'Popular Items',
			isActive: true,
			isFeatured: true,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/poolDrink.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			]
		},
		{
			isActive: true,
			isFeatured: true,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/electronics.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 2,
			name: 'Electronics'
		},
		{
			isActive: true,
			isFeatured: true,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/luggage.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 1
				}
			],
			id: 3,
			name: 'Travel Accessories'
		},
		{
			isActive: true,
			isFeatured: true,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/rideService.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 4,
			name: 'Lyft Credit'
		},
		{
			isActive: true,
			isFeatured: false,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/watches.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 5,
			name: 'Merchandise'
		},
		{
			isActive: true,
			isFeatured: false,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/bags.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 6,
			name: 'Merchandise1'
		},
		{
			isActive: true,
			isFeatured: false,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/suitCoat.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 7,
			name: 'Merchandise2'
		},
		{
			isActive: true,
			isFeatured: false,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/earbuds.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 8,
			name: 'Merchandise3'
		},
		{
			isActive: true,
			isFeatured: false,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/perfume.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 9,
			name: 'Merchandise4'
		},
		{
			isActive: true,
			isFeatured: false,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/perfume.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 10,
			name: 'Merchandise5'
		},
		{
			isActive: true,
			isFeatured: false,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/perfume.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 11,
			name: 'Merchandise6'
		},
		{
			isActive: true,
			isFeatured: false,
			createdOn: '',
			modifiedOn: '',
			media: [
				{
					id: 1,
					companyId: 1,
					uploaderId: 1,
					type: 'imagePyramid',
					urls: { thumb: '', small: '../../images/redeemableRewardPage/perfume.jpg', large: '' },
					storageDetails: [],
					title: '',
					description: '',
					isPrimary: 0
				}
			],
			id: 12,
			name: 'Merchandise7'
		}
	];
	private vendors: Api.Vendor.Res.Get[] = [
		{ name: 'Affiliate 3', affiliateId: 3, destinationId: null },
		{ name: 'Resort 1', affiliateId: null, destinationId: 1 },
		{ name: 'Resort 2', affiliateId: null, destinationId: 2 },
		{ name: 'Affiliate 2', affiliateId: 2, destinationId: null },
		{ name: 'Affiliate 1', affiliateId: 1, destinationId: null },
		{ name: 'Resort 3', affiliateId: null, destinationId: 3 },
		{ name: 'Resort 4', affiliateId: null, destinationId: 4 },
		{ name: 'Affiliate 4', affiliateId: 4, destinationId: null },
		{ name: 'Affiliate 5', affiliateId: 5, destinationId: null }
	];
	async getAllRewards(
		page: number,
		perPage: number,
		sortField: string,
		sortOrder: StandardOrderTypes,
		matchType: MatchTypes,
		filter: FilterQueryValue[]
	) {
		let filterQuery: FilterQuery = { matchType: matchType, searchTerm: filter };
		return this.getPaginatedList(page, perPage, sortField, sortOrder, filterQuery, 'reward/paged');
	}

	async getCategoriesInSelectFormat(): Promise<Model.SelectOptions[]> {
		return this.categoryList.map((categories) => {
			return { value: categories.id, text: categories.name, selected: false };
		});
		// if (!this.allCategory) {
		// 	await this.getAllCategories();
		// }
		// if (!this.allCategory) return [];
		// return this.allCategory.map((categories) => {
		// 	return { value: categories.id, text: categories.name, selected: false };
		// });
	}
	async getAllCategories(): Promise<Api.Reward.Category.Res.Get[]> {
		// if (!this.allCategory) {
		// 	const response = await http.get<RsResponseData<Api.Reward.Category.Res.Get[]>>('reward/category/paged');
		// 	this.allCategory = response.data.data;
		// 	console.log(this.allCategory);
		// }
		// return this.allCategory;
		return this.categoryList;
	}

	async getFeaturedCategories(): Promise<FeaturedCategory[]> {
		let featured: Model.FeaturedCategory[] = [];
		for (let category of this.categoryList) {
			if (category.isFeatured) {
				featured.push({
					categoryId: category.id,
					imagePath: category.media[0].urls.small,
					name: category.name
				});
			}
		}
		if (featured.length < 2) return [];
		return featured.slice(0, 3);
	}

	async getRedeemableRewards(data: Api.Reward.Req.Paged) {
		const res = await http.get<RsResponseData<Api.Reward.Res.Get[]>>('reward/paged');
		return res;
	}

	async getVendorsInSelectFormat() {
		return this.vendors.map((vendor) => {
			if (vendor.destinationId) {
				return { value: 'd' + vendor.destinationId, text: vendor.name, selected: false };
			} else if (vendor.affiliateId) {
				return { value: 'a' + vendor.affiliateId, text: vendor.name, selected: false };
			}
			return { value: 0, text: '', selected: false };
		});
		// let vendors = await this.getAllVendors();
		// return vendors.map((vendor) => {
		// 	if (vendor.destinationId) {
		// 		return { value: 'd' + vendor.destinationId, text: vendor.name, selected: false };
		// 	} else if (vendor.affiliateId) {
		// 		return { value: 'a' + vendor.affiliateId, text: vendor.name, selected: false };
		// 	}
		// 	return { value: 0, text: '', selected: false };
		// });
	}

	async getAllVendors(): Promise<Api.Vendor.Res.Get[]> {
		const response = await http.get<RsResponseData<Api.Vendor.Res.Get[]>>('vendor/paged');
		return response.data.data;
	}

	async getAllVouchers(
		page: number,
		perPage: number,
		sortField: string,
		sortOrder: StandardOrderTypes,
		matchType: MatchTypes,
		filter: FilterQueryValue[]
	) {
		let filterQuery: FilterQuery = { matchType: matchType, searchTerm: filter };
		return this.getPaginatedList(page, perPage, sortField, sortOrder, filterQuery, 'reward/voucher/paged');
	}

	async getAllForRedeemableRewardsPage(): Promise<Model.RedeemableRewards> {
		let res: Model.RedeemableRewards = {
			selectCategories: await this.getCategoriesInSelectFormat(),
			allCategories: await this.getAllCategories(),
			featuredCategories: await this.getFeaturedCategories(),
			destinationSelect: await this.getVendorsInSelectFormat()
		};
		return res;
	}
}
