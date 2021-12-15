import * as React from 'react';
import './AccommodationPopup.scss';
import { Box, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import Paper from '../../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import Carousel from '../../../components/carousel/Carousel';
import LabelButton from '../../../components/labelButton/LabelButton';
import DestinationImageGallery from '../../../components/destinationImageGallery/DestinationImageGallery';
import LightBoxCarouselPopup, { TabbedCarouselPopupProps } from '../../lightBoxCarouselPopup/LightBoxCarouselPopup';
import ImageLabel from '../../../components/imageLabel/ImageLabel';

export interface AccommodationPopupPopupProps extends PopupProps {
	accommodationDetails: Api.Accommodation.Res.Details;
	destinationName?: string | undefined;
	renderAccommodationSize: () => JSX.Element;
	handleReserveStay: () => void;
	renderAmenities: () => JSX.Element | JSX.Element[];
	renderLayoutImages: () => React.ReactNodeArray;
	popUp: React.ReactNode;
}

const AccommodationPopup: React.FC<AccommodationPopupPopupProps> = (props) => {
	return (
		<Paper className={'rsAccommodationOverviewPopup'}>
			<div className={'popupHeader'}>
				<Label
					variant={'customTwentyTwo'}
				>{`${props.destinationName} - ${props.accommodationDetails.name}`}</Label>
				<Icon
					iconImg={'icon-close'}
					color={'#797979'}
					onClick={() => {
						popupController.close(props.popUp);
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
						<ImageLabel
							labelName={props.accommodationDetails.bedroomCount.toString()}
							imgSrc={'sleep.png'}
							imgWidth={'40px'}
							imgHeight={'40px'}
							iconPosition={'left'}
							labelVariant={'subtitle1'}
						/>
						<ImageLabel
							labelName={props.accommodationDetails.bathroomCount.toString()}
							imgSrc={'shower.png'}
							imgWidth={'40px'}
							imgHeight={'40px'}
							iconPosition={'left'}
							labelVariant={'subtitle1'}
						/>
						<ImageLabel
							labelName={props.renderAccommodationSize()}
							imgSrc={'square-foot.png'}
							imgWidth={'40px'}
							imgHeight={'40px'}
							iconPosition={'left'}
							labelVariant={'subtitle1'}
						/>
					</Box>
					<LabelButton
						look={'containedPrimary'}
						variant={'button2'}
						label={'Reserve Stay'}
						className={'yellow'}
						onClick={props.handleReserveStay}
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
							{props.renderAmenities()}
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
							<Carousel className={'imageContainer'} showControls children={props.renderLayoutImages()} />
						) : (
							<div className={'singleLayoutImg'}>
								<img src={props.accommodationDetails.layout[0].media.urls.imageKit} alt={''} />
							</div>
						)}
					</>
				) : (
					<></>
				)}
			</Box>
		</Paper>
	);
};
export default AccommodationPopup;
