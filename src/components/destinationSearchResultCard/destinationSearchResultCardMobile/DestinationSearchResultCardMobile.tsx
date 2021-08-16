import * as React from 'react';
import './DestinationSearchResultCardMobile.scss';
import Carousel from '../../carousel/Carousel';
import { Box } from '@bit/redsky.framework.rs.996';
import { Rating } from '../../starRating/StarRating';
import TabbedDestinationSummary, {
	DestinationSummaryTab
} from '../../tabbedDestinationSummary/TabbedDestinationSummary';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../../paper/Paper';
import LabelButton from '../../labelButton/LabelButton';
import router from '../../../utils/router';

interface DestinationSearchResultCardMobileProps {
	className?: string;
	destinationName: string;
	address: string;
	logoImagePath: string;
	picturePaths: string[];
	starRating: Rating;
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
					<img src={path} alt="" />
				</Box>
			);
		});
	}

	return (
		<div className={'rsDestinationSearchResultCardMobile'}>
			<Carousel showControls children={renderPictures(props.picturePaths)} />
			<img className={'logoImg'} src={props.logoImagePath} alt={`${props.destinationName} Logo`} />
			<Label variant={'h1'} mb={8}>
				{props.destinationName}
			</Label>
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
