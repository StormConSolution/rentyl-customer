import * as React from 'react';
import './ImageLabel.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Img from '@bit/redsky.framework.rs.img';

interface ImageLabelProps {
	labelName: string | React.ReactNode;
	imgSrc:
		| 'alcohol.png'
		| 'beach-chair.png'
		| 'bellboy.png'
		| 'fitness.png'
		| 'golf.png'
		| 'racket.png'
		| 'shower.png'
		| 'sleep.png'
		| 'square-foot.png'
		| string;
	imgWidth: string;
	imgHeight: string;
	iconPosition: 'top' | 'right' | 'bottom' | 'left';
	labelVariant?:
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
	className?: string;
	color?: string;
	onClick?: () => void;
}

const ImageLabel: React.FC<ImageLabelProps> = (props) => {
	function buildImageSrc() {
		let defaultImages = [
			'alcohol.png',
			'beach-chair.png',
			'bellboy.png',
			'fitness.png',
			'golf.png',
			'racket.png',
			'shower.png',
			'sleep.png',
			'square-foot.png'
		];
		let newSrc = defaultImages.find((item) => item === props.imgSrc);
		if (newSrc) return require(`../../images/colorIcons/${newSrc}`);
		else return props.imgSrc;
	}

	return (
		<Box className={`rsImageLabel ${props.className || ''} ${props.iconPosition}`} onClick={props.onClick}>
			<Img src={buildImageSrc()} alt={'Image Label'} width={props.imgWidth} height={props.imgHeight} />
			{typeof props.labelName === 'string' ? (
				<Label variant={props.labelVariant} className={'label'} color={props.color} lineClamp={1}>
					{props.labelName}
				</Label>
			) : (
				props.labelName
			)}
		</Box>
	);
};

export default ImageLabel;
