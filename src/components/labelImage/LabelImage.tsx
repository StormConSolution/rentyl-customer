import React from 'react';
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

	return (
		<Box
			className={`rsLabelImage ${props.className || ''}`}
			height={size === 'small' ? '165px' : '160px'}
			width={size === 'small' ? '293px' : '278px'}
		>
			<img className={'mainImg'} src={props.mainImg} alt={'Main'} />
			<Label className={'labelImageText'} variant={'h4'}>
				{props.textOnImg}
			</Label>
		</Box>
	);
};
export default LabelImage;
