declare namespace Api {
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
			export interface Role {}
		}
		export namespace Res {
			export interface Create extends Model.Company {}
			export interface Update extends Model.Company {}
			export interface Role extends Model.UserRole {}
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
			permission: Permission[];
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
		}
	}

	export namespace Accommodation {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
				ids: number[];
			}
			export interface Update extends Omit<Model.Accommodation, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Accommodation {}
		}
	}

	export namespace AccommodationType {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
			}
			export interface Update extends Model.AccommodationType {}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.AccommodationType {}
		}
	}

	export namespace Action {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Action, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Action {}
		}
	}

	export namespace Affiliate {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Affiliate, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Affiliate {}
		}
	}

	export namespace BookingSource {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.BookingSource, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.BookingSource {}
		}
	}

	export namespace Campaign {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Campaign, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Campaign {}
		}
	}

	export namespace CampaignAction {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.CampaignAction, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.CampaignAction {}
		}
	}

	export namespace Category {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Category, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Category {}
		}
	}

	export namespace Cms {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Cms, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Cms {}
		}
	}

	export namespace Company {
		export namespace Req {
			export interface Create {}
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
		}
		export namespace Res {
			export interface Get extends Model.Company {}
		}
	}

	export namespace CompanyAffiliate {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.CompanyAffiliate, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.CompanyAffiliate {}
		}
	}

	export namespace CompanyServiceKey {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.CompanyServiceKey, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.CompanyServiceKey {}
		}
	}

	export namespace CompanyVariables {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.CompanyVariables, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.CompanyVariables {}
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
		}
		export namespace Res {
			export interface Get extends Model.Destination {}
		}
	}

	export namespace MarketSegment {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.MarketSegment, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.MarketSegment {}
		}
	}

	export namespace MediaMap {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.MediaMap, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.MediaMap {}
		}
	}

	export namespace OrderProduct {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.OrderProduct, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.OrderProduct {}
		}
	}

	export namespace Orders {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Orders, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Orders {}
		}
	}

	export namespace PaymentMethod {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.PaymentMethod, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.PaymentMethod {}
		}
	}

	export namespace PointRedemption {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.PointRedemption, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.PointRedemption {}
		}
	}

	export namespace Product {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Product, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Product {}
		}
	}

	export namespace ProductCategory {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.ProductCategory, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.ProductCategory {}
		}
	}

	export namespace ProductDestination {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.ProductDestination, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.ProductDestination {}
		}
	}

	export namespace ReportTemplate {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.ReportTemplate, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.ReportTemplate {}
		}
	}

	export namespace Reservation {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Reservation, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
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
		}
		export namespace Res {
			export interface Get extends Model.Reservation {}
			export interface Availability {
				[key: string]: Redis.Availability;
			}
		}
	}

	export namespace Review {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Review, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Review {}
		}
	}

	export namespace Segment {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.Segment, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.Segment {}
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

	export namespace UserAction {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.UserAction, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.UserAction {}
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

	export namespace UserCoupon {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.UserCoupon, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.UserCoupon {}
		}
	}

	export namespace UserPermission {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.UserPermission, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.UserPermission {}
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

	export namespace UserSegment {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.UserSegment, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.UserSegment {}
		}
	}

	export namespace UserSocialMedia {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update extends Omit<Model.UserSocialMedia, 'id'> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Model.UserSocialMedia {}
		}
	}
}
