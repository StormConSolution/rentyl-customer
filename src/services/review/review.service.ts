import { Service } from '../Service';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import http from '../../utils/http';

export default class ReviewService extends Service {
	async getForDestination(destinationId: number): Promise<Api.Review.Res.ForDestination> {
		const res = await http.get<RsResponseData<Api.Review.Res.ForDestination>>('/review/for-destination', {
			destinationId
		});
		return res.data.data;
	}

	async create(data: Api.Review.Req.Create): Promise<Api.Review.Res.Create> {
		const res = await http.post<RsResponseData<Api.Review.Res.Create>>('/review', data);
		return res.data.data;
	}
}
