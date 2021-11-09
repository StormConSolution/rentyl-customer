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

	function getAccommodationPrices(accommodationList: Api.Destination.Res.Accommodation[]) {
		let arrayOfPrices: any;
		accommodationList.map((accommodation: Api.Destination.Res.Accommodation) => {
			if (arrayOfPrices) {
				return (arrayOfPrices = [
					...arrayOfPrices,
					...accommodation.prices.map(
						(priceObj: {
							priceCents: number;
							pricePoints: number;
							quantityAvailable: number;
							rateCode: string;
						}) => {
							return priceObj;
						}
					)
				]);
			} else {
				return (arrayOfPrices = accommodation.prices.map(
					(priceObj: {
						priceCents: number;
						pricePoints: number;
						quantityAvailable: number;
						rateCode: string;
					}) => {
						return priceObj;
					}
				));
			}
		});
		return getLowestAccommodationPrice(arrayOfPrices);
	}

	function getLowestAccommodationPrice(
		accommodationPricesList:
			| {
					priceCents: number;
					pricePoints: number;
					quantityAvailable: number;
					rateCode: string;
			  }[]
			| undefined
	) {
		if (accommodationPricesList) {
			accommodationPricesList.sort((price1, price2) => price1.priceCents - price2.priceCents);
			return accommodationPricesList[0];
		} else {
			return null;
		}
	}

	return size === 'small' ? (
		<DestinationSearchResultCardMobile
			destinationName={props.destinationName}
			address={props.address}
			picturePaths={props.picturePaths}
			destinationDetailsPath={props.destinationDetailsPath}
			summaryTabs={props.summaryTabs}
			onAddCompareClick={props.onAddCompareClick}
			getAccommodationPrices={getAccommodationPrices}
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
			getAccommodationPrices={getAccommodationPrices}
		/>
	);
};

export default DestinationSearchResultCard;
