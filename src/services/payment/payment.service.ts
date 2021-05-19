import http from '../../utils/http';
import { Service } from '../Service';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class PaymentService extends Service {
	async addPaymentMethod(token: string, pmData: Api.Payment.PmData): Promise<Api.Payment.Res.Create> {
		// Hacky stuff to just work for testing purposes
		// let axiosConfig = http.currentConfig();
		// axiosConfig.headers = {
		// 	'company-id': 1,
		// 	'Content-Type': 'application/json',
		// 	'Access-Control-Allow-Origin': '*',
		// 	Accept: 'application/json, text/plain, *!/!*',
		// 	'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
		// 	token: 'd6b67fa0-b762-4989-8e97-67af140bb0a3'
		// };
		// http.changeConfig(axiosConfig);
		let axiosResponse = await http.post<RsResponseData<Api.Payment.Res.Create>>('payment', {
			cardToken: token,
			pmData
		});
		return axiosResponse.data.data;
	}

	async getGateway(): Promise<Api.Payment.Res.PublicData> {
		let axiosResponse = await http.get<RsResponseData<Api.Payment.Res.PublicData>>('payment/public');
		return axiosResponse.data.data;
	}
}
