import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { WebUtils } from '../../utils/utils';

export default class PackageService extends Service {
	async getAvailable(
		data: Api.UpsellPackage.Req.Availability
	): Promise<RedSky.RsPagedResponseData<Api.UpsellPackage.Res.Available[]>> {
		let response = await http.get<RedSky.RsPagedResponseData<Api.UpsellPackage.Res.Available[]>>(
			'/package/availability',
			WebUtils.convertDataForUrlParams(data)
		);
		return response.data;
	}

	async getPackagesByIds(data: Api.UpsellPackage.Req.Get): Promise<Api.UpsellPackage.Details[]> {
		let response = await http.get<RsResponseData<Api.UpsellPackage.Details[]>>(
			'/package',
			WebUtils.convertDataForUrlParams({ ids: data })
		);
		return response.data.data;
	}
}
