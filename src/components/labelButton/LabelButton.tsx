import * as React from 'react';
import './LabelButton.scss';
import Button from '@bit/redsky.framework.rs.button';
import Label from '@bit/redsky.framework.rs.label';
import { MouseEvent } from 'react';

interface LabelButtonProps {
	look: 'containedPrimary' | 'containedSecondary' | 'none';
	variant:
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'sectionHeader'
		| 'title'
		| 'subtitle1'
		| 'subtitle2'
		| 'body1'
		| 'body2'
		| 'caption'
		| 'button'
		| 'overline'
		| 'srOnly'
		| 'inherit'
		| 'error'
		| string;
	label: string;
	className?: string;
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	buttonType?: 'button' | 'submit';
	buttonRef?: React.RefObject<any>;
	disableRipple?: boolean;
}

const LabelButton: React.FC<LabelButtonProps> = (props) => {
	return (
		<Button
			className={!!props.className ? `rsLabelButton ${props.className}` : 'rsLabelButton'}
			look={props.look}
			onClick={props.onClick}
			disabled={props.disabled}
			type={props.buttonType}
			buttonRef={props.buttonRef}
			disableRipple={props.disableRipple}
		>
			{props.children}
			<Label variant={props.variant}>{props.label}</Label>
		</Button>
	);
};

export default LabelButton;
