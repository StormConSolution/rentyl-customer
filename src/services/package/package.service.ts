import { Service } from '../Service';
import http from '../../utils/http';

export default class PackageService extends Service {
	async getAvailable(
		data: Api.UpsellPackage.Req.Availability
	): Promise<RedSky.RsPagedResponseData<Api.UpsellPackage.Res.Complete[]>> {
		let response = await http.get<RedSky.RsPagedResponseData<Api.UpsellPackage.Res.Complete[]>>(
			'/package/availability',
			data
		);
		return response.data;
	}

	async getPackagesByIds(
		data: Api.UpsellPackage.Req.Availability
	): Promise<RedSky.RsPagedResponseData<Api.UpsellPackage.Res.Complete[]>> {
		let response = await http.get<RedSky.RsPagedResponseData<Api.UpsellPackage.Res.Complete[]>>(
			'/package/availability',
			data
		);
		return response.data;
	}
}
