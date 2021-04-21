import * as React from 'react';
import './ImageTitleLink.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelLink from '../labelLink/LabelLink';

interface ImageTitleLinkProps {
	title: string;
	imgUrl: string;
	path: string;
}

const ImageTitleLink: React.FC<ImageTitleLinkProps> = (props) => {
	return (
		<div className={'rsImageTitleLink'}>
			<img src={props.imgUrl} />
			<Label variant={'h2'}>{props.title}</Label>
			<LabelLink
				path={props.path}
				label={'View Details'}
				variant={'button'}
				iconRight={'icon-chevron-right'}
				iconSize={7}
			/>
		</div>
	);
};

export default ImageTitleLink;
