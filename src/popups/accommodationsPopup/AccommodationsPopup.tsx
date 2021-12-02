import * as React from 'react';
import './AccommodationsPopup.scss';
import { Box, Popup, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import AccommodationSearchCard from '../../components/accommodationSearchCardV2/AccommodationSearchCard';

export interface AccommodationsPopupProps extends PopupProps {
	propertyTypeName: string;
	destinationId: number;
	destinationName: string;
	accommodations: Api.Destination.Res.Accommodation[];
}

const AccommodationsPopup: React.FC<AccommodationsPopupProps> = (props) => {
	function renderAccommodations() {
		return (
			<Box className={'accommodationCards'}>
				{props.accommodations.map((accommodation) => {
					return (
						<AccommodationSearchCard
							key={accommodation.id}
							accommodation={accommodation}
							destinationId={props.destinationId}
						/>
					);
				})}
			</Box>
		);
	}

	return (
		<Popup opened={props.opened} className={'rsAccommodationsPopup'}>
			<Paper className={'accommodationCardsContainer'}>
				<Box className={'titleContainer'}>
					<Label variant={'accommodationModalCustomOne'}>
						{props.destinationName} - {props.propertyTypeName}
					</Label>
					<Icon
						className={'closeIcon'}
						iconImg={'icon-close'}
						size={30}
						onClick={() => {
							popupController.close(AccommodationsPopup);
						}}
					/>
				</Box>
				{renderAccommodations()}
			</Paper>
		</Popup>
	);
};

export default AccommodationsPopup;
