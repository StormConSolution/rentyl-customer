import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class AccommodationService extends Service {
	async getAccommodationDetails(accommodationId: number) {
		return await http.get<RsResponseData<Api.Accommodation.Res.Details>>('accommodation/details', {
			accommodationId
		});
	}
}
