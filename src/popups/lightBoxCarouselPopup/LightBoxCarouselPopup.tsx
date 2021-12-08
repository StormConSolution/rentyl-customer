import * as React from 'react';
import './LightBoxCarouselPopup.scss';
import { Box, Popup, PopupProps } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import Button from '@bit/redsky.framework.rs.button';
import { useEffect, useRef, useState } from 'react';
import Icon from '@bit/redsky.framework.rs.icon';
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';
import { ObjectUtils } from '../../utils/utils';
import CarouselButtons from '../../components/carouselButtons/CarouselButtons';
import Paper from '../../components/paper/Paper';
import Img from '@bit/redsky.framework.rs.img';

export interface TabbedCarouselPopupProps extends PopupProps {
	tabs?: Misc.ImageTabProp[];
	imageData?: Api.Media[];
	defaultImageIndex?: number;
	activeTabName?: string;
}

const LightBoxCarouselPopup: React.FC<TabbedCarouselPopupProps> = (props) => {
	const imageWrapperRef = useRef<HTMLDivElement>(null);
	const [activeTabName, setActiveTabName] = useState<string>('');
	const [imageIndex, setImageIndex] = useState<number>(props.defaultImageIndex || 0);
	const [media, setMedia] = useState<Api.Media[]>([]);
	const [largestImageIndex, setLargestImageIndex] = useState<number>(0);

	useEffect(() => {
		if (!props.tabs || !ObjectUtils.isArrayWithData(props.tabs)) return;
		if (props.activeTabName) setActiveTabName(props.activeTabName);
		else setActiveTabName(props.tabs[0].name);
		setTimeout(() => {
			imageWrapperRef.current!.scrollTo({ top: 0, left: 0 }); //Reset position to 0;
		}, 300);
	}, [props.activeTabName]);

	useEffect(() => {
		if (!media || !ObjectUtils.isArrayWithData(media)) return;
		if (imageIndex >= media.length) {
			setImageIndex(0);
		}
	}, [media]);

	useEffect(() => {
		if (!props.defaultImageIndex) return;

		let val = imageWrapperRef.current!.offsetWidth * props.defaultImageIndex;
		imageWrapperRef.current!.scrollTo({ top: 0, left: 0 }); //Reset position to 0;
		setTimeout(() => {
			imageWrapperRef.current!.scrollTo({ top: 0, left: val });
		}, 100);
		setImageIndex(props.defaultImageIndex);
	}, [props.defaultImageIndex]);

	useEffect(() => {
		if (props.tabs && ObjectUtils.isArrayWithData(props.tabs)) {
			let activeTab: Misc.ImageTabProp | undefined = props.tabs.find((item) => item.name === activeTabName);
			if (!activeTab) return;
			setMedia(activeTab.otherMedia);
			setLargestImageIndex(activeTab.otherMedia.length - 1); //So it matches the index count for the images.
		} else if (props.imageData && ObjectUtils.isArrayWithData(props.imageData)) {
			setMedia(props.imageData);
			setLargestImageIndex(props.imageData.length - 1); //So it matches the index count for the images.
		}
		setImageIndex(0);
		imageWrapperRef.current!.scrollTo({ top: 0, left: 0 });
	}, [activeTabName, props.imageData]);

	function renderTabs() {
		if (props.tabs && ObjectUtils.isArrayWithData(props.tabs)) {
			let tabsArray = props.tabs.map((item, index) => {
				return (
					<Button
						key={item.name}
						look={'none'}
						className={'tab' + (activeTabName === item.name ? ' selected' : '')}
						onClick={() => {
							setActiveTabName(item.name);
						}}
					>
						<Label variant="customTen">{item.name}</Label>
					</Button>
				);
			});

			let newTabs = [
				...tabsArray,
				<Button
					key={'none'}
					look={'none'}
					className={'closeButtonTabs'}
					onClick={() => {
						popupController.close(LightBoxCarouselPopup);
					}}
				>
					<Icon iconImg={'icon-close'} size={30} color={'#797979'} />
				</Button>
			];

			return <div className={'tabContainer'}>{newTabs}</div>;
		} else {
			return (
				<Button
					look={'none'}
					className={'closeButton'}
					onClick={() => {
						popupController.close(LightBoxCarouselPopup);
					}}
				>
					<Icon iconImg={'icon-close'} size={35} color={'#ffffff'} />{' '}
				</Button>
			);
		}
	}

	function renderImages() {
		return media.map((item, index) => {
			return <Img key={item.id} src={item.urls.imageKit} alt={item.type} width={'1920px'} height={'auto'} />;
		});
	}

	function renderTitleDescription() {
		if (!ObjectUtils.isArrayWithData(media)) return;
		return !!media[imageIndex].title.length || !!media[imageIndex].description.length ? (
			<Paper boxShadow borderRadius={'5px'}>
				<Label variant={'tabbedImageCarouselCustomOne'} mb={12}>
					{media[imageIndex].title}
				</Label>
				<Label variant={'tabbedImageCarouselCustomTwo'}>{media[imageIndex].description}</Label>
			</Paper>
		) : (
			''
		);
	}

	function renderCarouselButtons() {
		if (media.length === 1) return;
		return (
			<CarouselButtons
				position={'absolute'}
				top={'-75px'}
				right={'30px'}
				onClickRight={() => {
					let val = imageWrapperRef.current!.offsetWidth + imageWrapperRef.current!.scrollLeft;
					if (imageIndex >= largestImageIndex) {
						val = 0;
						setImageIndex(0);
					} else setImageIndex(imageIndex + 1);

					imageWrapperRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
				}}
				onClickLeft={() => {
					let val = imageWrapperRef.current!.scrollLeft - imageWrapperRef.current!.offsetWidth;

					if (imageIndex <= 0) {
						val = imageWrapperRef.current!.offsetWidth * largestImageIndex;
						setImageIndex(largestImageIndex);
					} else setImageIndex(imageIndex - 1);

					imageWrapperRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
				}}
			/>
		);
	}

	return (
		<Popup opened={props.opened}>
			<div className={'rsLightBoxCarouselPopup'}>
				{renderTabs()}
				<div ref={imageWrapperRef} className={'imageWrapper'}>
					{renderImages()}
				</div>
				<Box className={'buttonAndPaperWrapper'}>
					{renderCarouselButtons()}
					{renderTitleDescription()}
				</Box>
			</div>
		</Popup>
	);
};

export default LightBoxCarouselPopup;
