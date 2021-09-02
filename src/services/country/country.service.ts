import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class CountryService extends Service {
	async getAllCountries(): Promise<Api.Country.Res.AllCountries> {
		let response = await http.get<RsResponseData<Api.Country.Res.AllCountries>>('country/all');
		return response.data.data;
	}
	async getCountry(countryCode: string): Promise<Api.Country.Res.Country> {
		let response = await http.get<RsResponseData<Api.Country.Res.Country>>('country', {
			countryCode
		});
		return response.data.data;
	}
	async getStates(countryCode: string): Promise<Api.Country.Res.States> {
		let response = await http.get<RsResponseData<Api.Country.Res.States>>('country/states', {
			countryCode
		});
		return response.data.data;
	}
	async getCities(stateCode: string): Promise<Api.Country.Res.Cities> {
		let response = await http.get<RsResponseData<Api.Country.Res.Cities>>('country/cities', {
			stateCode
		});
		return response.data.data;
	}
}
