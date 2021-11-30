import React from 'react';
import './DestinationExperienceImageGallery.scss';
import Label from '@bit/redsky.framework.rs.label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Icon from '@bit/redsky.framework.rs.icon';
import { popupController } from '@bit/redsky.framework.rs.996';
import LightBoxCarouselPopup, {
	TabbedCarouselPopupProps
} from '../../popups/lightBoxCarouselPopup/LightBoxCarouselPopup';
import { ImageTabProp } from '../tabbedImageCarousel/TabbedImageCarousel';

interface DestinationExperienceImageGalleryProps {
	experiences: Api.Destination.Res.DestinationExperience[];
	className?: string;
}

const DestinationExperienceImageGallery: React.FC<DestinationExperienceImageGalleryProps> = (props) => {
	const size = useWindowResizeChange();

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
					className={'experienceImage'}
					style={{ backgroundImage: `url(${primaryMedia}?tr=w-$556,tr=h-320)` }}
				>
					<Label className={'labelImageText'} variant={'experienceImageCustomOne'}>
						{item.title}
					</Label>
					<Icon
						className={'expandIcon'}
						iconImg={'icon-expand'}
						color={'#FFFFFF'}
						onClick={() => {
							popupController.open<TabbedCarouselPopupProps>(LightBoxCarouselPopup, {
								tabs: formatCarouselTabs()
								// imageIndex: 3
							});
							// popupController.open<LightBoxCarouselPopup>(LightBoxCarouselPopup, );
						}}
						cursorPointer
						size={21}
					/>
				</div>
			);
		});
		if (size === 'small') return destinationArray[0];
		return destinationArray;
	}

	return (
		<div className={`rsDestinationExperienceImageGallery ${props.className || ''}`}>
			{renderExperienceLabelImage()}
		</div>
	);
};

export default DestinationExperienceImageGallery;
