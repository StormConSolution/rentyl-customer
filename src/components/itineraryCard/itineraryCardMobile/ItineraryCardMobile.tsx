import * as React from 'react';
import './ItineraryCardMobile.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Carousel from '../../carousel/Carousel';
import { useEffect, useState } from 'react';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../paper/Paper';
import LabelLink from '../../labelLink/LabelLink';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import ReservationInfoCard from '../../reservationInfoCard/ReservationInfoCard';

interface ReservationCardMobileProps {
	imgPaths: string[];
	logo: string;
	title: string;
	address: string;
	reservationDates: { startDate: string | Date; endDate: string | Date };
	propertyType: string;
	itineraryId: string;
	maxOccupancy: number;
	amenities: string[];
	totalPoints: number;
	linkPath: string;
	cancelPermitted: 0 | 1;
	itineraryTotal: number;
	paidWithPoints: boolean;
}

const ItineraryCardMobile: React.FC<ReservationCardMobileProps> = (props) => {
	const [showControls, setShowControls] = useState<boolean>(true);

	useEffect(() => {
		if (props.imgPaths.length <= 1) setShowControls(false);
	}, [props.imgPaths]);

	function renderPictures(picturePaths: string[]): JSX.Element[] {
		return picturePaths.map((path: string) => {
			return (
				<Box className={'imageWrapper'}>
					<img src={path} alt="Reservation Card Image" />
				</Box>
			);
		});
	}
	return (
		<Box className={'rsItineraryCardMobile'}>
			<Carousel showControls={showControls} children={renderPictures(props.imgPaths)} />
			{props.logo && props.logo !== '' && <img className={'logoImg'} src={props.logo} alt={''} />}
			<Label variant={'h1'} mb={8}>
				{props.title}
			</Label>
			<Label variant={'body1'} mb={32}>
				{props.address}
			</Label>
			<Paper boxShadow padding={'16px'}>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Label variant={'body1'}>TOTAL PRICE</Label>
					<LabelLink path={props.linkPath} label={'VIEW DETAILS'} variant={'body1'} />
				</Box>
				{!props.paidWithPoints ? (
					<div>
						<Label variant={'caption'} mb={5}>
							Total Price
						</Label>
						<Label variant={'h2'}>${StringUtils.formatMoney(props.itineraryTotal)}</Label>
					</div>
				) : (
					<div>
						<Label variant={'caption'} mb={5}>
							Points Paid
						</Label>
						<Label variant={'h2'}>{StringUtils.addCommasToNumber(props.totalPoints)}</Label>
					</div>
				)}
			</Paper>
			<ReservationInfoCard
				reservationDates={props.reservationDates}
				propertyType={props.propertyType}
				itineraryId={props.itineraryId}
				maxOccupancy={props.maxOccupancy}
				cancelPermitted={props.cancelPermitted}
			/>
		</Box>
	);
};

export default ItineraryCardMobile;
