import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class DestinationService extends Service {
	async getDestinationById(id: number) {
		let res = await http.get<RsResponseData<Api.Destination.Res.Get[]>>('destination', { id });
		return res.data.data;
	}

	async getDestinationByIds(ids: number[]) {
		let res = await http.get<RsResponseData<Api.Destination.Res.Get[]>>('destination', { ids });
		return res.data.data;
	}
	async getDestinationDetails(destinationId: number) {
		let res = await http.get<RsResponseData<Api.Destination.Res.Details[]>>('destination/details', {
			destinationId
		});
		return res.data.data;
	}
}
