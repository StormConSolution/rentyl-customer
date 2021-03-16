import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class AccommodationService extends Service {
	async getAccommodationDetails(accommodationId: number) {
		let res = await http.get<RsResponseData<Api.Destination.Res.Details[]>>('accommodation/details', {
			accommodationId
		});
		return res.data.data;
	}
	async getAccommodationTypeByIds(ids: number[]) {
		let res = await http.get<RsResponseData<Api.Destination.Res.AccommodationType[]>>(
			'destination/accommodationType',
			{ ids }
		);
		return res.data.data;
	}
	async getAccommodationTypeById(id: number) {
		let res = await http.get<RsResponseData<Api.Destination.Res.AccommodationType[]>>(
			'destination/accommodationType',
			{ id }
		);
		return res.data.data;
	}
}
