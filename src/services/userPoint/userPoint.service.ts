import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class UserPointService extends Service {
	async getPointTransactionsByUserId(): Promise<Api.UserPoint.Res.Get[]> {
		const response = await http.get<RsResponseData<Api.UserPoint.Res.Get[]>>(`user/points`);
		return response.data.data;
	}
}
