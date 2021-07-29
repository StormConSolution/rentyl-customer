declare namespace Model {
	export type InternalResourceTypes = 'ANDROID' | 'IOS' | 'WEB';
	export type ServiceKeyType = 'DESTINATION' | 'RESERVATION' | 'PAYMENT' | 'OFFSITE_LOYALTY';
	export type AccommodationTypes = 'HOTEL' | 'RENTAL';
	export type AccommodationStatusType = 'ACTIVE' | 'INACTIVE' | 'DELETED';
	export type AccommodationRoomClassType = 'Deluxe';
	export type UserAddressType = 'SHIPPING' | 'BILLING' | 'BOTH';
	export type UserAccessScopeTypes =
		| 'USER'
		| 'POINTS'
		| 'TEST'
		| 'USER_POINTS'
		| 'LOYALTY_CAMPAIGNS'
		| 'LOYALTY_REWARDS'
		| 'ADMINISTRATION'
		| 'MEDIA_ACCESS'
		| 'ORDERS'
		| 'ANALYTICS'
		| 'REAL_ESTATE';
	export type SystemActionLogActions =
		| 'CREATE'
		| 'DELETE'
		| 'UPDATE'
		| 'POINT_ADJUSTMENT'
		| 'TRIGGER'
		| 'CAMPAIGN_CONSOLIDATION';
	export type PointTypes = 'ACTION' | 'CAMPAIGN' | 'ADMIN' | 'ORDER' | 'BOOKING' | 'RENTAL' | 'VACATION' | 'VOUCHER';
	export type UserPointStatusTypes = 'PENDING' | 'RECEIVED' | 'REVOKED' | 'EXPIRED' | 'REDEEMED' | 'CANCELED';
	export type PointReason =
		| 'TECHNICAL_ERROR'
		| 'HOTEL_STAY'
		| 'RETAIL_TRANSACTION'
		| 'RESTAURANT_TRANSACTION'
		| 'GOODWILL'
		| 'VOUCHER_CLAIM'
		| 'CAMPAIGN_ACTION'
		| 'TRANSACTION_REFUND';
	export type DestinationPolicyType = 'CheckIn' | 'CheckOut' | 'Cancellation';
	export type PaymentSystemProviders = 'adyen' | 'spreedly' | 'mock';
	export type OffsiteLoyaltySystemProviders = 'fidel';

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
		bedDetails: AccommodationBedDetails[];
		extraBeds: boolean | number;
		extraBedPriceCents: number;
		adaCompliant: 0 | 1;
		heroUrl: string;
		size: string; // of type {max: number; min: number; units: string}
	}

	export interface AccommodationBedDetails {
		type: string;
		isPrimary: boolean | number;
		qty: number;
		description: string;
	}

	export interface AccommodationCategory {
		id: number;
		companyId: number;
		accommodationId: number;
		title: string;
		description: string;
	}

	export interface AccommodationLayout {
		id: number;
		companyId: number;
		accommodationId: number;
		title: string;
		mediaId: number;
	}

	export interface AccommodationLayoutRoom {
		id: number;
		companyId: number;
		accommodationLayoutId: number;
		title: string;
		description: string;
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
		isActive: 0 | 1;
		type: AccommodationTypes;
		metaData: string;
		externalSystemId: string;
	}

	export interface Action {
		id: number;
		companyId: number;
		affiliateId: number;
		affiliateLocationId: number;
		name: string;
		description: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isActive: 0 | 1;
		type: string;
		pointValue: number;
	}

	export interface Affiliate {
		id: number;
		companyId: number;
		name: string;
		squareLogoUrl: string;
		wideLogoUrl: string;
		website: string;
		description: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		externalId: string;
		metaData: any;
	}

	export interface AffiliateLocation {
		id: number;
		affiliateId: number;
		name: string;
		address1: string;
		address2: string;
		city: string;
		state: string;
		zip: string;
		country: string;
		isActive: 0 | 1;
		externalId: string;
		metaData: any;
	}

	export interface BookingSource {
		id: number;
		name: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isActive: 0 | 1;
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
		isActive: 0 | 1;
		maxReward: number;
		type: string;
		startOn: Date | string;
		endOn: Date | string;
		pointValueMultiplier: number;
		activityReferenceNumber: string;
	}

	export interface CampaignAction {
		id: number;
		companyId: number;
		campaignId: number;
		actionId: number;
		createdOn: Date | string;
		actionCount: number;
		isActive: 0 | 1;
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

	export interface CompanyGateway {
		id: number;
		companyId: number;
		name: string;
		token: string;
		apiToken: string;
		metaData: any;
		publicData: any;
		isActive: 0 | 1;
		isPrimary: 0 | 1;
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
		ap2FactorLoginTimeoutDays: number;
		ap2FactorLoginVerificationTimeoutHours: number;
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
		logoUrl: string;
		heroUrl: string;
		metaData: string;
		externalSystemId: string;
		modifiedOn: Date | string;
		chainId: number;
	}

	export type DestinationPolicy = {
		destinationId: number;
		companyId: number;
		value: string;
		policyType: DestinationPolicyType;
		modifiedOn: Date | string;
	};

	export interface DestinationTax {
		destinationId: number;
		companyId: number;
		code: string;
		name: string;
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

	export interface Feature {
		id: number;
		companyId: number;
		affiliateId: number;
		destinationId: number;
		accommodationId: number;
		accommodationCategoryId: number;
		title: string;
		description: string;
		icon: string;
		isActive: 0 | 1;
		isCarousel: 0 | 1;
	}

	export interface MarketSegment {
		id: number;
		name: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isActive: 0 | 1;
		code: string;
	}

	export interface MediaUrls {
		thumb: string;
		small: string;
		large: string;
	}

	export interface StorageDetails {
		storageType: 'backblaze' | 's3';
		filePath: string;
	}

	export interface BackblazeStorageDetails extends StorageDetails {
		fileId: string;
	}

	export interface S3StorageDetails extends StorageDetails {
		bucketId: string;
	}

	export interface Media {
		id: number;
		companyId: number;
		uploaderId: number;
		type: 'image' | 'video' | 'imagePyramid';
		urls: MediaUrls;
		storageDetails: BackblazeStorageDetails[] | S3StorageDetails[];
		title: string;
		description: string;
		isPrimary: 0 | 1;
	}

	export interface MediaMap {
		mediaId: number;
		accommodationId: number;
		accommodationCategoryId: number;
		accommodationLayoutId: number;
		destinationId: number;
		featureId: number;
		packagesId: number;
		rewardId: number;
		rewardCategoryId: number;
		tierId: number;
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

	export interface Packages {
		id: number;
		companyId: number;
		destinationId: number;
		title: string;
		description: string;
		code: string;
		isActive: 0 | 1;
		startDate: Date | string;
		endDate: Date | string;
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
		isDeleted: 0 | 1;
		isPrimary: 0 | 1;
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
		guestFirstName: string;
		guestLastName: string;
		guestPhone: string;
		guestEmail: string;
		rateCode: string;
		bookingSourceId: number;
		marketSegmentId: number;
		orderId: number;
		userPaymentMethodId: number;
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
		priceDetail: string | null;
		nightCount: number;
		metaData: any;
		externalConfirmationId: string;
		confirmationCode: string;
		itineraryNumber: string;
		cancellationPermitted: 0 | 1;
		parentReservationId: number;
		externalReservationId: string;
		externalCancellationId: string;
		itineraryId: string;
		additionalDetails: string;
	}

	export interface ReservationUpsellPackage {
		reservationId: number;
		upsellPackageId: number;
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
		isVerified: 0 | 1;
		verifyUserId: number;
		verifiedOn: Date | string;
		status: string;
	}

	export interface Reward {
		id: number;
		companyId: number;
		destinationId: number | null;
		affiliateId: number | null;
		name: string;
		pointCost: number;
		monetaryValueInCents: number;
		description: string;
		upc: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		isActive: 0 | 1;
	}

	export interface RewardCategory {
		id: number;
		companyId: number;
		name: string;
		isActive: 0 | 1;
		isFeatured: 0 | 1;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface RewardCategoryMap {
		rewardId: number;
		categoryId: number;
		companyId: number;
	}

	export interface RewardVoucher {
		id: number;
		rewardId: number;
		companyId: number;
		customerUserId: number;
		code: string;
		isActive: 0 | 1;
		isRedeemed: 0 | 1;
		createdOn: Date | string;
		modifiedOn: Date | string;
		redeemedOn: Date | string;
	}

	export interface Segment {
		id: number;
		companyId: number;
		tierId: number;
		name: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		description: string;
		isActive: 0 | 1;
		ageMin: number;
		ageMax: number;
		spendMin: number;
		spendMax: number;
	}

	export interface SystemActionLog {
		id: number;
		companyId: number;
		userId: number;
		action: SystemActionLogActions;
		source: string; // should be a DbTableName
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
		isActive: 0 | 1;
		accrualRate: number;
		threshold: number;
		isAnnualRate: 0 | 1;
	}

	export interface TierFeature {
		id: number;
		companyId: number;
		name: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface TierFeatureMap {
		tierId: number;
		TierFeatureId: number;
	}

	export interface User {
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
		password: string;
		token: string;
		resetPasswordOnLogin: 0 | 1;
		permissionLogin: 0 | 1;
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
		lifeTimePoints: number;
		availablePoints: number;
		loginExpiresOn: Date | string;
		loginVerificationExpiresOn: Date | string;
		loginVerificationGuid: string;
	}

	export interface UserAction {
		id: number;
		userId: number;
		campaignActionId: number;
		hasAwarded: 0 | 1;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface UserAddress {
		id: number;
		userId: number;
		name: string;
		type: UserAddressType;
		address1: string;
		address2: string;
		city: string;
		state: string;
		zip: string;
		country: string;
		isDefault: 1 | 0;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface UserCoupon {
		id: number;
		companyId: number;
		userId: number;
		name: string;
		isActive: 0 | 1;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface UserPaymentMethod {
		id: number;
		companyId: number;
		userId: number;
		userAddressId: number;
		token: string;
		nameOnCard: string;
		type: string;
		last4: number;
		expirationMonth: number;
		expirationYear: number;
		cardNumber: string;
		isPrimary: 0 | 1;
		createdOn: Date | string;
		systemProvider: PaymentSystemProviders;
		metaData: any;
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
		userActionId: number;
		orderId: number;
		reservationId: number;
		rewardVoucherId: number;
		campaignActionId: number;
		description: string;
		status: UserPointStatusTypes;
		pointType: PointTypes;
		pointAmount: number;
		reason: PointReason;
		notes: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		availableOn: Date | string;
		expireOn: Date | string;
	}

	export interface UserRole {
		id: number;
		companyId: number;
		name: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
		accessScope: UserRoleAccessScope[];
		isAdmin: 1 | 0;
		isCustomer: 1 | 0;
	}

	export interface UserRoleAccessScope {
		accessScope: UserAccessScopeTypes;
		read: 1 | 0;
		write: 1 | 0;
	}

	export interface UserSegment {
		id: number;
		userId: number;
		createdOn: Date | string;
	}

	export interface UserSetting {
		id: number;
		userId: number;
		allowNewsLetter: 0 | 1;
		allowEmailNotification: 0 | 1;
	}

	export interface UserSocialMedia {
		id: number;
		userId: number;
		serviceName: string;
		details: string;
		createdOn: Date | string;
		modifiedOn: Date | string;
	}

	export interface UserTier {
		id: number;
		userId: number;
		tierId: number;
		createdOn: Date | string;
		expiresOn: Date | string;
	}

	export interface Vendor {
		destinationId: number;
		affiliateId: number;
		name: string;
		companyId: number;
	}
}
