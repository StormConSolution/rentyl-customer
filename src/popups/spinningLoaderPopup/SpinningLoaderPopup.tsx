import * as React from 'react';
import './SpinningLoaderPopup.scss';
import { Popup } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';

export interface SpinningLoaderPopupProps extends PopupProps {}

const SpinningLoaderPopup: React.FC<SpinningLoaderPopupProps> = (props) => {
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<div className={'rsSpinningLoaderPopup'}>
				<div className="loader" />
			</div>
		</Popup>
	);
};

export default SpinningLoaderPopup;
