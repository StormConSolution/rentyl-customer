import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { NumberUtils } from '../../utils/utils';

export default class DestinationService extends Service {
	async getDestinations(): Promise<Api.Destination.Res.Details[]> {
		let response = await http.get<Api.Destination.Res.GetByPage>('destination/paged');
		return response.data.data;
	}
	async getDestinationById(id: Api.Destination.Req.Get): Promise<Api.Destination.Res.Get> {
		let response = await http.get<RsResponseData<Api.Destination.Res.Get>>('destination', id);
		return response.data.data;
	}

	async getDestinationByIds({ ids }: Api.Destination.Req.Get): Promise<Api.Destination.Res.Get[]> {
		let response = await http.get<RsResponseData<Api.Destination.Res.Get[]>>('destination', ids);
		return response.data.data;
	}
	async getDestinationDetails(
		destinationId: number,
		startDate?: Date | string,
		endDate?: Date | string
	): Promise<Api.Destination.Res.Details> {
		let response = await http.get<RsResponseData<Api.Destination.Res.Details>>('destination/details', {
			destinationId,
			startDate,
			endDate
		});
		return response.data.data;
	}

	async searchAvailableReservations(
		data: Api.Destination.Req.Availability
	): Promise<RedSky.RsPagedResponseData<Api.Destination.Res.Availability[]>> {
		if (data.priceRangeMin) data.priceRangeMin = NumberUtils.dollarsToCents(data.priceRangeMin);
		if (data.priceRangeMax) data.priceRangeMax = NumberUtils.dollarsToCents(data.priceRangeMax);
		let response = await http.get<RedSky.RsPagedResponseData<Api.Destination.Res.Availability[]>>(
			'destination/availability',
			data
		);
		return response.data;
	}

	async getAllPropertyTypes(): Promise<Api.Destination.Res.PropertyType[]> {
		let res = await http.get<RsResponseData<Api.Destination.Res.PropertyType[]>>('destination/allPropertyTypes');
		return res.data.data;
	}

	async getExperienceTypes(): Promise<Api.Experience.Res.Get[]> {
		const res = await http.get<RsResponseData<Api.Experience.Res.Get[]>>('experience');
		return res.data.data;
	}
}
