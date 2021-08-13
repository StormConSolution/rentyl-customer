import * as React from 'react';
import './WhatToEditPopup.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Paper from '../../components/paper/Paper';
import LabelButton from '../../components/labelButton/LabelButton';
import Icon from '@bit/redsky.framework.rs.icon';

export interface WhatToEditPopupProps extends PopupProps {
	cancel: () => void;
	changeRoom: () => void;
	editInfo: () => void;
	editRoomInfo: () => void;
}

const WhatToEditPopup: React.FC<WhatToEditPopupProps> = (props) => {
	const size = useWindowResizeChange();
	return (
		<Popup opened={props.opened}>
			<Paper className={'rsWhatToEditPopup'}>
				<Icon
					iconImg={'icon-close'}
					className={'closeBtn'}
					cursorPointer
					onClick={() => {
						popupController.closeAll();
					}}
				/>
				<Box
					display={'flex'}
					width={size === 'small' ? '300px' : '375px'}
					justifyContent={'space-around'}
					alignItems={'center'}
				>
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Change Room Details'}
						onClick={() => {
							popupController.hide(WhatToEditPopup);
							props.editRoomInfo();
						}}
					/>
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Change Payment Info'}
						onClick={() => {
							popupController.closeAll();
							props.editInfo();
						}}
					/>
				</Box>
			</Paper>
		</Popup>
	);
};

export default WhatToEditPopup;
