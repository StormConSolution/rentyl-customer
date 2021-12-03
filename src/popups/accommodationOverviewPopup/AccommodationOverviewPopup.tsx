import * as React from 'react';
import './AccommodationOverviewPopup.scss';
import { Box, Popup, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import Carousel from '../../components/carousel/Carousel';
import LabelButton from '../../components/labelButton/LabelButton';
import DestinationImageGallery from '../../components/destinationImageGallery/DestinationImageGallery';
import LightBoxCarouselPopup, { TabbedCarouselPopupProps } from '../lightBoxCarouselPopup/LightBoxCarouselPopup';
import router from '../../utils/router';
import { StringUtils } from '../../utils/utils';
import AccommodationsPopup from '../accommodationsPopup/AccommodationsPopup';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';

export interface AccommodationOverviewPopupProps extends PopupProps {
	accommodationDetails: Api.Accommodation.Res.Details;
	destinationName: string;
	destinationId: number;
}

const AccommodationOverviewPopup: React.FC<AccommodationOverviewPopupProps> = (props) => {
	const reservationFilters = useRecoilValue<Misc.ReservationFilters>(globalState.reservationFilters);

	function handleReserveStay() {
		let data: any = { ...reservationFilters };
		let newRoom: Misc.StayParams = {
			uuid: Date.now(),
			adults: data.adultCount,
			children: data.childCount || 0,
			accommodationId: props.accommodationDetails.id,
			arrivalDate: data.startDate,
			departureDate: data.endDate,
			packages: [],
			rateCode: ''
		};
		data = StringUtils.setAddPackagesParams({ destinationId: props.destinationId, newRoom });
		popupController.close(AccommodationsPopup);
		router.navigate(`/booking/packages?data=${data}`).catch(console.error);
	}

	function renderAccommodationSize() {
		let size = '';
		let sizeObj = props.accommodationDetails.size;
		if (sizeObj) {
			size = `${sizeObj.min} to ${sizeObj.max} ${sizeObj.units === 'SquareFeet' ? `ft` : sizeObj.units}`;
		}
		return (
			<div className={'accommodationCounts'}>
				<Icon iconImg={'cms-icon-0503'} size={45} />
				<Label variant={'accommodationOverviewCustomTwo'}>
					{size}
					{sizeObj?.units === 'SquareFeet' ? <span className={'superScript'}>2</span> : ''}
				</Label>
			</div>
		);
	}

	function renderAmenities() {
		if (!props.accommodationDetails) return <></>;
		return props.accommodationDetails.amenities.map((amenity) => {
			return (
				<div className={'amenityItem'} key={`amenity-${amenity.id}`}>
					<Icon iconImg={amenity.icon} size={42} />
					<Label variant={'accommodationOverviewCustomOne'}>{amenity.title}</Label>
				</div>
			);
		});
	}

	function renderLayoutImages(): React.ReactNodeArray {
		if (!props.accommodationDetails.layout) return [<div />];
		return props.accommodationDetails.layout.map((layout) => {
			return (
				<div className={'imageTile'}>
					<img src={layout.media.urls.imageKit} alt={layout.title} />
				</div>
			);
		});
	}

	return (
		<Popup opened={props.opened}>
			<Paper className={'rsAccommodationOverviewPopup'}>
				<div className={'popupHeader'}>
					<Label
						variant={'customTwentyTwo'}
					>{`${props.destinationName} - ${props.accommodationDetails.name}`}</Label>
					<Icon
						iconImg={'icon-close'}
						color={'#797979'}
						onClick={() => {
							popupController.close(AccommodationOverviewPopup);
						}}
					/>
				</div>

				<Box padding={'34px 57px'} maxWidth={1644} margin={'auto'}>
					{props.accommodationDetails.media ? (
						<DestinationImageGallery
							onGalleryClick={() => {
								popupController.open<TabbedCarouselPopupProps>(LightBoxCarouselPopup, {
									imageData: props.accommodationDetails.media
								});
							}}
							imageData={props.accommodationDetails.media}
						/>
					) : (
						<></>
					)}

					<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} marginBottom={48}>
						<Box
							display={'flex'}
							justifyContent={props.accommodationDetails.size ? 'space-between' : 'flex-start'}
							marginTop={16}
							minWidth={500}
						>
							<div className={'accommodationCounts'}>
								<Icon iconImg={'cms-icon-0425'} size={45} />
								<Label variant={'accommodationOverviewCustomTwo'}>
									{props.accommodationDetails.bathroomCount}
								</Label>
							</div>
							<div className={'accommodationCounts'}>
								<Icon iconImg={'cms-icon-0412'} size={45} />
								<Label variant={'accommodationOverviewCustomTwo'}>
									{props.accommodationDetails.bedroomCount}
								</Label>
							</div>
							{props.accommodationDetails.size ? renderAccommodationSize() : <></>}
						</Box>
						<LabelButton
							look={'containedPrimary'}
							variant={'button2'}
							label={'Reserve Stay'}
							className={'yellow'}
							onClick={handleReserveStay}
						/>
					</Box>

					<div className={'overview'}>
						<Label variant={'tabbedImageCarouselCustomOne'}>Overview</Label>
						<Label variant={'accommodationOverviewCustomOne'} margin={'60px auto'}>
							{props.accommodationDetails.shortDescription
								? props.accommodationDetails.shortDescription
								: props.accommodationDetails.longDescription}
						</Label>
					</div>

					{props.accommodationDetails.amenities.length !== 0 ? (
						<div className={'amenitiesList'}>
							<Label variant={'tabbedImageCarouselCustomOne'} marginTop={20}>
								Amenities
							</Label>
							<Box display={'flex'} flexWrap={'wrap'} margin={'40px auto'}>
								{renderAmenities()}
							</Box>
						</div>
					) : (
						<></>
					)}

					{props.accommodationDetails.layout.length !== 0 ? (
						<>
							<Label variant={'tabbedImageCarouselCustomOne'} margin={'60px auto'}>
								Floor Plan
							</Label>

							{props.accommodationDetails.layout && props.accommodationDetails.layout.length > 1 ? (
								<Carousel className={'imageContainer'} showControls children={renderLayoutImages()} />
							) : (
								<Box marginBottom={60}>
									<img src={props.accommodationDetails.layout[0].media.urls.imageKit} />
								</Box>
							)}
						</>
					) : (
						<></>
					)}
				</Box>
			</Paper>
		</Popup>
	);
};
export default AccommodationOverviewPopup;
