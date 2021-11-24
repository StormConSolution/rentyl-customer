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
	isAdded?: boolean;
}

const DestinationPackageTile: React.FC<DestinationPackageTileProps> = (props) => {
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
	const [showControls, setShowControls] = useState<boolean>(true);

	useEffect(() => {
		if (props.imgPaths.length <= 1) setShowControls(false);
	}, [props.imgPaths]);

	return (
		<Paper className={'rsDestinationPackageTile'} borderRadius={'4px'} position={'relative'}>
			<Box className={'imageWrapper'}>
				<Img src={props.imgPaths[0]} alt={''} width={500} height={600} />
			</Box>
			<Box width={550} paddingLeft={44}>
				<Label variant={'customTwentyFour'} color="#001933" marginBottom={16}>
					{props.title}
				</Label>
				<Label
					variant={'customFive'}
					marginBottom={13}
					showMoreText={
						<Label variant={'customTwentyFour'} color="#001933">
							View More
						</Label>
					}
					lineClamp={3}
					showMoreButton
					showLessText={
						<Label variant={'customTwentyFour'} color="#001933">
							View Less
						</Label>
					}
				>
					{props.description}
				</Label>
			</Box>
			<Box marginLeft={'auto'} textAlign={'right'}>
				{company.allowCashBooking && (
					<Label variant={'customTwentyThree'} marginBottom={9}>
						${StringUtils.formatMoney(props.prices.amountAfterTax)}
					</Label>
				)}
				<Label variant="customThree">Per Stay</Label>
			</Box>

			<LabelButton
				look={'containedPrimary'}
				variant={'button'}
				label={props.text || 'Add to my stay'}
				className={`addButton${props.isAdded && ' packageAdded'}`}
				onClick={props.onAddPackage}
			/>
		</Paper>
	);
};

export default DestinationPackageTile;
