import * as React from 'react';
import './AccommodationOptionsPopup.scss';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Paper from '../../components/paper/Paper';
import LabelButton from '../../components/labelButton/LabelButton';
import Icon from '@bit/redsky.framework.rs.icon';

export interface AccommodationOptionsPopupProps extends PopupProps {
	onRemove: () => void;
	onChangeRoom: () => void;
	onEditRoom: () => void;
	cancellable: boolean;
}

const AccommodationOptionsPopup: React.FC<AccommodationOptionsPopupProps> = (props) => {
	return (
		<Popup opened={props.opened}>
			<Paper className={'rsAccommodationOptionsPopup'}>
				<Icon
					iconImg={'icon-close'}
					className={'closeBtn'}
					cursorPointer
					onClick={() => {
						popupController.closeAll();
					}}
				/>
				{props.cancellable && (
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Remove'}
						onClick={() => {
							popupController.hide(AccommodationOptionsPopup);
							props.onRemove();
						}}
					/>
				)}
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'Change Room'}
					onClick={() => {
						popupController.closeAll();
						props.onChangeRoom();
					}}
				/>
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'Edit Details'}
					onClick={() => {
						popupController.hide(AccommodationOptionsPopup);
						props.onEditRoom();
					}}
				/>
			</Paper>
		</Popup>
	);
};

export default AccommodationOptionsPopup;
