import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class UserAddressService extends Service {
	async create(data: Api.UserAddress.Req.Create) {
		return await http.post<RsResponseData<Api.UserAddress.Res.Create>>('userAddress', data);
	}

	async delete(id: number) {
		return await http.delete<RsResponseData<number>>('userAddress', { id });
	}
}
