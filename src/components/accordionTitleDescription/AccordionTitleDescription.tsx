import * as React from 'react';
import './AccordionTitleDescription.scss';
import Label from '@bit/redsky.framework.rs.label';
import { ReactNodeArray } from 'react';

interface AccordionTitleDescriptionProps {
	title: string;
	description: string | number | ReactNodeArray;
}

const AccordionTitleDescription: React.FC<AccordionTitleDescriptionProps> = (props) => {
	return (
		<div className={'rsAccordionTitleDescription'}>
			<Label variant={'h4'} marginBottom={9}>
				{props.title}
			</Label>
			<Label variant={'body2'}>{props.description}</Label>
		</div>
	);
};

export default AccordionTitleDescription;
