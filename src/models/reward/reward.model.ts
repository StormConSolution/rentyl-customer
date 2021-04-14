import { Model } from '../Model';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import StandardOrderTypes = RedSky.StandardOrderTypes;
import MatchTypes = RedSky.MatchTypes;
import FilterQueryValue = RedSky.FilterQueryValue;
import FilterQuery = RedSky.FilterQuery;

export default class RewardModel extends Model {
	private allCategory: Api.Reward.Category.Res.Get[] | undefined;

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

	async getCategoriesInSelectFormat() {
		if (!this.allCategory) {
			await this.getAllCategories();
		}
		if (!this.allCategory) return [];
		return this.allCategory.map((categories) => {
			return { value: categories.id, text: categories.name, selected: false };
		});
	}
	async getAllCategories(): Promise<Api.Reward.Category.Res.Get[]> {
		if (!this.allCategory) {
			const response = await http.get<RsResponseData<Api.Reward.Category.Res.Get[]>>('reward/category/paged');
			this.allCategory = response.data.data;
		}
		return this.allCategory;
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
}
