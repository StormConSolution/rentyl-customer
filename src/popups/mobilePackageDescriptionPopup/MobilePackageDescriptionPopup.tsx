import * as React from 'react';
import './MobilePackageDescriptionPopup.scss';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import Img from '@bit/redsky.framework.rs.img';
import Button from '@bit/redsky.framework.rs.button';

export interface MobilePackageDescriptionPopupProps extends PopupProps {
	packageImage: string;
	description: string;
	addPackage: () => void;
	isAdded: boolean;
}

const MobilePackageDescriptionPopup: React.FC<MobilePackageDescriptionPopupProps> = (props) => {
	return (
		<Popup opened={props.opened}>
			<div className={'rsMobilePackageDescriptionPopup'}>
				<Box className="popupHeader">
					<Label variant="body3">Add Package</Label>
					<Icon
						iconImg={'icon-close'}
						size={15}
						color="#797979"
						onClick={() => {
							popupController.close(MobilePackageDescriptionPopup);
						}}
					/>
				</Box>
				<Box className="popupBody">
					<Img
						src={props.packageImage}
						height={204}
						width={304}
						className="packageImage"
						alt={`package-display`}
					/>
					<Label variant="subtitle1" paddingY={10}>
						{props.description}
					</Label>
					<Button
						look={'none'}
						onClick={() => {
							props.addPackage();
							popupController.close(MobilePackageDescriptionPopup);
						}}
						className="addPackageButton"
					>
						{props.isAdded ? 'Remove Package' : 'Add Package'}
					</Button>
				</Box>
			</div>
		</Popup>
	);
};

export default MobilePackageDescriptionPopup;
