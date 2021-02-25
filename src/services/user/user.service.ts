import http from '../../utils/http';
import SparkMD5 from 'spark-md5';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import modelFactory from '../../models/modelFactory';
import { Service } from '../Service';
import UserModel from '../../models/user/user.model';
import { FilterQuery, StandardOrderTypes } from '../../@types/redsky';

export default class UserService extends Service {
	userModel: UserModel = modelFactory.get<UserModel>('UserModel');
	onLoggedInCallbacks: ((user: Api.User.Res.Get) => void)[] = [];

	async loginUserByPassword(username: string, password: string) {
		password = SparkMD5.hash(password);
		let axiosResponse = await http.post<RsResponseData<Api.User.Res.Get>>('user/login', {
			username,
			password
		});
		await this.onAfterLogin(axiosResponse.data.data);
	}

	async loginUserByToken(token: string) {
		let axiosResponse = await http.get<RsResponseData<Api.User.Res.Get>>('user/with/token?token=' + token);
		await this.onAfterLogin(axiosResponse.data.data);
	}

	async getAllCountries(): Promise<Api.Country.ICountry[]> {
		let res = await http.get<RsResponseData<Api.Country.Res.AllCountries>>('country/all');
		return res.data.data.countries;
	}
	async createNewCustomer(customer: Api.Customer.Req.Create) {
		customer.password = SparkMD5.hash(customer.password);
		/*let res = await http.post('customer', customer);
		console.log(res);
		return res;*/
	}

	getCurrentUser(): Api.User.Res.Get | undefined {
		return this.userModel.getCurrentUser();
	}

	subscribeToLoggedIn(callback: (user: Api.User.Res.Get) => void) {
		this.onLoggedInCallbacks.push(callback);
	}

	async getPaginatedList(
		page: number,
		perPage: number,
		sortField?: string,
		sortOrder?: StandardOrderTypes,
		filter?: FilterQuery | null,
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

	private async onAfterLogin(user: Api.User.Res.Get) {
		let axiosConfig = http.currentConfig();
		axiosConfig.headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			Accept: 'application/json, text/plain, */*',
			'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
			token: user.token
		};
		http.changeConfig(axiosConfig);
		this.userModel.setCurrentUser(user);
		await modelFactory.refreshAllModels();
		this.onLoggedInCallbacks.forEach((callback) => {
			callback(user);
		});
	}
}
