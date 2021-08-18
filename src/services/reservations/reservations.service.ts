import { WebUtils } from '../../utils/utils';
import { Service } from '../Service';
import serviceFactory from '../serviceFactory';
import UserService from '../user/user.service';
import http from '../../utils/http';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class ReservationsService extends Service {
	private userService!: UserService;

	start() {
		this.userService = serviceFactory.get<UserService>('UserService');
	}

	async verifyAvailability(data: Api.Reservation.Req.Verification): Promise<Api.Reservation.Res.Verification> {
		let response = await http.get<RsResponseData<Api.Reservation.Res.Verification>>(
			'reservation/verification',
			data
		);
		return response.data.data;
	}

	async create(data: Api.Reservation.Req.Create) {
		let response = await http.post<RsResponseData<Api.Reservation.Res.Create>>('reservation', data);
		this.refreshUser();
		return response.data.data;
	}

	async createItinerary(data: Api.Reservation.Req.Itinerary.Create): Promise<Api.Reservation.Res.Itinerary.Get> {
		const response = await http.post<RsResponseData<Api.Reservation.Res.Itinerary.Get>>(
			'reservation/itinerary',
			data
		);
		this.refreshUser();
		return response.data.data;
	}

	async getItinerary(data: Api.Reservation.Req.Itinerary.Get) {
		let response = await http.get<RsResponseData<Api.Reservation.Res.Itinerary.Get>>('reservation/itinerary', data);
		return response.data.data;
	}

	async get(id: number): Promise<Api.Reservation.Res.Get> {
		let response = await http.get<RsResponseData<Api.Reservation.Res.Get>>('reservation', { id });
		return response.data.data;
	}

	async update(data: Api.Reservation.Req.Update): Promise<Api.Reservation.Res.Get> {
		let response = await http.put<RsResponseData<Api.Reservation.Res.Get>>('reservation', data);
		this.refreshUser();
		return response.data.data;
	}

	//this will change to reservation level later.
	async updatePaymentMethod(data: Api.Reservation.Req.UpdatePayment): Promise<Api.Reservation.Res.Itinerary.Get> {
		let response = await http.put<RsResponseData<Api.Reservation.Res.Itinerary.Get>>(
			'reservation/payment-method',
			data
		);
		this.refreshUser();
		return response.data.data;
	}

	async getByPage(pageQuery: RedSky.PageQuery) {
		let response = await http.get<RedSky.RsPagedResponseData<Api.Reservation.Res.Get[]>>(
			'reservation/paged',
			WebUtils.convertDataForUrlParams(pageQuery)
		);
		return response.data;
	}

	async upcoming(limit: number) {
		let response = await http.get<RsResponseData<Api.Reservation.Res.Upcoming[]>>('reservation/upcoming', {
			limit
		});
		return response.data.data;
	}

	async updateReservation(data: Api.Reservation.Req.Update) {
		let response = await http.put<RsResponseData<Api.Reservation.Res.Get>>('reservation', data);
		this.refreshUser();
		return response.data.data;
	}

	async cancel(id: number): Promise<Api.Reservation.Res.Cancel> {
		let response = await http.post<RsResponseData<Api.Reservation.Res.Cancel>>('reservation/cancel', { id });
		this.refreshUser();
		return response.data.data;
	}

	async getPackagesByIds(data: Api.UpsellPackage.Req.Get): Promise<RsResponseData<Api.UpsellPackage.Res.Get[]>> {
		let response = await http.get<RsResponseData<Api.UpsellPackage.Res.Get[]>>('package', data);
		return response.data;
	}

	private refreshUser() {
		this.userService.refreshUser().catch(console.error);
	}
}
