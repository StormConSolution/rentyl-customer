import React from 'react';
import './StarRating.scss';
import { Box } from '@bit/redsky.framework.rs.996';

export type Rating = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

interface starRatingProps {
	className?: string;
	size: 'small16px' | 'medium24px' | 'large32px';
	rating: Rating;
}

const StarRating: React.FC<starRatingProps> = (props) => {
	function createStarRating() {
		let htmlElement: JSX.Element[] = [];
		for (let i = 0; i < 5; i++) {
			if (i < props.rating) {
				if (i + 0.5 === props.rating) htmlElement.push(halfStar());
				else htmlElement.push(wholeStar());
			} else {
				htmlElement.push(emptyStar());
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

	function wholeStar() {
		const borderClassName = getBorderSizeClassName();
		return (
			<Box className={'starRating'}>
				<Box className={`starRatingBorder ${borderClassName}`} />
			</Box>
		);
	}

	function halfStar() {
		const borderClassName = getBorderSizeClassName();
		const backgroundClassName = getBackgroundSizeClassName();
		return (
			<Box className={'starRating'}>
				<Box className={`starRatingBorder ${borderClassName}`} />
				<Box className={`starRatingBackground ${backgroundClassName}`} />
				<Box className={`halfStar ${borderClassName}`} />
			</Box>
		);
	}

	function emptyStar() {
		const borderClassName = getBorderSizeClassName();
		const backgroundClassName = getBackgroundSizeClassName();
		return (
			<Box className={'starRating'}>
				<Box className={`starRatingBorder ${borderClassName}`} />
				<Box className={`starRatingBackground ${backgroundClassName}`} />
			</Box>
		);
	}

	return <Box className={'rsStarRating'}>{createStarRating()}</Box>;
};
export default StarRating;
