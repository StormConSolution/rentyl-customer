import * as React from 'react';
import './DestinationPackageTile.scss';
import Paper from '../paper/Paper';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import LabelButton from '../labelButton/LabelButton';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import Img from '@bit/redsky.framework.rs.img';
import Icon from '@bit/redsky.framework.rs.icon';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

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
	const size = useWindowResizeChange();
	const smallSize = size === 'small';

	return (
		<Paper className={'rsDestinationPackageTile'} borderRadius={'4px'} position={'relative'}>
			<Box className={'imageWrapper'}>
				<Img
					src={props.imgPaths[0]}
					alt={`package-${props.title}`}
					width={smallSize ? 327 : 500}
					height={smallSize ? 219 : 600}
				/>
			</Box>
			<Box width={smallSize ? 327 : 550} paddingLeft={smallSize ? 0 : 44}>
				<Label variant={size} color="#001933" marginBottom={16}>
					{props.title}
				</Label>
				{smallSize ? null : (
					<Label
						variant={'customFive'}
						marginBottom={13}
						showMoreText={
							<Label variant={'customTwentyFour'} color="#001933">
								View More
								<Icon iconImg="icon-chevron-down" className="viewTextIcon" />
							</Label>
						}
						lineClamp={3}
						showMoreButton
						showLessText={
							<Label variant={'customTwentyFour'} color="#001933">
								View Less
								<Icon iconImg="icon-chevron-up" className="viewTextIcon" />
							</Label>
						}
					>
						{props.description}
					</Label>
				)}
			</Box>
			<Box className="mobilePriceAndButtonContainer" width={smallSize ? 327 : 'auto'}>
				<Box className="priceAndTextLabelContainer">
					{company.allowCashBooking && (
						<Label variant={'customTwentyThree'} marginBottom={9}>
							${StringUtils.formatMoney(props.prices.amountAfterTax)}
						</Label>
					)}
					<Label variant="customThree">Per Stay</Label>
				</Box>
				<LabelButton
					look={'none'}
					variant={'button'}
					label={
						props.text ? (
							<Label display="flex" className="addPackButtonText" variant="customThree" color="#fff">
								<Icon
									iconImg={!props.isAdded ? 'icon-plus' : 'icon-solid-check'}
									size={20}
									color="#fff"
									className="addPackageButtonIcon"
								/>
								{smallSize ? '' : props.text}
							</Label>
						) : (
							'Add to my stay'
						)
					}
					className={`addButton${props.isAdded ? ' packageAdded' : ''}`}
					onClick={props.onAddPackage}
				/>
			</Box>
		</Paper>
	);
};

export default DestinationPackageTile;
