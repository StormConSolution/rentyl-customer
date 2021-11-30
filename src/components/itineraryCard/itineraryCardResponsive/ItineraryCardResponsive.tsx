import * as React from 'react';
import './ItineraryCardResponsive.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import ReservationInfoCard from '../../reservationInfoCard/ReservationInfoCard';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import LabelLink from '../../labelLink/LabelLink';
import Icon from '@bit/redsky.framework.rs.icon';
import IconLabel from '../../iconLabel/IconLabel';
import CarouselV2 from '../../carouselV2/CarouselV2';
import router from '../../../utils/router';

interface ItineraryCardResponsiveProps {
	imgPaths: string[];
	title: string;
	address: string;
	reservationDates: { startDate: string | Date; endDate: string | Date };
	destinationExperiences: {
		id: number;
		title: string;
		icon: string;
	}[];
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

const ItineraryCardResponsive: React.FC<ItineraryCardResponsiveProps> = (props) => {
	function renderFeatures() {
		return props.destinationExperiences.map((experience) => {
			return (
				<Box
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					textAlign={'center'}
					key={experience.id}
					marginRight={30}
				>
					<IconLabel
						labelName={experience.title}
						iconImg={experience.icon}
						iconPosition={'top'}
						iconSize={45}
						labelVariant={'subtitle1'}
					/>
				</Box>
			);
		});
	}
	return (
		<Box className={'rsItineraryCardResponsive'}>
			<Box className={'columnOne'}>
				<CarouselV2 path={props.linkPath} imgPaths={props.imgPaths} />
			</Box>
			<Box
				className={'columnTwo'}
				onClick={() => {
					router.navigate(`${props.linkPath}`).catch((err) => console.error(err));
				}}
			>
				<Box className={'rowOne'} display={'flex'} alignItems={'center'} marginBottom={24}>
					<Label variant={'customTwo'} marginRight={24}>
						{props.title}
					</Label>
					<Label variant={'caption1'}>
						<Icon iconImg="icon-pin" color={'#D2555F'} size={17} className="locationIcon" />
						{props.address}
					</Label>
				</Box>
				<Box className={'rowTwo'}>
					<ReservationInfoCard
						reservationDates={props.reservationDates}
						propertyType={props.propertyType}
						itineraryId={props.itineraryId}
						maxOccupancy={props.maxOccupancy}
						cancelPermitted={props.cancelPermitted}
					/>
				</Box>
				<Box className={'rowThree'}>
					<Label marginBottom={15}>Amenities</Label>
					<Box className={'experienceWrapper'}>{renderFeatures()}</Box>
				</Box>
			</Box>
			<Box
				className={'columnThree'}
				onClick={() => {
					router.navigate(`${props.linkPath}`).catch((err) => console.error(err));
				}}
			>
				{!props.paidWithPoints ? (
					<div>
						<Label variant={'caption'} marginBottom={18}>
							Trip Total
						</Label>
						<Label variant={'customTwentyThree'} marginBottom={18}>
							${StringUtils.formatMoney(props.itineraryTotal)}
						</Label>
					</div>
				) : (
					<div>
						<Label variant={'caption'} marginBottom={18}>
							Points Paid
						</Label>
						<Label variant={'customTwentyThree'} marginBottom={18}>
							{StringUtils.addCommasToNumber(props.totalPoints)}
						</Label>
					</div>
				)}
				<LabelLink path={props.linkPath} label={'view details'} variant={'caption'} />
			</Box>
		</Box>
	);
};

export default ItineraryCardResponsive;
