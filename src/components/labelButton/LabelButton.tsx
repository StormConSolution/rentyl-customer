import * as React from 'react';
import './LabelButton.scss';
import Button from '@bit/redsky.framework.rs.button';
import Label from '@bit/redsky.framework.rs.label';

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
		| 'error';
	label: string;
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
}

const LabelButton: React.FC<LabelButtonProps> = (props) => {
	return (
		<Button
			className={!!props.className ? `rsLabelButton ${props.className}` : 'rsLabelButton'}
			look={props.look}
			onClick={props.onClick}
			disabled={props.disabled}
		>
			<Label variant={props.variant}>{props.label}</Label>
		</Button>
	);
};

export default LabelButton;
