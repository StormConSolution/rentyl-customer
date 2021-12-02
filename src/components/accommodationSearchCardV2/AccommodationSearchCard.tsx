import * as React from 'react';
import { Box } from '@bit/redsky.framework.rs.996';
import AccommodationSearchCardMobile from './accommodationSearchCardMobile/AccommodationSearchCardMobile';
import AccommodationSearchCardResponsive from './accommodationSearchCardResponsive/AccommodationSearchCardResponsive';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface AccommodationSearchCardProps {
	accommodation: Api.Destination.Res.Accommodation;
	destinationId: number;
	openAccordion?: boolean;
	showInfoIcon?: boolean;
	onClickInfoIcon?: () => void;
}

const AccommodationSearchCard: React.FC<AccommodationSearchCardProps> = (props) => {
	const size = useWindowResizeChange();

	return (
		<Box className={'rsAccommodationSearchCard'}>
			{size === 'small' ? (
				<AccommodationSearchCardMobile
					accommodation={props.accommodation}
					destinationId={props.destinationId}
					openAccordion={props.openAccordion}
					showInfoIcon={props.showInfoIcon}
					onClickInfoIcon={props.onClickInfoIcon}
				/>
			) : (
				<AccommodationSearchCardResponsive
					accommodation={props.accommodation}
					destinationId={props.destinationId}
					openAccordion={props.openAccordion}
					showInfoIcon={props.showInfoIcon}
					onClickInfoIcon={props.onClickInfoIcon}
				/>
			)}
		</Box>
	);
};

export default AccommodationSearchCard;
