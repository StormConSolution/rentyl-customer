import React from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { DestinationSummaryTab } from '../tabbedDestinationSummary/TabbedDestinationSummary';
import DestinationSearchResultCardMobile from './destinationSearchResultCardMobile/DestinationSearchResultCardMobile';
import DestinationSearchResultCardResponsive from './destinationSearchResultCardResponsive/DestinationSearchResultCardResponsive';
import Media = Api.Media;

export interface PriceObject {
	priceCents: number;
	pricePoints: number;
	quantityAvailable: number;
	rateCode: string;
}

export interface DestinationSearchResultCardProps {
	className?: string;
	destinationId: number;
	destinationName: string;
	unfilteredAccommodations: Api.Destination.Res.Accommodation[];
	destinationDescription: string;
	destinationFeatures: {
		id: number;
		title: string;
		icon: string;
		description: string;
		isHighlighted: 0 | 1;
		media: Media[];
	}[];
	address: string;
	picturePaths: string[];
	summaryTabs: DestinationSummaryTab[];
	onAddCompareClick?: () => void;
}

const DestinationSearchResultCard: React.FC<DestinationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();

	function getLowestAccommodationPrice() {
		let arrayOfPrices: PriceObject[] | undefined = props.unfilteredAccommodations.map(
			(accommodation: Api.Destination.Res.Accommodation) => {
				return getLowestAccommodation(accommodation.prices);
			}
		);
		arrayOfPrices.sort((price1, price2) => price1.priceCents - price2.priceCents);
		return arrayOfPrices[0];
	}

	function getLowestAccommodation(rateCodes: PriceObject[]) {
		rateCodes.sort((code1, code2) => {
			return code1.priceCents - code2.priceCents;
		});
		return rateCodes[0];
	}

	return size === 'small' ? (
		<DestinationSearchResultCardMobile
			destinationId={props.destinationId}
			destinationName={props.destinationName}
			address={props.address}
			picturePaths={props.picturePaths}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
			getLowestAccommodationPrice={getLowestAccommodationPrice}
		/>
	) : (
		<DestinationSearchResultCardResponsive
			destinationId={props.destinationId}
			destinationName={props.destinationName}
			destinationDescription={props.destinationDescription}
			destinationFeatures={props.destinationFeatures}
			address={props.address}
			picturePaths={props.picturePaths}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
			getLowestAccommodationPrice={getLowestAccommodationPrice}
		/>
	);
};

export default DestinationSearchResultCard;
