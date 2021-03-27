import * as React from 'react';
import './MobileLightBoxTwoPopup.scss';
import { Popup } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Accordion from '@bit/redsky.framework.rs.accordion';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Carousel from '../../components/carousel/Carousel';
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';
import Icon from '@bit/redsky.framework.rs.icon';

export interface MobileLightBoxTwoPopupProps extends PopupProps {
	imageDataArray: { title: string; description: string; imagePath: string }[];
	imageIndex?: number;
}

const MobileLightBoxTwoPopup: React.FC<MobileLightBoxTwoPopupProps> = (props) => {
	function renderCarouselChildren() {
		return props.imageDataArray.map((item, index) => {
			return (
				<Box key={index} className={'lightBoxImgContainer'}>
					<Icon
						iconImg={'icon-close'}
						onClick={() => popupController.close(MobileLightBoxTwoPopup)}
						cursorPointer
						color={'#ffffff'}
					/>
					<img src={item.imagePath} alt={item.title} />
					<Accordion title={item.title} backgroundColor={'rgba(30,24,11,.4)'}>
						<Label variant={'body2'}>{item.description}</Label>
					</Accordion>
				</Box>
			);
		});
	}

	return (
		<Popup opened={props.opened}>
			<div className={'rsMobileLightBoxTwoPopup'}>
				<Carousel children={renderCarouselChildren()} imageIndex={props.imageIndex} />
			</div>
		</Popup>
	);
};

export default MobileLightBoxTwoPopup;
