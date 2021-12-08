declare namespace Misc {
	export type Variant =
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'sectionHeader'
		| 'title'
		| 'subtitle1'
		| 'subtitle2'
		| 'body1'
		| 'body2'
		| 'caption'
		| 'button'
		| 'overline'
		| 'srOnly'
		| 'inherit'
		| 'error'
		| string;

	export interface FeaturedCategory {
		categoryId: number;
		imagePath: string;
		name: string;
	}

	export interface AccommodationFeatures {
		id: number;
		title: string;
		icon: string;
	}

	export interface RedeemableRewards {
		allCategories: Api.Reward.Category.Res.Get[];
		featuredCategories: FeaturedCategory[];
		destinationSelect: SelectOptions[];
	}

	export interface SelectOptions {
		value: number | string;
		text: number | string;
		selected: boolean;
	}

	export interface OptionType {
		value: string | number;
		label: string | number;
	}
	export interface GroupType {
		label: string;
		options: OptionType[];
	}

	export interface ReservationContactInfoDetails {
		contactInfo: string;
		email: string;
		phone: string;
		additionalDetails: string;
	}

	export interface BookingParams {
		destinationId: number;
		stays: StayParams[];
		newRoom?: StayParams;
		editUuid?: number;
	}

	export interface StayParams {
		uuid: number;
		adults: number;
		children: number;
		accommodationId: number;
		arrivalDate: string;
		departureDate: string;
		packages: number[];
		rateCode: string;
	}

	export interface DateRange {
		startDate: string;
		endDate: string;
	}

	export interface ComparisonCardInfo {
		destinationId: number;
		accommodationOptions: Misc.OptionType[];
		selectedAccommodationId: number;
		logo: string;
		title: string;
	}
	export interface ComparisonState {
		destinationDetails: ComparisonCardInfo[];
		showCompareButton: boolean;
	}

	export interface FilterFormPopupOptions {
		regionIds: number[];
		propertyTypeIds: number[];
		adultCount: number;
		childCount: number;
		priceRangeMax: string;
		priceRangeMin: string;
		rateCode: string;
	}

	interface IBaseCountry {
		name: string;
		isoCode: string;
	}

	export interface ReservationFilters extends Api.AvailabilityFilter {
		redeemPoints: boolean;
		regionIds?: number[];
		destinationId?: number;
		accommodationId?: number;
	}

	export interface Pricing {
		priceCents: number;
		pricePoints: number;
		quantityAvailable: number;
		rate: Api.Destination.Res.Rate;
		minStay: number;
	}

	export interface ImageTabProp {
		name: string;
		title: string;
		imagePath: string;
		description: string;
		buttonLabel?: string;
		otherMedia: Api.Media[];
	}
}
