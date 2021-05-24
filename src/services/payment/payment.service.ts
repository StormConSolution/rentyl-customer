import http from '../../utils/http';
import { Service } from '../Service';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

export default class PaymentService extends Service {
	private spreedlyErrorCallbackId = 0;
	private onSpreedlyErrorCallbacks: { id: number; callback: (errorMsg: string) => void }[] = [];
	private spreedlyPaymentMethodCallbackId = 0;
	private onSpreedlyPaymentMethodCallbacks: {
		id: number;
		callback: (token: string, pmData: Api.Payment.PmData) => void;
	}[] = [];
	private spreedlyReadyCallbackId = 0;
	private onSpreedlyReadyCallbacks: { id: number; callback: (frame: any) => void }[] = [];

	private spreedlyFieldEventCallbackId = 0;
	private onSpreedlyFieldEventCallbacks: {
		id: number;
		callback: (
			name: 'number' | 'cvv',
			type: 'focus' | 'blur' | 'mouseover' | 'mouseout' | 'input' | 'enter' | 'escape' | 'tab' | 'shiftTab',
			activeEl: 'number' | 'cvv',
			inputProperties: {
				cardType?: string;
				validNumber?: boolean;
				validCvv?: boolean;
				numberLength?: number;
				cvvLength?: number;
			}
		) => void;
	}[] = [];

	constructor() {
		super();

		window.Spreedly.on('errors', () => {
			// error occurred
			this.onSpreedlyErrorCallbacks.forEach((callback) => {
				callback.callback('error');
			});
		});

		window.Spreedly.on('paymentMethod', (token: string, pmData: Api.Payment.PmData) => {
			this.onSpreedlyPaymentMethodCallbacks.forEach((callback) => {
				callback.callback(token, pmData);
			});
		});

		window.Spreedly.on('ready', (frame: any) => {
			this.onSpreedlyReadyCallbacks.forEach((callback) => {
				callback.callback(frame);
			});
		});

		window.Spreedly.on(
			'fieldEvent',
			(
				name: 'number' | 'cvv',
				type: 'focus' | 'blur' | 'mouseover' | 'mouseout' | 'input' | 'enter' | 'escape' | 'tab' | 'shiftTab',
				activeEl: 'number' | 'cvv',
				inputProperties: {
					cardType?: string;
					validNumber?: boolean;
					validCvv?: boolean;
					numberLength?: number;
					cvvLength?: number;
				}
			) => {
				this.onSpreedlyFieldEventCallbacks.forEach((callback) => {
					callback.callback(name, type, activeEl, inputProperties);
				});
			}
		);
	}

	subscribeToSpreedlyFieldEvent(
		callback: (
			name: 'number' | 'cvv',
			type: 'focus' | 'blur' | 'mouseover' | 'mouseout' | 'input' | 'enter' | 'escape' | 'tab' | 'shiftTab',
			activeEl: 'number' | 'cvv',
			inputProperties: {
				cardType?: string;
				validNumber?: boolean;
				validCvv?: boolean;
				numberLength?: number;
				cvvLength?: number;
			}
		) => void
	): number {
		let id = ++this.spreedlyFieldEventCallbackId;
		this.onSpreedlyFieldEventCallbacks.push({ id, callback });
		return id;
	}

	unsubscribeToSpreedlyFieldEvent(id: number) {
		this.onSpreedlyFieldEventCallbacks = this.onSpreedlyFieldEventCallbacks.filter((item) => {
			return item.id !== id;
		});
	}

	subscribeToSpreedlyReady(callback: (frame: any) => void): number {
		let id = ++this.spreedlyReadyCallbackId;
		this.onSpreedlyReadyCallbacks.push({ id, callback });
		return id;
	}

	unsubscribeToSpreedlyReady(id: number) {
		this.onSpreedlyReadyCallbacks = this.onSpreedlyReadyCallbacks.filter((item) => {
			return item.id !== id;
		});
	}

	subscribeToSpreedlyPaymentMethod(callback: (token: string, pmData: Api.Payment.PmData) => void): number {
		let id = ++this.spreedlyPaymentMethodCallbackId;
		this.onSpreedlyPaymentMethodCallbacks.push({ id, callback });
		return id;
	}

	unsubscribeToSpreedlyPaymentMethod(id: number) {
		this.onSpreedlyPaymentMethodCallbacks = this.onSpreedlyPaymentMethodCallbacks.filter((item) => {
			return item.id !== id;
		});
	}

	subscribeToSpreedlyError(callback: (errorMsg: string) => void): number {
		let id = ++this.spreedlyErrorCallbackId;
		this.onSpreedlyErrorCallbacks.push({ id, callback });
		return id;
	}

	unsubscribeToSpreedlyError(id: number) {
		this.onSpreedlyErrorCallbacks = this.onSpreedlyErrorCallbacks.filter((item) => {
			return item.id !== id;
		});
	}

	async addPaymentMethod(data: Api.Payment.Req.Create): Promise<Api.Payment.Res.Create> {
		let axiosResponse = await http.post<RsResponseData<Api.Payment.Res.Create>>('payment', data);
		return axiosResponse.data.data;
	}

	async getGateway(): Promise<Api.Payment.Res.PublicData> {
		let axiosResponse = await http.get<RsResponseData<Api.Payment.Res.PublicData>>('payment/public');
		return axiosResponse.data.data;
	}

	async update(data: Api.Payment.Req.Update): Promise<Api.Payment.Res.Update> {
		let res = await http.put<RsResponseData<Api.Payment.Res.Update>>('payment', data);
		return res.data.data;
	}

	async delete(id: number): Promise<Api.Payment.Res.Delete> {
		return await http.delete('payment', { id });
	}
}
