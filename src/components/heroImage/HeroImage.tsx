import React from 'react';
import './HeroImage.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface HeroImageProps {
	image: string;
	height: string;
	mobileHeight: string;
	backgroundPosition?: string;
	className?: string;
	position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
	padding?: string;
	zIndex?: number;
}

const HeroImage: React.FC<HeroImageProps> = (props) => {
	const size = useWindowResizeChange();
	function renderImgStyles() {
		let styles: any = {
			backgroundImage: `url(${props.image})`,
			height: size === 'small' ? props.mobileHeight : props.height
		};

		if (!!props.backgroundPosition) styles.backgroundPosition = props.backgroundPosition;
		if (!!props.position) styles.position = props.position;
		if (!!props.padding) styles.padding = props.padding;
		if (!!props.zIndex) styles.zIndex = props.zIndex;

		return styles;
	}

	return (
		<div className={`rsHeroImage ${props.className || ''}`} style={renderImgStyles()}>
			{props.children}
		</div>
	);
};

export default HeroImage;
