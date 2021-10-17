import './TabbedImageCarousel.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import React, { useEffect, useRef, useState } from 'react';
import Paper from '../paper/Paper';
import LabelButton from '../labelButton/LabelButton';
import LightBoxTwoPopup, { LightBoxTwoPopupProps } from '../../popups/lightBoxTwoPopup/LightBoxTwoPopup';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import MobileLightBoxTwoPopup, {
	MobileLightBoxTwoPopupProps
} from '../../popups/mobileLightBoxTwoPopup/MobileLightBoxTwoPopup';
import Img from '@bit/redsky.framework.rs.img';
import Icon from '@bit/redsky.framework.rs.icon';

export interface ImageTabProp {
	name: string;
	title: string;
	imagePath: string;
	description: string;
	buttonLabel?: string;
	otherMedia?: Api.Media[];
}

export interface TabbedImageCarouselProps {
	tabs: ImageTabProp[];
}

const TabbedImageCarousel: React.FC<TabbedImageCarouselProps> = function (props: TabbedImageCarouselProps) {
	const parentRef = useRef<HTMLElement>(null);
	const totalChildren = props.tabs.length;
	const [showIcons, setShowIcons] = useState<boolean>(false);
	const [imageViewIndex, setImageViewIndex] = useState<number>(1);
	const [activeTabName, setActiveTabName] = useState<string>(props.tabs[0] ? props.tabs[0].name : '');
	const size = useWindowResizeChange();

	useEffect(() => {
		if (parentRef.current) {
			if (parentRef.current.scrollWidth > 1440) {
				setShowIcons(true);
			}
		}
	}, []);

	function renderTab(tab: ImageTabProp, index: number): JSX.Element {
		return (
			<div
				className={'tab' + (activeTabName === tab.name ? ' activeTab' : '')}
				onClick={() => {
					setActiveTabName(tab.name);
				}}
				key={tab.name}
			>
				<Label variant="caption">{tab.name}</Label>
			</div>
		);
	}

	function renderAllTabs() {
		return props.tabs.map(renderTab);
	}

	function renderContent(tab: ImageTabProp) {
		return (
			<Box className={'galleryItem' + (activeTabName === tab.name ? ' shown' : '')} key={tab.name}>
				<div className="imageHolder">
					<Img
						alt={tab.name}
						src={tab.imagePath}
						width={375}
						height={570}
						rootMargin={'0px 0px 500px 0px'}
						srcSetSizes={[1440]}
					/>
				</div>
				<Paper boxShadow>
					<Label variant="h1">{tab.title}</Label>
					<Label variant="body2">{tab.description}</Label>
					{!!tab.buttonLabel && (
						<LabelButton
							look="containedPrimary"
							variant="button"
							label={tab.buttonLabel}
							onClick={() => {
								if (!tab.otherMedia) return;
								if (size === 'small') {
									popupController.open<MobileLightBoxTwoPopupProps>(MobileLightBoxTwoPopup, {
										imageIndex: 0,
										imageDataArray: tab.otherMedia.map((value) => {
											return {
												title: value.title,
												description: value.description,
												imagePath: value.urls.imageKit || ''
											};
										})
									});
								} else {
									popupController.open<LightBoxTwoPopupProps>(LightBoxTwoPopup, {
										imageIndex: 0,
										imageDataArray: tab.otherMedia.map((value) => {
											return {
												title: value.title,
												description: value.description,
												imagePath: value.urls.imageKit || ''
											};
										})
									});
								}
							}}
						/>
					)}
				</Paper>
			</Box>
		);
	}

	function renderAllTabContent() {
		return props.tabs.map(renderContent);
	}

	return (
		<Box className="rsTabbedImageCarousel">
			<Box className={'tabContainer'}>
				<Icon
					className={showIcons ? 'arrowIcon leftArrow' : 'none'}
					iconImg={'icon-chevron-left'}
					cursorPointer
					color={'white'}
					onClick={() => {
						let val = parentRef.current!.scrollLeft - parentRef.current!.offsetWidth;
						setImageViewIndex(imageViewIndex - 1);
						if (imageViewIndex <= 0) {
							val = parentRef.current!.offsetWidth * totalChildren;
							setImageViewIndex(totalChildren);
						}
						parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
					}}
				/>
				<div className="tabList" ref={parentRef}>
					{renderAllTabs()}
				</div>
				<Icon
					className={showIcons ? 'arrowIcon rightArrow' : 'none'}
					iconImg={'icon-chevron-right'}
					cursorPointer
					color={'white'}
					onClick={() => {
						let val = parentRef.current!.offsetWidth + parentRef.current!.scrollLeft;
						setImageViewIndex(imageViewIndex + 1);
						if (imageViewIndex > totalChildren) {
							val = 0;
							setImageViewIndex(1);
						}
						parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
					}}
				/>
			</Box>
			{renderAllTabContent()}
		</Box>
	);
};

export default TabbedImageCarousel;
