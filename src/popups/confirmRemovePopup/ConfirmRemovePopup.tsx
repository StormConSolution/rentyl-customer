import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import * as React from 'react';
import './ConfirmRemovePopup.scss';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../../components/labelButton/LabelButton';

export interface ConfirmRemovePopupProps extends PopupProps {
	onRemove: () => void;
}

const ConfirmRemovePopup: React.FC<ConfirmRemovePopupProps> = (props) => {
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper className={'rsConfirmRemovePopup'}>
				<Icon
					iconImg={'icon-close'}
					onClick={() => {
						popupController.close(ConfirmRemovePopup);
					}}
					cursorPointer
				/>
				<Label variant={'h2'} mb={40}>
					REMOVE
				</Label>
				<Box display={'grid'} style={{ placeItems: 'center' }}>
					<Label variant={'h3'}>
						Are you sure you want to remove this room/property from your itinerary?
					</Label>
					<Box display={'flex'} marginTop={30} width={250} justifyContent={'space-between'}>
						<LabelButton
							look={'containedPrimary'}
							variant={'button'}
							label={'Remove'}
							onClick={props.onRemove}
						/>
						<LabelButton
							look={'containedSecondary'}
							variant={'button'}
							label={'Cancel'}
							onClick={() => {
								popupController.close(ConfirmRemovePopup);
							}}
						/>
					</Box>
				</Box>
			</Paper>
		</Popup>
	);
};

export default ConfirmRemovePopup;
