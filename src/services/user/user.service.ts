import http from '../../utils/http';
import SparkMD5 from 'spark-md5';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import modelFactory from '../../models/modelFactory';
import { Service } from '../Service';
import UserModel from '../../models/user/user.model';
import globalState, { setRecoilExternalValue } from '../../models/globalState';

export default class UserService extends Service {
	userModel: UserModel = modelFactory.get<UserModel>('UserModel');

	private loggedInCallbackIdCounter = 0;
	private onLoggedInCallbacks: { id: number; callback: (user: Api.User.Res.Get) => void }[] = [];
	private loggedOutCallbackIdCounter = 0;
	private onLoggedOutCallbacks: { id: number; callback: () => void }[] = [];

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
		return await http.post('customer', customer);
	}

	getCurrentUser(): Api.User.Res.Get | undefined {
		return this.userModel.getCurrentUser();
	}

	async update(data: Api.User.Req.Update) {
		return await http.put<RsResponseData<Api.User.Res.Detail>>('user', data);
	}

	logout() {
		this.onLoggedOutCallbacks.forEach((callback) => {
			callback.callback();
		});

		setRecoilExternalValue<Api.User.Res.Detail | undefined>(globalState.user, undefined);
	}

	async updatePassword(data: Api.User.Req.UpdatePassword) {
		data.old = SparkMD5.hash(data.old);
		data.new = SparkMD5.hash(data.new);
		return await http.put<RsResponseData<boolean>>('user/password', data);
	}

	subscribeToLoggedIn(callback: (user: Api.User.Res.Get) => void): number {
		let id = ++this.loggedInCallbackIdCounter;
		this.onLoggedInCallbacks.push({ id, callback });
		return id;
	}

	unsubscribeToLoggedIn(id: number) {
		this.onLoggedInCallbacks = this.onLoggedInCallbacks.filter((item) => {
			return item.id !== id;
		});
	}

	subscribeToLoggedOut(callback: () => void): number {
		let id = ++this.loggedOutCallbackIdCounter;
		this.onLoggedOutCallbacks.push({ id, callback });
		return id;
	}

	unsubscribeToLoggedOut(id: number) {
		this.onLoggedOutCallbacks = this.onLoggedOutCallbacks.filter((item) => {
			return item.id !== id;
		});
	}
	async getPaginatedList(
		page: number,
		perPage: number,
		sortField?: string,
		sortOrder?: RedSky.StandardOrderTypes,
		filter?: RedSky.FilterQuery | null,
		alternatePath?: string
	) {
		let res = await this.userModel.getPaginatedList<any>(
			page,
			perPage,
			sortField,
			sortOrder,
			filter,
			alternatePath
		);
		return res;
	}

	private async onAfterLogin(user: Api.User.Res.Detail) {
		let axiosConfig = http.currentConfig();
		axiosConfig.headers = {
			'company-id': 1,
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			Accept: 'application/json, text/plain, */*',
			'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
			token: user.token
		};
		http.changeConfig(axiosConfig);
		this.userModel.setCurrentUser(user);
		await modelFactory.refreshAllModels();
		setRecoilExternalValue<Api.User.Res.Detail | undefined>(globalState.user, user);
		this.onLoggedInCallbacks.forEach((callback) => {
			callback.callback(user);
		});
	}
}
