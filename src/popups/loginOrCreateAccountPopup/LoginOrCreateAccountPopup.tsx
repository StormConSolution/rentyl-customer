import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import * as React from 'react';
import './LoginOrCreateAccountPopup.scss';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import router from '../../utils/router';
import Icon from '@bit/redsky.framework.rs.icon';
import LinkButton from '../../components/linkButton/LinkButton';

export interface LoginOrCreateAccountPopupProps extends PopupProps {
	query: string;
}

const LoginOrCreateAccountPopup: React.FC<LoginOrCreateAccountPopupProps> = (props) => {
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper
				className={'rsLoginOrCreateAccountPopup'}
				width={'420px'}
				padding={'25px'}
				borderRadius={'4px'}
				position={'relative'}
			>
				<Icon
					iconImg={'icon-close'}
					onClick={() => {
						popupController.close(LoginOrCreateAccountPopup);
					}}
					size={14}
					cursorPointer
				/>
				<Label variant={'h2'} marginBottom={'30px'}>
					It looks like you're not logged in.
					<br />
					Lets change that.
				</Label>
				<Box display={'flex'} justifyContent={'space-evenly'} width={'100%'}>
					<LinkButton
						look={'containedPrimary'}
						label={'Log in'}
						onClick={() => {
							popupController.close(LoginOrCreateAccountPopup);
						}}
						path={`/signin?data=${encodeURI(props.query)}`}
					/>
					<LinkButton
						look={'containedPrimary'}
						label={'Sign up'}
						onClick={() => {
							popupController.close(LoginOrCreateAccountPopup);
						}}
						path={`/signup?data=${encodeURI(props.query)}`}
					/>
				</Box>
			</Paper>
		</Popup>
	);
};

export default LoginOrCreateAccountPopup;
