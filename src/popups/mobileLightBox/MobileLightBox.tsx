import * as React from 'react';
import './MobileLightBox.scss';
import { Box, Popup, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import IconLabel from '../../components/iconLabel/IconLabel';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import CarouselButtons from '../../components/carouselButtons/CarouselButtons';
import { ImageTabProp } from '../../components/tabbedImageCarousel/TabbedImageCarousel';
import Button from '@bit/redsky.framework.rs.button';
import { ObjectUtils } from '../../utils/utils';
import { useEffect, useRef, useState } from 'react';

interface ObserverAttributes extends NamedNodeMap {
	dataid: any;
	dataindex: any;
}

export interface MobileLightBoxProps extends PopupProps {
	imageData?: Api.Media[];
	featureData?: ImageTabProp[];
}

const MobileLightBox: React.FC<MobileLightBoxProps> = (props) => {
	const carouselButtonRef = useRef<HTMLDivElement>(null);
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState<ImageTabProp | undefined>(
		!!props.featureData ? props.featureData[0] : undefined
	);
	const [titleDescription, setTitleDescription] = useState<{ title: string; description: string }>();
	const [imageIndex, setImageIndex] = useState<number>(0);
	let totalChildren = getTotalImagesCount();
	const imgOptions = {
		rootMargin: '-40%',
		threshold: 0
	};

	useEffect(() => {
		let popup: HTMLDivElement | null = document.querySelector('.rs-popup');
		if (!popup) return;
		popup!.style.backgroundColor = 'rgba(0,0,0,.8)';
		document.body.style.overflow = 'hidden';

		return () => {
			popup!.style.backgroundColor = 'rgba(0,0,0,.18)';
			document.body.style.overflow = 'unset';
		};
	}, []);

	useEffect(() => {
		setTimeout(() => {
			imageContainerRef.current!.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		}, 300);
	}, [activeTab]);

	useEffect(() => {
		const imgObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				} else {
					let attributes = entry.target.attributes as ObserverAttributes;
					if (!!props.featureData && activeTab) {
						let activeImage = activeTab.otherMedia.find(
							(item) => item.id === parseInt(attributes.dataid.value)
						);
						if (!activeImage) return;
						setImageIndex(parseInt(attributes.dataindex.value));
						setTitleDescription({ title: activeImage.title, description: activeImage.description });
					} else if (!!props.imageData) {
						let activeImage = props.imageData.find((item) => item.id === parseInt(attributes.dataid.value));
						if (!activeImage) return;
						setImageIndex(parseInt(attributes.dataindex.value));
						setTitleDescription({ title: activeImage.title, description: activeImage.description });
					}
					let carouselBtnRef = carouselButtonRef.current;
					if (!carouselBtnRef) return;
					if (carouselBtnRef.classList.contains('hide')) {
						carouselBtnRef.classList.remove('hide');
					}
				}
			});
		}, imgOptions);

		let images = document.querySelectorAll('.lightBoxImage');

		images.forEach((item) => {
			imgObserver.observe(item);
		});

		return () => {
			images.forEach((item) => {
				imgObserver.unobserve(item);
			});
		};
	}, [activeTab]);

	function getTotalImagesCount() {
		if (!!activeTab) {
			return activeTab.otherMedia.length - 1;
		} else if (!!props.imageData && ObjectUtils.isArrayWithData(props.imageData)) {
			return props.imageData.length - 1;
		} else {
			return 0;
		}
	}

	function renderFeatureNavButtons() {
		if (!props.featureData || !ObjectUtils.isArrayWithData(props.featureData)) return;

		return props.featureData.map((item, index) => {
			let activeTabName = activeTab ? activeTab.name : '';
			return (
				<Button
					look={'none'}
					className={'tab' + (activeTabName === item.name ? ' selected' : '')}
					onClick={() => {
						setActiveTab(item);
					}}
					key={item.name}
				>
					<Label variant="mobileLightBoxCustomThree">{item.name}</Label>
				</Button>
			);
		});
	}

	function renderImages() {
		if (!!props.featureData) {
			if (!activeTab) return;
			return activeTab.otherMedia.map((image, index) => {
				return (
					<img
						key={image.id}
						dataid={image.id}
						dataindex={index}
						className={'lightBoxImage'}
						src={image.urls.imageKit}
						alt={''}
						width={'100%'}
						height={'auto'}
					/>
				);
			});
		}
		if (!!props.imageData) {
			return props.imageData.map((image, index) => {
				return (
					<img
						key={image.id}
						dataid={image.id}
						dataindex={index}
						className={'lightBoxImage'}
						src={image.urls.imageKit}
						alt={''}
						width={'100%'}
						height={'auto'}
					/>
				);
			});
		}
	}

	function renderDescriptionPaper() {
		if (!titleDescription || !titleDescription.description) return;

		return (
			<Paper borderRadius={'20px'} boxShadow>
				<Label
					key={Date.now()} //THIS IS NEEDED TO RE-RENDER THE SHOW-MORE BTN
					variant={'mobileLightBoxCustomTwo'}
					lineClamp={4}
					showMoreButton
					showLessText={'View Less'}
					showMoreText={'View More'}
					onShowMoreTextClick={() => {
						hideShowCarouselButtons();
					}}
				>
					{titleDescription ? titleDescription.description : ''}
				</Label>
			</Paper>
		);
	}

	function hideShowCarouselButtons() {
		let carouselBtnRef = carouselButtonRef.current;
		if (!carouselBtnRef) return;
		if (carouselBtnRef.classList.contains('hide')) {
			carouselBtnRef.classList.remove('hide');
		} else {
			carouselBtnRef.classList.add('hide');
		}
	}

	return (
		<Popup opened={props.opened}>
			<div className={'rsMobileLightBox'}>
				<div className={'topNav'}>
					<IconLabel
						labelVariant={'mobileLightBoxCustomOne'}
						labelName={'Back'}
						iconImg={'icon-chevron-left'}
						iconPosition={'left'}
						iconSize={12}
						onClick={() => {
							popupController.close(MobileLightBox);
						}}
					/>
				</div>
				<div className={'featureNav'}>{renderFeatureNavButtons()}</div>
				<Box className={'imageContainer'} boxRef={imageContainerRef}>
					{renderImages()}
				</Box>

				<Box className={'bottomContent'}>
					<CarouselButtons
						carouselButtonRef={carouselButtonRef}
						onClickLeft={() => {
							let val = imageContainerRef.current!.scrollLeft - imageContainerRef.current!.offsetWidth;

							if (imageIndex <= 1) {
								val = imageContainerRef.current!.offsetWidth * totalChildren;
								setImageIndex(totalChildren);
							}
							imageContainerRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
						}}
						onClickRight={() => {
							let val = imageContainerRef.current!.offsetWidth + imageContainerRef.current!.scrollLeft;
							if (imageIndex >= totalChildren) {
								val = 0;
							}
							imageContainerRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
						}}
					/>
					{renderDescriptionPaper()}
				</Box>
				<Label className={'imageCount'} variant={'body1'} color={'#ffffff'}>{`${imageIndex + 1}/${
					totalChildren + 1
				}`}</Label>
			</div>
		</Popup>
	);
};

export default MobileLightBox;
