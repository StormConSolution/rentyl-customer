import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { WebUtils } from '../../utils/utils';

export default class DestinationService extends Service {
	async getDestinations(): Promise<Api.Destination.Res.Details[]> {
		let response = await http.get<Api.Destination.Res.GetByPage>('destination/paged');
		return response.data.data;
	}
	async getDestinationById(id: Api.Destination.Req.Get) {
		return await http.get<RsResponseData<Api.Destination.Res.Get>>('destination', id);
	}

	async getDestinationByIds(ids: Api.Destination.Req.Get[]) {
		return await http.get<RsResponseData<Api.Destination.Res.Get[]>>('destination', ids);
	}
	async getDestinationDetails(destinationId: number) {
		return await http.get<RsResponseData<Api.Destination.Res.Details>>('destination/details', { destinationId });
	}

	async getDestinationAccommodations(destinationId: number) {
		let response = await this.getDestinationDetails(destinationId);
		return response.data.data.accommodations;
	}
	async searchAvailableReservations(data: Api.Destination.Req.Availability) {
		return await http.get<Api.Destination.Res.GetByPageAvailability>(
			'destination/availability',
			WebUtils.convertDataForUrlParams(data)
		);
	}

	async getAvailablePackages(destinationId: number): Promise<Api.Package.Res.GetByPage> {
		const response = await http.get<RsResponseData<Api.Package.Res.GetByPage>>('/package/paged');
		return response.data.data;
	}

	async searchAvailableAccommodationsByDestination(
		data: Api.Accommodation.Req.Availability
	): Promise<RedSky.RsPagedResponseData<Api.Accommodation.Res.Availability>> {
		const response = await http.get<RsResponseData<Api.Accommodation.Res.Availability[]>>(
			'/accommodation/availability',
			WebUtils.convertDataForUrlParams(data)
		);
		return response.data;
	}
}
