import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import modelFactory from '../../models/modelFactory';
import { Service } from '../Service';
import ReservationsModel from '../../models/reservations/reservations.model';

export default class ReservationsService extends Service {
	reservationsModel: ReservationsModel = modelFactory.get<ReservationsModel>('ReservationsModel');

	searchAvailableReservations(data: Api.Reservation.Req.Availability) {
		return http.get<RsResponseData<Api.Reservation.Res.Availability>>('reservation/availability?companyId=1', data);
	}
}
