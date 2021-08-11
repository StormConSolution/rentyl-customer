import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import AccommodationsModel from '../../models/accommodations/accommodations.model';
import modelFactory from '../../models/modelFactory';
import { WebUtils } from '../../utils/utils';
import FilterQueryValue = RedSky.FilterQueryValue;

export default class AccommodationService extends Service {
	accommodationsModel: AccommodationsModel = modelFactory.get<AccommodationsModel>('AccommodationsModel');

	async getAccommodationDetails(accommodationId: number) {
		return await http.get<RsResponseData<Api.Accommodation.Res.Details>>('accommodation/details', {
			accommodationId
		});
	}

	async getByPage(filter?: FilterQueryValue[]): Promise<Api.Accommodation.Res.GetByPage> {
		let res = await http.get<RsResponseData<Api.Accommodation.Res.GetByPage>>(
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

	async getManyAccommodationDetails(accommodationIds: number[]) {
		return this.accommodationsModel.getManyAccommodationDetails(accommodationIds);
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
