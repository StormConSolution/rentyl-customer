import React from 'react';
import Box from '../../../components/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import '@bit/redsky.framework.rs.996';
import BookingCartTotalsCard from '../bookingCartTotalsCard/BookingCartTotalsCard';

interface Stay extends Omit<Api.Reservation.Req.Itinerary.Stay, 'numberOfAccommodations'> {
	accommodationName: string;
	prices: Api.Reservation.PriceDetail;
	checkInTime: string;
	checkoutTime: string;
}
interface AccommodationDetailsProps {
	room: number;
	accommodation: Stay;
}

const AccommodationDetails: React.FC<AccommodationDetailsProps> = (props) => {
	return <Box></Box>;
};
export default AccommodationDetails;
