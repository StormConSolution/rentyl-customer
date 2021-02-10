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
		<div display={'flex'} className={'rsCarouselButtons'} style={renderStyle()}>
			<Button look={'none'} onClick={props.onClickLeft}>
				<Icon iconImg={'icon-chevron-left'} color={'#001933'} size={8} />
			</Button>
			<hr />
			<Button look={'none'} onClick={props.onClickRight}>
				<Icon iconImg={'icon-chevron-right'} color={'#001933'} size={8} />
			</Button>
		</div>
	);
};

export default CarouselButtons;
