import * as React from 'react';
import './LinkButton.scss';
import { Link } from '@bit/redsky.framework.rs.996';
import Button from '@bit/redsky.framework.rs.button';
import Label from '@bit/redsky.framework.rs.label';

interface LinkButtonProps {
	path: string;
	label: string;
	className?: string;
	look: 'containedPrimary' | 'containedSecondary' | 'none';
	yellow?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = (props) => {
	return (
		<Link path={props.path} className={`rsLinkButton ${props.className || ''}`}>
			<Button look={props.look} className={`${props.yellow ? 'yellow' : ''}`}>
				<Label variant={'caption'}>{props.label}</Label>
			</Button>
		</Link>
	);
};

export default LinkButton;
