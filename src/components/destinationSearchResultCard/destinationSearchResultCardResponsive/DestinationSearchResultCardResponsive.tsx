import * as React from 'react';
import './DestinationSearchResultCardResponsive.scss';
import { DestinationSummaryTab } from '../../tabbedDestinationSummary/TabbedDestinationSummary';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import Carousel from '../../carousel/Carousel';
import Img from '@bit/redsky.framework.rs.img';
import Icon from '@bit/redsky.framework.rs.icon';
import LabelButton from '../../labelButton/LabelButton';
import { ObjectUtils, StringUtils } from '../../../utils/utils';
import { useRecoilValue } from 'recoil';
import globalState from '../../../state/globalState';

interface DestinationSearchResultCardResponsiveProps {
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

const DestinationSearchResultCardResponsive: React.FC<DestinationSearchResultCardResponsiveProps> = (props) => {
	const reservationFilters = useRecoilValue(globalState.reservationFilters);

	function findLowestPricedAccommodation() {
		let lowestPrice: { pricePoints: number; priceCents: number } = { pricePoints: 0, priceCents: 0 };
		props.summaryTabs.map((accommodationList) => {
			if (ObjectUtils.isArrayWithData(accommodationList.content.accommodations)) {
				return accommodationList.content.accommodations.map((accommodation) => {
					if (ObjectUtils.isArrayWithData(accommodation.prices)) {
						accommodation.prices.map((price) => {
							if (!lowestPrice.priceCents || lowestPrice.priceCents >= price.priceCents) {
								lowestPrice = { pricePoints: price.pricePoints, priceCents: price.priceCents };
							}
						});
					}
				});
			}
		});
		return lowestPrice;
	}

	function renderPricePerNight() {
		let lowestPrice: { pricePoints: number; priceCents: number } = findLowestPricedAccommodation();
		if (reservationFilters.redeemPoints) {
			return <Label variant={'boldCaption1'}>{StringUtils.addCommasToNumber(lowestPrice.pricePoints)}pts/</Label>;
		} else {
			return <Label variant={'boldCaption1'}>${StringUtils.formatMoney(lowestPrice.priceCents)}/</Label>;
		}
	}

	function renderPictures(picturePaths: string[]): JSX.Element[] {
		return picturePaths.map((path: string) => {
			return (
				<Box className={'imageWrapper'}>
					<Img src={path} alt={'Resort Image'} width={556} height={636} />
				</Box>
			);
		});
	}

	function renderFeatures() {
		return props.destinationFeatures.map((feature) => {
			return (
				<Box>
					<Icon iconImg={feature.icon} />
					<Label variant={'subtitle1'} className={'featureTitle'}>
						{feature.title}
					</Label>
				</Box>
			);
		});
	}

	function renderButtons() {
		return props.summaryTabs.map((button) => {
			return <LabelButton look={'containedPrimary'} variant={'button'} label={button.label} />;
		});
	}

	return (
		<Box className={`rsDestinationSearchResultCardResponsive ${props.className || ''}`}>
			<Carousel showControls children={renderPictures(props.picturePaths)} />
			<Box display={'flex'} flexDirection={'column'} maxWidth={'914px'}>
				<Label variant={'h4'}>{props.destinationName}</Label>
				<Box display={'flex'}>
					<Label variant={'subtitle1'} paddingRight={'74px'}>
						Bedrooms
					</Label>
					<Label variant={'subtitle1'}>{props.address}</Label>
				</Box>
				<Box display={'flex'}>
					<Label variant={'body4'} className={'destinationDescription'} lineClamp={2}>
						{props.destinationDescription}
					</Label>
				</Box>
				<Box className={'featureIcons'}>{renderFeatures()}</Box>
				<Box display={'flex'} gap={'24px'}>
					{renderButtons()}
				</Box>
			</Box>
			<Box>
				<Label>from</Label>
				{renderPricePerNight()}
			</Box>
		</Box>
	);
};

export default DestinationSearchResultCardResponsive;
