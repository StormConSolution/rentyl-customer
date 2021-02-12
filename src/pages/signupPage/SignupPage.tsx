import React from 'react';
import { Page } from '@bit/redsky.framework.rs.996';
import './SignupPage.scss';
import Box from '../../components/box/Box';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

const SignupPage: React.FC = () => {
	const size = useWindowResizeChange();

	return (
		<Page className={'rsSignupPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box
					className={'heroImgAndText'}
					display={'flex'}
					alignItems={'center'}
					marginBottom={size === 'small' ? 366 : 135}
				>
					<Box className={'signupTitleBox'} marginTop={119} marginLeft={140}>
						<Label className={'signupTitleLabel'}>Sign up for Spire Loyalty</Label>
					</Box>
				</Box>
			</div>
		</Page>
	);
};

export default SignupPage;
