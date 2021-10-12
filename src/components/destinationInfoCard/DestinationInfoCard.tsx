import * as React from 'react';
import './DestinationInfoCard.scss';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import LabelButton from '../labelButton/LabelButton';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelLink from '../labelLink/LabelLink';
import StarRating from '../starRating/StarRating';

interface DestinationInfoCardProps {
	destinationId: number;
	destinationName: string;
	destinationImage: string;
	address: string;
	city: string;
	state: string;
	zip: number | string;
	rating: number;
	longDescription: string;
	onViewAvailableStaysClick?: () => void;
}

const DestinationInfoCard: React.FC<DestinationInfoCardProps> = (props) => {
	/**
	 * Commented out code will be implemented at a later date. Daniel wants us to commented it out for now
	 * This was done on 5/7/2021 - Ticket #192
	 */

	function renderDestinationAddress() {
		if (!props.address || !props.zip) {
			if (props.state && props.city) {
				return (
					<Label variant={'caption'}>
						{props.state}, {props.city}
					</Label>
				);
			}
		} else if (props.address && props.zip && props.state && props.city) {
			return (
				<Label variant={'caption'}>
					{props.address}, {props.state}, {props.city} {props.zip}
				</Label>
			);
		} else {
			return null;
		}
	}

	const size = useWindowResizeChange();
	return (
		<Paper
			className={'rsDestinationInfoCard'}
			padding={size === 'small' ? '20px' : '50px'}
			boxShadow
			backgroundColor={'#FCFBF8'}
			width={size === 'small' ? '335px' : '536px'}
		>
			<img src={props.destinationImage} alt={'Destination Logo'} />
			{renderDestinationAddress()}
			<Label variant={size === 'small' ? 'h2' : 'h1'}>{props.destinationName}</Label>
			<Box display={'flex'} marginBottom={'15px'}>
				<StarRating size={'small16px'} rating={props.rating} />
				<LabelLink
					path={`/destination/reviews?di=${props.destinationId}`}
					externalLink={false}
					label={'view reviews'}
					variant={'button'}
				/>
			</Box>
			<Label variant={'body2'}>{props.longDescription}</Label>
			<Box display={'flex'} marginTop={'30px'}>
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'View Available Stays'}
					onClick={props.onViewAvailableStaysClick}
				/>
				{/*<LabelLink*/}
				{/*	path={'/'}*/}
				{/*	externalLink={false}*/}
				{/*	label={'Watch video'}*/}
				{/*	variant={'button'}*/}
				{/*	iconRight={'icon-chevron-circle-right'}*/}
				{/*	iconSize={12}*/}
				{/*/>*/}
			</Box>
		</Paper>
	);
};

export default DestinationInfoCard;
