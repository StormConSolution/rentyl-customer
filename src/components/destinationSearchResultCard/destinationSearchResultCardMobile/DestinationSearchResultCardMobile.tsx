import * as React from 'react';
import './DestinationSearchResultCardMobile.scss';
import Carousel from '../../carousel/Carousel';
import { Box } from '@bit/redsky.framework.rs.996';
import TabbedDestinationSummary, {
	DestinationSummaryTab
} from '../../tabbedDestinationSummary/TabbedDestinationSummary';
import Label from '@bit/redsky.framework.rs.label';
import LabelButton from '../../labelButton/LabelButton';
import router from '../../../utils/router';
import StarRating from '../../starRating/StarRating';
import LabelLink from '../../labelLink/LabelLink';
import Img from '@bit/redsky.framework.rs.img';

interface DestinationSearchResultCardMobileProps {
	className?: string;
	destinationName: string;
	address: string;
	logoImagePath: string;
	picturePaths: string[];
	starRating: number;
	reviewPath: string;
	destinationDetailsPath: string;
	summaryTabs: DestinationSummaryTab[];
	onAddCompareClick?: () => void;
}

const DestinationSearchResultCardMobile: React.FC<DestinationSearchResultCardMobileProps> = (props) => {
	function renderPictures(picturePaths: string[]): JSX.Element[] {
		return picturePaths.map((path: string, index) => {
			return (
				<Box key={index} className={'imageWrapper'}>
					<Img src={path} loading={'lazy'} alt={'Resort Image'} width={345} height={290} />
				</Box>
			);
		});
	}

	return (
		<div className={'rsDestinationSearchResultCardMobile'}>
			<Carousel showControls children={renderPictures(props.picturePaths)} />
			{props.logoImagePath && props.logoImagePath !== '' && (
				<img className={'logoImg'} src={props.logoImagePath} alt={''} />
			)}
			<Label variant={'h1'} mb={8}>
				{props.destinationName}
			</Label>
			<Box display={'flex'} mb={8}>
				<StarRating size="small16px" rating={props.starRating} />
				<LabelLink
					className="ratings"
					label="View Reviews >"
					path={props.reviewPath}
					variant="caption"
					externalLink={false}
				/>
			</Box>
			<Label variant={'body1'} mb={32}>
				{props.address}
			</Label>
			<TabbedDestinationSummary tabs={props.summaryTabs} />
			<Box display={'flex'} marginTop={10} justifyContent={'space-between'}>
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'Resort Details'}
					onClick={() => {
						router.navigate(props.destinationDetailsPath).catch(console.error);
					}}
				/>
				{!!props.onAddCompareClick && (
					<LabelButton
						look={'containedSecondary'}
						variant={'button'}
						label={'Add to compare +'}
						onClick={() => {
							if (props.onAddCompareClick) props.onAddCompareClick();
						}}
					/>
				)}
			</Box>
		</div>
	);
};

export default DestinationSearchResultCardMobile;
