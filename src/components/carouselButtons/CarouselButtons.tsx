import * as React from 'react';
import './CarouselButtons.scss';
import Button from '@bit/redsky.framework.rs.button';
import Icon from '@bit/redsky.framework.rs.icon';

interface CarouselButtonsProps {
	position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
	top?: string;
	right?: string;
	bottom?: string;
	left?: string;
	onClickRight: () => void;
	onClickLeft: () => void;
	carouselButtonRef?: React.RefObject<HTMLDivElement>;
	className?: string;
}

const CarouselButtons: React.FC<CarouselButtonsProps> = (props) => {
	function renderStyle() {
		let styles: any = {};
		let i: keyof typeof props;
		for (i in props) {
			if (i === 'onClickLeft' || i === 'onClickRight') continue;
			styles[i] = props[i];
		}
		return styles;
	}

	return (
		<div
			className={`rsCarouselButtons ${props.className || ''}`}
			style={renderStyle()}
			ref={props.carouselButtonRef}
		>
			<Button look={'none'} onClick={props.onClickLeft}>
				<Icon iconImg={'icon-chevron-left'} color={'#ffffff'} size={20} />
			</Button>
			<Button look={'none'} onClick={props.onClickRight}>
				<Icon iconImg={'icon-chevron-right'} color={'#ffffff'} size={20} />
			</Button>
		</div>
	);
};

export default CarouselButtons;
