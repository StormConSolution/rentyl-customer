import * as React from 'react';
import './TitleDescription.scss';
import Label from '@bit/redsky.framework.rs.label';
import { ReactNode, ReactNodeArray } from 'react';

interface AccordionTitleDescriptionProps {
	title: string;
	description: string | number | ReactNodeArray | ReactNode;
	className?: string;
}

const TitleDescription: React.FC<AccordionTitleDescriptionProps> = (props) => {
	return (
		<div className={`'rsTitleDescription' ${props.className || ''}`}>
			<Label variant={'reservationDetailsPaperCustomFour'} marginBottom={7}>
				{props.title}
			</Label>
			<Label variant={'customFive'}>{props.description}</Label>
		</div>
	);
};

export default TitleDescription;
