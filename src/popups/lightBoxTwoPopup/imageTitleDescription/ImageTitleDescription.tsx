import * as React from 'react';
import './ImageTitleDescription.scss';
import Label from '@bit/redsky.framework.rs.label';

interface ImageTitleDescriptionProps {
	title: string;
	description: string;
}

const ImageTitleDescription: React.FC<ImageTitleDescriptionProps> = (props) => {
	return (
		<div className={'rsImageTitleDescription'}>
			<Label variant={'h2'}>{props.title}</Label>
			<Label variant={'body2'}>{props.description}</Label>
		</div>
	);
};

export default ImageTitleDescription;
