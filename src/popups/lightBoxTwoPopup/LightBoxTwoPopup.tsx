import * as React from 'react';
import './LightBoxTwoPopup.scss';
import { Popup } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import CarouselButtons from '../../components/carouselButtons/CarouselButtons';
import { useEffect, useRef, useState } from 'react';
import ImageTitleDescription from './imageTitleDescription/ImageTitleDescription';
import Icon from '@bit/redsky.framework.rs.icon';
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';

export interface LightBoxTwoPopupProps extends PopupProps {
	imageDataArray: { title: string; description: string; imagePath: string }[];
}

const LightBoxTwoPopup: React.FC<LightBoxTwoPopupProps> = (props) => {
	const parentRef = useRef<HTMLElement>(null);
	const [imageIndex, setImageIndex] = useState<number>(0);
	const [mainImage, setMainImage] = useState<string>('');
	const [imageDescription, setImageDescription] = useState<React.ReactNode>();
	const imageContainerWidth = 131.5;

	useEffect(() => {
		setMainImage(props.imageDataArray[imageIndex].imagePath);
		setImageDescription(
			<ImageTitleDescription
				title={props.imageDataArray[imageIndex].title}
				description={props.imageDataArray[imageIndex].description}
			/>
		);
	}, [imageIndex]);

	function renderImages() {
		return props.imageDataArray.map((item, index) => {
			return (
				<img
					key={index}
					className={`${index === imageIndex ? 'selected' : ''}`}
					src={item.imagePath}
					alt={''}
					onClick={() => {
						setImageIndex(index);
						let val = imageContainerWidth * index;
						parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
					}}
				/>
			);
		});
	}

	function renderMainImage() {
		return { backgroundImage: `url(${mainImage})` };
	}

	return (
		<Popup className={'rsLightBoxTwoPopup'} opened={props.opened}>
			<Box className={'lightBoxTwoContent'}>
				<div className={'mainImage'} style={renderMainImage()}>
					<Icon
						iconImg={'icon-close'}
						onClick={() => popupController.close(LightBoxTwoPopup)}
						cursorPointer
						color={'#ffffff'}
					/>
					{imageDescription || ''}
					<CarouselButtons
						position={'absolute'}
						bottom={'0'}
						left={'0px'}
						right={'0px'}
						onClickRight={() => {
							if (imageIndex === props.imageDataArray.length - 1) return;
							setImageIndex(imageIndex + 1);
							let val = imageContainerWidth * (imageIndex + 1);
							parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
						}}
						onClickLeft={() => {
							if (imageIndex === 0) return;
							setImageIndex(imageIndex - 1);
							let val = imageContainerWidth * (imageIndex - 1);
							if (val < 0) val = parentRef.current!.scrollLeft;
							parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
						}}
					/>
				</div>
				<div ref={parentRef} className={'imageCarousel'}>
					{renderImages()}
				</div>
			</Box>
		</Popup>
	);
};

export default LightBoxTwoPopup;