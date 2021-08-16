import * as React from 'react';
import './ConfirmOptionPopup.scss';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Icon from '@bit/redsky.framework.rs.icon';
import Paper from '../../components/paper/Paper';
import LabelButton from '../../components/labelButton/LabelButton';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

export interface ConfirmOptionPopupProps extends PopupProps {
	title: string;
	className?: string;
	bodyText?: string;
	confirm: () => void;
	cancelText: string;
	confirmText: string;
}

const ConfirmOptionPopup: React.FC<ConfirmOptionPopupProps> = (props) => {
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<div className={'rsConfirmOptionPopup'}>
				<Icon
					iconImg={'icon-close'}
					cursorPointer
					onClick={() => {
						popupController.close(ConfirmOptionPopup);
					}}
				/>
				<Paper className={'paperWrapper'} backgroundColor={'#fcfbf8'}>
					<Label variant={'h2'}>{props.title}</Label>
					<p>{props.bodyText}</p>
					<Box className={'buttonBox'} display={'flex'}>
						<LabelButton
							variant={'caption'}
							look={'containedSecondary'}
							onClick={() => popupController.closeAll()}
							label={props.cancelText}
							buttonType={'button'}
							className={'popupBtn'}
						/>
						<LabelButton
							variant={'caption'}
							look={'containedPrimary'}
							onClick={() => {
								props.confirm();
								popupController.close(ConfirmOptionPopup);
							}}
							label={props.confirmText}
							buttonType={'button'}
							className={'popupBtn'}
						/>
					</Box>
				</Paper>
			</div>
		</Popup>
	);
};

export default ConfirmOptionPopup;
