import React from 'react';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';

interface BookingAvailabilityProps {
	destinationId: number;
}
const BookingAvailability: React.FC<BookingAvailabilityProps> = (props) => {
	function renderAvailableAccommodations() {
		return (
			<Box>
				<Box display={'flex'}></Box>
			</Box>
		);
	}

	function renderAccommodationSearch() {
		return (
			<Box>
				<Box display={'flex'}>
					<Label variant={'body1'}>View Results by</Label>
					<Label variant={'body1'}>Sort by</Label>
					<Label variant={'body1'}>Show Filters</Label>
				</Box>
				{renderAvailableAccommodations()}
			</Box>
		);
	}
	return <></>;
};

export default BookingAvailability;
