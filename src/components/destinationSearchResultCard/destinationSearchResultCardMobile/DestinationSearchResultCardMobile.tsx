import * as React from 'react';
import './DestinationSearchResultCardMobile.scss';
import CarouselV2 from '../../carouselV2/CarouselV2';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import router from '../../../utils/router';
import Icon from '@bit/redsky.framework.rs.icon';
import { useRecoilValue } from 'recoil';
import globalState from '../../../state/globalState';
import { DestinationSummaryTab } from '../../tabbedDestinationSummary/TabbedDestinationSummary';
import { StringUtils } from '../../../utils/utils';
import LabelButton from '../../labelButton/LabelButton';
import { useEffect, useState } from 'react';

interface DestinationSearchResultCardMobileProps {
	className?: string;
	destinationId: number;
	destinationName: string;
	address: string;
	picturePaths: string[];
	summaryTabs: DestinationSummaryTab[];
	onAddCompareClick?: () => void;
	minPrice: number;
	minPoints: number;
}

const DestinationSearchResultCardMobile: React.FC<DestinationSearchResultCardMobileProps> = (props) => {
	const reservationFilters = useRecoilValue(globalState.reservationFilters);

	function renderPricePerNight() {
		if (reservationFilters.redeemPoints) {
			return (
				<Box display={'flex'}>
					<Label variant={'boldCaption1'} className={'yellowText'}>
						{StringUtils.addCommasToNumber(props.minPoints)}pts
					</Label>
					<Label variant={'caption1'}>/</Label>
					<Label variant={'caption1'}>night</Label>
				</Box>
			);
		} else {
			return (
				<Box display={'flex'}>
					<Label variant={'boldCaption1'}>${StringUtils.formatMoney(props.minPrice)}/</Label>
					<Label variant={'caption1'}>night</Label>
				</Box>
			);
		}
	}

	return (
		<Box className={'rsDestinationSearchResultCardMobile'}>
			<CarouselV2
				path={`/destination/details?di=${props.destinationId}&startDate=${reservationFilters.startDate}&endDate=${reservationFilters.endDate}`}
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
							router
								.navigate(
									`/destination/details?di=${props.destinationId}&startDate=${reservationFilters.startDate}&endDate=${reservationFilters.endDate}`
								)
								.catch(console.error);
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
