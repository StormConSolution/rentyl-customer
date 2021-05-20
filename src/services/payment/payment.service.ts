import http from '../../utils/http';
import { Service } from '../Service';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class PaymentService extends Service {
	async addPaymentMethod(token: string, pmData: Api.Payment.PmData): Promise<Api.Payment.Res.Create> {
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
