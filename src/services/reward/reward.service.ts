import { RsResponseData } from '@bit/redsky.framework.rs.http';
import http from '../../utils/http';
import { Service } from '../Service';
import serviceFactory from '../serviceFactory';
import UserService from '../user/user.service';
import { WebUtils } from '../../utils/utils';

export default class RewardService extends Service {
	private userService!: UserService;

	start() {
		this.userService = serviceFactory.get<UserService>('UserService');
	}

	async getRewardById(id: number): Promise<Api.Reward.Res.Get> {
		const response = await http.get<RsResponseData<Api.Reward.Res.Get>>('reward', { id });
		return response.data.data;
	}

	async getPagedRewards(data: Api.Reward.Req.Paged): Promise<RedSky.RsPagedResponseData<Api.Reward.Res.Get[]>> {
		let response = await http.get<RedSky.RsPagedResponseData<Api.Reward.Res.Get[]>>('/reward/paged', data);
		return response.data;
	}

	async getAllActiveCategories(): Promise<RedSky.RsPagedResponseData<Api.Reward.Category.Res.Get[]>> {
		const query = WebUtils.createPageQueryObject(1, 100, 'ASC', 'isActive', 'exact', [
			{ column: 'isActive', value: 1 }
		]);
		let response = await http.get<RedSky.RsPagedResponseData<Api.Reward.Res.Get[]>>(
			'/reward/category/paged',
			query
		);
		return response.data;
	}

	async getPagedCategories(
		query: RedSky.PageQuery
	): Promise<RedSky.RsPagedResponseData<Api.Reward.Category.Res.Get[]>> {
		let response = await http.get<RedSky.RsPagedResponseData<Api.Reward.Res.Get[]>>(
			'/reward/category/paged',
			WebUtils.convertDataForUrlParams(query)
		);
		return response.data;
	}

	async claimRewardVoucher(data: Api.Reward.Voucher.Req.Claim): Promise<Api.Reward.Voucher.Res.Claim> {
		const res = await http.put<RsResponseData<Api.Reward.Voucher.Res.Claim>>('reward/voucher/claim', data);
		this.refreshUser();
		return res.data.data;
	}

	async getAllVendors(): Promise<Api.Vendor.Res.Get[]> {
		const response = await http.get<RsResponseData<Api.Vendor.Res.Get[]>>('vendor/paged');
		return response.data.data;
	}

	async getVendorsInSelectFormat(): Promise<Misc.SelectOptions[]> {
		let vendors = await this.getAllVendors();
		return vendors.map((vendor) => {
			if (vendor.destinationId) {
				return { value: 'd' + vendor.destinationId, text: vendor.name, selected: false };
			} else if (vendor.brandId) {
				return { value: 'a' + vendor.brandId, text: vendor.name, selected: false };
			}
			return { value: 0, text: '', selected: false };
		});
	}

	private refreshUser() {
		this.userService.refreshUser().catch(console.error);
	}
}
