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
			return (
				<Box display={'flex'} alignItems={'flex-end'} flexDirection={'column'}>
					<Label variant={'h2'} className={'yellowText'}>
						{StringUtils.addCommasToNumber(lowestPrice.pricePoints)}
					</Label>
					<Label variant={'subtitle3'}>points per night</Label>
				</Box>
			);
		} else {
			return (
				<Box display={'flex'} alignItems={'flex-end'} flexDirection={'column'}>
					<Label variant={'h2'}>${StringUtils.formatMoney(lowestPrice.priceCents)}</Label>
					<Label variant={'subtitle3'}>per night</Label>
					<Label variant={'subtitle2'}>+taxes & fees</Label>
				</Box>
			);
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
				<Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
					<Icon iconImg={'cms-icon-0501'} size={45} />
					<Label variant={'subtitle1'} className={'featureTitle'} lineClamp={1}>
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
			<Box display={'flex'}>
				<Carousel showControls children={renderPictures(props.picturePaths)} />
				<Box display={'flex'} flexDirection={'column'} maxWidth={'1020px'} padding={'5px 45px'}>
					<Label variant={'h4'} paddingBottom={'10px'}>
						{props.destinationName}
					</Label>
					<Box display={'flex'} paddingBottom={'16px'}>
						<Label variant={'subtitle1'} paddingRight={'74px'}>
							Bedrooms
						</Label>
						<Label variant={'subtitle1'}>{props.address}</Label>
					</Box>
					<Box display={'flex'} paddingBottom={'18px'}>
						<Label variant={'body4'} className={'destinationDescription'} lineClamp={2}>
							{props.destinationDescription}
						</Label>
					</Box>
					<Box className={'featureIcons'} paddingBottom={'30px'}>
						{renderFeatures()}
					</Box>
					<Box display={'flex'} gap={'24px'}>
						{renderButtons()}
					</Box>
				</Box>
			</Box>
			<Box display={'flex'} flexDirection={'column'} alignItems={'flex-end'} justifyContent={'flex-end'}>
				<Label variant={'subtitle3'} className={'fromText'}>
					from
				</Label>
				{renderPricePerNight()}
			</Box>
		</Box>
	);
};

export default DestinationSearchResultCardResponsive;
