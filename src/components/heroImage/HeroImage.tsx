import React from 'react';
import './HeroImage.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface HeroImageProps {
	className?: string;
	images: string[];
	height: string;
	width: string;
	mobileHeight: string;
	mobileWidth: string;
}

const HeroImage: React.FC<HeroImageProps> = (props) => {
	const size = useWindowResizeChange();

	function renderImages() {
		return <Box className={`rsHeroImage ${props.className || ''}`}></Box>;
	}

	return renderImages();
};

export default HeroImage;
