import * as React from 'react';
import './ItineraryCard.scss';
import ItineraryCardResponsive from './itineraryCardResponsive/ItineraryCardResponsive';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ItineraryCardMobile from './itineraryCardMobile/ItineraryCardMobile';

interface ReservationCardProps {
	imgPaths: string[];
	logo: string;
	title: string;
	address: string;
	reservationDates: { startDate: string | Date; endDate: string | Date };
	propertyType: string;
	itineraryId: string;
	maxOccupancy: number;
	amenities: string[];
	totalPoints: number;
	linkPath: string;
	cancelPermitted: 0 | 1;
	itineraryTotal: number;
	paidWithPoints: boolean;
}

const ItineraryCard: React.FC<ReservationCardProps> = (props) => {
	const size = useWindowResizeChange();
	return size === 'small' ? (
		<ItineraryCardMobile
			imgPaths={props.imgPaths}
			logo={props.logo}
			title={props.title}
			address={props.address}
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
	) : (
		<ItineraryCardResponsive
			imgPaths={props.imgPaths}
			logo={props.logo}
			title={props.title}
			address={props.address}
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
