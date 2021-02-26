import React from 'react';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import './DashboardPage.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Box from '../../components/box/Box';
import TabbedImageGallery from '../../components/tabbedImageGallery/TabbedImageGallery';
import AmenitiesGalleryTabs from './AmenitiesGalleryTabs';
import LabelButton from '../../components/labelButton/LabelButton';
import LightboxPopup, { LightboxPopupProps } from '../../popups/lightboxPopup/LightboxPopup';
import LightboxPopupItems from './LightboxPopupItems';

const DashboardPage: React.FC = () => {
	return (
		<Page className="rsDashboardPage">
			<Box>
				<Label>Dashboard</Label>
			</Box>
			<Label>Plots Go Here</Label>
			<Box width="1440px" height="640px">
				<TabbedImageGallery tabs={AmenitiesGalleryTabs} />
			</Box>
			<Box>
				<LabelButton
					label="Lightbox"
					look="containedSecondary"
					variant="sectionHeader"
					onClick={() =>
						popupController.open<LightboxPopupProps>(LightboxPopup, { items: LightboxPopupItems })
					}
				/>
			</Box>
		</Page>
	);
};

export default DashboardPage;
