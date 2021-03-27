import React, { StyleHTMLAttributes } from 'react';
import './LabelImage.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface LabelImageProps {
	mainImg: string;
	textOnImg: string;
	className?: string;
}

const LabelImage: React.FC<LabelImageProps> = (props) => {
	const size = useWindowResizeChange();

	function renderStyles() {
		let styles: any = {
			backgroundImage: `url(${props.mainImg})`,
			height: size === 'small' ? '165px' : '160px',
			width: size === 'small' ? '293px' : '278px'
		};
		return styles;
	}

	return (
		<div className={`rsLabelImage ${props.className || ''}`} style={renderStyles()}>
			<Label className={'labelImageText'} variant={'h4'}>
				{props.textOnImg}
			</Label>
		</div>
	);
};
export default LabelImage;
