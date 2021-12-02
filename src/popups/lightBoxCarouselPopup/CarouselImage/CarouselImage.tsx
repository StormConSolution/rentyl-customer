import * as React from 'react';
import './CarouselImage.scss';
import Paper from '../../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { ImageTabProp } from '../../../components/tabbedImageCarousel/TabbedImageCarousel';
import { useEffect, useState } from 'react';
import Img from '@bit/redsky.framework.rs.img';
import CarouselButtons from '../../../components/carouselButtons/CarouselButtons';
import { ObjectUtils } from '../../../utils/utils';

interface TabbedImageCarouselImageProps {
	tabData?: ImageTabProp;
	imageData?: Api.Media[];
	defaultImageIndex?: number;
}

const CarouselImage: React.FC<TabbedImageCarouselImageProps> = (props) => {
	const [imageIndex, setImageIndex] = useState<number>(props.defaultImageIndex || 0);
	const media = renderMedia();
	const largestImageIndex = media.length - 1; //So it matches the index count for the images.

	useEffect(() => {
		const media = renderMedia();
		if (imageIndex >= media.length) {
			setImageIndex(0);
		}
	}, [props.tabData, props.imageData]);

	function renderMedia() {
		if (props.tabData) {
			return props.tabData.otherMedia;
		} else if (props.imageData && ObjectUtils.isArrayWithData(props.imageData)) {
			return props.imageData;
		} else {
			return [];
		}
	}

	function renderStyles() {
		let styles: any = { backgroundImage: `url(${media[imageIndex].urls.imageKit})` };
		if (!!props.tabData) {
			styles.height = `calc(100vh - 80px)`;
		} else {
			styles.height = '100vh';
		}
		return styles;
	}
	return imageIndex > largestImageIndex || media.length === 0 ? (
		<div />
	) : (
		<div className={'rsCarouselImage'} style={renderStyles()}>
			<Paper boxShadow borderRadius={'5px'}>
				<Label variant={'tabbedImageCarouselCustomOne'} mb={12}>
					{media[imageIndex].title}
				</Label>
				<Label variant={'tabbedImageCarouselCustomTwo'}>{media[imageIndex].description}</Label>
				<CarouselButtons
					position={'absolute'}
					top={'-75px'}
					right={'0'}
					onClickRight={() => {
						if (imageIndex === largestImageIndex) {
							setImageIndex(0);
							return;
						}
						setImageIndex(imageIndex + 1);
					}}
					onClickLeft={() => {
						if (imageIndex === 0) {
							setImageIndex(largestImageIndex);
							return;
						}
						setImageIndex(imageIndex - 1);
					}}
				/>
			</Paper>
		</div>
	);
};

export default CarouselImage;
