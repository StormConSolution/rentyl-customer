import React, { useRef, useState } from 'react';
import './DestinationExperienceImageGallery.scss';
import Label from '@bit/redsky.framework.rs.label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import LightBoxCarouselPopup, {
	TabbedCarouselPopupProps
} from '../../popups/lightBoxCarouselPopup/LightBoxCarouselPopup';
import { ImageTabProp } from '../tabbedImageCarousel/TabbedImageCarousel';
import MobileLightBox, { MobileLightBoxProps } from '../../popups/mobileLightBox/MobileLightBox';
import Button from '@bit/redsky.framework.rs.button';

interface DestinationExperienceImageGalleryProps {
	experiences: Api.Destination.Res.DestinationExperience[];
	className?: string;
}

const DestinationExperienceImageGallery: React.FC<DestinationExperienceImageGalleryProps> = (props) => {
	const size = useWindowResizeChange();
	const parentRef = useRef<HTMLDivElement>(null);
	const [imageViewIndex, setImageViewIndex] = useState<number>(1);
	const totalChildren = props.experiences.length;

	function getPrimaryMediaUrl(item: Api.Destination.Res.DestinationExperience): string {
		for (let value of item.media) {
			if (!value.isPrimary) continue;
			return value.urls.imageKit;
		}
		return '';
	}

	function formatCarouselTabs() {
		let imageTabArray: ImageTabProp[] = [];
		props.experiences.forEach((item) => {
			imageTabArray.push({
				name: item.title,
				title: item.title,
				imagePath: getPrimaryMediaUrl(item),
				description: item.description,
				otherMedia: item.media
			});
		});
		return imageTabArray;
	}

	function renderExperienceLabelImage() {
		let destinationArray: any = [];
		props.experiences.forEach((item) => {
			if (!item.isHighlighted) return true;
			let primaryMedia: any = getPrimaryMediaUrl(item);
			if (primaryMedia === '') return false;
			destinationArray.push(
				<div
					key={item.title}
					className={'experienceImage'}
					style={{ backgroundImage: `url(${primaryMedia}?tr=w-$556,tr=h-320)` }}
				>
					<Box className={'textAndLogoWrapper'}>
						<Label className={'labelImageText'} variant={'experienceImageCustomOne'}>
							{item.title}
						</Label>
						<Icon
							className={'expandIcon'}
							iconImg={'icon-expand'}
							color={'#FFFFFF'}
							onClick={() => {
								if (size === 'small') {
									popupController.open<MobileLightBoxProps>(MobileLightBox, {
										featureData: formatCarouselTabs(),
										activeTabName: item.title
									});
								} else {
									popupController.open<TabbedCarouselPopupProps>(LightBoxCarouselPopup, {
										tabs: formatCarouselTabs(),
										activeTabName: item.title
									});
								}
							}}
							cursorPointer
							size={21}
						/>
					</Box>
				</div>
			);
		});
		return destinationArray;
	}

	return size === 'small' ? (
		<div className={`rsDestinationExperienceImageGallery ${props.className || ''}`}>
			<div className={'imageWrapper'} ref={parentRef}>
				{renderExperienceLabelImage()}
			</div>
			<Button
				className={'clickLeft'}
				look={'none'}
				onClick={(event) => {
					event.stopPropagation();
					let val = parentRef.current!.scrollLeft - parentRef.current!.offsetWidth;
					setImageViewIndex(imageViewIndex - 1);
					if (imageViewIndex <= 1) {
						val = parentRef.current!.offsetWidth * totalChildren;
						setImageViewIndex(totalChildren);
					}
					parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
				}}
			>
				<Icon iconImg={'icon-chevron-left'} color={'#001933'} size={8} />
			</Button>
			<Button
				className={'clickRight'}
				look={'none'}
				onClick={(event) => {
					event.stopPropagation();
					let val = parentRef.current!.offsetWidth + parentRef.current!.scrollLeft;
					setImageViewIndex(imageViewIndex + 1);
					if (imageViewIndex >= totalChildren) {
						val = 0;
						setImageViewIndex(1);
					}
					parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
				}}
			>
				<Icon iconImg={'icon-chevron-right'} color={'#001933'} size={8} />
			</Button>
		</div>
	) : (
		<div className={`rsDestinationExperienceImageGallery ${props.className || ''}`}>
			{renderExperienceLabelImage()}
		</div>
	);
};

export default DestinationExperienceImageGallery;
