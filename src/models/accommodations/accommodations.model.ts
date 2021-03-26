import { Model } from '../Model';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class AccommodationsModel extends Model {
	private accommodationDetailList: Api.Accommodation.Res.Details[] = [];

	private async getAccommodationDetail(accommodationId: number) {
		let res = await http.get<RsResponseData<Api.Accommodation.Res.Details>>('accommodation/details', {
			accommodationId
		});
		let index = this.accommodationDetailList.findIndex((x) => x.id === accommodationId);
		if (index === -1) this.accommodationDetailList.push(res.data.data);
		return res.data.data;
	}

	async getManyAccommodationDetails(accommodationIds: number[]) {
		let accommodationDetails: Api.Accommodation.Res.Details[] = [];
		for (let detail of accommodationIds) {
			let index = this.accommodationDetailList.findIndex((x) => x.id === detail);
			if (index !== -1) {
				accommodationDetails.push(this.accommodationDetailList[index]);
			} else {
				let res = await this.getAccommodationDetail(detail);
				if (res) {
					accommodationDetails.push(res);
				} else {
					return [];
				}
			}
		}
		return accommodationDetails;
	}
}
