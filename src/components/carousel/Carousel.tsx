import * as React from 'react';
import './Carousel.scss';
import { useEffect, useRef } from 'react';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';

interface CarouselProps {
	children: React.ReactNodeArray;
	showControls?: boolean;
	carouselRefCallBack?: (ref: any) => void;
	imageIndex?: number;
	className?: string;
}

const Carousel: React.FC<CarouselProps> = (props) => {
	const parentRef = useRef<HTMLElement>(null);
	const childRef = useRef<HTMLElement>(null);
	const totalChildren = props.children.length;
	let imageViewIndex: number = 1;
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
		<div className={`rsCarousel ${props.className || ''}`}>
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

							imageViewIndex--;
							if (imageViewIndex < 1) {
								val = parentRef.current!.offsetWidth * totalChildren;
								imageViewIndex = totalChildren;
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
							imageViewIndex++;
							if (imageViewIndex > totalChildren) {
								val = 0;
								imageViewIndex = 1;
							}
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
