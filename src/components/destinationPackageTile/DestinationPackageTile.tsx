import * as React from 'react';
import './DestinationPackageTile.scss';
import Paper from '../paper/Paper';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import Accordion from '@bit/redsky.framework.rs.accordion';
import LabelButton from '../labelButton/LabelButton';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';

interface DestinationPackageTileProps {
	title: string;
	description: string;
	priceCents: number;
	imgUrl: string;
	onAddPackage?: () => void;
	text?: string;
}

const DestinationPackageTile: React.FC<DestinationPackageTileProps> = (props) => {
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
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
						{company.allowCashBooking && (
							<Label variant={'h2'}>
								${StringUtils.formatMoney(props.priceCents)} {company.allowPointBooking && ' or '}
							</Label>
						)}
						{company.allowPointBooking && (
							<Label variant={company.allowCashBooking ? 'h4' : 'h2'}>
								{StringUtils.addCommasToNumber(props.priceCents)} points
							</Label>
						)}
						<Label variant={'body2'}>Per Stay</Label>
						{company.allowCashBooking && <Label variant={'body2'}>Including Taxes and Fees</Label>}
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
				label={props.text ? props.text : 'Add Package'}
				onClick={props.onAddPackage}
			/>
		</Paper>
	);
};

export default DestinationPackageTile;
