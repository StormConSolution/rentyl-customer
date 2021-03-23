import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import AccommodationsModel from '../../models/accommodations/accommodations.model';
import modelFactory from '../../models/modelFactory';

export default class AccommodationService extends Service {
	accommodationsModel: AccommodationsModel = modelFactory.get<AccommodationsModel>('AccommodationsModel');

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
