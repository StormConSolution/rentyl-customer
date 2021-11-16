import { Service } from '../Service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class DestinationService extends Service {
	async getDestinations(): Promise<Api.Destination.Res.Details[]> {
		let response = await http.get<Api.Destination.Res.GetByPage>('destination/paged');
		return response.data.data;
	}
	async getDestinationById(id: Api.Destination.Req.Get): Promise<Api.Destination.Res.Get> {
		let response = await http.get<RsResponseData<Api.Destination.Res.Get>>('destination', id);
		return response.data.data;
	}

	async getDestinationByIds(ids: Api.Destination.Req.Get[]): Promise<Api.Destination.Res.Get[]> {
		let response = await http.get<RsResponseData<Api.Destination.Res.Get[]>>('destination', ids);
		return response.data.data;
	}
	async getDestinationDetails(destinationId: number): Promise<Api.Destination.Res.Details> {
		let response = await http.get<RsResponseData<Api.Destination.Res.Details>>('destination/details', {
			destinationId
		});
		return response.data.data;
	}

	async searchAvailableReservations(
		data: Api.Destination.Req.Availability
	): Promise<RedSky.RsPagedResponseData<Api.Destination.Res.Availability[]>> {
		let response = await http.get<RedSky.RsPagedResponseData<Api.Destination.Res.Availability[]>>(
			'destination/availability',
			data
		);
		return response.data;
	}

	async getAllPropertyTypes(): Promise<Api.Destination.Res.PropertyType[]> {
		let res = await http.get<RsResponseData<Api.Destination.Res.PropertyType[]>>('destination/allPropertyTypes');
		return res.data.data;
	}

	// TODO: Waiting for backend changes for this call, temporarily hard coding a list for UI Testing
	async getAllExperiences() {
		return [
			{ label: 'Golf', value: 1 },
			{ label: 'Waterpark', value: 2 },
			{ label: 'Spa', value: 3 },
			{ label: 'Resort pool', value: 4 },
			{ label: 'In home chef', value: 5 },
			{ label: 'Butler Service', value: 6 },
			{ label: 'Tennis Courts', value: 7 },
			{ label: 'Restaurants', value: 8 },
			{ label: 'Kids clubs', value: 9 },
			{ label: 'Bike Rentals', value: 10 }
		];
	}

	// TODO: Waiting for backend changes for this call, temporarily hard coding a list for UI Testing
	async getAllInUnitAmenities() {
		return [
			{ label: 'Air Conditioning', value: 1 },
			{ label: 'Washer / Dryer', value: 2 },
			{ label: 'Private Pool', value: 3 },
			{ label: 'Full Kitchen', value: 4 },
			{ label: 'Theater Room', value: 5 },
			{ label: 'Games Room', value: 6 },
			{ label: 'Outdoor Kitchen', value: 7 },
			{ label: 'Hot Tub / Spa', value: 8 },
			{ label: 'Wetbar', value: 9 },
			{ label: 'First Floor Bedroom', value: 10 },
			{ label: 'Pet Friendly', value: 11 },
			{ label: 'Free Parking', value: 12 }
		];
	}
}
