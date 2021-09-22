declare namespace Misc {
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
		rateCode?: string;
	}

	export interface DateRange {
		startDate: string;
		endDate: string;
	}

	export interface INavData {
		title: string;
		route: string;
		isSectionHeader: boolean;
		isSignedIn: boolean;
	}
}
