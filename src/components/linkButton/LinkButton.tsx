import * as React from 'react';
import './LinkButton.scss';
import { Link } from '@bit/redsky.framework.rs.996';
import Button from '@bit/redsky.framework.rs.button';
import Label from '@bit/redsky.framework.rs.label';

interface LinkButtonProps {
	path: string;
	label: string;
	className?: string;
	disabled?: boolean;
	buttonType?: 'button' | 'submit';
	onClick?: () => void;
	look: 'containedPrimary' | 'containedSecondary' | 'none';
}

const LinkButton: React.FC<LinkButtonProps> = (props) => {
	return (
		<Link path={props.path} className={`rsLinkButton ${props.className || ''}`} onClick={props.onClick}>
			<Button look={props.look} disabled={props.disabled} type={props.buttonType}>
				<Label variant={'caption'}>{props.label}</Label>
			</Button>
		</Link>
	);
};

export default LinkButton;
