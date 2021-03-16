declare namespace Api {
	export namespace Accommodation {
		export namespace Req {
			export interface Details {
				accommodationId: number;
			}
		}
		export namespace Res {
			export interface Details extends Model.Accommodation {
				logoUrl: string;
				accommodationType: Model.AccommodationTypes;
				accommodationTypeCode: string;
				accommodationTypeDescription: string;
				media: Model.Media[];
				layout: AccommodationLayout.Details[];
				categories: AccommodationCategory.Details[];
				features: Feature.Details[];
			}
		}
	}

	export namespace AccommodationCategory {
		export interface Details extends Model.AccommodationCategory {
			media: Model.Media[];
		}
	}

	export namespace AccommodationLayout {
		export interface Details extends Model.AccommodationLayout {
			rooms: Model.AccommodationLayoutRoom[];
		}
	}
	export namespace Company {
		export namespace Req {
			export interface Create {
				name: string;
				description?: string;
				industryIds: number[];
				addressLine1: string;
				addressLine2?: string;
				city: string;
				state: string;
				zip: string;
				country: string;
				isBuyer: boolean | number;
				website: string;
				domainName: string;
			}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Company, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
			export interface Role {}
		}
		export namespace Res {
			export interface Create extends Model.Company {}
			export interface Update extends Model.Company {}
			export interface Role extends Model.UserRole {}
			export interface Get extends Model.Company {}
		}
	}

	export namespace Country {
		interface Timezones {
			zoneName: string;
			gmtOffset: number;
			gmtOffsetName: string;
			abbreviation: string;
			tzName: string;
		}
		interface ICountry {
			name: string;
			phonecode: string;
			isoCode: string;
			flag: string;
			currency: string;
			latitude: string;
			longitude: string;
			timezones?: Timezones[];
		}
		interface IState {
			name: string;
			isoCode: string;
			countryCode: string;
			latitude?: string | null;
			longitude?: string | null;
		}
		interface ICity {
			name: string;
			countryCode: string;
			stateCode: string;
			latitude?: string | null;
			longitude?: string | null;
		}
		export namespace Req {
			export interface AllCountries {}
			export interface Country {
				countryCode: string;
			}
			export interface States {
				countryCode: string;
			}
			export interface Cities {
				countryCode: string;
				stateCode: string;
			}
		}
		export namespace Res {
			export interface AllCountries {
				countries: ICountry[];
			}
			export interface Country extends ICountry {}
			export interface States {
				states: IState[];
			}
			export interface Cities {
				cities: ICity[];
			}
		}
	}

	export namespace Customer {
		export namespace Req {
			export interface Create {
				name: string;
				birthDate: Date | string;
				address: string;
				city: string;
				zip: string;
				country: string;
				phone: string;
				primaryEmail: string;
				password: string;
				newsLetter: 0 | 1;
				emailNotification: 0 | 1;
			}
		}
		export namespace Res {
			export interface Create extends User.Filtered {}
		}
	}

	export namespace Destination {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Partial<Model.Destination> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
			export interface AccommodationType {
				destinationId?: number;
				destinationIds?: number[];
			}
			export interface Features {
				destinationId: number;
			}
			export interface Packages {
				destinationId: number;
			}
			export interface Details {
				destinationId: number;
			}
		}
		export namespace Res {
			export interface Get {
				id: number;
				companyId: number;
				name: string;
				description: string;
				code: string;
				status: string;
				address1: string;
				address2: string;
				city: string;
				state: string;
				zip: string;
				country: string;
				logoUrl: string;
				heroUrl: string;
				media: Model.Media[];
			}
			export interface Details {
				id: number;
				name: string;
				description: string;
				code: string;
				status: string;
				address1: string;
				address2: string;
				city: string;
				state: string;
				zip: string;
				country: string;
				logoUrl: string;
				heroUrl: string;
				media: Model.Media[];
				features: Feature.Details[];
				packages: Package.Details[];
			}
			export interface AccommodationType {
				id: number;
				companyId: number;
				destinationId: number;
				code: string;
				name: string;
				description: string;
				createdOn: Date | string;
				modifiedOn: Date | string;
				isActive: boolean;
				type: 'HOTEL' | 'RENTAL';
				metaData: string;
				externalSystemId: string;
			}
		}
	}

	export namespace Country {
		interface Timezones {
			zoneName: string;
			gmtOffset: number;
			gmtOffsetName: string;
			abbreviation: string;
			tzName: string;
		}
		interface ICountry {
			name: string;
			phonecode: string;
			isoCode: string;
			flag: string;
			currency: string;
			latitude: string;
			longitude: string;
			timezones?: Timezones[];
		}
		interface IState {
			name: string;
			isoCode: string;
			countryCode: string;
			latitude?: string | null;
			longitude?: string | null;
		}
		interface ICity {
			name: string;
			countryCode: string;
			stateCode: string;
			latitude?: string | null;
			longitude?: string | null;
		}
		export namespace Req {
			export interface AllCountries {}
			export interface Country {
				countryCode: string;
			}
			export interface States {
				countryCode: string;
			}
			export interface Cities {
				countryCode: string;
				stateCode: string;
			}
		}
		export namespace Res {
			export interface AllCountries {
				countries: ICountry[];
			}
			export interface Country extends ICountry {}
			export interface States {
				states: IState[];
			}
			export interface Cities {
				cities: ICity[];
			}
		}
	}

	export namespace Customer {
		export namespace Req {
			export interface Create {
				name: string;
				birthDate: Date | string;
				address: string;
				city: string;
				zip: string;
				country: string;
				phone: string;
				primaryEmail: string;
				password: string;
				newsLetter: 0 | 1;
				emailNotification: 0 | 1;
			}
		}
		export namespace Res {
			export interface Create extends User.Filtered {}
		}
	}

	export namespace Media {
		export namespace Req {
			export interface Create {
				file: any;
				id: number;
			}

			export interface Get {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.Media {}
		}
	}

	export namespace Order {
		export namespace Req {
			interface PaymentAmount {
				currency: string;
				value: number;
			}
			export interface PaymentMethods {
				countryCode: string;
				shopperLocale: string;
				amount: PaymentAmount;
			}
			interface CreatePaymentMethod {
				type: string;
				encryptedCardNumber: string;
				encryptedSecurityCode: string;
				encryptedExpiryMonth: string;
				encryptedExpiryYear: string;
				holderName?: string;
			}
			export interface CreatePayment {
				referenceId: number | string;
				amount: PaymentAmount;
				paymentMethod: CreatePaymentMethod;
			}
		}
		export namespace Res {
			interface PaymentMethodDetail {
				key: string;
				type: 'cardToken' | 'text' | 'tel' | 'select' | 'radio' | 'emailAddress';
				optional?: boolean;
			}
			export interface PaymentMethod {
				name: string;
				type: string;
				brands?: 'visa' | 'mc' | 'amex' | 'discover' | 'diners';
				details?: PaymentMethodDetail[];
				fundingSource?: 'credit' | 'debit';
			}
			export interface PaymentMethods {
				paymentMethods: PaymentMethod[];
			}
			export interface CreatePayment {}
		}
	}

	export namespace Reservation {
		export namespace Req {
			export interface Availability {
				startDate: Date | string;
				endDate: Date | string;
				adults: number;
				destinationId?: number;
				children?: number;
				currencyCode?: string;
				roomClass?: 'adacompliance';
				priceRangeMin?: number;
				priceRangeMax?: number;
				page?: number;
				limit?: number;
			}
			export interface Paged extends RedSky.PageQuery {}
		}
		export namespace Res {
			export interface Get extends Model.Reservation {}
			export interface Availability {
				[key: string]: Redis.Availability;
			}
			export interface Paged {}
		}
	}

	export namespace SystemActionLog {
		export namespace Req {
			export interface Create {
				companyId: number;
				userId: number;
				action: Model.SystemActionLogActions;
				source: string; // should be a DbTableName
				sourceId?: number;
				metaData?: any;
			}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.SystemActionLog, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.SystemActionLog {}
		}
	}

	export namespace Tier {
		export namespace Req {
			export interface Create {
				name: string;
				description?: string;
				isActive: 0 | 1;
				accrualRate: number;
				threshold: number;
				isAnnualRate?: 0 | 1;
				featureIds: number[];
			}
			export interface Get {
				id: number;
			}

			export interface Update extends Partial<Omit<Model.Tier, 'companyId' | 'createdOn' | 'modifiedOn'>> {
				id: number;
				featureIds?: number[];
			}
			export interface Delete {
				id: number;
			}
			export interface CreateFeature {
				name: string;
			}
			export interface GetFeature {
				id: number;
			}
			export interface UpdateFeature {
				id: number;
				name: string;
			}
			export interface DeleteFeature {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.Tier {
				features: Model.TierFeature[];
			}
			export interface CreateFeature extends Model.TierFeature {}
			export interface GetFeatures extends Model.TierFeature {}
			export interface GetFeature extends Model.TierFeature {}
			export interface UpdateFeature extends Model.TierFeature {}
		}
	}

	export namespace User {
		export interface Permission {
			key: string;
			read: boolean | number;
			write: boolean | number;
		}
		export interface Address {
			id: number;
			name: string;
			type: Model.UserAddressType;
			address1: string;
			address2: string;
			city: string;
			state: string;
			zip: number;
			country: string;
			isDefault: boolean | number;
		}

		export interface Filtered {
			id: number;
			companyId: number;
			tierId: number;
			userRoleId: number;
			firstName: string;
			lastName: string;
			primaryEmail: string;
			accountNumber: string;
			phone: string;
			notes: string;
			token: string;
			createdOn: Date | string;
			modifiedOn: Date | string;
			joinedOn: Date | string;
			birthDate: Date | string;
			lastLoginOn: Date | string;
			permissionLogin: boolean | number;
			permission: Permission[] | [];
			address: Address[] | [];
			lifeTimePoints: number;
			availablePoints: number;
			city: string;
			state: string;
			loginExpiresOn: Date | string;
			loginVerificationExpiresOn: Date | string;
		}

		export interface Model extends Model.User {
			permission: Permission[];
			address: Address[] | [];
			city: string;
			state: string;
		}
		export namespace Req {
			export interface Create {
				userRoleId: number;
				firstName: string;
				lastName: string;
				primaryEmail: string;
				password: string;
				phone?: string;
				birthDate?: Date | string;
			}

			export interface Update {
				id?: number;
				ids?: number[];
				userRoleId?: number;
				firstName?: string;
				lastName?: string;
				primaryEmail?: string;
				password?: string;
				phone?: string;
				birthDate?: Date | string;
			}

			export interface Login {
				username: string;
				password: string;
			}

			export interface Get {
				id?: number;
				ids?: number[];
			}

			export interface Delete {
				id?: number;
				ids?: number[];
			}

			export interface ForgotPassword {
				primaryEmail: string;
			}

			export interface ResetPassword {
				passwordResetGuid: string;
				newPassword: string;
			}

			export interface ValidateGuid {
				guid: string;
			}

			export interface UserEmail {
				primaryEmail: string;
			}

			export interface Verify {
				userId: number;
				status: 'APPROVED' | 'DENIED' | 'HOLD';
			}

			export interface GetByPage {
				pagination: string;
				sort: string;
				filter: string;
			}

			export interface VerifyLogin {
				guid: string;
			}

			export interface UserPoints {
				userId: number;
			}
		}
		export namespace Res {
			export interface Company {
				companyId: number;
			}
			export interface Get extends Filtered {}
			export interface Login extends Filtered {}
			export interface ForgotPassword extends Filtered {}
			export interface ResetPassword extends Filtered {}
			export interface ValidateGuid extends Filtered {}
			export interface GetByPage {
				data: Filtered[];
				total: number;
			}
			export interface VerifyLogin extends Filtered {}
			export interface UserPoint extends Model.UserPoint {}
		}
	}

	export namespace UserAddress {
		export namespace Req {
			export interface Create {
				name?: string;
				userId?: number;
				type: Model.UserAddressType;
				address1: string;
				address2?: string;
				city: string;
				state: string;
				zip: number;
				country: string;
				isDefault: boolean | number;
			}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update {
				id: number;
				name?: string;
				type?: Model.UserAddressType;
				address1?: string;
				address2?: string;
				city?: string;
				state?: string;
				zip?: number;
				country?: string;
				isDefault: boolean | number;
			}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.UserAddress {}
			export interface Create extends Model.UserAddress {}
			export interface Update extends Model.UserAddress {}
		}
	}

	export namespace UserPoint {
		export namespace Req {
			export interface Create {
				userId: number;
				pointType: Model.PointTypes;
				pointAmount: number;
				reason: Model.PointReason;
				description?: string;
				notes?: string;
				award: 0 | 1;
			}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface GetByPage {
				pagination: string;
				sort: string;
				filter: string;
			}
		}
		export namespace Res {
			export interface Get extends Model.UserPoint {}
			export interface Create extends Model.UserPoint {}
		}
	}
}
