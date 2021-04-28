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

	async getRewardById(id: number): Promise<Api.Reward.Res.Get> {
		const response = await http.get<RsResponseData<Api.Reward.Res.Get>>('reward', { id });
		return response.data.data;
	}

	async getPagedRewards(data: Api.Reward.Req.Paged): Promise<Api.Reward.Res.GetByPage> {
		return this.rewardModel.getRedeemableRewards(data);
	}

	async getAllActiveCategories(): Promise<Api.Reward.Category.Res.Get[]> {
		return this.rewardModel.getAllActiveCategories();
	}

	async getPagedCategories(
		page: number,
		perPage: number,
		sortField: string,
		sortOrder: StandardOrderTypes,
		matchType: MatchTypes,
		filter: FilterQueryValue[]
	) {
		return this.rewardModel.getPagedCategories(page, perPage, sortField, sortOrder, matchType, filter);
	}

	async claimRewardVoucher(data: Api.Reward.Voucher.Req.Claim) {
		const res = await http.put<RsResponseData<Api.Reward.Voucher.Res.Claim>>('reward/voucher/claim', data);
		return res.data.data;
	}

	async getAllForRewardItemPage() {
		return this.rewardModel.getAllForRewardItemPage();
	}
}
