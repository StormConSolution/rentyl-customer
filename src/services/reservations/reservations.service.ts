import modelFactory from '../../models/modelFactory';
import { Service } from '../Service';
import ReservationsModel from '../../models/reservations/reservations.model';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class ReservationsService extends Service {
	reservationsModel: ReservationsModel = modelFactory.get<ReservationsModel>('ReservationsModel');

	async verifyAvailability(data: Api.Reservation.Req.Verification) {
		return await http.get<RsResponseData<Api.Reservation.Res.Verification>>('reservation/verification', data);
	}
}
