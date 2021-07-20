import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class CompanyService extends Service {
	async getCompanyDetails(): Promise<Api.Company.Res.Get> {
		let res = await http.get<RsResponseData<Api.Company.Res.Get>>('company/company-and-variables');
		return res.data.data;
	}
}
