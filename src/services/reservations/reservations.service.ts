import modelFactory from '../../models/modelFactory';
import { Service } from '../Service';
import ReservationsModel from '../../models/reservations/reservations.model';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import StandardOrderTypes = RedSky.StandardOrderTypes;
import MatchTypes = RedSky.MatchTypes;
import FilterQueryValue = RedSky.FilterQueryValue;

export default class ReservationsService extends Service {
	reservationsModel: ReservationsModel = modelFactory.get<ReservationsModel>('ReservationsModel');

	async verifyAvailability(data: Api.Reservation.Req.Verification) {
		return await http.get<RsResponseData<Api.Reservation.Res.Verification>>('reservation/verification', data);
	}

	async create(data: Api.Reservation.Req.Create) {
		let response = await http.post<RsResponseData<Api.Reservation.Res.Create>>('reservation', data);
		return response.data.data;
	}

	async get(id: number): Promise<Api.Reservation.Res.Get> {
		let response = await http.get<RsResponseData<Api.Reservation.Res.Get>>('reservation', { id });
		return response.data.data;
	}

	async getByPage(
		page: number,
		perPage: number,
		sortField?: string,
		sortOrder?: StandardOrderTypes,
		matchType?: MatchTypes,
		filter?: FilterQueryValue[]
	) {
		let response = await this.reservationsModel.getByPage(page, perPage, sortField, sortOrder, matchType, filter);
		return response.data;
	}
}
