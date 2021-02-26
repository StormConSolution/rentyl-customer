import { Service } from './Service';
import UserService from './user/user.service';
import ReservationsService from './reservations/reservations.service';
import ComparisonService from './comparison/comparison.service';

type ServiceKey = 'UserService' | 'ReservationsService' | 'ComparisonService';

class ServiceFactory {
	private services: { [key: string]: Service } = {};

	create() {
		// Add new models here to the factory
		this.services['UserService'] = new UserService();
		this.services['ReservationsService'] = new ReservationsService();
		this.services['ComparisonService'] = new ComparisonService();

		for (let key in this.services) {
			this.services[key].start();
		}
	}

	get<T extends Service>(name: ServiceKey): T {
		return this.services[name] as T;
	}
}

let serviceFactory = new ServiceFactory();
export default serviceFactory;

// TEMP
//window.sf = serviceFactory;
