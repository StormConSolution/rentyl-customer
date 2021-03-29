import modelFactory from '../../models/modelFactory';
import { Service } from '../Service';
import ReservationsModel from '../../models/reservations/reservations.model';

export default class ReservationsService extends Service {
	reservationsModel: ReservationsModel = modelFactory.get<ReservationsModel>('ReservationsModel');
}
