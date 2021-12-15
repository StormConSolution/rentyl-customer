import * as React from 'react';
import './AccommodationSearchCardMobile.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import { ObjectUtils, StringUtils, WebUtils } from '../../../utils/utils';
import Accordion from '@bit/redsky.framework.rs.accordion';
import CarouselV2 from '../../carouselV2/CarouselV2';
import serviceFactory from '../../../services/serviceFactory';
import AccommodationService from '../../../services/accommodation/accommodation.service';
import { useEffect, useState } from 'react';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import LabelButton from '../../labelButton/LabelButton';
import RateCodeCard from '../../rateCodeCard/RateCodeCard';
import router from '../../../utils/router';
import { useRecoilState } from 'recoil';
import globalState from '../../../state/globalState';
import MobileLightBox, { MobileLightBoxProps } from '../../../popups/mobileLightBox/MobileLightBox';

interface AccommodationSearchCardMobileProps {
	accommodation: Api.Destination.Res.Accommodation;
	destinationId: number;
	openAccordion?: boolean;
	showInfoIcon?: boolean;
	onClickInfoIcon?: (accommodationId: number) => void;
	pointsEarnable: number;
	loyaltyStatus: Model.LoyaltyStatus;
}

const AccommodationSearchCardMobile: React.FC<AccommodationSearchCardMobileProps> = (props) => {
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);
	const [accommodationDetails, setAccommodationDetails] = useState<Api.Accommodation.Res.Details>();
	const [displayLowestPrice, setDisplayLowestPrice] = useState<Misc.Pricing>();
	const [accommodationPrices, setAccommodationPrices] = useState<Misc.Pricing[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(props.openAccordion || false);

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
	}, [props.accommodation]);

	function onBookNow() {
		if (props.loyaltyStatus !== 'ACTIVE') {
			setReservationFilters({ ...reservationFilters, redeemPoints: false });
		}
		let data: any = { ...reservationFilters, redeemPoints: props.loyaltyStatus === 'ACTIVE' };
		let newRoom: Misc.StayParams = {
			uuid: Date.now(),
			adults: data.adultCount,
			children: data.childCount || 0,
			accommodationId: props.accommodation.id,
			arrivalDate: data.startDate,
			departureDate: data.endDate,
			packages: [],
			rateCode: displayLowestPrice?.rate.code || ''
		};
		data = StringUtils.setAddPackagesParams({ destinationId: props.destinationId, newRoom });
		popupController.closeAll();
		router.navigate(`/booking/packages?data=${data}`).catch(console.error);
	}

	function getImageUrls(): string[] {
		if (accommodationDetails?.media) {
			let images = accommodationDetails.media;
			images.sort((a, b) => {
				return b.isPrimary - a.isPrimary;
			});
			return images.map((urlObj) => {
				return urlObj.urls.imageKit?.toString();
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
					popupController.open<MobileLightBoxProps>(MobileLightBox, {
						imageData: accommodationDetails?.media
					});
				}}
			/>
		);
	}

	function renderPointsOrCash() {
		if (reservationFilters.redeemPoints && props.loyaltyStatus === 'ACTIVE') {
			return (
				<Box className={'pricePerNight'}>
					<Label variant={'accommodationModalCustomEleven'} className={'yellowText'}>
						{StringUtils.addCommasToNumber(displayLowestPrice?.pricePoints)}pts
					</Label>
					<Label variant={'pointsPageCustomSix'}>/night</Label>
				</Box>
			);
		} else {
			return (
				<Box className={'pricePerNight'}>
					<Label variant={'accommodationModalCustomEleven'}>
						{displayLowestPrice ? '$' + StringUtils.formatMoney(displayLowestPrice.priceCents) + '/ ' : ''}
					</Label>
					<Label variant={'pointsPageCustomSix'}>night + taxes & fees</Label>
				</Box>
			);
		}
	}

	return (
		<Box className={'rsAccommodationSearchCardMobile'}>
			{renderImageCarousel()}
			<Box className={'accommodationDetailsContainer'}>
				<Box className={'accommodationTitle'}>
					<Label variant={'accommodationModalCustomNine'}>{props.accommodation.name}</Label>
					{props.showInfoIcon && (
						<Icon
							iconImg={'icon-info-outline'}
							cursorPointer
							onClick={() => {
								if (props.onClickInfoIcon) props.onClickInfoIcon(props.accommodation.id);
							}}
							size={22}
						/>
					)}
				</Box>
				<Box className={'detailsTextContainer'}>
					{props.accommodation.maxOccupantCount && (
						<Label paddingRight={5} variant={'accommodationModalCustomTen'}>
							Sleeps {props.accommodation.maxOccupantCount}
						</Label>
					)}
					{props.accommodation.bedDetails && (
						<Label variant={'accommodationModalCustomTen'}>
							| {props.accommodation.bedDetails.length} Various Bed Types |
						</Label>
					)}
					{props.accommodation.maxSquareFt && props.accommodation.minSquareFt && (
						<Label variant={'accommodationModalCustomTen'} paddingLeft={5}>
							{props.accommodation.minSquareFt} to {props.accommodation.maxSquareFt} ft
						</Label>
					)}
				</Box>
				<Label variant={'pointsPageCustomThree'} className={'rateCodeTitle'}>
					{displayLowestPrice?.rate.name ? displayLowestPrice.rate.name : 'Promotional Rate'}
				</Label>
				<Label variant={'bookingSummaryCustomThree'} className={'rateCodeDescription'}>
					{displayLowestPrice?.rate.description ? displayLowestPrice.rate.description : 'Promotional Rate'}
				</Label>
				{renderPointsOrCash()}
				{!reservationFilters.redeemPoints && props.loyaltyStatus === 'ACTIVE' && (
					<Label variant={'accommodationModalCustomTwelve'} className={'earnText'}>
						You will earn {props.pointsEarnable} points for this stay
					</Label>
				)}
				<Box className={'buttonContainer'}>
					<LabelButton
						look={'containedPrimary'}
						variant={'buttonTwo'}
						label={'Book Now'}
						className={'yellow'}
						onClick={onBookNow}
					/>
				</Box>
			</Box>
			<Box className={'accordionContainer'}>
				{ObjectUtils.isArrayWithData(accommodationPrices) && (
					<Accordion
						title={isOpen ? 'View less rates' : 'View more rates'}
						isOpen={props.openAccordion}
						onClick={() => setIsOpen(!isOpen)}
					>
						{accommodationPrices.map((priceObj) => {
							return (
								<RateCodeCard
									key={priceObj.rate.code}
									priceObj={priceObj}
									destinationId={props.destinationId}
									accommodationId={props.accommodation.id}
									pointsEarnable={props.pointsEarnable}
									loyaltyStatus={props.loyaltyStatus}
								/>
							);
						})}
					</Accordion>
				)}
			</Box>
		</Box>
	);
};

export default AccommodationSearchCardMobile;
