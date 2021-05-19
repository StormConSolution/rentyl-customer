declare namespace Api {
	export interface MediaDetails {
		id: number;
		isPrimary: 0 | 1;
	}
	export interface Media extends Omit<Model.Media, 'storageDetails'> {}
	export namespace Accommodation {
		export namespace Req {
			export interface Details {
				accommodationId: number;
			}
			export interface Update {
				id: number;
				name?: string;
				shortDescription?: string;
				longDescription?: string;
				address1?: string;
				address2?: string;
				city?: string;
				state?: string;
				zip?: string;
				country?: string;
				status?: Model.AccommodationStatusType;
				heroUrl?: string;
				mediaIds?: MediaDetails[];
			}
			export interface GetByPage {
				pagination: string;
				sort: string;
				filter: string;
			}

			export interface Availability {
				destinationId: number;
				startDate: Date | string;
				endDate: Date | string;
				adults: number;
				children: number;
				priceRangeMin?: number;
				priceRangeMax?: number;
				pagination?: RedSky.PagePagination;
			}
		}
		export namespace Res {
			export interface Update extends Details {}
			export interface Details extends Model.Accommodation {
				logoUrl: string;
				accommodationType: Model.AccommodationTypes;
				accommodationTypeCode: string;
				accommodationTypeDescription: string;
				media: Media[];
				layout: AccommodationLayout.Details[];
				categories: AccommodationCategory.Details[];
				features: Omit<
					Feature.Details,
					'affiliateId' | 'destinationId' | 'accommodationCategoryId' | 'accommodationId'
				>[];
			}
			export interface GetByPage {
				data: Details[];
				total: number;
			}
			export interface Availability {
				id: number;
				name: string;
				longDescription: string;
				media: Media[]; //*All media for accommodation and accommodation categories*
				featureIcons: string[]; //*Limit it to the first five*
				maxSleeps: number;
				maxOccupantCount: number;
				size: { max: number; min: number; units: string } | null; //*square footage, if we have it. Let me know what other info we might be able to grab that would be relivant*
				adaCompliant: 0 | 1;
				extraBeds: 0 | 1;
				extraBedPriceCents: number;
				costPerNightCents: number;
				availableAccommodationCount: number;
				pointsPerNight: number;
				pointsEarned: number;
			}
		}
	}

	export namespace AccommodationCategory {
		export interface Details extends Model.AccommodationCategory {
			media: Media[];
			features: Feature.Details[];
		}
		export namespace Req {
			export interface Create {
				accommodationId: number;
				title: string;
				description?: string;
				features?: number[];
				mediaIds?: MediaDetails[];
			}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update {
				id: number;
				title?: string;
				description?: string;
				features?: Feature.Req.Create[];
				mediaIds?: MediaDetails[];
			}
			export interface GetByAccommodation {
				accommodationId: number;
			}
			export interface GetByDestination {
				destinationId: number;
			}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Create extends Details {}
			export interface Get extends Details {}
			export interface Update extends Details {}
		}
	}

	export namespace AccommodationLayout {
		export interface Details extends Model.AccommodationLayout {
			rooms: Model.AccommodationLayoutRoom[];
			media: Media;
		}
		export namespace Req {
			export interface Create {
				accommodationId: number;
				title: string;
				mediaId: number;
			}
			export interface Update {
				id: number;
				title?: string;
				mediaId: number;
			}
			export interface Delete {
				id: number;
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
			export interface Create extends Details {}
			export interface Update extends Details {}
			export interface Get extends Details {}
			export interface GetByPage {
				data: Details[];
				total: number;
			}
		}
	}

	export namespace AccommodationLayoutRoom {
		export namespace Req {
			export interface Create {
				accommodationLayoutId: number;
				title: string;
				description: string;
			}
			export interface Update {
				id: number;
				title?: string;
				description?: string;
			}
			export interface Delete {
				id: number;
			}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface GetForLayout {
				accommodationLayoutId: number;
			}
		}
		export namespace Res {
			export interface Create extends Model.AccommodationLayoutRoom {}
			export interface Update extends Model.AccommodationLayoutRoom {}
			export interface Get extends Model.AccommodationLayoutRoom {}
			export interface GetForLayout extends Model.AccommodationLayoutRoom {}
		}
	}

	export namespace Action {
		export namespace Req {
			export interface Create {
				name: string;
				description?: string;
				isActive?: boolean | number;
				type: string;
				pointValue: number;
			}
			export interface Get {
				id?: number;
				ids?: number[];
			}

			export interface Update {
				id: number;
				name?: string;
				description?: string;
				isActive?: boolean | number;
				type?: string;
				pointValue?: number;
			}
			export interface Delete {
				id: number;
			}

			export interface Fulfill {
				actionId: number;
			}
		}

		export namespace Res {
			export interface Create extends Model.Action {}
			export interface Get extends Model.Action {}
			export interface GetByPage {
				data: Model.Action[];
				total: number;
			}
			export interface Update extends Model.Action {}
			export interface Details extends Model.Action {
				campaigns: CampaignDetails[];
			}
			export interface CampaignDetails extends Omit<Model.Campaign, 'companyId'> {
				campaignActionId: number;
				actionCount: number;
			}
		}
	}

	export namespace Campaign {
		export interface Action extends Omit<Model.Action, 'companyId'> {
			actionCount: number;
		}
		export interface Detail extends Model.Campaign {
			actions: Action[];
		}
		export namespace Req {
			export interface Create {
				segmentId?: number;
				name: string;
				description?: string;
				isActive?: 0 | 1;
				maxReward: number;
				type: string;
				startOn: Date | string;
				endOn: Date | string;
				pointValueMultiplier: number;
				actions: CampaignAction.CreateMany[];
			}
			export interface Get {
				id?: number;
				ids?: number[];
			}

			export interface Update {
				id: number;
				segmentId?: number;
				name?: string;
				description?: string;
				isActive?: 0 | 1;
				maxReward?: number;
				type?: string;
				startOn?: Date | string;
				endOn?: Date | string;
				pointValueMultiplier?: number;
				actions?: CampaignAction.CreateMany[];
			}
			export interface Delete {
				id: number;
			}

			export interface Consolidate {
				userId?: number;
			}
		}

		export namespace Res {
			export interface Create extends Detail {}
			export interface Get extends Detail {}
			export interface GetByPage {
				data: Detail[];
				total: number;
			}
			export interface Update extends Detail {}
		}
	}

	export namespace CampaignAction {
		export interface Create {
			campaignId: number;
			actionId: number;
			actionCount?: number;
		}
		export interface CreateMany {
			actionId: number;
			actionCount?: number;
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
				phone: string;
				primaryEmail: string;
				password: string;
			}

			export interface Get {}
		}
		export namespace Res {
			export interface Create extends User.Filtered {}
			export interface Get extends User.Res.Detail {}
		}
	}

	export namespace Destination {
		export namespace Req {
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Update {
				id: number;
				description?: string;
				status?: string;
				address1?: string;
				address2?: string;
				city?: string;
				state?: string;
				zip?: string;
				country?: string;
				logoUrl?: string;
				heroUrl?: string;
				mediaIds?: MediaDetails[];
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

			export interface GetByPage {
				pagination: string;
				sort: string;
				filter: string;
			}

			export interface Availability extends RedSky.PageQuery {
				startDate: Date | string;
				endDate: Date | string;
				adults: number;
				children: number;
				priceRangeMin?: number;
				priceRangeMax?: number;
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
				media: Media[];
			}
			export interface Update extends Details {}
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
				media: Media[];
				features: Omit<
					Feature.Details,
					'affiliateId' | 'accommodationId' | 'accommodationCategoryId' | 'destinationId'
				>[];
				packages: Package.Details[];
				accommodations: {
					id: number;
					name: string;
					shortDescription: string;
				}[];
				accommodationTypes: {
					id: number;
					name: string;
					description: string;
					code: string;
				}[];
				policies: { type: Model.DestinationPolicyType; value: string }[];
			}
			export interface Availability {
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
				media: Media[];
				features: {
					id: number;
					title: string;
					icon: string;
				}[];
				accommodationTypes: {
					id: number;
					name: string;
				}[];
				accommodations: {
					id: number;
					name: string;
					roomCount: number;
					bedDetails: any;
					priceCents: number;
					features: {
						id: number;
						title: string;
						icon: string;
					}[];
				}[];
			}
			export interface GetByPageAvailability {
				data: Availability[];
				total: number;
			}
			export interface AccommodationType extends Model.AccommodationType {}
			export interface GetByPage {
				data: Details[];
				total: number;
			}
		}
	}

	export namespace Feature {
		export interface Details extends Model.Feature {
			media: Media[];
		}
		export namespace Req {
			export interface Create {
				affiliateId?: number;
				destinationId?: number;
				accommodationId?: number;
				accommodationCategoryId?: number;
				title?: string;
				description?: string;
				mediaIds?: MediaDetails[];
				icon?: string;
				isActive: 0 | 1;
				isCarousel: 0 | 1;
			}
			export interface Update {
				id: number;
				title?: string;
				description?: string;
				mediaIds?: MediaDetails[];
				icon?: string;
				isActive?: 0 | 1;
				isCarousel?: 0 | 1;
			}
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Delete {
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
			export interface Create extends Details {}
			export interface Update extends Details {}
			export interface Get extends Details {}
			export interface Delete extends Details {}
			export interface GetByPage {
				data: Details[];
				total: number;
			}
		}
	}

	export namespace Media {
		export namespace Req {
			export interface CreateImagePyramid {
				keepTransparency?: boolean;
				file: any;
			}

			export interface Get {
				id?: number;
				ids?: number[];
			}

			export interface Update {
				id: number;
				title?: string;
				description?: string;
				isPrimary?: 0 | 1;
			}

			export interface Delete {
				id?: number;
				ids?: number[];
			}
		}
		export namespace Res {
			export interface Get extends Media {}
			export interface Update extends Media {}
			export interface Delete {}
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
				referenceId: number;
				amount: PaymentAmount;
				paymentMethod: CreatePaymentMethod;
				storePaymentMethod: boolean;
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
			export interface CreatePayment {
				integration_info: string;
			}
		}
	}

	export namespace Package {
		export interface Details extends Model.Packages {
			media: Media[];
		}
		export namespace Req {
			export interface Update {
				id: number;
				title?: string;
				description?: string;
				mediaIds?: MediaDetails[];
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
			export interface Update extends Details {}
			export interface Get extends Details {}
			export interface GetByPage {
				data: Details[];
				total: number;
			}
		}
	}

	export namespace Payment {
		export interface PmData {
			address1: string;
			address2: string;
			callback_url: string;
			card_type: string; // 'visa'
			city: string;
			company: string;
			country: string;
			created_at: Date | string;
			data: any;
			eligible_for_card_updater: boolean;
			email: string;
			errors: any[];
			fingerprint: string;
			first_name: string;
			first_six_digits: number;
			full_name: string;
			last_four_digits: number;
			last_name: string;
			metadata: any;
			month: number;
			number: string;
			payment_method_type: string;
			phone_number: string;
			shipping_address1: string;
			shipping_address2: string;
			shipping_city: string;
			shipping_country: string;
			shipping_phone_number: string;
			shipping_state: string;
			shipping_zip: string;
			state: string;
			storage_state: string;
			test: boolean;
			token: string;
			updated_at: Date | string;
			verification_value: string;
			year: number;
			zip: string;
		}
		export namespace Req {
			export interface Create {
				cardToken: string;
				pmData: PmData;
				userAddressId?: number;
				isPrimary?: 0 | 1;
			}
			export interface PublicData {}
			export interface ActiveForUser {}
		}
		export namespace Res {
			export interface Create {}
			export interface PublicData {
				id: number;
				name: string;
				publicData: { token: string };
			}
			export interface ActiveForUser extends Model.UserPaymentMethod {}
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
			export interface Verification {
				accommodationId: number;
				adults: number;
				children: number;
				arrivalDate: string | Date;
				departureDate: string | Date;
				numberOfAccommodations: number;
			}
			export interface Create {
				accommodationId: number;
				adults: number;
				children: number;
				arrivalDate: Date | string;
				departureDate: Date | string;
				rateCode: string;
				numberOfAccommodations: number;
			}
		}
		export namespace Res {
			export interface Get extends Model.Reservation {}
			export interface Availability {
				[key: string]: Redis.Availability;
			}
			export interface Paged {}
			export interface Verification {
				checkInTime: string;
				checkInDate: string | Date;
				checkoutTime: string;
				checkoutDate: string | Date;
				adults: number;
				children: number;
				accommodationName: string;
				destinationName: string;
				rateCode: string;
				destinationPackages: BookingPackageDetails[];
				policies: { type: Model.DestinationPolicyType; value: string }[];
				prices: PriceDetail;
			}

			interface PriceDetail {
				accommodationDailyCostsInCents: { [date: string]: number };
				accommodationTotalInCents: number;
				feeTotalsInCents: { name: string; amount: number }[];
				taxTotalsInCents: { name: string; amount: number }[];
				taxAndFeeTotalInCents: number;
				grandTotalCents: number;
			}

			export interface Create {
				id?: string;
				confirmationCode?: string;
			}
			export interface CostPerNight {
				accommodationCostInCents: number;
				taxesAndFeesInCents: number;
				totalInCents: number;
			}

			export interface BookingPackageDetails extends Api.Package.Details {
				priceCents: number;
			}
			export interface Policies {
				guaranteePolicy: string;
				cancelPolicy: string;
			}
		}
	}

	export namespace Reward {
		export namespace Req {
			export interface Get {
				id?: number;
				ids?: number[];
			}
			export interface Paged extends RedSky.PageQuery {}
			export interface Create {
				name: string;
				pointCost: number;
				monetaryValueInCents: number;
				destinationId?: number;
				affiliateId?: number;
				description: string;
				upc: number;
				mediaDetails?: MediaDetails[];
				categoryIds: number[];
			}
			export interface Update extends Partial<Omit<Model.Reward, 'id' | 'companyId'>> {
				id: number;
				mediaDetails?: MediaDetails[];
				categoryIds?: number[];
			}
			export interface Delete {
				id: number;
			}
		}
		export namespace Res {
			export interface Voucher {
				id: number;
				customerUserId: number;
				isActive: 0 | 1;
				isRedeemed: 0 | 1;
				code: string;
			}
			export interface Get {
				id: number;
				name: string;
				pointCost: number;
				monetaryValueInCents: number;
				destinationId?: number;
				affiliateId?: number;
				description: string;
				upc: number;
				isActive: boolean;
				createdOn: Date | string;
				modifiedOn: Date | string;
				vendorName: string;
				media: Media[];
				categoryIds: number[];
				vouchers: Voucher[];
			}
			export interface GetByPage {
				data: Get[];
				total?: number | undefined;
			}
			export interface Create extends Omit<Get, 'modifiedOn'> {}
			export interface Update extends Get {}
		}
		export namespace Voucher {
			export namespace Req {
				export interface Create {
					rewardId: number;
					codes: string[];
				}
				export interface Delete {
					rewardId: number;
					code: string;
				}
				export interface Claim {
					code: string;
					rewardId: number;
				}
			}
			export namespace Res {
				export interface Get extends Omit<Model.RewardVoucher, 'companyId'> {}
				export interface Create extends Get {}
				export interface Delete {
					rewardId: number;
					code: string;
				}
				export interface Claim extends Model.RewardVoucher {}
			}
		}
		export namespace Category {
			export namespace Req {
				export interface Create {
					name: string;
					mediaDetails?: MediaDetails[];
					isFeatured?: 0 | 1;
					isActive?: 0 | 1;
				}
				export interface Delete {
					id: number;
				}
				export interface Update {
					id: number;
					name?: string;
					isActive?: 0 | 1;
					isFeatured?: 0 | 1;
					mediaDetails?: MediaDetails[];
				}
				export interface Get {
					id?: number;
					ids?: number[];
				}
			}
			export namespace Res {
				export interface Get extends Model.RewardCategory {
					media: Media[];
				}
				export interface Create extends Get {}
				export interface Update extends Get {}
			}
		}
	}

	export namespace SystemActionLog {
		export namespace Req {
			export interface Create {
				companyId: number;
				userId: number;
				action: Model.SystemActionLogActions;
				source: string; // should be a DbTableName or service
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
				accrualRate: number;
				threshold: number;
				isAnnualRate?: 0 | 1;
				featureIds: number[];
				mediaDetails?: MediaDetails[];
			}
			export interface Get {
				id: number;
			}

			export interface Update extends Partial<Omit<Model.Tier, 'companyId' | 'createdOn' | 'modifiedOn'>> {
				id: number;
				featureIds?: number[];
				mediaDetails?: MediaDetails[];
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
			export interface Get extends Omit<Model.Tier, 'companyId'> {
				features: Model.TierFeature[];
				mediaDetails: MediaDetails[];
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
			isDefault: 1 | 0;
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
				userRoleId?: number;
				firstName: string;
				lastName: string;
				primaryEmail: string;
				password: string;
				phone?: string;
				birthDate?: Date | string;
				address?: Api.UserAddress.Req.Create;
				newsLetter?: 0 | 1;
				emailNotification?: 0 | 1;
			}

			export interface Update {
				id?: number;
				ids?: number[];
				userRoleId?: number;
				firstName?: string;
				lastName?: string;
				primaryEmail?: string;
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

			export interface UpdatePassword {
				old: string;
				new: string;
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
				userId?: number;
			}
		}
		export namespace Res {
			export interface Company {
				companyId: number;
			}
			export interface Get extends Filtered {}
			export interface Detail extends Get {
				tierTitle: string;
				tierBadge: Media;
				pendingPoints: number;
				nextTierThreshold: number;
				nextTierTitle: string;
				pointsExpiring: number | null;
				pointsExpiringOn: Date | string | null;
			}
			export interface Login extends Detail {}
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
				state?: string;
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
			export interface Verbose extends Model.UserPoint {
				title: string;
				arrivalDate: Date | string;
				departureDate: Date | string;
				media: Media[];
			}
		}
	}

	export namespace Vendor {
		export namespace Res {
			export interface Get {
				name: string;
				destinationId: number | null;
				affiliateId: number | null;
			}
			export interface GetByPage {
				data: Get[];
				total: number;
			}
		}
	}
}
