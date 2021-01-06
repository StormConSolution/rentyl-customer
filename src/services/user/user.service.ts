import http from '../../utils/http';
import SparkMD5 from 'spark-md5';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import modelFactory from '../../models/modelFactory';
import { Service } from '../Service';
import UserModel from '../../models/user/user.model';
import { FilterQuery, StandardOrderTypes } from '../../@types/redsky';

const fakeUser: Api.User.Res.Login = {
	id: 1,
	primaryEmail: 'fakeUser@test.com',
	name: 'Joe Snuffy',
	password: '1Password',
	token: 'c0ddb342-5d4f-4882-8720-3493ea22fdce',
	role: 'super_admin'
};

export default class UserService extends Service {
	userModel: UserModel = modelFactory.get<UserModel>('UserModel');
	onLoggedInCallbacks: ((user: Api.User.Res.Login) => void)[] = [];

	async loginUserByPassword(username: string, password: string) {
		password = SparkMD5.hash(password);
		try {
			let axiosResponse = await http.post<RsResponseData<Api.User.Res.Login>>('user/login', {
				username,
				password
			});
			await this.onAfterLogin(axiosResponse.data.data);
		} catch (e) {
			await this.onAfterLogin(fakeUser); //DELETE TRY CATCH AND THIS CODE WHEN CLONING;
		}
	}

	async loginUserByToken(token: string) {
		let axiosResponse = await http.get<RsResponseData<Api.User.Res.Login>>('user/with/token?token=' + token);
		await this.onAfterLogin(axiosResponse.data.data);
	}

	getCurrentUser(): Api.User.Res.Login | undefined {
		return this.userModel.getCurrentUser();
	}

	subscribeToLoggedIn(callback: (user: Api.User.Res.Login) => void) {
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

	private async onAfterLogin(user: Api.User.Res.Login) {
		// Make sure they are allowed to even login based on their role
		let adminRoles = ['super_admin', 'support'];
		if (!adminRoles.includes(user.role)) throw new Error('INVALID_ROLE');

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
