import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import serviceFactory from '../serviceFactory';
import UserService from '../user/user.service';

export default class UserAddressService extends Service {
	private userService = serviceFactory.get<UserService>('UserService');

	async create(data: Api.UserAddress.Req.Create) {
		let res = await http.post<RsResponseData<Api.UserAddress.Res.Create>>('userAddress', data);
		this.refreshUser();
		return res.data.data;
	}

	async update(data: Api.UserAddress.Req.Update) {
		let result = await http.put<RsResponseData<Api.UserAddress.Res.Update>>('userAddress', data);
		this.refreshUser();
		return result;
	}

	async delete(id: number) {
		let result = await http.delete<RsResponseData<number>>('userAddress', { id });
		this.refreshUser();
		return result;
	}

	private refreshUser() {
		this.userService.refreshUser().catch(console.error);
	}
}
