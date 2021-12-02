import * as React from 'react';
import './ItineraryCard.scss';
import ItineraryCardResponsive from './itineraryCardResponsive/ItineraryCardResponsive';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ItineraryCardMobile from './itineraryCardMobile/ItineraryCardMobile';
import Media = Api.Media;

interface ReservationCardProps {
	imgPaths: string[];
	logo: string;
	title: string;
	address: string;
	reservationDates: { startDate: string | Date; endDate: string | Date };
	destinationExperiences: {
		id: number;
		title: string;
		icon: string;
		description: string;
		isHighlighted: 0 | 1;
		media: Media[];
	}[];
	propertyType: string;
	itineraryId: string;
	maxOccupancy: number;
	amenities: string[];
	totalPoints: number;
	linkPath: string;
	cancelPermitted: 0 | 1;
	itineraryTotal: number;
	paidWithPoints: boolean;
	city: string;
	state: string;
}

const ItineraryCard: React.FC<ReservationCardProps> = (props) => {
	const size = useWindowResizeChange();
	return size === 'small' ? (
		<ItineraryCardMobile
			imgPaths={props.imgPaths}
			logo={props.logo}
			title={props.title}
			reservationDates={props.reservationDates}
			propertyType={props.propertyType}
			itineraryId={props.itineraryId}
			maxOccupancy={props.maxOccupancy}
			amenities={props.amenities}
			totalPoints={props.totalPoints}
			linkPath={props.linkPath}
			cancelPermitted={props.cancelPermitted}
			itineraryTotal={props.itineraryTotal}
			paidWithPoints={props.paidWithPoints}
			city={props.city}
			state={props.state}
		/>
	) : (
		<ItineraryCardResponsive
			imgPaths={props.imgPaths}
			title={props.title}
			address={props.address}
			destinationExperiences={props.destinationExperiences}
			reservationDates={props.reservationDates}
			propertyType={props.propertyType}
			itineraryId={props.itineraryId}
			maxOccupancy={props.maxOccupancy}
			amenities={props.amenities}
			totalPoints={props.totalPoints}
			linkPath={props.linkPath}
			cancelPermitted={props.cancelPermitted}
			itineraryTotal={props.itineraryTotal}
			paidWithPoints={props.paidWithPoints}
		/>
	);
};

export default ItineraryCard;
