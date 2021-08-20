import { Service } from '../Service';
import http from '../../utils/http';

export default class CompanyService extends Service {
	async getCompanyDetails(): Promise<Api.Company.Res.GetCompanyAndClientVariables> {
		let res = await http.get<RedSky.RsResponseData<Api.Company.Res.GetCompanyAndClientVariables>>(
			`/company/company-and-variables`
		);
		return res.data.data;
	}

	async updateAvailablePages(data: Api.Company.Req.UpdateAvailablePages) {
		const response = await http.put<RedSky.RsResponseData<boolean>>('/company/available-pages', data);
		return response.data.data;
	}
}
