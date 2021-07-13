import React, { MouseEvent, useState } from 'react';
import './IconToolTip.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
interface IconToolTipProps {
	iconImg: string;
	color?: string;
	size?: number;
	className?: string;
	onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
	cursorPointer?: boolean;
	title?: string;
}

const IconToolTip: React.FC<IconToolTipProps> = (props) => {
	const [hovered, setHovered] = useState<boolean>(false);
	return (
		<div className={'rsIconToolTip'} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
			<Label variant={'caption'} display={hovered ? 'inline-block' : 'none'}>
				{props.title}
			</Label>

			<Icon
				iconImg={props.iconImg}
				color={props.color}
				size={props.size}
				className={props.className}
				onClick={props.onClick}
				cursorPointer={props.cursorPointer}
			/>
		</div>
	);
};

export default IconToolTip;
