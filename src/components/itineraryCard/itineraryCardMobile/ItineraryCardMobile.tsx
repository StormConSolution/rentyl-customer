import * as React from 'react';
import './ItineraryCardMobile.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import CarouselV2 from '../../carouselV2/CarouselV2';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import Icon from '@bit/redsky.framework.rs.icon';
import router from '../../../utils/router';

interface ReservationCardMobileProps {
	imgPaths: string[];
	logo: string;
	title: string;
	city: string;
	state: string;
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
	return (
		<Box className={'rsItineraryCardMobile'}>
			<CarouselV2 path={props.linkPath} imgPaths={props.imgPaths} />
			<Box className="titleAndButton" marginTop={10} marginBottom={16}>
				<Label variant={'customTwentyFour'}>{props.title}</Label>
				<Icon
					iconImg="icon-info-outline"
					color={'#000'}
					size={20}
					className="locationIcon"
					onClick={() => {
						router.navigate(`${props.linkPath}`).catch((err) => console.error(err));
					}}
				/>
			</Box>
			<Box className={'bottomRow'}>
				{!props.paidWithPoints ? (
					<Box display="flex">
						<Label variant={'boldCaption1'} marginRight={5}>
							${StringUtils.formatMoney(props.itineraryTotal)}
						</Label>
						<Label variant={'caption1'}>trip total</Label>
					</Box>
				) : (
					<Box display="flex">
						<Label variant={'boldCaption1'} marginRight={5}>
							{StringUtils.addCommasToNumber(props.totalPoints)}
						</Label>
						<Label variant={'caption1'}>points paid</Label>
					</Box>
				)}
				<Label variant={'caption1'}>
					<Icon iconImg="icon-pin" color={'#D2555F'} size={17} className="locationIcon" />
					{props.city}, {props.state}
				</Label>
			</Box>
		</Box>
	);
};

export default ItineraryCardMobile;
