import React, { useEffect, useState } from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { DestinationSummaryTab } from '../tabbedDestinationSummary/TabbedDestinationSummary';
import DestinationSearchResultCardMobile from './destinationSearchResultCardMobile/DestinationSearchResultCardMobile';
import DestinationSearchResultCardResponsive from './destinationSearchResultCardResponsive/DestinationSearchResultCardResponsive';
import { ObjectUtils } from '../../utils/utils';

export interface DestinationSearchResultCardProps {
	className?: string;
	destinationName: string;
	destinationDescription: string;
	destinationFeatures: {
		id: number;
		title: string;
		icon: string;
	}[];
	address: string;
	picturePaths: string[];
	destinationDetailsPath: string;
	summaryTabs: DestinationSummaryTab[];
	onAddCompareClick?: () => void;
}

const DestinationSearchResultCard: React.FC<DestinationSearchResultCardProps> = (props) => {
	const size = useWindowResizeChange();
	const [lowestPrice, setLowestPrice] = useState<{ pricePoints: number; priceCents: number }>();

	useEffect(() => {
		let newLowPrice: { pricePoints: number; priceCents: number } = { pricePoints: 0, priceCents: 0 };
		props.summaryTabs.map((accommodationList) => {
			if (ObjectUtils.isArrayWithData(accommodationList.content.accommodations)) {
				return accommodationList.content.accommodations.map((accommodation) => {
					if (ObjectUtils.isArrayWithData(accommodation.prices)) {
						accommodation.prices.map((price) => {
							if (!newLowPrice.priceCents || newLowPrice.priceCents >= price.priceCents) {
								newLowPrice = { pricePoints: price.pricePoints, priceCents: price.priceCents };
							}
						});
					}
				});
			}
		});
		setLowestPrice(newLowPrice);
	}, [props.summaryTabs]);

	return size === 'small' ? (
		<DestinationSearchResultCardMobile
			destinationName={props.destinationName}
			address={props.address}
			picturePaths={props.picturePaths}
			destinationDetailsPath={props.destinationDetailsPath}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
		/>
	) : (
		<DestinationSearchResultCardResponsive
			destinationName={props.destinationName}
			destinationDescription={props.destinationDescription}
			destinationFeatures={props.destinationFeatures}
			address={props.address}
			picturePaths={props.picturePaths}
			destinationDetailsPath={props.destinationDetailsPath}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
		/>
	);
};

export default DestinationSearchResultCard;
