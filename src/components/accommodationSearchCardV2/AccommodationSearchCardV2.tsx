import * as React from 'react';
import './AccommodationSearchCardV2.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { useEffect, useState } from 'react';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { ObjectUtils, WebUtils } from '../../utils/utils';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import LoadingPage from '../../pages/loadingPage/LoadingPage';
import CarouselV2 from '../carouselV2/CarouselV2';
import Accordion from '@bit/redsky.framework.rs.accordion';
import RateCodeCard from '../rateCodeCard/RateCodeCard';
import PointsOrCentsBox from '../pointsOrCentsBox/PointsOrCentsBox';
import MobileLightBox, { MobileLightBoxProps } from '../../popups/mobileLightBox/MobileLightBox';
import LightBoxCarouselPopup, {
	TabbedCarouselPopupProps
} from '../../popups/lightBoxCarouselPopup/LightBoxCarouselPopup';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface AccommodationSearchCardV2Props {
	accommodation: Api.Destination.Res.Accommodation;
	destinationId: number;
}

const AccommodationSearchCardV2: React.FC<AccommodationSearchCardV2Props> = (props) => {
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const size = useWindowResizeChange();
	const [accommodationDetails, setAccommodationDetails] = useState<Api.Accommodation.Res.Details>();
	const [displayLowestPrice, setDisplayLowestPrice] = useState<Misc.Pricing>();
	const [accommodationPrices, setAccommodationPrices] = useState<Misc.Pricing[]>([]);

	useEffect(() => {
		async function getAccommodationDetails() {
			try {
				const res = await accommodationService.getAccommodationDetails(props.accommodation.id);
				setAccommodationDetails(res);
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'No accommodation found'), 'Error!');
			}
		}
		getAccommodationDetails().catch(console.error);
	}, [props.accommodation]);

	useEffect(() => {
		if (props.accommodation) {
			let newAccommodationPrices = props.accommodation.prices;
			newAccommodationPrices.sort(function (a, b) {
				return a.priceCents - b.priceCents;
			});
			setDisplayLowestPrice(newAccommodationPrices[0]);
			newAccommodationPrices.shift();
			setAccommodationPrices(newAccommodationPrices);
		}
	}, []);

	function getImageUrls(): string[] {
		if (accommodationDetails?.media) {
			let images = accommodationDetails.media;
			images.sort((a, b) => {
				return b.isPrimary - a.isPrimary;
			});
			return images.map((urlObj) => {
				return urlObj.urls.imageKit?.toString() || urlObj.urls.thumb;
			});
		}
		return [];
	}

	function renderImageCarousel() {
		const urls = getImageUrls();
		return (
			<CarouselV2
				path={() => {}}
				imgPaths={urls}
				hideCompareButton={true}
				onGalleryClick={() => {
					if (size === 'small') {
						popupController.open<MobileLightBoxProps>(MobileLightBox, {
							imageData: accommodationDetails?.media
						});
					} else {
						popupController.open<TabbedCarouselPopupProps>(LightBoxCarouselPopup, {
							imageData: accommodationDetails?.media
						});
					}
				}}
			/>
		);
	}

	return !props.accommodation ? (
		<LoadingPage />
	) : (
		<Box className={'rsAccommodationSearchCardV2'}>
			{renderImageCarousel()}
			<Box className={'accommodationContainer'}>
				<Box className={'accommodationDetails'}>
					<Box className={'accommodationDescription'}>
						<Label variant={'accommodationModalCustomTwo'}>{props.accommodation.name}</Label>
						<Box className={'detailsTextContainer'}>
							{props.accommodation.maxOccupantCount && (
								<Label paddingRight={5} variant={'customThree'}>
									Sleeps {props.accommodation.maxOccupantCount}
								</Label>
							)}
							{props.accommodation.bedDetails && (
								<Label variant={'customThree'}>
									| {props.accommodation.bedDetails.length} Various Bed Types |
								</Label>
							)}
							{props.accommodation.maxSquareFt && props.accommodation.minSquareFt && (
								<Label variant={'customThree'} paddingLeft={5}>
									{props.accommodation.minSquareFt} to {props.accommodation.maxSquareFt} ft
								</Label>
							)}
						</Box>
						<Label lineClamp={3} variant={'accommodationModalCustomThree'}>
							{accommodationDetails?.longDescription}
						</Label>
						<Label variant={'accommodationModalCustomSeven'}>
							{displayLowestPrice ? displayLowestPrice.title : ''}
						</Label>
						<Label variant={'accommodationModalCustomEight'}>
							{displayLowestPrice ? displayLowestPrice.description : ''}
						</Label>
					</Box>
					<Box className={'priceBox'}>
						{displayLowestPrice && (
							<PointsOrCentsBox
								priceObj={displayLowestPrice}
								accommodationId={props.accommodation.id}
								destinationId={props.destinationId}
							/>
						)}
					</Box>
				</Box>
				<Box className={'accordionContainer'}>
					{ObjectUtils.isArrayWithData(accommodationPrices) && (
						<Accordion title={'View more rates'}>
							{accommodationPrices.map((priceObj) => {
								return (
									<RateCodeCard
										key={priceObj.rateCode}
										priceObj={priceObj}
										destinationId={props.destinationId}
										accommodationId={props.accommodation.id}
									/>
								);
							})}
						</Accordion>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default AccommodationSearchCardV2;
