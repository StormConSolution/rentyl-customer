import * as React from 'react';
import './DestinationSearchResultCardMobile.scss';
import Carousel from '../../carousel/Carousel';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import router from '../../../utils/router';
import Img from '@bit/redsky.framework.rs.img';
import Icon from '@bit/redsky.framework.rs.icon';
import { useRecoilValue } from 'recoil';
import globalState from '../../../state/globalState';
import { DestinationSummaryTab } from '../../tabbedDestinationSummary/TabbedDestinationSummary';
import { ObjectUtils, StringUtils } from '../../../utils/utils';
import LabelButton from '../../labelButton/LabelButton';
import { useEffect, useState } from 'react';
import CarouselV2 from '../../carouselV2/CarouselV2';

interface DestinationSearchResultCardMobileProps {
	className?: string;
	destinationName: string;
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

const DestinationSearchResultCardMobile: React.FC<DestinationSearchResultCardMobileProps> = (props) => {
	const reservationFilters = useRecoilValue(globalState.reservationFilters);
	const [lowestPrice, setLowestPrice] = useState<{
		priceCents: number;
		pricePoints: number;
		quantityAvailable: number;
		rateCode: string;
	} | null>();

	useEffect(() => {
		setLowestPrice(props.getLowestAccommodationPrice());
	}, []);

	function renderPricePerNight() {
		if (reservationFilters.redeemPoints && lowestPrice) {
			return (
				<Box display={'flex'}>
					<Label variant={'boldCaption1'}>{StringUtils.addCommasToNumber(lowestPrice.pricePoints)}pts/</Label>
					<Label variant={'caption1'}>night</Label>
				</Box>
			);
		} else if (!reservationFilters.redeemPoints && lowestPrice) {
			return (
				<Box display={'flex'}>
					<Label variant={'boldCaption1'}>${StringUtils.formatMoney(lowestPrice.priceCents)}/</Label>
					<Label variant={'caption1'}>night</Label>
				</Box>
			);
		} else {
			return (
				<Box>
					<LabelButton
						look={'containedPrimary'}
						className={'yellow'}
						variant={'button'}
						label={'Contact Us'}
					/>
					<Label variant={'subtitle3'} paddingTop={'5px'}>
						to inquire about booking
					</Label>
				</Box>
			);
		}
	}

	return (
		<Box className={'rsDestinationSearchResultCardMobile'}>
			<CarouselV2
				path={props.destinationDetailsPath}
				imgPaths={props.picturePaths}
				onAddCompareClick={() => {
					if (props.onAddCompareClick) props.onAddCompareClick();
				}}
				onGalleryClick={() => {
					console.log('');
				}}
			/>
			<Box className={'mobileCardInfo'}>
				<Box display={'flex'} justifyContent={'space-between'} paddingTop={'10px'} paddingBottom={'18px'}>
					<Label variant={'subtitle1'}>{props.destinationName}</Label>
					<Icon
						iconImg={'icon-info-outline'}
						onClick={() => {
							router.navigate(props.destinationDetailsPath).catch(console.error);
						}}
						size={20}
					/>
				</Box>
				<Box display={'flex'} justifyContent={'space-between'} paddingBottom={'16px'}>
					{renderPricePerNight()}
					<Label variant={'caption1'} className={'addressLabel'}>
						{props.address}
					</Label>
				</Box>
				<Box display={'flex'} justifyContent={'flex-end'}>
					<Label className={'earnText'} variant={'italicBold'}>
						You could earn from points for this stay
					</Label>
				</Box>
			</Box>
		</Box>
	);
};

export default DestinationSearchResultCardMobile;
