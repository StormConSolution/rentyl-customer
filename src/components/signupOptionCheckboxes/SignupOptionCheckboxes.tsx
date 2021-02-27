import { Box } from '@bit/redsky.framework.rs.996';
import React from 'react';
import './SignupOptionCheckboxes.scss';

export interface SignupOptionCheckboxesProps {
	options: SignupOption[];
	onClick: (e: React.MouseEvent) => void;
}
export interface SignupOption {
	value: string;
	text: string;
	defaultToChecked?: boolean;
}

const SignupOptionCheckboxes: React.FC<SignupOptionCheckboxesProps> = (props: SignupOptionCheckboxesProps) => {
	function renderCheckboxes(options: SignupOption[], onClickFunction: (e: React.MouseEvent) => void) {
		return options.map((opt: SignupOption) => {
			return (
				<label className={'checkboxContainer'} key={opt.value}>
					<input value={opt.value} type={'checkbox'} className={'checkboxInput'} onClick={onClickFunction} />
					<span className={'checkbox'}>
						<Box />
					</span>
					{opt.text}
				</label>
			);
		});
	}

	return (
		<Box className="rsSignupOptionCheckboxes" display={'flex'} flexDirection={'column'}>
			{renderCheckboxes(props.options, props.onClick)}
		</Box>
	);
};

export default SignupOptionCheckboxes;
