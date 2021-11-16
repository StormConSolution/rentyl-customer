import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';
import { WebUtils } from '../../utils/utils';
import FilterQueryValue = RedSky.FilterQueryValue;

export default class AccommodationService extends Service {
	async getAccommodationDetails(accommodationId: number): Promise<Api.Accommodation.Res.Details> {
		let response = await http.get<RsResponseData<Api.Accommodation.Res.Details>>('accommodation/details', {
			accommodationId
		});
		return response.data.data;
	}

	async getByPage(filter?: FilterQueryValue[]): Promise<RedSky.RsPagedResponseData<Api.Accommodation.Res.GetByPage>> {
		let res = await http.get<RedSky.RsPagedResponseData<Api.Accommodation.Res.GetByPage>>(
			'accommodation/paged',
			WebUtils.convertDataForUrlParams(filter)
		);
		return res.data.data;
	}

	async availability(
		destinationId: number,
		searchQueryObj: Misc.ReservationFilters
	): Promise<RedSky.RsPagedResponseData<Api.Accommodation.Res.Availability>> {
		const newSearchQueryObj: Api.Accommodation.Req.Availability = {
			destinationId: destinationId,
			startDate: searchQueryObj.startDate,
			endDate: searchQueryObj.endDate,
			adults: searchQueryObj.adultCount,
			children: searchQueryObj.childCount,
			pagination: { page: 1, perPage: 5 }
		};
		if (searchQueryObj.priceRangeMin) {
			newSearchQueryObj.priceRangeMin = searchQueryObj.priceRangeMin;
		}
		if (searchQueryObj.priceRangeMax) {
			newSearchQueryObj.priceRangeMax = searchQueryObj.priceRangeMax;
		}
		if (searchQueryObj.propertyTypeIds) {
			newSearchQueryObj.propertyTypeIds = searchQueryObj.propertyTypeIds;
		}
		let res = await http.get<RedSky.RsPagedResponseData<Api.Accommodation.Res.Availability>>(
			'accommodation/availability',
			newSearchQueryObj
		);
		return res.data;
	}

	async getManyAccommodationDetails(accommodationIds: number[]): Promise<Api.Accommodation.Res.Details[]> {
		let accommodations: Api.Accommodation.Res.Details[] = [];
		for (let id of accommodationIds) {
			let res = await http.get<RsResponseData<Api.Accommodation.Res.Details>>('accommodation/details', {
				accommodationId: id
			});
			accommodations.push(res.data.data);
		}
		return accommodations;
	}
}
