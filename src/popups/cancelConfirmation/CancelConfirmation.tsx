import * as React from 'react';
import './CancelConfirmation.scss';
import { Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Box from '../../components/box/Box';
import Icon from '@bit/redsky.framework.rs.icon';
import Paper from '../../components/paper/Paper';
import LabelButton from '../../components/labelButton/LabelButton';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

export interface CancelConfirmationProps extends PopupProps {
	title: string;
	onChange: (value: any) => void;
	onClose: () => void;
	popupOnClick?: (pinToFirst: boolean) => void;
	className?: string;
	cancelPolicy?: string;
	confirm: () => void;
}

const CancelConfirmation: React.FC<CancelConfirmationProps> = (props) => {
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<div className={'rsCancelConfirmation'}>
				<Icon
					iconImg={'icon-close'}
					cursorPointer
					onClick={() => {
						popupController.close(CancelConfirmation);
					}}
				/>
				<Paper className={'paperWrapper'} backgroundColor={'#fcfbf8'}>
					<Label variant={'h2'}>{props.title}</Label>
					<p>{props.cancelPolicy}</p>
					<Box className={'buttonBox'} display={'flex'}>
						<LabelButton
							variant={'caption'}
							look={'containedSecondary'}
							onClick={() => popupController.close(CancelConfirmation)}
							label={'Do Not Cancel'}
							buttonType={'button'}
							className={'popupBtn'}
						/>
						<LabelButton
							variant={'caption'}
							look={'containedPrimary'}
							onClick={() => {
								props.confirm();
								popupController.close(CancelConfirmation);
							}}
							label={'Cancel Now'}
							buttonType={'button'}
							className={'popupBtn'}
						/>
					</Box>
				</Paper>
			</div>
		</Popup>
	);
};

export default CancelConfirmation;
