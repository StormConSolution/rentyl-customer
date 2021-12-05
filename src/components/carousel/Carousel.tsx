import * as React from 'react';
import './Carousel.scss';
import { useEffect, useRef, useState } from 'react';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';
import { ObjectUtils } from '../../utils/utils';

interface CarouselProps {
	children: React.ReactNodeArray;
	showControls?: boolean;
	carouselRefCallBack?: (ref: any) => void;
	imageIndex?: number;
	className?: string;
}

const Carousel: React.FC<CarouselProps> = (props) => {
	const parentRef = useRef<HTMLElement>(null);
	const totalChildren = props.children.length;
	const [imageViewIndex, setImageViewIndex] = useState<number>(1);

	useEffect(() => {
		if (props.imageIndex === undefined) return;
		let val = parentRef.current!.offsetWidth * props.imageIndex;
		parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
	}, [props.imageIndex]);

	useEffect(() => {
		setTimeout(() => {
			parentRef.current!.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		}, 300);
	}, []);

	function renderChildren() {
		return props.children.map((item, index) => {
			return (
				<div key={index} className={'carouselChild'}>
					{item}
				</div>
			);
		});
	}

	function renderButtons() {
		if (!props.showControls || !ObjectUtils.isArrayWithData(props.children) || props.children.length < 2) return;
		return (
			<React.Fragment>
				<Button
					className={'clickLeft'}
					look={'none'}
					onClick={() => {
						let val = parentRef.current!.scrollLeft - parentRef.current!.offsetWidth;

						setImageViewIndex(imageViewIndex - 1);
						if (imageViewIndex <= 1) {
							val = parentRef.current!.offsetWidth * totalChildren;
							setImageViewIndex(totalChildren);
						}
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
						setImageViewIndex(imageViewIndex + 1);
						if (imageViewIndex >= totalChildren) {
							val = 0;
							setImageViewIndex(1);
						}
						parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
					}}
				>
					<Icon iconImg={'icon-chevron-right'} color={'#001933'} size={8} />
				</Button>
			</React.Fragment>
		);
	}

	return (
		<div className={`rsCarousel ${props.className || ''}`}>
			<div ref={parentRef} className={'carouselParent'}>
				{renderChildren()}
			</div>
			{renderButtons()}
		</div>
	);
};

export default Carousel;
