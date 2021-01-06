import * as React from 'react';
import './TestPopup.scss';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Box from '../../components/box/Box';
import Icon from '@bit/redsky.framework.rs.icon';

interface TestPopupProps extends PopupProps {}

const TestPopup: React.FC<TestPopupProps> = (props) => {
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Box className={'rsTestPopup'}>
				<Icon
					iconImg={'icon-close'}
					className={'closeBtn'}
					cursorPointer
					onClick={() => {
						popupController.close(TestPopup);
					}}
				/>
				<h1>I am a popup!</h1>
			</Box>
		</Popup>
	);
};

export default TestPopup;
