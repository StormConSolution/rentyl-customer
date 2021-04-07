import { Service } from './Service';
import UserService from './user/user.service';
import ReservationsService from './reservations/reservations.service';
import ComparisonService from './comparison/comparison.service';
import DestinationService from './destination/destination.service';
import AccommodationService from './accommodation/accommodation.service';
import CountryService from './country/country.service';
import UserAddressService from './userAddress/userAddress.service';

type ServiceKey =
	| 'UserService'
	| 'ReservationsService'
	| 'ComparisonService'
	| 'DestinationService'
	| 'AccommodationService'
	| 'CountryService'
	| 'UserAddressService';

class ServiceFactory {
	private services: { [key: string]: Service } = {};

	create() {
		// Add new models here to the factory
		this.services['UserService'] = new UserService();
		this.services['ReservationsService'] = new ReservationsService();
		this.services['ComparisonService'] = new ComparisonService();
		this.services['DestinationService'] = new DestinationService();
		this.services['AccommodationService'] = new AccommodationService();
		this.services['CountryService'] = new CountryService();
		this.services['UserAddressService'] = new UserAddressService();

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
