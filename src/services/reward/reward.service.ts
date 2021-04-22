import { RsResponseData } from '@bit/redsky.framework.rs.http';
import http from '../../utils/http';
import { Service } from '../Service';
import modelFactory from '../../models/modelFactory';
import RewardModel from '../../models/reward/reward.model';
import StandardOrderTypes = RedSky.StandardOrderTypes;
import MatchTypes = RedSky.MatchTypes;
import FilterQueryValue = RedSky.FilterQueryValue;

export default class RewardService extends Service {
	rewardModel: RewardModel = modelFactory.get<RewardModel>('RewardModel');

	async getAllRewards(
		page: number,
		perPage: number,
		sortField: string,
		sortOrder: StandardOrderTypes,
		matchType: MatchTypes,
		filter: FilterQueryValue[]
	) {
		return this.rewardModel.getAllRewards(page, perPage, sortField, sortOrder, matchType, filter);
	}

	async getRewardById(id: number): Promise<Api.Reward.Res.Get | undefined> {
		const response = await http.get<RsResponseData<Api.Reward.Res.Get>>('reward', { id });
		return response.data.data;
	}

	async getAllCategories(): Promise<Api.Reward.Category.Res.Get[]> {
		return this.rewardModel.getAllCategories();
	}

	async getPagedRewards(data: Api.Reward.Req.Paged) {
		return this.rewardModel.getRedeemableRewards(data);
	}

	async getAllVendorsInSelectFormat() {
		return this.rewardModel.getVendorsInSelectFormat();
	}
	async getAllVendors() {
		return this.rewardModel.getAllVendors();
	}

	async getAllForRewardItemPage() {
		return this.rewardModel.getAllForRewardItemPage();
	}
	async getAllVouchers(
		page: number,
		perPage: number,
		sortField: string,
		sortOrder: StandardOrderTypes,
		matchType: MatchTypes,
		filter: FilterQueryValue[]
	) {
		return this.rewardModel.getAllVouchers(page, perPage, sortField, sortOrder, matchType, filter);
	}
}
