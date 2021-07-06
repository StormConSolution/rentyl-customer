import * as React from 'react';
import './WhatToEditPopup.scss';
import useWindowResizeChange from '../../../customHooks/useWindowResizeChange';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Paper from '../../../components/paper/Paper';
import LabelButton from '../../../components/labelButton/LabelButton';
import Icon from '@bit/redsky.framework.rs.icon';
import Box from '../../../components/box/Box';

export interface WhatToEditPopupProps extends PopupProps {
	cancel: () => void;
	changeRoom: () => void;
	editInfo: () => void;
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
						popupController.close(WhatToEditPopup);
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
						label={'Cancel'}
						onClick={() => {
							popupController.close(WhatToEditPopup);
							props.cancel();
						}}
					/>
					{/*<LabelButton*/}
					{/*	look={'containedPrimary'}*/}
					{/*	variant={'button'}*/}
					{/*	label={'Change Room'}*/}
					{/*	onClick={() => {*/}
					{/*		popupController.close(WhatToEditPopup);*/}
					{/*		props.changeRoom();*/}
					{/*	}}*/}
					{/*/>*/}
					<LabelButton
						look={'containedPrimary'}
						variant={'button'}
						label={'Change Payment Info'}
						onClick={() => {
							popupController.close(WhatToEditPopup);
							props.editInfo();
						}}
					/>
				</Box>
			</Paper>
		</Popup>
	);
};

export default WhatToEditPopup;
