import { Model } from './Model';

type ModelKey = 'UserModel' | 'ReservationsModel' | 'AccommodationsModel' | 'RewardModel';

class ModelFactory {
	private models: { [key: string]: Model } = {};

	create() {
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
