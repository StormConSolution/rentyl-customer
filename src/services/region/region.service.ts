import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class RegionService extends Service {
	start() {}

	async getAllRegions(): Promise<Api.Region.Res.Get[]> {
		const response = await http.get<RsResponseData<Api.Region.Res.Get[]>>('/region');
		return response.data.data;
	}
}
