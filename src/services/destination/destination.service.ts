import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class DestinationService extends Service {
	async getDestinationById(id: Api.Destination.Req.Get) {
		return await http.get<RsResponseData<Api.Destination.Res.Get>>('destination', id);
	}

	async getDestinationByIds(ids: Api.Destination.Req.Get[]) {
		return await http.get<RsResponseData<Api.Destination.Res.Get[]>>('destination', ids);
	}
	async getDestinationDetails(destinationId: number) {
		return await http.get<RsResponseData<Api.Destination.Res.Details>>('destination/details', { destinationId });
	}
	async searchAvailableReservations(data: Api.Destination.Req.Availability) {
		return await http.get<Api.Destination.Res.GetByPageAvailability>('destination/availability', data);
	}

	async searchAvailableAccommodationsByDestination(
		data: Api.Accommodation.Req.Availability
	): Promise<Api.Accommodation.Res.Availability[]> {
		const response = await http.get<RsResponseData<Api.Accommodation.Res.Availability[]>>(
			'/accommodation/availability',
			data
		);
		return response.data.data;
	}
}
