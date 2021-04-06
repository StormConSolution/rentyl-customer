import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class CountryService extends Service {
	async getAllCountries() {
		return await http.get<RsResponseData<Api.Country.Res.AllCountries>>('country/all');
	}
	async getCountry(countryCode: string) {
		return await http.get<RsResponseData<Api.Country.Res.Country>>('country', {
			countryCode
		});
	}
	async getStates(countryCode: string) {
		return await http.get<RsResponseData<Api.Country.Res.States>>('country/states', {
			countryCode
		});
	}
	async getCities(stateCode: string) {
		return await http.get<RsResponseData<Api.Country.Res.Cities>>('country/cities', {
			stateCode
		});
	}
}
