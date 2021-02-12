import * as React from 'react';
import './Carousel.scss';
import { useEffect, useRef, useState } from 'react';
import CarouselButtons from '../carouselButtons/CarouselButtons';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';

interface CarouselProps {
	children: React.ReactNodeArray;
	showControls?: boolean;
	carouselRefCallBack?: (ref: any) => void;
	imageIndex?: number;
}

const Carousel: React.FC<CarouselProps> = (props) => {
	const parentRef = useRef<HTMLElement>(null);
	function renderChildren() {
		return props.children.map((item, index) => {
			return (
				<div key={index} className={'carouselChild'}>
					{item}
				</div>
			);
		});
	}

	useEffect(() => {
		if (props.imageIndex === undefined) return;
		let val = parentRef.current!.offsetWidth * props.imageIndex;
		parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
	}, [props.imageIndex]);

	return (
		<div className={'rsCarousel'}>
			<div ref={parentRef} className={'carouselParent'}>
				{renderChildren()}
			</div>
			{props.showControls && (
				<>
					<Button
						className={'clickLeft'}
						look={'none'}
						onClick={() => {
							let val = parentRef.current!.scrollLeft - parentRef.current!.offsetWidth;
							if (val < 0) val = parentRef.current!.scrollLeft;
							parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
						}}
					>
						<Icon iconImg={'icon-chevron-left'} color={'#001933'} size={8} />
					</Button>
					<Button
						className={'clickRight'}
						look={'none'}
						onClick={() => {
							let val = parentRef.current!.offsetWidth + parentRef.current!.scrollLeft;
							parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
						}}
					>
						<Icon iconImg={'icon-chevron-right'} color={'#001933'} size={8} />
					</Button>
				</>
			)}
		</div>
	);
};

export default Carousel;
