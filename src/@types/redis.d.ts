declare namespace Redis {
	export interface AvailabilityAccommodation {
		id: number;
		name: string;
		code: string;
		status: string;
		maxOccupancy: number;
		maxSleeps: number;
		roomClass: string;
		adaCompliant: number;
		price: {
			total: number;
			currencyCode: string;
			qtyAvailable: number;
			rate: string;
			maxPrice: boolean;
			minPrice: boolean;
		}[];
	}
	export interface Availability {
		destinationId: number;
		accommodations: AvailabilityAccommodation[];
	}
}
