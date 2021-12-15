import * as React from 'react';
import './MobileAccommodationOverviewPopup.scss';
import { Box, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import Paper from '../../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import CarouselV2 from '../../../components/carouselV2/CarouselV2';
import MobileLightBox, { MobileLightBoxProps } from '../../mobileLightBox/MobileLightBox';
import ImageLabel from '../../../components/imageLabel/ImageLabel';

export interface MobileAccommodationOverviewPopupProps extends PopupProps {
	accommodationDetails: Api.Accommodation.Res.Details;
	destinationName: string;
	renderAmenities: () => JSX.Element | JSX.Element[];
	getAccommodationImages: () => any;
	renderAccommodationSize: () => any;
	handleFloorPlanExpand: () => void;
	popUp: React.ReactNode;
}

const MobileAccommodationOverviewPopup: React.FC<MobileAccommodationOverviewPopupProps> = (props) => {
	return (
		<Paper className={'rsMobileAccommodationOverviewPopup'}>
			<div className={'popupHeader'}>
				<Label variant={'customThirteen'}>{props.accommodationDetails.name}</Label>
				<Icon
					iconImg={'icon-close'}
					color={'#797979'}
					onClick={() => {
						popupController.close(props.popUp);
					}}
				/>
			</div>

			<div className={'popupContent'}>
				<CarouselV2
					path={() => {}}
					imgPaths={props.getAccommodationImages()}
					onGalleryClick={() => {
						popupController.open<MobileLightBoxProps>(MobileLightBox, {
							imageData: props.accommodationDetails.media
						});
					}}
				/>

				<Box
					display={'flex'}
					justifyContent={props.accommodationDetails.size ? 'space-between' : 'flex-start'}
					marginTop={16}
				>
					<ImageLabel
						labelName={props.accommodationDetails.bedroomCount.toString()}
						imgSrc={'sleep.png'}
						imgWidth={'30px'}
						imgHeight={'20px'}
						iconPosition={'left'}
					/>
					<ImageLabel
						labelName={props.accommodationDetails.bathroomCount.toString()}
						imgSrc={'shower.png'}
						imgWidth={'30px'}
						imgHeight={'20px'}
						iconPosition={'left'}
					/>
					<ImageLabel
						labelName={props.renderAccommodationSize()}
						imgSrc={'square-foot.png'}
						imgWidth={'30px'}
						imgHeight={'20px'}
						iconPosition={'left'}
					/>
				</Box>

				<Label variant={'accommodationOverviewCustomOne'} margin={'24px auto'}>
					{props.accommodationDetails.shortDescription
						? props.accommodationDetails.shortDescription
						: props.accommodationDetails.longDescription}
				</Label>

				{props.accommodationDetails.amenities.length !== 0 ? (
					<div className={'amenitiesList'}>
						<Label variant={'customFifteen'} marginTop={20}>
							Amenities
						</Label>
						<Box display={'flex'} flexWrap={'wrap'}>
							{props.renderAmenities()}
						</Box>
					</div>
				) : (
					<></>
				)}

				{props.accommodationDetails.layout.length !== 0 ? (
					<>
						<Label variant={'customFifteen'} margin={'20px auto'}>
							Floor Plan
						</Label>
						<Box display={'flex'} alignItems={'center'} justifyContent={'center'} marginBottom={40}>
							<img
								className={'floorPlanImg'}
								src={props.accommodationDetails.layout[0].media.urls.imageKit}
								alt={''}
							/>
						</Box>

						{props.accommodationDetails.layout.length > 1 ? (
							<div className={'expandFloorPlanDiv'} onClick={props.handleFloorPlanExpand}>
								<Label>Expand floor plans</Label>
								<Icon iconImg={'cms-icon-0055'} size={22} />
							</div>
						) : (
							<Box margin={40} />
						)}
					</>
				) : (
					<Box margin={40} />
				)}
			</div>
		</Paper>
	);
};
export default MobileAccommodationOverviewPopup;
