import * as React from 'react';
import './SignupBanner.scss';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Button from '@bit/redsky.framework.rs.button';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import SignupPopup, { SignupPopupProps } from '../../popups/signup/SignupPopup';

const SignupBanner: React.FC = () => {
	const size = useWindowResizeChange();

	return (
		<Box className={'rsSignupBanner'}>
			<Label variant={`${size === 'small' ? 'h2' : 'h1'}`} className={'textTag'}>
				Where convenience meets luxury
			</Label>
			<Button
				onClick={() => {
					popupController.open<SignupPopupProps>(SignupPopup);
				}}
				children={<Label variant={'packagesCustomTwo'}>Sign up for spire Loyalty today!</Label>}
				look={'containedPrimary'}
				className={'yellow'}
			/>
		</Box>
	);
};

export default SignupBanner;
