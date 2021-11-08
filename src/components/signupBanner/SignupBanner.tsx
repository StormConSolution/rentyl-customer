import * as React from 'react';
import './SignupBanner.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Button from '@bit/redsky.framework.rs.button';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

const SignupBanner: React.FC = () => {
	const size = useWindowResizeChange();

	return (
		<Box className={'rsSignupBanner'}>
			<Label variant={`${size === 'small' ? 'h2' : 'h1'}`}>Where convenience meets luxury</Label>
			<Button
				onClick={() => {}}
				children={<Label variant={'body1'}>Sign up for spire Loyalty today!</Label>}
				look={'containedPrimary'}
			/>
		</Box>
	);
};

export default SignupBanner;
