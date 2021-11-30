import * as React from 'react';
import './AccommodationSearchCardV2.scss';
import { Box } from '@bit/redsky.framework.rs.996';
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

interface AccommodationSearchCardV2Props {
	accommodation: Api.Destination.Res.Accommodation;
}

const AccommodationSearchCardV2: React.FC<AccommodationSearchCardV2Props> = (props) => {
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const [accommodationDetails, setAccommodationDetails] = useState<Api.Accommodation.Res.Details>();
	const [displayLowestPrice, setDisplayLowestPrice] = useState<Misc.Pricing>();
	const [accommodationPrices, setAccommodationPrices] = useState<Misc.Pricing[]>([]);

	useEffect(() => {
		async function getAccommodationDetails() {
			try {
				const res = await accommodationService.getAccommodationDetails(props.accommodation.id);
				console.log('accommodationDetails', res, props.accommodation);
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
				path={''}
				imgPaths={urls}
				onAddCompareClick={() => {}}
				onGalleryClick={() => {
					console.log('Show LightboxV2 images...');
				}}
				onRemoveCompareClick={() => {}}
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
								<Label variant={'customThree'}>Sleeps {props.accommodation.maxOccupantCount}</Label>
							)}
							{props.accommodation.bedDetails && (
								<Label variant={'customThree'}>
									| {props.accommodation.bedDetails.length} Various Bed Types |
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
						{displayLowestPrice && <PointsOrCentsBox priceObj={displayLowestPrice} />}
					</Box>
				</Box>
				<Box className={'accordionContainer'}>
					{ObjectUtils.isArrayWithData(accommodationPrices) && (
						<Accordion title={'View more rates'}>
							{accommodationPrices.map((priceObj) => {
								return <RateCodeCard priceObj={priceObj} />;
							})}
						</Accordion>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default AccommodationSearchCardV2;
