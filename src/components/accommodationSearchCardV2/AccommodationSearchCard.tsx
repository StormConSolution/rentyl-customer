import * as React from 'react';
import { Box } from '@bit/redsky.framework.rs.996';
import AccommodationSearchCardMobile from './accommodationSearchCardMobile/AccommodationSearchCardMobile';
import AccommodationSearchCardResponsive from './accommodationSearchCardResponsive/AccommodationSearchCardResponsive';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { useEffect, useState } from 'react';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';

interface AccommodationSearchCardProps {
	accommodation: Api.Destination.Res.Accommodation;
	destinationId: number;
	openAccordion?: boolean;
	showInfoIcon?: boolean;
	onClickInfoIcon?: (accommodationId: number) => void;
	pointsEarnable: number;
}

const AccommodationSearchCard: React.FC<AccommodationSearchCardProps> = (props) => {
	const size = useWindowResizeChange();
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const [loyaltyStatus, setLoyaltyStatus] = useState<Model.LoyaltyStatus>('PENDING');

	useEffect(() => {
		async function getDestination() {
			try {
				const res = await destinationService.getDestinationById({ id: props.destinationId });
				setLoyaltyStatus(res.loyaltyStatus);
			} catch (e) {
				console.error(e);
			}
		}
		getDestination().catch(console.error);
	}, []);

	return (
		<Box className={'rsAccommodationSearchCard'}>
			{size === 'small' ? (
				<AccommodationSearchCardMobile
					accommodation={props.accommodation}
					destinationId={props.destinationId}
					openAccordion={props.openAccordion}
					showInfoIcon={props.showInfoIcon}
					onClickInfoIcon={props.onClickInfoIcon}
					pointsEarnable={props.pointsEarnable}
					loyaltyStatus={loyaltyStatus}
				/>
			) : (
				<AccommodationSearchCardResponsive
					accommodation={props.accommodation}
					destinationId={props.destinationId}
					openAccordion={props.openAccordion}
					showInfoIcon={props.showInfoIcon}
					onClickInfoIcon={props.onClickInfoIcon}
					pointsEarnable={props.pointsEarnable}
					loyaltyStatus={loyaltyStatus}
				/>
			)}
		</Box>
	);
};

export default AccommodationSearchCard;
