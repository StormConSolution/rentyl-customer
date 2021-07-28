import * as React from 'react';
import './ReservationDetailsCostSummaryCard.scss';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import { convertTwentyFourHourTime } from '../../utils/utils';
import Accordion from '@bit/redsky.framework.rs.accordion';
import { StringUtils } from '@bit/redsky.framework.rs.utils';

interface ReservationDetailsCostSummaryCartProps {
	accommodationName: string;
	checkInTime: string;
	checkOutTime: string;
	arrivalDate: string | Date;
	departureDate: string | Date;
	adultCount: number;
	childCount: number;
	taxAndFeeTotalsInCents: { name: string; amount: number }[];
	costPerNight: { [date: string]: number };
	grandTotalCents: number;
}

const ReservationDetailsCostSummaryCard: React.FC<ReservationDetailsCostSummaryCartProps> = (props) => {
	function renderItemizedCostPerNight() {
		let itemizedCostPerNight: React.ReactNodeArray = [];
		for (let i in props.costPerNight) {
			itemizedCostPerNight.push(
				<Box display={'flex'} alignItems={'center'} key={i}>
					<Label variant={'body1'}>{new Date(i).toDateString()}</Label>
					<Label variant={'body1'} marginLeft={'auto'}>
						${StringUtils.formatMoney(props.costPerNight[i])}
					</Label>
				</Box>
			);
		}
		return itemizedCostPerNight;
	}

	function renderTaxesAndFees() {
		return props.taxAndFeeTotalsInCents.map((item, index) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={index}>
					<Label variant={'body1'}>{item.name}</Label>
					<Label variant={'body1'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.amount)}
					</Label>
				</Box>
			);
		});
	}

	return (
		<Paper className={'rsReservationDetailsCostSummaryCard'} boxShadow>
			<Label variant={'h4'} mb={4}>
				{props.accommodationName}
			</Label>
			<Label variant={'body1'}>{`${new Date(props.arrivalDate).toDateString()} - ${new Date(
				props.departureDate
			).toDateString()}`}</Label>
			<hr />
			<Box display={'flex'} mb={16}>
				<Box marginRight={44}>
					<Label variant={'h4'} mb={8}>
						CHECK-IN
					</Label>
					<Label variant={'body1'}>{convertTwentyFourHourTime(props.checkInTime)}</Label>
				</Box>
				<div>
					<Label variant={'h4'} mb={8}>
						CHECK-OUT
					</Label>
					<Label variant={'body1'}>{convertTwentyFourHourTime(props.checkOutTime)}</Label>
				</div>
			</Box>
			<hr />
			<Label variant={'h4'}>GUEST</Label>
			<Label variant={'body1'}>{`${props.adultCount} Adults`}</Label>
			<Label variant={'body1'}>{`${props.childCount} Children`}</Label>
			<hr />
			<Accordion isOpen titleReact={<Label variant={'h4'}>DATES</Label>}>
				{renderItemizedCostPerNight()}
			</Accordion>
			<Label variant={'body1'}>{Object.keys(props.costPerNight).length} Nights</Label>
			<hr />
			<Accordion isOpen titleReact={<Label variant={'h4'}>TAXES AND FEES</Label>}>
				{renderTaxesAndFees()}
			</Accordion>
			<hr />
			<Box display={'flex'} justifyContent={'space-between'}>
				<Label variant={'h2'}>Total:</Label>
				<Label variant={'h2'}>{StringUtils.formatMoney(props.grandTotalCents)}</Label>
			</Box>
		</Paper>
	);
};

export default ReservationDetailsCostSummaryCard;
