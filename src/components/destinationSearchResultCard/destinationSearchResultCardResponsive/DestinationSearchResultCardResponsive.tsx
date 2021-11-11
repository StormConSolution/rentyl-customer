import * as React from 'react';
import './DestinationSearchResultCardResponsive.scss';
import { DestinationSummaryTab } from '../../tabbedDestinationSummary/TabbedDestinationSummary';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import CarouselV2 from '../../carouselV2/CarouselV2';
import LabelButton from '../../labelButton/LabelButton';
import { ObjectUtils, StringUtils } from '../../../utils/utils';
import { useRecoilValue } from 'recoil';
import globalState from '../../../state/globalState';
import IconLabel from '../../iconLabel/IconLabel';
import { useEffect, useState } from 'react';
import { PriceObject } from '../DestinationSearchResultCard';

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
	getLowestAccommodationPrice: () => {
		priceCents: number;
		pricePoints: number;
		quantityAvailable: number;
		rateCode: string;
	} | null;
}

const DestinationSearchResultCardResponsive: React.FC<DestinationSearchResultCardResponsiveProps> = (props) => {
	const reservationFilters = useRecoilValue(globalState.reservationFilters);
	const [accommodationList, setAccommodationList] = useState<Api.Destination.Res.Accommodation[]>([]);
	const [lowestPrice, setLowestPrice] = useState<PriceObject | null>();

	useEffect(() => {
		props.summaryTabs.map((accommodationList) => {
			if (ObjectUtils.isArrayWithData(accommodationList.content.accommodations)) {
				setAccommodationList(accommodationList.content.accommodations);
			}
		});
	}, [props.summaryTabs]);

	useEffect(() => {
		setLowestPrice(props.getLowestAccommodationPrice());
	}, [accommodationList]);

	function renderPricePerNight() {
		if (reservationFilters.redeemPoints && lowestPrice) {
			return (
				<Box display={'flex'} alignItems={'flex-end'} justifyContent={'flex-end'} flexDirection={'column'}>
					<Label variant={'subtitle3'} className={'fromText'}>
						from
					</Label>
					<Label variant={'h2'} className={'yellowText'}>
						{StringUtils.addCommasToNumber(lowestPrice.pricePoints)}
					</Label>
					<Label variant={'subtitle3'}>points per night</Label>
				</Box>
			);
		} else if (!reservationFilters.redeemPoints && lowestPrice) {
			return (
				<Box display={'flex'} alignItems={'flex-end'} justifyContent={'flex-end'} flexDirection={'column'}>
					<Label variant={'subtitle3'} className={'fromText'}>
						from
					</Label>
					<Label variant={'h2'}>${StringUtils.formatMoney(lowestPrice.priceCents)}</Label>
					<Label variant={'subtitle3'}>per night</Label>
					<Label variant={'subtitle2'}>+taxes & fees</Label>
				</Box>
			);
		} else {
			return (
				<Box
					display={'flex'}
					alignItems={'flex-end'}
					justifyContent={'flex-end'}
					flexDirection={'column'}
					textAlign={'center'}
				>
					<LabelButton
						look={'containedPrimary'}
						className={'yellow'}
						variant={'button'}
						label={'Contact Us'}
					/>
					<Label variant={'subtitle3'} paddingTop={'16px'}>
						to inquire about booking
					</Label>
				</Box>
			);
		}
	}

	function renderFeatures() {
		return props.destinationFeatures.map((feature) => {
			return (
				<Box display={'flex'} flexDirection={'column'} alignItems={'center'} textAlign={'center'}>
					<IconLabel
						labelName={feature.title}
						iconImg={feature.icon}
						iconPosition={'top'}
						iconSize={45}
						labelVariant={'subtitle1'}
					/>
				</Box>
			);
		});
	}

	function renderButtons() {
		return props.summaryTabs.map((button) => {
			if (ObjectUtils.isArrayWithData(button.content.accommodations)) {
				return <LabelButton look={'containedPrimary'} variant={'button'} label={button.label}></LabelButton>;
			} else {
				return (
					<LabelButton look={'containedPrimary'} variant={'button'} label={'Accommodations'}></LabelButton>
				);
			}
		});
	}

	return (
		<Box className={`rsDestinationSearchResultCardResponsive ${props.className || ''}`}>
			<Box display={'flex'}>
				<CarouselV2
					path={props.destinationDetailsPath}
					imgPaths={props.picturePaths}
					onAddCompareClick={() => {
						if (props.onAddCompareClick) props.onAddCompareClick();
					}}
					onGalleryClick={() => {
						console.log('Show LightboxV2 images...');
					}}
				/>
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
			{renderPricePerNight()}
		</Box>
	);
};

export default DestinationSearchResultCardResponsive;
