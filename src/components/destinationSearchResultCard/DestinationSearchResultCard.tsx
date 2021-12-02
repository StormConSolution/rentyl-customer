import React from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import DestinationSearchResultCardMobile from './destinationSearchResultCardMobile/DestinationSearchResultCardMobile';
import DestinationSearchResultCardResponsive from './destinationSearchResultCardResponsive/DestinationSearchResultCardResponsive';

export interface PropertyTypeObject {
	propertyTypeName: string;
	propertyTypeId: number;
	destinationId: number;
	destinationName: string;
	accommodations: Api.Destination.Res.Accommodation[];
}

export interface DestinationSearchResultCardProps {
	className?: string;
	destinationObj: Api.Destination.Res.Availability;
	picturePaths: string[];
	onAddCompareClick?: () => void;
	onRemoveCompareClick?: () => void;
	onGalleryClick: () => void;
}

const DestinationSearchResultCard: React.FC<DestinationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();

	return size === 'small' ? (
		<DestinationSearchResultCardMobile
			destinationObj={props.destinationObj}
			picturePaths={props.picturePaths}
			onAddCompareClick={props.onAddCompareClick}
			onRemoveCompareClick={props.onRemoveCompareClick}
			onGalleryClick={props.onGalleryClick}
		/>
	) : (
		<DestinationSearchResultCardResponsive
			destinationObj={props.destinationObj}
			picturePaths={props.picturePaths}
			onAddCompareClick={props.onAddCompareClick}
			onRemoveCompareClick={props.onRemoveCompareClick}
			onGalleryClick={props.onGalleryClick}
		/>
	);
};

export default DestinationSearchResultCard;
