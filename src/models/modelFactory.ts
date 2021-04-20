import { Model } from './Model';
import UserModel from './user/user.model';
import ReservationsModel from './reservations/reservations.model';
import AccommodationsModel from './accommodations/accommodations.model';
import RewardModel from './reward/reward.model';

type ModelKey = 'UserModel' | 'ReservationsModel' | 'AccommodationsModel' | 'RewardModel';

class ModelFactory {
	private models: { [key: string]: Model } = {};

	create() {
		// Add new models here to the factory
		this.models['UserModel'] = new UserModel();
		this.models['ReservationsModel'] = new ReservationsModel();
		this.models['AccommodationsModel'] = new AccommodationsModel();
		this.models['RewardModel'] = new RewardModel();

		for (let key in this.models) {
			this.models[key].start();
		}
	}

	get<T extends Model>(name: ModelKey): T {
		return this.models[name] as T;
	}

	async refreshAllModels() {
		let promises: any = [];
		Object.keys(this.models).forEach((modelName) => {
			promises.push(this.models[modelName].refreshData());
		});
		await Promise.all(promises);
	}
}

let modelFactory = new ModelFactory();
export default modelFactory;
