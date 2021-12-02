import * as React from 'react';
import './MobileAccommodationOverviewPopup.scss';
import { Box, Popup, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import CarouselV2 from '../../components/carouselV2/CarouselV2';
import { useEffect } from 'react';
import MobileLightBoxTwoPopup, { MobileLightBoxTwoPopupProps } from '../mobileLightBoxTwoPopup/MobileLightBoxTwoPopup';
import MobileLightBox, { MobileLightBoxProps } from '../mobileLightBox/MobileLightBox';
import { ImageTabProp } from '../../components/tabbedImageCarousel/TabbedImageCarousel';

export interface MobileAccommodationOverviewPopupProps extends PopupProps {
	accommodationDetails: Api.Accommodation.Res.Details | undefined;
}

const MobileAccommodationOverviewPopup: React.FC<MobileAccommodationOverviewPopupProps> = (props) => {
	useEffect(() => {
		console.log(props.accommodationDetails);
	}, []);
	function getAccommodationImages() {
		let images: string[] = [];
		props.accommodationDetails?.media.forEach((value) => {
			images.push(value.urls.small);
		});
		return images;
	}

	function handleFloorPlanExpand() {
		// let images: { title: string; description: string; imagePath: string }[] = [];
		// props.accommodationDetails?.layout.forEach((value) => {
		// 	images.push({
		// 		title: value.media.title,
		// 		description: value.media.description,
		// 		imagePath: value.media.urls.imagekit
		// 	});
		// });

		let images: Api.Media[] = [];
		let featureData: ImageTabProp[] = [];
		props.accommodationDetails?.layout.forEach((value) => {
			images.push(value.media);
			featureData.push({
				name: value.title,
				title: value.media.title,
				imagePath: value.media.urls.small,
				description: value.media.description,
				buttonLabel: value.media.title,
				otherMedia: []
			});
		});

		popupController.open<MobileLightBoxProps>(MobileLightBox, {
			imageData: images,
			featureData: featureData
		});
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

	function renderAccommodationSize() {
		let size = '';
		let sizeObj = props.accommodationDetails?.size;
		if (sizeObj) {
			size = `${sizeObj.min} to ${sizeObj.max} ${sizeObj.units === 'SquareFeet' ? `ft` : sizeObj.units}`;
		}
		return (
			<div className={'accommodationCounts'}>
				<Icon iconImg={'cms-icon-0503'} size={30} />
				<Label variant={'subtitle1'}>
					{size}
					{sizeObj?.units === 'SquareFeet' ? <span className={'superScript'}>2</span> : ''}
				</Label>
			</div>
		);
	}

	return (
		<Popup opened={props.opened}>
			<Paper className={'rsMobileAccommodationOverviewPopup'}>
				<div className={'popupHeader'}>
					<Label variant={'customThirteen'}>{props.accommodationDetails?.name}</Label>
					<Icon
						iconImg={'icon-close'}
						color={'#797979'}
						onClick={() => {
							popupController.close(MobileAccommodationOverviewPopup);
						}}
					/>
				</div>

				<Box padding={16}>
					<CarouselV2
						path={() => {}}
						imgPaths={getAccommodationImages()}
						onAddCompareClick={() => {}}
						onRemoveCompareClick={() => {}}
						onGalleryClick={() => {}}
					/>

					<Box display={'flex'} justifyContent={'space-between'} marginTop={16}>
						<div className={'accommodationCounts'}>
							<Icon iconImg={'cms-icon-0425'} size={30} />
							<Label variant={'subtitle1'}>{props.accommodationDetails?.bathroomCount}</Label>
						</div>
						<div className={'accommodationCounts'}>
							<Icon iconImg={'cms-icon-0412'} size={30} />
							<Label variant={'subtitle1'}>{props.accommodationDetails?.bedroomCount}</Label>
						</div>
						{props.accommodationDetails?.size ? renderAccommodationSize() : <></>}
					</Box>

					<Label variant={'accommodationOverviewCustomOne'} margin={'24px auto'}>
						{props.accommodationDetails?.shortDescription
							? props.accommodationDetails.shortDescription
							: props.accommodationDetails?.longDescription}
					</Label>

					{props.accommodationDetails?.amenities.length !== 0 ? (
						<div className={'amenitiesList'}>
							<Label variant={'customFifteen'} marginTop={20}>
								Amenities
							</Label>
							<Box display={'flex'} flexWrap={'wrap'}>
								{renderAmenities()}
							</Box>
						</div>
					) : (
						<></>
					)}

					{props.accommodationDetails?.layout.length !== 0 ? (
						<>
							<Label variant={'customFifteen'} margin={'20px auto'}>
								Floor Plan
							</Label>
							<img
								className={'floorPlanImg'}
								src={props.accommodationDetails?.layout[0].media.urls.small}
							/>

							<div className={'expandFloorPlanDiv'} onClick={handleFloorPlanExpand}>
								<Label>Expand floor plans</Label>
								<Icon iconImg={'cms-icon-0055'} size={22} />
							</div>
						</>
					) : (
						<></>
					)}
				</Box>
			</Paper>
		</Popup>
	);
};
export default MobileAccommodationOverviewPopup;
