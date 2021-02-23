import React from 'react';
import './ResortComparisonCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box } from '@bit/redsky.framework.rs.996';
import Select from '../Select/Select';
import Paper from '../paper/Paper';

interface ResortComparisonCardProps {
	logo: string;
	title: string;
	roomTypes: { value: string | number; text: string | number }[];
	onChange: (value: any) => void;
	onClose: () => void;
	className?: string;
}

const ResortComparisonCard: React.FC<ResortComparisonCardProps> = (props) => {
	return (
		<Paper className={`rsResortComparisonCard ${props.className || ''}`} height={'82px'} width={'278px'}>
			<Box className={'topContent'} display={'flex'}>
				<img src={props.logo} alt={'resort logo'} width={'82px'} />
				<Label className={'title'} variant={'h2'}>
					{props.title}
				</Label>
				<Icon className={'close'} iconImg={'icon-close'} onClick={props.onClose} size={14} color={'#004b98'} />
			</Box>
			<Box className={'bottomContent'} display={'flex'}>
				<Select onChange={props.onChange} placeHolder={'select room type'} options={props.roomTypes} />
			</Box>
		</Paper>
	);
};

export default ResortComparisonCard;
