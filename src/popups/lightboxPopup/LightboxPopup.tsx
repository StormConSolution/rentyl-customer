import React, { useState } from 'react';
import Popup, { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Carousel from '../../components/carousel/Carousel';
import Label from '@bit/redsky.framework.rs.label';
import './LightboxPopup.scss';
import CarouselButtons from '../../components/carouselButtons/CarouselButtons';

export interface LightboxItem {
	thumbnailImagePath: string;
	imagePath: string;
	title: string;
	description: string;
}

export interface LightboxPopupProps extends PopupProps {
	items: Array<LightboxItem>;
}

const LightboxPopup: React.FC<LightboxPopupProps> = (props) => {
	const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
	const [maxImageIndex] = useState<number>(props.items?.length - 1);

	function renderSingleThumbnail(item: LightboxItem, index: number) {
		return (
			<img
				alt={''}
				key={index}
				src={item.thumbnailImagePath}
				className={activeImageIndex === index ? 'selected' : ''}
				onClick={() => setActiveImageIndex(index)}
			/>
		);
	}

	function renderThumbnails() {
		return props.items.map(renderSingleThumbnail);
	}

	function renderSingleInfoBox(item: LightboxItem, index: number) {
		return (
			<Box key={index} className={'infoBox ' + (activeImageIndex === index ? 'selected' : 'hidden')}>
				<Label variant="h2">{item.title}</Label>
				<Label variant="body2">{item.description}</Label>
			</Box>
		);
	}

	function renderInfoBoxes() {
		return props.items.map(renderSingleInfoBox);
	}

	function renderSingleActiveImage(item: LightboxItem, index: number) {
		return <img alt="" src={item.imagePath} className={activeImageIndex === index ? 'selected' : 'hidden'} />;
	}

	function renderActiveImages() {
		return props.items.map(renderSingleActiveImage);
	}

	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick className="rsLightboxPopup">
			<Box className={'lightboxPopupContent'}>
				<Box className="activeImage">
					{renderActiveImages()}
					{renderInfoBoxes()}
					<CarouselButtons
						onClickLeft={() => {
							let newIndex = activeImageIndex - 1;
							if (newIndex < 0) newIndex = maxImageIndex;
							setActiveImageIndex(newIndex);
						}}
						onClickRight={() => {
							let newIndex = activeImageIndex + 1;
							if (newIndex > maxImageIndex) newIndex = 0;
							setActiveImageIndex(newIndex);
						}}
					/>
				</Box>
				<Carousel imageIndex={activeImageIndex}>{renderThumbnails()}</Carousel>

				<Icon
					iconImg={'icon-close'}
					className={'closeBtn'}
					cursorPointer
					onClick={() => {
						popupController.close(LightboxPopup);
					}}
				/>
			</Box>
		</Popup>
	);
};

export default LightboxPopup;
