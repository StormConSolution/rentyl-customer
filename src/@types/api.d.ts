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
		}
		export namespace Res {
			export interface Create extends Model.Company {}
			export interface Update extends Model.Company {}
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

		export interface Filtered {
			id: number;
			companyId: number;
			tierId: number;
			firstName: string;
			lastName: string;
			primaryEmail: string;
			accountNumber: string;
			phone: string;
			notes: string;
			token: string;
			role: string;
			createdOn: Date | string;
			modifiedOn: Date | string;
			joinedOn: Date | string;
			birthDate: Date | string;
			lastLoginOn: Date | string;
			permissionLogin: boolean | number;
			permission: Permission[];
		}

		export interface Model extends Model.User {
			permission: Permission[];
		}
		export namespace Req {
			export interface Create {
				firstName: string;
				lastName: string;
				primaryEmail: string;
				password: string;
				role: Model.UserRoleType;
				companyId: number;
				phone?: string;
			}

			export interface Update {
				id?: number;
				ids?: number[];
				firstName?: string;
				lastName?: string;
				primaryEmail?: string;
				password?: string;
				description?: string;
				phone?: string;
			}

			export interface Login {
				username: string;
				password: string;
			}

			export interface Get {
				id?: number;
				ids?: number[];
				token: string;
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
		}
		export namespace Res {
			export interface Company {
				companyId: number;
			}
			export interface Get extends Filtered {}
			export interface Login extends Filtered {}
			export interface GetByPage {
				data: Filtered[];
				total: number;
			}
		}
	}

	export namespace Accommodation {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
			}
			export interface Update extends Model.Accommodation {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Action {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Affiliate {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.BookingSource {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Campaign {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.CampaignAction {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Category {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Cms {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Company {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.CompanyAffiliate {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.CompanyServiceKey {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.CompanyVariables {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Partial<Model.Destination> {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.MarketSegment {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.MediaMap {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.OrderProduct {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Orders {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.PaymentMethod {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.PointRedemption {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Product {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.ProductCategory {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.ProductDestination {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.ReportTemplate {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Reservation {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Review {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.Segment {}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.Segment {}
		}
	}

	export namespace SystemActionLog {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
			}
			export interface Update extends Model.SystemActionLog {}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.SystemActionLog {}
		}
	}

	export namespace Tier {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
			}
			export interface Update extends Model.Tier {}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.Tier {}
		}
	}

	export namespace UserAction {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
			}
			export interface Update extends Model.UserAction {}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.UserAction {}
		}
	}

	export namespace UserAddress {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
			}
			export interface Update extends Model.UserAddress {}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.UserAddress {}
		}
	}

	export namespace UserCoupon {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
			}
			export interface Update extends Model.UserCoupon {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.UserPermission {}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.UserPermission {}
		}
	}

	export namespace UserPoint {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
			}
			export interface Update extends Model.UserPoint {}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.UserPoint {}
		}
	}

	export namespace UserSegment {
		export namespace Req {
			export interface Create {}
			export interface Get {
				id: number;
			}
			export interface Update extends Model.UserSegment {}
			export interface Delete {
				id: number;
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
				id: number;
			}
			export interface Update extends Model.UserSocialMedia {}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.UserSocialMedia {}
		}
	}
}
