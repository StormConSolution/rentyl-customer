declare namespace Model {
	export type InternalResourceTypes = 'ANDROID' | 'IOS' | 'WEB';
	export type UserRoleType = 'user' | 'admin' | 'super_admin';
	export type ServiceKeyType = 'DESTINATION' | 'RESERVATION';
	export type AccommodationTypes = 'HOTEL' | 'RENTAL';
	export type AccommodationStatusType = 'ACTIVE' | 'INACTIVE' | 'DELETED';
	export type AccommodationRoomClassType = 'Deluxe';
	export interface Accommodation {
		id: number;
		companyId: number;
		destinationId: number;
		accommodationTypeId: number;
		name: string;
		code: string;
		shortDescription: string;
		longDescription: string;
		address1: string;
		address2: string;
		city: string;
		state: string;
		zip: string;
		country: string;
		roomCount: number;
		floorCount: number;
		createdOn: Date | string;
		modifiedOn: Date | string;
		status: AccommodationStatusType;
		isPrivate: boolean;
		isRentReady: boolean;
		phase: string;
		lot: string;
		closingDate: Date | string;
		houseView: string;
		furnitureDescription: string;
		kitchenDescription: string;
		modelDescription: string;
		managementCompany: string;
		maxOccupantCount: number;
		maxSleeps: number;
		propertyCode: string;
		agreementDate: Date | string;
		propertyStatus: string;
		accommodationCode: string;
		priceCents: number;
		metaData: string;
		externalSystemId: string;
		roomClass: AccommodationRoomClassType;
		bedDetails: {
			type: string;
			isPrimary: boolean | number;
			qty: number;
			description: string;
		};
		extraBeds: boolean | number;
		extraBedPriceCents: number;
		adaCompliant: boolean | number;
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
		type: AccommodationTypes;
		metaData: string;
		externalSystemId: string;
	}

	export interface Action {
		id: number;
		companyId: number;
		name: string;
		description: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isActive: boolean;
		type: string;
		value: number;
		valueMax: number;
	}

	export interface Affiliate {
		id: number;
		name: string;
		squareLogoUrl: string;
		wideLogoUrl: string;
		website: string;
		description: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface BookingSource {
		id: number;
		name: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isActive: boolean;
		code: string;
	}

	export interface Campaign {
		id: number;
		companyId: number;
		segmentId: number;
		name: string;
		description: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isActive: boolean;
		maxReward: number;
		type: string;
		startOn: Date | string;
		endOn: Date | string;
	}

	export interface CampaignAction {
		id: number;
		companyId: number;
		campaignId: number;
		actionId: number;
		createdOn: number;
		actionCount: number;
	}

	export interface Category {
		id: number;
		companyId: number;
		name: string;
		description: string;
		createdOn: Date | string;
		isActive: boolean;
		parentCategoryId: number;
	}

	export interface Cms {
		id: number;
		companyId: number;
		page: string;
		metaData: string;
	}

	export interface Company {
		id: number;
		name: string;
		squareLogoUrl: string;
		wideLogoUrl: string;
		website: string;
		description: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		hostname: string;
		vanityUrls: string;
		privacyPolicyUrl: string;
		termsConditionsUrl: string;
		returnPolicyUrl: string;
		address: string;
		city: string;
		state: string;
		zip: string;
		country: string;
	}

	export interface CompanyAffiliate {
		companyId: number;
		affiliateId: number;
		createdOn: Date | string;
	}

	export interface CompanyServiceKey {
		id: number;
		companyId: number;
		serviceType: string;
		serviceName: string;
		serviceKey: string;
	}

	export interface CompanyVariables {
		companyId: number;
	}

	export interface Destination {
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
		metaData: string;
		externalSystemId: string;
		modifiedOn: Date | string;
	}

	export interface EmailLog {
		id: number;
		companyId: number;
		initiatorId: number;
		recipientId: number;
		sentToEmail: string;
		sentFromEmail: string;
		sentOn: Date | string;
		html: string;
		subject: string;
	}

	export interface EmailTemplate {
		id: number;
		companyId: number;
		type: string;
		createdOn: Date | string;
		subject: string;
		design: string;
		html: string;
	}

	export interface MarketSegment {
		id: number;
		name: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isActive: boolean;
		code: string;
	}

	export interface MediaUrls {
		thumb: string;
		smallSmall: string;
		small: string;
		mediumSmall: string;
		medium: string;
		large: string;
	}

	export interface StorageDetails {
		storageType: 'backblaze';
	}

	export interface BackblazeStorageDetails extends StorageDetails {
		fileId: string;
		filePath: string;
	}

	export interface Media {
		id: number;
		uploaderId: number;
		type: 'image' | 'video' | 'imagePyramid';
		urls: MediaUrls;
		storageDetails: BackblazeStorageDetails[];
	}

	export interface MediaMap {
		mediaId: number;
		productId: number;
		cmsId: number;
		destinationId: number;
		accommodationId: number;
	}

	export interface OrderProduct {
		id: number;
		productId: number;
		orderId: number;
		companyId: number;
		userId: number;
		quantity: number;
		status: string;
		type: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface Orders {
		id: number;
		companyId: number;
		userId: number;
		paymentMethodId: number;
		number: number;
		status: string;
		type: string;
		totalPriceCents: number;
		subTotalPriceCents: number;
		taxPriceCents: number;
		shippingPriceCents: number;
		discountPriceCents: number;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface PaymentMethod {
		id: number;
		userId: number;
		userAddressId: number;
		createdOn: Date | string;
		modifiedOn: Date | string;
		paymentToken: string;
		paymentCardType: string;
		paymentLast4: number;
		paymentExpiration: string;
		paymentCardName: string;
		paymentGateway: string;
		isDeleted: boolean;
		isPrimary: boolean;
		metaData: string;
	}

	export interface PointRedemption {
		id: number;
		companyId: number;
		userId: number;
		productId: number;
		userAddressId: number;
		status: string;
		type: string;
		pointPrice: number;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface Product {
		id: number;
		companyId: number;
		name: string;
		shortDescription: string;
		longDescription: string;
		priceCents: number;
		isActive: boolean;
		createdOn: Date | string;
		modifiedOn: Date | string;
		sku: string;
		upc: number;
		reviewScore: number;
		reviewCount: number;
		type: string;
		pointPrice: number;
		pointValue: number;
	}

	export interface ProductCategory {
		productId: number;
		categoryId: number;
		createdOn: Date | string;
	}

	export interface ProductDestination {
		productId: number;
		destinationId: number;
		quantityAvailable: number;
		quantitySold: number;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface ReportTemplate {
		id: number;
		companyId: number;
		name: string;
		description: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface Reservation {
		id: number;
		companyId: number;
		userId: number;
		destinationId: number;
		accommodationId: number;
		bookingSourceId: number;
		marketSegmentId: number;
		orderId: number;
		reservationNumber: string;
		arrivalDate: Date | string;
		departureDate: Date | string;
		status: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		canceledOn: Date | string;
		externalReservationNumber: string;
		cancelNumber: string;
		externalCancelNumber: string;
		adultCount: number;
		childCount: number;
		infantCount: number;
		confirmationDate: Date | string;
		nightCount: number;
	}

	export interface Review {
		id: number;
		companyId: number;
		userId: number;
		source: string;
		sourceId: number;
		message: string;
		score: number;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isVerified: boolean;
		verifyUserId: number;
		verifiedOn: Date | string;
		status: string;
	}

	export interface Segment {
		id: number;
		companyId: number;
		tierId: number;
		name: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		description: string;
		isActive: boolean;
		ageMin: number;
		ageMax: number;
		spendMin: number;
		spendMax: number;
	}

	export interface SystemActionLog {
		id: number;
		companyId: number;
		userId: number;
		action: string;
		source: string;
		sourceId: number;
		createdOn: Date | string;
		metaData: string;
	}

	export interface Tier {
		id: number;
		companyId: number;
		name: string;
		description: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isActive: boolean;
		accrualRate: number;
		threshold: number;
		features: string;
	}

	export interface User {
		id: number;
		companyId: number;
		tierId: number;
		firstName: string;
		lastName: string;
		primaryEmail: string;
		accountNumber: string;
		phone: string;
		notes: string;
		password: string;
		token: string;
		resetPasswordOnLogin: Boolean | number;
		role: UserRoleType;
		permissionLogin: boolean;
		createdOn: Date | string;
		modifiedOn: Date | string;
		joinedOn: Date | string;
		birthDate: Date | string;
		lastLoginOn: Date | string;
		passwordResetGuid: string;
		passwordResetExpiresOn: Date | string;
		gender: 'male' | 'female' | 'other';
		ethnicity: string;
		inactiveAfterDate: Date | string;
	}

	export interface UserAction {
		id: number;
		userId: number;
		campaignActionId: number;
		createdOn: Date | string;
	}

	export interface UserAddress {
		id: number;
		userId: number;
		type: string;
		address1: string;
		address2: string;
		city: string;
		state: string;
		zip: string;
		country: string;
		default: boolean;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface UserCoupon {
		id: number;
		companyId: number;
		userId: number;
		name: string;
		isActive: boolean;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface UserPermission {
		userId: number;
		key: string;
		read: boolean | number;
		write: boolean | number;
	}

	export interface UserPoint {
		id: number;
		userId: number;
		campaignActionId: number;
		createdOn: Date | string;
		type: string;
		value: number;
	}

	export interface UserSegment {
		id: number;
		userId: number;
		createdOn: Date | string;
	}

	export interface UserSocialMedia {
		id: number;
		userId: number;
		serviceName: string;
		details: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}
}
