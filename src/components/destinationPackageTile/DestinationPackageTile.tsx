import * as React from 'react';
import './DestinationPackageTile.scss';
import Paper from '../paper/Paper';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import Accordion from '@bit/redsky.framework.rs.accordion';
import LabelButton from '../labelButton/LabelButton';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import Carousel from '../carousel/Carousel';
import { useEffect, useState } from 'react';
import Img from '@bit/redsky.framework.rs.img';

interface DestinationPackageTileProps {
	title: string;
	description: string;
	prices: Api.UpsellPackage.Res.PriceDetail;
	imgPaths: string[];
	onAddPackage?: () => void;
	text?: string;
}

const DestinationPackageTile: React.FC<DestinationPackageTileProps> = (props) => {
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
	const [showControls, setShowControls] = useState<boolean>(true);

	useEffect(() => {
		if (props.imgPaths.length <= 1) setShowControls(false);
	}, [props.imgPaths]);

	function renderPictures(picturePaths: string[]): JSX.Element[] {
		return picturePaths.map((path: string) => {
			return (
				<Box className={'imageWrapper'}>
					<Img src={path} alt={''} width={500} height={600} />
				</Box>
			);
		});
	}

	return (
		<Paper
			className={'rsDestinationPackageTile'}
			borderRadius={'4px'}
			boxShadow
			padding={'16px'}
			position={'relative'}
		>
			<Carousel showControls={showControls} children={renderPictures(props.imgPaths)} />
			<div>
				<Label variant={'h2'}>{props.title}</Label>
				<Accordion
					backgroundColor={'#f0f0f0'}
					hideHoverEffect
					titleReact={<Label variant={'h4'}>View Details</Label>}
				>
					<Label variant={'body1'} margin={'0 10px'}>
						{props.description}
					</Label>
				</Accordion>
			</div>
			<Box marginLeft={'auto'} textAlign={'right'}>
				{company.allowCashBooking && (
					<Label variant={'h2'}>
						${StringUtils.formatMoney(props.prices.amountAfterTax)} {company.allowPointBooking && ' or '}
					</Label>
				)}
				{company.allowPointBooking && (
					<Label variant={company.allowCashBooking ? 'h4' : 'h2'}>
						{StringUtils.addCommasToNumber(props.prices.amountPoints)} points
					</Label>
				)}
				<Label variant={'body2'}>Per Stay</Label>
				{company.allowCashBooking && <Label variant={'body2'}>Including Taxes and Fees</Label>}
			</Box>

			<LabelButton
				look={'containedPrimary'}
				variant={'button'}
				label={props.text || 'Add Package'}
				onClick={props.onAddPackage}
			/>
		</Paper>
	);
};

export default DestinationPackageTile;
