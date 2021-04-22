export namespace Booking {
	export interface BookingPackageDetails extends Api.Package.Details {
		priceCents: number;
	}
	export interface Policies {
		guaranteePolicy: string;
		cancelPolicy: string;
	}

	export namespace Req {
		export interface details {
			startDate: string;
			endDate: string;
			adults: number;
			children: number;
			accommodationId: number;
		}
	}
	export namespace Res {
		export interface Details {
			checkInTime: string;
			checkInDate: string;
			checkoutTime: string;
			checkoutDate: string;
			adults: number;
			children: number;
			costTotalCents: number;
			taxAndFees: { title: string; priceCents: number }[];
			costPerNight: { date: string; priceCents: number }[];
			accommodationName: string;
			destinationPackages: BookingPackageDetails[];
			policies: Policies;
		}
	}
}

export let FakeBookingData: Booking.Res.Details = {
	accommodationName: 'Deluxe Rooms: Two Queen',
	adults: 2,
	checkInDate: 'May 11, 2021',
	checkInTime: '4:00 pm',
	checkoutDate: 'May 21, 2021',
	checkoutTime: '11:00 am',
	children: 3,
	costPerNight: [
		{
			date: 'May 11, 2021',
			priceCents: 13392
		},
		{
			date: 'May 12, 2021',
			priceCents: 13392
		},
		{
			date: 'May 13, 2021',
			priceCents: 13392
		},
		{
			date: 'May 14, 2021',
			priceCents: 25128
		},
		{
			date: 'May 15, 2021',
			priceCents: 25128
		},
		{
			date: 'May 16, 2021',
			priceCents: 13392
		},
		{
			date: 'May 17, 2021',
			priceCents: 13392
		},
		{
			date: 'May 18, 2021',
			priceCents: 13392
		},
		{
			date: 'May 19, 2021',
			priceCents: 13392
		},
		{
			date: 'May 20, 2021',
			priceCents: 13392
		}
	],
	costTotalCents: 219500,
	destinationPackages: [
		{
			id: 1,
			companyId: 1,
			title: 'Spa day WOOT!',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias corporis deserunt	dolore facilis illo ipsum, labore maxime necessitatibus odit possimus provident quia quisquam repellat sit tempora totam, vitae voluptate voluptatum.Its a spa day',
			priceCents: 17900,
			code: '',
			media: [
				{
					id: 738,
					companyId: 1,
					uploaderId: 2,
					type: 'imagePyramid',
					urls: {
						thumb: 'https://spire-media-public.s3.us-east-2.amazonaws.com/images/1615825006466_T.jpg',
						small: 'https://spire-media-public.s3.us-east-2.amazonaws.com/images/1615825006466_S.jpg',
						large: 'https://spire-media-public.s3.us-east-2.amazonaws.com/images/1615825006466_L.jpg'
					},
					title: '',
					description: '',
					isPrimary: 1
				},
				{
					id: 738,
					uploaderId: 2,
					companyId: 1,
					type: 'imagePyramid',
					urls: {
						thumb: 'https://spire-media-public.s3.us-east-2.amazonaws.com/images/1615825006466_T.jpg',
						small: 'https://spire-media-public.s3.us-east-2.amazonaws.com/images/1615825006466_S.jpg',
						large: 'https://spire-media-public.s3.us-east-2.amazonaws.com/images/1615825006466_L.jpg'
					},
					title: '',
					description: '',
					isPrimary: 1
				}
			]
		}
	],
	taxAndFees: [
		{ title: 'Sales and Tourist Tax', priceCents: 21248 },
		{ title: 'Resort Fee', priceCents: 40860 }
	],
	policies: {
		guaranteePolicy: '10% of the total price is required at the time of booking to guarantee the reservation.',
		cancelPolicy:
			'Reservations for 4 to 8-Bedroom Homes must be canceled at least 15 days prior to arrival and 9 to 13-Bedroom Homes at least 31 days prior to arrival or guest will be charged for all nights of the reservation. Changes may be permitted based on availability.'
	}
};
