import { RsResponseData } from '@bit/redsky.framework.rs.http';
import http from '../../utils/http';
import { Service } from '../Service';
import serviceFactory from '../serviceFactory';
import UserService from '../user/user.service';

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
		let query: RedSky.PageQuery = {
			filter: {
				matchType: 'exact',
				searchTerm: [
					{
						column: 'isActive',
						value: 1
					}
				]
			},
			pagination: { page: 1, perPage: 100 },
			sort: {
				field: 'isActive',
				order: 'ASC'
			}
		};
		let response = await http.get<RedSky.RsPagedResponseData<Api.Reward.Res.Get[]>>(
			'/reward/category/paged',
			query
		);
		return response.data;
	}

	async getPagedCategories(
		data: RedSky.PageQuery
	): Promise<RedSky.RsPagedResponseData<Api.Reward.Category.Res.Get[]>> {
		let response = await http.get<RedSky.RsPagedResponseData<Api.Reward.Res.Get[]>>('/reward/category/paged', data);
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

	private refreshUser() {
		this.userService.refreshUser().catch(console.error);
	}
}
