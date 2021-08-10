import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class PackageService extends Service {
	async forDestination(destinationId: number): Promise<Api.UpsellPackage.Res.forDestination[]> {
		let response = await http.get<RsResponseData<Api.UpsellPackage.Res.forDestination[]>>(
			'/package/for-destination',
			{ destinationId }
		);
		return response.data.data;
	}
}
