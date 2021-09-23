import * as React from 'react';
import './SignUpSteps.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';

interface SignUpStepsProps {
	stepNumber: number;
	title: string;
	description: string;
}

const SignUpSteps: React.FC<SignUpStepsProps> = (props) => {
	return (
		<div className={'rsSignUpSteps'}>
			<div className={'stepCircle'}>
				<Label variant={'h1'}>{props.stepNumber}</Label>
			</div>
			<Box mt={10}>
				<Label variant={'h1'} mb={10}>
					{props.title}
				</Label>
				<Label variant={'body1'} maxWidth={385}>
					{props.description}
				</Label>
			</Box>
		</div>
	);
};

export default SignUpSteps;
