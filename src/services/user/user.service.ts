import http from '../../utils/http';
import SparkMD5 from 'spark-md5';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { Service } from '../Service';
import globalState, {
	clearPersistentState,
	getRecoilExternalValue,
	KEY_PREFIX,
	setRecoilExternalValue
} from '../../state/globalState';
import router from '../../utils/router';

export default class UserService extends Service {
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

	async requestPasswordByEmail(primaryEmail: string): Promise<Api.User.Res.ForgotPassword> {
		let response = await http.post<RsResponseData<Api.User.Res.ForgotPassword>>('user/password/forgot', {
			primaryEmail
		});
		return response.data.data;
	}

	async resetPasswordByGuid(passwordResetGuid: string, newPassword: string): Promise<Api.User.Res.ResetPassword> {
		newPassword = SparkMD5.hash(newPassword);
		let response = await http.put<RsResponseData<Api.User.Res.ResetPassword>>('user/password/reset', {
			passwordResetGuid,
			newPassword
		});
		return response.data.data;
	}

	async guidValidation(guid: string): Promise<Api.User.Res.ValidateGuid> {
		let response = await http.put<RsResponseData<Api.User.Res.ValidateGuid>>('user/password/guid/valid', {
			guid
		});
		return response.data.data;
	}

	async createNewCustomer(customer: Api.Customer.Req.Create): Promise<Api.Customer.Res.Create> {
		customer.password = SparkMD5.hash(customer.password);
		let response = await http.post<RsResponseData<Api.Customer.Res.Create>>('customer', customer);
		return response.data.data;
	}

	async refreshUser(): Promise<void> {
		const user = getRecoilExternalValue<Api.User.Res.Detail | undefined>(globalState.user);
		if (!user) return;
		this.loginUserByToken(user.token).catch(console.error);
	}

	async update(data: Api.User.Req.Update): Promise<Api.User.Res.Detail> {
		let response = await http.put<RsResponseData<Api.User.Res.Detail>>('user', data);
		setRecoilExternalValue<Api.User.Res.Detail | undefined>(globalState.user, response.data.data);
		return response.data.data;
	}

	logout() {
		setRecoilExternalValue<Api.User.Res.Detail | undefined>(globalState.user, undefined);
		clearPersistentState();
		router.navigate('/').catch(console.error);
	}

	async updatePassword(data: Api.User.Req.UpdatePassword): Promise<boolean> {
		data.old = SparkMD5.hash(data.old);
		data.new = SparkMD5.hash(data.new);
		let response = await http.put<RsResponseData<boolean>>('user/password', data);
		return response.data.data;
	}

	async setCheckoutUserInLocalStorage(checkoutUser: Api.User.Req.Checkout) {
		setRecoilExternalValue<Api.User.Req.Checkout | undefined>(globalState.checkoutUser, checkoutUser);
	}

	async clearCheckoutUserFromLocalStorage() {
		if (!!getRecoilExternalValue<Api.User.Req.Checkout | undefined>(globalState.checkoutUser)) {
			localStorage.removeItem(KEY_PREFIX + globalState.checkoutUser.key);
		}
	}

	private async onAfterLogin(user: Api.User.Res.Detail) {
		let axiosConfig = http.currentConfig();
		axiosConfig.headers = { ...axiosConfig.headers, token: user.token };
		http.changeConfig(axiosConfig);

		setRecoilExternalValue<Api.User.Res.Detail | undefined>(globalState.user, user);
	}
}
