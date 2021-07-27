import { Service } from '../Service';
import packageJson from '../../../package.json';
import http from '../../utils/http';

export default class CompanyService extends Service {
	async getCompanyDetails(): Promise<Api.Company.Res.GetCompanyAndClientVariables> {
		let res = await http.get<RedSky.RsResponseData<Api.Company.Res.GetCompanyAndClientVariables>>(
			`/company/company-and-variables`
		);

		return res.data.data;
	}
}
