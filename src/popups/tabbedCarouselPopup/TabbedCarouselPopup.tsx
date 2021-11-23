import * as React from 'react';
import './TabbedCarouselPopup.scss';
import { Box, Popup, PopupProps } from '@bit/redsky.framework.rs.996';
import { ImageTabProp } from '../../components/tabbedImageCarousel/TabbedImageCarousel';
import Label from '@bit/redsky.framework.rs.label';
import Button from '@bit/redsky.framework.rs.button';
import { useEffect, useState } from 'react';
import Icon from '@bit/redsky.framework.rs.icon';
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';
import TabbedImageCarouselImage from './tabbedImageCarouselImage/TabbedImageCarouselImage';

export interface TabbedCarouselPopupProps extends PopupProps {
	tabs: ImageTabProp[];
}

const TabbedCarouselPopup: React.FC<TabbedCarouselPopupProps> = (props) => {
	const [activeTabName, setActiveTabName] = useState<string>(props.tabs[0] ? props.tabs[0].name : '');

	useEffect(() => {
		document.querySelector('body')!.style.overflowY = 'hidden';

		return () => {
			document.querySelector('body')!.style.overflowY = 'unset';
			popupController.close(TabbedCarouselPopup);
		};
	}, []);

	function renderTabs() {
		let tabsArray = props.tabs.map((item, index) => {
			return (
				<Button
					look={'none'}
					className={'tab' + (activeTabName === item.name ? ' selected' : '')}
					onClick={() => {
						setActiveTabName(item.name);
					}}
					key={item.name}
				>
					<Label variant="customTen">{item.name}</Label>
				</Button>
			);
		});

		return [
			...tabsArray,
			<Button look={'none'} className={'closeButton'}>
				<Icon
					iconImg={'icon-close'}
					size={30}
					color={'#797979'}
					onClick={() => {
						popupController.close(TabbedCarouselPopup);
					}}
				/>
			</Button>
		];
	}

	function renderImages() {
		if (!activeTabName) return;
		let activeTab: ImageTabProp | undefined = props.tabs.find((item) => item.name === activeTabName);
		if (!activeTab) return;
		return <TabbedImageCarouselImage tabData={activeTab} />;
	}

	return (
		<Popup opened={props.opened}>
			<div className={'rsTabbedCarouselPopup'}>
				<div className={'tabContainer'}>{renderTabs()}</div>
				<div class={'imageCarouselWrapper'}>{renderImages()}</div>
			</div>
		</Popup>
	);
};

export default TabbedCarouselPopup;
