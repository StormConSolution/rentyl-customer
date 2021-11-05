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

interface DestinationSearchResultCardMobileProps {
	className?: string;
	destinationName: string;
	address: string;
	picturePaths: string[];
	destinationDetailsPath: string;
	summaryTabs: DestinationSummaryTab[];
	onAddCompareClick?: () => void;
}

const DestinationSearchResultCardMobile: React.FC<DestinationSearchResultCardMobileProps> = (props) => {
	const reservationFilters = useRecoilValue(globalState.reservationFilters);

	function renderPictures(picturePaths: string[]): JSX.Element[] {
		return picturePaths.map((path: string) => {
			return (
				<Box key={path} className={'imageWrapper'}>
					<Img src={path} alt={'Resort Image'} width={690} height={580} />
				</Box>
			);
		});
	}

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

	return (
		<Box className={'rsDestinationSearchResultCardMobile'}>
			<Carousel showControls children={renderPictures(props.picturePaths)} />
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
					<Box display={'flex'}>
						{renderPricePerNight()}
						<Label variant={'caption1'}>night</Label>
					</Box>
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
