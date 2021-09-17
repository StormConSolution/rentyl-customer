import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { WebUtils } from '../../utils/utils';

export default class DestinationService extends Service {
	async getDestinations(): Promise<Api.Destination.Res.Details[]> {
		let response = await http.get<Api.Destination.Res.GetByPage>('destination/paged');
		return response.data.data;
	}
	async getDestinationById(id: Api.Destination.Req.Get): Promise<Api.Destination.Res.Get> {
		let response = await http.get<RsResponseData<Api.Destination.Res.Get>>('destination', id);
		return response.data.data;
	}

	async getDestinationByIds(ids: Api.Destination.Req.Get[]): Promise<Api.Destination.Res.Get[]> {
		let response = await http.get<RsResponseData<Api.Destination.Res.Get[]>>('destination', ids);
		return response.data.data;
	}
	async getDestinationDetails(destinationId: number): Promise<Api.Destination.Res.Details> {
		let response = await http.get<RsResponseData<Api.Destination.Res.Details>>('destination/details', {
			destinationId
		});
		return response.data.data;
	}

	async searchAvailableReservations(
		data: Api.Destination.Req.Availability
	): Promise<RedSky.RsPagedResponseData<Api.Destination.Res.Availability[]>> {
		console.log(data);
		let response = await http.get<RsResponseData<Api.Destination.Res.GetByPageAvailability>>(
			'destination/availability',
			WebUtils.convertDataForUrlParams(data)
		);
		return response.data;
	}

	async getAllPropertyTypes() {
		let res = await http.get<RsResponseData<Api.Destination.Res.PropertyType[]>>('destination/allPropertyTypes');
		return res.data;
	}
}
