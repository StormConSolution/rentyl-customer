import * as React from 'react';
import './DestinationPackageTile.scss';
import Paper from '../../../components/paper/Paper';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import Accordion from '@bit/redsky.framework.rs.accordion';
import LabelButton from '../../../components/labelButton/LabelButton';

interface DestinationPackageTileProps {
	title: string;
	description: string;
	priceCents: number;
	imgUrl: string;
	onAddPackage?: () => void;
}

const DestinationPackageTile: React.FC<DestinationPackageTileProps> = (props) => {
	return (
		<Paper
			className={'rsDestinationPackageTile'}
			borderRadius={'4px'}
			boxShadow
			padding={'16px'}
			position={'relative'}
		>
			<img src={props.imgUrl} alt={props.title + ' image'} />
			<div>
				<Box display={'flex'}>
					<Label variant={'h2'}>{props.title}</Label>
					<Box marginLeft={'auto'} textAlign={'right'}>
						<Label variant={'h2'}>${StringUtils.formatMoney(props.priceCents)}</Label>
						<Label variant={'body2'}>Per Stay</Label>
						<Label variant={'body2'}>Including Taxes and Fees</Label>
					</Box>
				</Box>
				<Accordion titleReact={<Label variant={'h4'}>View Details</Label>}>
					<Label variant={'body1'} margin={'0 10px'}>
						{props.description}
					</Label>
				</Accordion>
			</div>
			<LabelButton
				look={'containedPrimary'}
				variant={'button'}
				label={'Add Package'}
				onClick={props.onAddPackage}
			/>
		</Paper>
	);
};

export default DestinationPackageTile;
