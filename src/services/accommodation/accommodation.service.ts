import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class AccommodationService extends Service {
	async getAccommodationById(destinationIds: number[]) {
		let res = await http.get<RsResponseData<Api.Destination.Res.AccommodationType>>(
			'destination/accommodationType',
			{ destinationIds }
		);
		return res.data.data;
	}
}
