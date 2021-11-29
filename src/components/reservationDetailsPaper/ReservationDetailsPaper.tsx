import * as React from 'react';
import './ReservationDetailsPaper.scss';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Img from '@bit/redsky.framework.rs.img';
import { Box } from '@bit/redsky.framework.rs.996';
import IconLabel from '../iconLabel/IconLabel';
import TitleDescription from '../titleDescription/TitleDescription';
import { DateUtils, ObjectUtils, StringUtils } from '../../utils/utils';

interface ReservationDetailsPaperProps {
	reservationData: Api.Reservation.Res.Get;
}

const ReservationDetailsPaper: React.FC<ReservationDetailsPaperProps> = (props) => {
	function renderAddress() {
		let destination = props.reservationData.destination;
		return `${destination.address1} ${destination.address2 || ''} ${destination.city}, ${destination.state} ${
			destination.zip
		}`;
	}

	function renderGuestInfo() {
		let guest = props.reservationData.guest;
		return (
			<React.Fragment>
				<TitleDescription title={'Primary guest name'} description={`${guest.firstName} ${guest.lastName}`} />
				<TitleDescription title={'Email'} description={guest.email} />
				<TitleDescription title={'Phone'} description={StringUtils.formatPhoneNumber(guest.phone)} />
			</React.Fragment>
		);
	}

	function renderReservationDetails() {
		let reservation = props.reservationData;
		console.log(reservation.arrivalDate);
		return (
			<React.Fragment>
				<TitleDescription title={'Reservation name'} description={reservation.accommodation.name} />
				<TitleDescription
					title={'Reservation date'}
					description={`${DateUtils.displayUserDate(
						reservation.arrivalDate,
						'ddd MMM d YYYY'
					)} - ${DateUtils.displayUserDate(reservation.departureDate, 'ddd MMM d YYYY')}`}
				/>
				<TitleDescription title={'Itinerary number'} description={reservation.itineraryId} />
			</React.Fragment>
		);
	}

	function renderAccommodationDetails() {
		let accommodation = props.reservationData.accommodation;
		return (
			<React.Fragment>
				<TitleDescription title={'Max occupancy'} description={accommodation.maxOccupantCount} />
				<TitleDescription title={'Sleeps'} description={accommodation.maxSleeps} />
				<TitleDescription title={'Property type'} description={accommodation.propertyType} />
				<TitleDescription title={'Ada compliant'} description={accommodation.adaCompliant ? 'Yes' : 'No'} />
				<TitleDescription title={'Extra bed'} description={accommodation.maxOccupantCount} />
				<TitleDescription title={'Floor Count'} description={accommodation.floorCount} />
			</React.Fragment>
		);
	}

	function renderAmenities() {
		let amenities = props.reservationData.destination;
		return '';
	}

	return (
		<Paper borderRadius={'20px'} boxShadow className={'rsReservationDetailsPaper'}>
			<Label variant={'reservationDetailsPaperCustomOne'}>Itinerary Details</Label>
			<Img src={props.reservationData.destination.heroUrl} alt={'Destination Hero'} width={980} height={470} />
			<Box display={'flex'} alignItems={'center'} mb={40} mt={25}>
				<Label variant={'reservationDetailsPaperCustomTwo'} mr={30}>
					{props.reservationData.destination.name}
				</Label>
				<IconLabel
					iconImg={'icon-pin'}
					iconPosition={'left'}
					labelName={renderAddress()}
					labelVariant={'reservationDetailsPaperCustomThree'}
					iconSize={13}
				/>
			</Box>
			<div className={'infoSection'}>
				{renderGuestInfo()}
				{renderReservationDetails()}
				{renderAccommodationDetails()}
				<TitleDescription title={'Amenities'} description={renderAmenities()} />
			</div>
		</Paper>
	);
};

export default ReservationDetailsPaper;
