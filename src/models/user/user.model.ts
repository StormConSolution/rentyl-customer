import { Model } from '../Model';

export default class UserModel extends Model {
	private currentUser: Api.User.Res.Get | undefined;

	start() {
		this.modelName = 'user';
	}

	setCurrentUser(user: Api.User.Res.Get) {
		this.currentUser = user;
	}

	getCurrentUser() {
		return this.currentUser;
	}

	/*private convertDataForParams(data: any): any {
		let convertedData: any = {};
		for (let i in data) {
			if (typeof data[i] === 'object') {
				convertedData[i] = JSON.stringify(data[i]);
			} else {
				convertedData[i] = data[i];
			}
		}
		return convertedData;
	}*/
}
