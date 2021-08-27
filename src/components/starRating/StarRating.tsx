import React from 'react';
import './StarRating.scss';
import { Box } from '@bit/redsky.framework.rs.996';

interface starRatingProps {
	size: 'small16px' | 'medium24px' | 'large32px';
	rating: number;
	className?: string;
}

const StarRating: React.FC<starRatingProps> = (props) => {
	function roundDownToHalfValue(val: number) {
		return Math.floor(val * 2) / 2;
	}

	function createStarRating() {
		let htmlElement: JSX.Element[] = [];
		for (let i = 0; i < 5; i++) {
			if (i < roundDownToHalfValue(props.rating)) {
				if (i + 0.5 === roundDownToHalfValue(props.rating)) htmlElement.push(halfStar(i));
				else htmlElement.push(wholeStar(i));
			} else {
				htmlElement.push(emptyStar(i));
			}
		}
		return htmlElement;
	}

	function getBackgroundSizeClassName() {
		let backgroundClassName;
		if (props.size === 'small16px') backgroundClassName = 'smallStarBackground';
		else if (props.size === 'medium24px') backgroundClassName = 'medStarBackground';
		else backgroundClassName = 'largeStarBackground';
		return backgroundClassName;
	}

	function getBorderSizeClassName() {
		let borderClassName;
		if (props.size === 'small16px') borderClassName = 'smallStarBorder';
		else if (props.size === 'medium24px') borderClassName = 'medStarBorder';
		else borderClassName = 'largeStarBorder';
		return borderClassName;
	}

	function wholeStar(index: number) {
		const borderClassName = getBorderSizeClassName();
		return (
			<Box key={index} className={'starRating'}>
				<Box className={`starRatingBorder ${borderClassName}`} />
			</Box>
		);
	}

	function halfStar(index: number) {
		const borderClassName = getBorderSizeClassName();
		const backgroundClassName = getBackgroundSizeClassName();
		return (
			<Box key={index} className={'starRating'}>
				<Box className={`starRatingBorder ${borderClassName}`} />
				<Box className={`starRatingBackground ${backgroundClassName}`} />
				<Box className={`halfStar ${borderClassName}`} />
			</Box>
		);
	}

	function emptyStar(index: number) {
		const borderClassName = getBorderSizeClassName();
		const backgroundClassName = getBackgroundSizeClassName();
		return (
			<Box key={index} className={'starRating'}>
				<Box className={`starRatingBorder ${borderClassName}`} />
				<Box className={`starRatingBackground ${backgroundClassName}`} />
			</Box>
		);
	}

	return <Box className={`rsStarRating ${props.className || ''}`}>{createStarRating()}</Box>;
};
export default StarRating;
