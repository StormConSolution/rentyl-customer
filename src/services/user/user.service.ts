import http from '../../utils/http';
import SparkMD5 from 'spark-md5';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import modelFactory from '../../models/modelFactory';
import { Service } from '../Service';
import UserModel from '../../models/user/user.model';
import globalState, {
	clearPersistentState,
	getRecoilExternalValue,
	setRecoilExternalValue
} from '../../models/globalState';
import router from '../../utils/router';

export default class UserService extends Service {
	userModel: UserModel = modelFactory.get<UserModel>('UserModel');

	async loginUserByPassword(username: string, password: string) {
		password = SparkMD5.hash(password);
		let axiosResponse = await http.post<RsResponseData<Api.User.Res.Detail>>('user/login', {
			username,
			password
		});
		await this.onAfterLogin(axiosResponse.data.data);
	}

	async loginUserByToken(token: string) {
		let axiosResponse = await http.get<RsResponseData<Api.User.Res.Detail>>('user/with/token?token=' + token);
		await this.onAfterLogin(axiosResponse.data.data);
	}

	async requestPasswordByEmail(primaryEmail: string) {
		return await http.post<RsResponseData<Api.User.Res.ForgotPassword>>('user/password/forgot', {
			primaryEmail
		});
	}

	async resetPasswordByGuid(passwordResetGuid: string, newPassword: string) {
		newPassword = SparkMD5.hash(newPassword);
		return await http.put<RsResponseData<Api.User.Res.ResetPassword>>('user/password/reset', {
			passwordResetGuid,
			newPassword
		});
	}

	async guidValidation(guid: string) {
		return await http.put<RsResponseData<Api.User.Res.ValidateGuid>>('user/password/guid/valid', {
			guid
		});
	}

	async getAllCountries(): Promise<Api.Country.ICountry[]> {
		let res = await http.get<RsResponseData<Api.Country.Res.AllCountries>>('country/all');
		return res.data.data.countries;
	}
	async createNewCustomer(customer: Api.Customer.Req.Create) {
		customer.password = SparkMD5.hash(customer.password);
		return await http.post<RsResponseData<Api.Customer.Res.Create>>('customer', customer);
	}

	async refreshUser(): Promise<void> {
		const user = getRecoilExternalValue<Api.User.Res.Detail | undefined>(globalState.user);
		const token = getRecoilExternalValue<string>(globalState.userToken);
		if (!user) return;
		this.loginUserByToken(user.token).catch(console.error);
	}

	async update(data: Api.User.Req.Update): Promise<Api.User.Res.Detail> {
		let response = await http.put<RsResponseData<Api.User.Res.Detail>>('user', data);
		this.onAfterLogin(response.data.data);
		return response.data.data;
	}

	logout() {
		setRecoilExternalValue<Api.User.Res.Detail | undefined>(globalState.user, undefined);
		clearPersistentState();
		router.navigate('/').catch(console.error);
	}

	async updatePassword(data: Api.User.Req.UpdatePassword) {
		data.old = SparkMD5.hash(data.old);
		data.new = SparkMD5.hash(data.new);
		return await http.put<RsResponseData<boolean>>('user/password', data);
	}

	async getPaginatedList(
		page: number,
		perPage: number,
		sortField?: string,
		sortOrder?: RedSky.StandardOrderTypes,
		filter?: RedSky.FilterQuery | null,
		alternatePath?: string
	) {
		return await this.userModel.getPaginatedList<any>(page, perPage, sortField, sortOrder, filter, alternatePath);
	}

	private async onAfterLogin(user: Api.User.Res.Detail) {
		let axiosConfig = http.currentConfig();
		axiosConfig.headers = { ...axiosConfig.headers, token: user.token };
		http.changeConfig(axiosConfig);

		setRecoilExternalValue<Api.User.Res.Detail | undefined>(globalState.user, user);
	}
}
