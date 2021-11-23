import * as React from 'react';
import './TabbedImageCarouselImage.scss';
import Paper from '../../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { ImageTabProp } from '../../../components/tabbedImageCarousel/TabbedImageCarousel';
import { useState } from 'react';
import Img from '@bit/redsky.framework.rs.img';
import CarouselButtons from '../../../components/carouselButtons/CarouselButtons';

interface TabbedImageCarouselImageProps {
	tabData: ImageTabProp;
}

const TabbedImageCarouselImage: React.FC<TabbedImageCarouselImageProps> = (props) => {
	const [imageIndex, setImageIndex] = useState<number>(0);
	const maxImage = props.tabData.otherMedia.length - 1;
	return (
		<div
			className={'rsTabbedImageCarouselImage'}
			style={{ backgroundImage: `url(${props.tabData.otherMedia[imageIndex].urls.imageKit})` }}
		>
			<Paper boxShadow borderRadius={'5px'}>
				<Label variant={'customEighteen'} mb={12}>
					{props.tabData.otherMedia[imageIndex].title}
				</Label>
				<Label variant={'customNineteen'}>{props.tabData.otherMedia[imageIndex].description}</Label>
				<CarouselButtons
					position={'absolute'}
					top={'-75px'}
					right={'0'}
					onClickRight={() => {
						if (imageIndex === maxImage) {
							setImageIndex(0);
							return;
						}
						setImageIndex(imageIndex + 1);
					}}
					onClickLeft={() => {
						if (imageIndex === 0) {
							setImageIndex(maxImage);
							return;
						}
						setImageIndex(imageIndex - 1);
					}}
				/>
			</Paper>
		</div>
	);
};

export default TabbedImageCarouselImage;
