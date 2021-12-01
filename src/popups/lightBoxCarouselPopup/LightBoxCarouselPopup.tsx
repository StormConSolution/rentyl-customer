import * as React from 'react';
import './LightBoxCarouselPopup.scss';
import { Box, Popup, PopupProps } from '@bit/redsky.framework.rs.996';
import { ImageTabProp } from '../../components/tabbedImageCarousel/TabbedImageCarousel';
import Label from '@bit/redsky.framework.rs.label';
import Button from '@bit/redsky.framework.rs.button';
import { useEffect, useState } from 'react';
import Icon from '@bit/redsky.framework.rs.icon';
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';

import { ObjectUtils } from '../../utils/utils';
import CarouselImage from './CarouselImage/CarouselImage';

export interface TabbedCarouselPopupProps extends PopupProps {
	tabs?: ImageTabProp[];
	imageData?: Api.Media[];
	imageIndex?: number;
	activeTabName?: string;
}

const LightBoxCarouselPopup: React.FC<TabbedCarouselPopupProps> = (props) => {
	const [activeTabName, setActiveTabName] = useState<string>('');

	useEffect(() => {
		if (props.tabs && ObjectUtils.isArrayWithData(props.tabs)) {
			if (props.activeTabName) setActiveTabName(props.activeTabName);
			else setActiveTabName(props.tabs[0].name);
		}
	}, [props.activeTabName]);

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
				<Button key={'none'} look={'none'} className={'closeButtonTabs'}>
					<Icon
						iconImg={'icon-close'}
						size={30}
						color={'#797979'}
						onClick={() => {
							popupController.close(LightBoxCarouselPopup);
						}}
					/>
				</Button>
			];

			return <div className={'tabContainer'}>{newTabs}</div>;
		} else {
			return (
				<Button look={'none'} className={'closeButton'}>
					<Icon
						iconImg={'icon-close'}
						size={35}
						color={'#ffffff'}
						onClick={() => {
							popupController.close(LightBoxCarouselPopup);
						}}
					/>{' '}
				</Button>
			);
		}
	}

	function renderImages() {
		if (activeTabName && props.tabs && ObjectUtils.isArrayWithData(props.tabs)) {
			let activeTab: ImageTabProp | undefined = props.tabs.find((item) => item.name === activeTabName);
			if (!activeTab) return;
			return <CarouselImage tabData={activeTab} imageIndex={props.imageIndex} />;
		} else if (props.imageData) {
			return <CarouselImage imageData={props.imageData} imageIndex={props.imageIndex} />;
		}
	}

	return (
		<Popup opened={props.opened}>
			<div className={'rsLightBoxCarouselPopup'}>
				{renderTabs()}
				<div className={'imageCarouselWrapper'}>{renderImages()}</div>
			</div>
		</Popup>
	);
};

export default LightBoxCarouselPopup;
