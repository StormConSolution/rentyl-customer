import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { ObjectUtils, WebUtils } from '../../utils/utils';

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

	async getPackagesByIds(data: Api.UpsellPackage.Req.Availability): Promise<Api.UpsellPackage.Res.Available[]> {
		let response = await http.get<RedSky.RsPagedResponseData<Api.UpsellPackage.Details[]>>(
			'/package/availability',
			data
		);
		return response.data.data;
	}
}
