import { Model } from '../Model';
import StandardOrderTypes = RedSky.StandardOrderTypes;
import MatchTypes = RedSky.MatchTypes;
import FilterQueryValue = RedSky.FilterQueryValue;
import FilterQuery = RedSky.FilterQuery;

export default class ReservationsModel extends Model {
	start() {
		this.modelName = 'reservations';
	}

	async getByPage(
		page: number,
		perPage: number,
		sortField?: string,
		sortOrder?: StandardOrderTypes,
		matchType?: MatchTypes,
		filter?: FilterQueryValue[]
	) {
		let filterQuery: FilterQuery | null = null;
		if (!!filter && !!matchType) {
			filterQuery = { matchType: matchType, searchTerm: filter };
		}
		return this.getPaginatedList(page, perPage, sortField, sortOrder, filterQuery, 'reservation/paged');
	}
}
