import { Model } from '../Model';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import StandardOrderTypes = RedSky.StandardOrderTypes;
import MatchTypes = RedSky.MatchTypes;
import FilterQueryValue = RedSky.FilterQueryValue;
import FilterQuery = RedSky.FilterQuery;
import FeaturedCategory = Model.FeaturedCategory;

export default class RewardModel extends Model {
	private allActiveCategories: Api.Reward.Category.Res.Get[] = [];

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

	async getRedeemableRewards(data: Api.Reward.Req.Paged): Promise<Api.Reward.Res.GetByPage> {
		let matchType: MatchTypes = 'exact';
		let searchTerm: FilterQueryValue[] = [];
		if (data.filter) {
			if (data.filter.matchType) matchType = data.filter.matchType;
			if (data.filter.searchTerm) searchTerm = data.filter.searchTerm;
		}
		let res = await this.getAllRewards(
			data.pagination.page,
			data.pagination.perPage,
			'name',
			'ASC',
			matchType,
			searchTerm
		);
		return res.data;
	}

	async getPagedCategories(
		page: number,
		perPage: number,
		sortField: string,
		sortOrder: StandardOrderTypes,
		matchType: MatchTypes,
		filter: FilterQueryValue[]
	) {
		let filterQuery: FilterQuery = { matchType: matchType, searchTerm: filter };
		return this.getPaginatedList(page, perPage, sortField, sortOrder, filterQuery, 'reward/category/paged');
	}

	async getAllActiveCategories(): Promise<Api.Reward.Category.Res.Get[]> {
		if (!ObjectUtils.isArrayWithData(this.allActiveCategories)) {
			let res = await this.getPagedCategories(1, 100, 'name', 'ASC', 'exact', [{ column: 'isActive', value: 1 }]);
			this.allActiveCategories = res.data.data;
		}
		return this.allActiveCategories;
	}

	async getFeaturedCategories(): Promise<FeaturedCategory[]> {
		let featured: Model.FeaturedCategory[] = [];
		if (ObjectUtils.isArrayWithData(this.allActiveCategories) && this.allActiveCategories) {
			for (let category of this.allActiveCategories) {
				if (category.isFeatured && category.isActive) {
					featured.push({
						categoryId: category.id,
						imagePath: category.media[0].urls.small,
						name: category.name
					});
				}
			}
			if (featured.length < 2) return [];
			return featured.slice(0, 3);
		} else {
			return [];
		}
	}

	async getVendorsInSelectFormat() {
		let vendors = await this.getAllVendors();
		return vendors.map((vendor) => {
			if (vendor.destinationId) {
				return { value: 'd' + vendor.destinationId, text: vendor.name, selected: false };
			} else if (vendor.affiliateId) {
				return { value: 'a' + vendor.affiliateId, text: vendor.name, selected: false };
			}
			return { value: 0, text: '', selected: false };
		});
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

	async getAllForRewardItemPage(): Promise<Model.RedeemableRewards> {
		return {
			allCategories: await this.getAllActiveCategories(),
			featuredCategories: await this.getFeaturedCategories(),
			destinationSelect: await this.getVendorsInSelectFormat()
		};
	}
}
