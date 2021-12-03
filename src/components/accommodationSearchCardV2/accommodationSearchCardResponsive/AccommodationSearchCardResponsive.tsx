import * as React from 'react';
import './AccommodationSearchCardResponsive.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import { useEffect, useState } from 'react';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { ObjectUtils, WebUtils } from '../../../utils/utils';
import serviceFactory from '../../../services/serviceFactory';
import AccommodationService from '../../../services/accommodation/accommodation.service';
import LoadingPage from '../../../pages/loadingPage/LoadingPage';
import CarouselV2 from '../../carouselV2/CarouselV2';
import Accordion from '@bit/redsky.framework.rs.accordion';
import Icon from '@bit/redsky.framework.rs.icon';
import useWindowResizeChange from '../../../customHooks/useWindowResizeChange';
import MobileLightBox, { MobileLightBoxProps } from '../../../popups/mobileLightBox/MobileLightBox';
import LightBoxCarouselPopup, {
	TabbedCarouselPopupProps
} from '../../../popups/lightBoxCarouselPopup/LightBoxCarouselPopup';
import PointsOrCentsBox from '../../pointsOrCentsBox/PointsOrCentsBox';
import RateCodeCard from '../../rateCodeCard/RateCodeCard';

interface AccommodationSearchCardResponsiveProps {
	accommodation: Api.Destination.Res.Accommodation;
	destinationId: number;
	openAccordion?: boolean;
	showInfoIcon?: boolean;
	onClickInfoIcon?: (accommodationId: number) => void;
	pointsEarnable: number;
}

const AccommodationSearchCardResponsive: React.FC<AccommodationSearchCardResponsiveProps> = (props) => {
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
		<Box className={'rsAccommodationSearchCardResponsive'}>
			{renderImageCarousel()}
			<Box className={'accommodationContainer'}>
				<Box className={'accommodationDetails'}>
					<Box className={'accommodationDescription'}>
						<Box display={'flex'} paddingBottom={17}>
							<Label variant={'accommodationModalCustomTwo'} paddingRight={20}>
								{props.accommodation.name}
							</Label>
							{props.showInfoIcon && (
								<Icon
									iconImg={'icon-info-outline'}
									onClick={() => {
										if (props.onClickInfoIcon) props.onClickInfoIcon(props.accommodation.id);
									}}
									size={22}
								/>
							)}
						</Box>
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
									{props.accommodation.minSquareFt} to {props.accommodation.maxSquareFt} ft&sup2;
								</Label>
							)}
						</Box>
						<Label lineClamp={3} variant={'accommodationModalCustomThree'} marginBottom={29}>
							{accommodationDetails?.longDescription}
						</Label>
						<Box className={'rateDescriptionContainer'}>
							<Label variant={'accommodationModalCustomSeven'} paddingBottom={13}>
								{displayLowestPrice?.rate.name ? displayLowestPrice.rate.name : 'Promotional Rate'}
							</Label>
							<Label variant={'accommodationModalCustomEight'}>
								{displayLowestPrice?.rate.description
									? displayLowestPrice.rate.description
									: 'Promotional Rate'}
							</Label>
						</Box>
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
						<Accordion title={'View more rates'} isOpen={props.openAccordion}>
							{accommodationPrices.map((priceObj) => {
								return (
									<RateCodeCard
										key={priceObj.rate.code}
										priceObj={priceObj}
										destinationId={props.destinationId}
										accommodationId={props.accommodation.id}
										pointsEarnable={props.pointsEarnable}
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

export default AccommodationSearchCardResponsive;
