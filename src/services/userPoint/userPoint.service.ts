import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class UserPointService extends Service {
	async getPointTransactionsByUserId(): Promise<Api.UserPoint.Res.Verbose[]> {
		const response = await http.get<RsResponseData<Api.UserPoint.Res.Verbose[]>>(`user/points`);
		return response.data.data;
	}
}
