import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { WebUtils } from '../../utils/utils';
import FilterQueryValue = RedSky.FilterQueryValue;

export default class AccommodationService extends Service {
	async getAccommodationDetails(accommodationId: number): Promise<Api.Accommodation.Res.Details> {
		let response = await http.get<RsResponseData<Api.Accommodation.Res.Details>>('accommodation/details', {
			accommodationId
		});
		return response.data.data;
	}

	async getByPage(filter?: FilterQueryValue[]): Promise<RedSky.RsPagedResponseData<Api.Accommodation.Res.GetByPage>> {
		let res = await http.get<RedSky.RsPagedResponseData<Api.Accommodation.Res.GetByPage>>(
			'accommodation/paged',
			WebUtils.convertDataForUrlParams(filter)
		);
		return res.data.data;
	}

	async availability(
		data: Api.Accommodation.Req.Availability
	): Promise<RedSky.RsPagedResponseData<Api.Accommodation.Res.Availability>> {
		let res = await http.get<RedSky.RsPagedResponseData<Api.Accommodation.Res.Availability>>(
			'accommodation/availability',
			WebUtils.convertDataForUrlParams(data)
		);
		return res.data;
	}

	async getManyAccommodationDetails(accommodationIds: number[]): Promise<Api.Accommodation.Res.Details[]> {
		let accommodations: Api.Accommodation.Res.Details[] = [];
		for (let id in accommodationIds) {
			let res = await http.get<RsResponseData<Api.Accommodation.Res.Details>>('accommodation/details', {
				accommodationId: id
			});
			accommodations.push(res.data.data);
		}
		return accommodations;
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
