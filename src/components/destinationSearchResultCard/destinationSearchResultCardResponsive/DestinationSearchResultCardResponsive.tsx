import * as React from 'react';
import './DestinationSearchResultCardResponsive.scss';
import { DestinationSummaryTab } from '../../tabbedDestinationSummary/TabbedDestinationSummary';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import CarouselV2 from '../../carouselV2/CarouselV2';
import LabelButton from '../../labelButton/LabelButton';
import { ObjectUtils, StringUtils } from '../../../utils/utils';
import { useRecoilState } from 'recoil';
import globalState from '../../../state/globalState';
import IconLabel from '../../iconLabel/IconLabel';
import router from '../../../utils/router';
import AccommodationsPopup, { AccommodationsPopupProps } from '../../../popups/accommodationsPopup/AccommodationsPopup';

interface DestinationSearchResultCardResponsiveProps {
	className?: string;
	destinationId: number;
	destinationName: string;
	destinationDescription: string;
	destinationExperiences: {
		id: number;
		title: string;
		icon: string;
	}[];
	address: string;
	picturePaths: string[];
	summaryTabs: DestinationSummaryTab[];
	onAddCompareClick?: () => void;
	minPrice: number;
	minPoints: number;
}

const DestinationSearchResultCardResponsive: React.FC<DestinationSearchResultCardResponsiveProps> = (props) => {
	const [reservationFilters, setReservationFilters] = useRecoilState<Misc.ReservationFilters>(
		globalState.reservationFilters
	);

	function renderPricePerNight() {
		if (reservationFilters.redeemPoints) {
			return (
				<Box display={'flex'} alignItems={'flex-end'} justifyContent={'flex-end'} flexDirection={'column'}>
					<Label variant={'subtitle3'} className={'fromText'}>
						from
					</Label>
					<Label variant={'h2'} className={'yellowText'}>
						{StringUtils.addCommasToNumber(props.minPoints)}
					</Label>
					<Label variant={'subtitle3'}>points per night</Label>
				</Box>
			);
		} else {
			return (
				<Box display={'flex'} alignItems={'flex-end'} justifyContent={'flex-end'} flexDirection={'column'}>
					<Label variant={'subtitle3'} className={'fromText'}>
						from
					</Label>
					<Label variant={'h2'}>${StringUtils.formatMoney(props.minPrice)}</Label>
					<Label variant={'subtitle3'}>per night</Label>
					<Label variant={'subtitle2'}>+taxes & fees</Label>
				</Box>
			);
		}
	}

	function renderFeatures() {
		return props.destinationExperiences.map((experience) => {
			return (
				<Box
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					textAlign={'center'}
					key={experience.id}
				>
					<IconLabel
						labelName={experience.title}
						iconImg={experience.icon}
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
			if (ObjectUtils.isArrayWithData(props.summaryTabs)) {
				if (ObjectUtils.isArrayWithData(button.content.accommodations)) {
					return (
						<LabelButton
							key={button.label}
							look={'containedPrimary'}
							variant={'button'}
							label={button.label}
							onClick={(event) => {
								popupController.open<AccommodationsPopupProps>(AccommodationsPopup, {
									content: button
								});
								event.stopPropagation();
							}}
						/>
					);
				}
			} else {
				return (
					<LabelButton
						key={button.label}
						look={'containedPrimary'}
						variant={'button'}
						label={'Accommodations'}
						onClick={(event) => {
							popupController.open<AccommodationsPopupProps>(AccommodationsPopup);
							event.stopPropagation();
						}}
					/>
				);
			}
		});
	}

	return (
		<Box className={`rsDestinationSearchResultCardResponsive ${props.className || ''}`}>
			<Box display={'flex'}>
				<CarouselV2
					path={`/destination/details?di=${props.destinationId}&startDate=${reservationFilters.startDate}&endDate=${reservationFilters.endDate}`}
					imgPaths={props.picturePaths}
					onAddCompareClick={() => {
						if (props.onAddCompareClick) props.onAddCompareClick();
					}}
					onGalleryClick={() => {
						console.log('Show LightboxV2 images...');
					}}
				/>
				<Box
					display={'flex'}
					flexDirection={'column'}
					maxWidth={'1020px'}
					padding={'5px 45px'}
					onClick={() => {
						router
							.navigate(
								`/destination/details?di=${props.destinationId}&startDate=${reservationFilters.startDate}&endDate=${reservationFilters.endDate}`
							)
							.catch(console.error);
						setReservationFilters({ ...reservationFilters, destinationId: props.destinationId });
					}}
				>
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
