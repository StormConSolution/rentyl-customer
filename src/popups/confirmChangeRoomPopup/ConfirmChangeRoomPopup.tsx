import * as React from 'react';
import './ConfirmChangeRoomPopup.scss';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import LabelButton from '../../components/labelButton/LabelButton';
import Paper from '../../components/paper/Paper';

export interface ConfirmChangeRoomPopupProps extends PopupProps {
	onUpdateRoomClick: () => void;
}

const ConfirmChangeRoomPopup: React.FC<ConfirmChangeRoomPopupProps> = (props) => {
	return (
		<Popup opened={props.opened}>
			<Paper className={'rsConfirmChangeRoomPopup'}>
				<Icon
					iconImg={'icon-close'}
					onClick={() => {
						popupController.close(ConfirmChangeRoomPopup);
					}}
					cursorPointer
				/>
				<Label variant={'h2'} mb={40}>
					UPDATE ROOM
				</Label>
				<Box display={'grid'} style={{ placeItems: 'center' }}>
					<Label variant={'h3'}>
						You are updating your room and will cancel your previous room reservation.
					</Label>
					<Box display={'flex'} marginTop={30} width={250} justifyContent={'space-between'}>
						<LabelButton
							look={'containedPrimary'}
							variant={'button'}
							label={'Update Room'}
							onClick={props.onUpdateRoomClick}
						/>
						<LabelButton
							look={'containedSecondary'}
							variant={'button'}
							label={'Cancel'}
							onClick={() => {
								popupController.close(ConfirmChangeRoomPopup);
							}}
						/>
					</Box>
				</Box>
			</Paper>
		</Popup>
	);
};

export default ConfirmChangeRoomPopup;
