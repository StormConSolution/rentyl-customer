import * as React from 'react';
import './LinkButton.scss';
import { Link } from '@bit/redsky.framework.rs.996';
import Button from '@bit/redsky.framework.rs.button';
import Label from '@bit/redsky.framework.rs.label';

interface LinkButtonProps {
	path: string;
	label: string;
	buttonSecondary?: boolean;
	className?: string;
}

const LinkButton: React.FC<LinkButtonProps> = (props) => {
	return (
		<Link path={props.path} className={`rsLinkButton ${props.className || ''}`}>
			<Button look={!props.buttonSecondary ? 'containedPrimary' : 'containedSecondary'}>
				<Label variant={'caption'}>{props.label}</Label>
			</Button>
		</Link>
	);
};

export default LinkButton;
