import * as React from 'react';
import './ItineraryCostSummaryCard.scss';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import { useEffect, useState } from 'react';
import { DateUtils } from '../../utils/utils';

interface ItineraryCostSummaryCardProps {
	destinationName: string;
	address: {
		address1: string;
		address2?: string;
		city: string;
		state: string;
		zip: string | number;
	};
	reservation: {
		name: string;
		arrivalDate: string | Date;
		departureDate: string | Date;
		nights: number;
		cost: number;
		taxesAndFees: number;
		points: number;
	}[];
	paidWithPoints: boolean;
}

const ItineraryCostSummaryCard: React.FC<ItineraryCostSummaryCardProps> = (props) => {
	const [taxesAndFees, setTaxesAndFees] = useState<number>(0);
	const [totalCost, setTotalCost] = useState<number>(0);
	useEffect(() => {
		setTotalCost(
			props.reservation.reduce((acc: number, item) => {
				if (props.paidWithPoints) return acc + item.points;
				return acc + item.cost;
			}, 0)
		);
		setTaxesAndFees(
			props.reservation.reduce((acc: number, item) => {
				return acc + item.taxesAndFees;
			}, 0)
		);
	}, [props.reservation]);

	function renderReservations() {
		return props.reservation.map((item, index) => {
			return (
				<div className={'reservation'} key={index}>
					<Box display={'flex'} justifyContent={'space-between'}>
						<Label variant={'h4'}>{item.name}</Label>
						{!props.paidWithPoints ? (
							<Label variant={'h4'}>${StringUtils.formatMoney(item.cost)}</Label>
						) : (
							<Label variant={'h4'}>{StringUtils.addCommasToNumber(item.points)} points</Label>
						)}
					</Box>
					<Label variant={'body1'}>{`${DateUtils.displayUserDate(
						item.arrivalDate
					)} - ${DateUtils.displayUserDate(item.departureDate)}`}</Label>
					<Label variant={'body1'}>
						{DateUtils.daysBetween(item.departureDate, item.arrivalDate)} Nights
					</Label>
				</div>
			);
		});
	}

	return (
		<Paper className={'rsItineraryCostSummaryCard'} boxShadow>
			<Label variant={'h4'}>{props.destinationName}</Label>
			<Label variant={'h4'}>{`${props.address.address1} ${props.address.address2 || ''} ${props.address.city}, ${
				props.address.state
			} ${props.address.zip}`}</Label>
			<hr />
			{renderReservations()}
			{!props.paidWithPoints && (
				<Box display={'flex'} justifyContent={'space-between'}>
					<Label variant={'h4'}>TAXES AND FEES</Label>
					<Label variant={'h4'}>${StringUtils.formatMoney(taxesAndFees)}</Label>
				</Box>
			)}
			{!props.paidWithPoints && <hr />}
			<Box display={'flex'} justifyContent={'space-between'}>
				<Label variant={'h2'}>Total:</Label>
				{!props.paidWithPoints ? (
					<Label variant={'h2'}>${StringUtils.formatMoney(totalCost + taxesAndFees)}</Label>
				) : (
					<Label variant={'h2'}>{StringUtils.addCommasToNumber(totalCost)} Points</Label>
				)}
			</Box>
		</Paper>
	);
};

export default ItineraryCostSummaryCard;
