import * as React from 'react';
import './ItineraryCostSummaryCard.scss';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import { DateUtils, StringUtils } from '../../utils/utils';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

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
		subtotalCostCents: number;
		taxesAndFees: number;
		subtotalPoints: number;
		packagesTotalCost: number;
	}[];
	paidWithPoints: boolean;
}

const ItineraryCostSummaryCard: React.FC<ItineraryCostSummaryCardProps> = (props) => {
	const size = useWindowResizeChange();
	let grandTotalCents = 0;
	let grandTotalTaxFeeCents = 0;
	let grandTotalPoints = 0;
	let grandTotalPackageCost = 0;
	props.reservation.forEach((reservation) => {
		grandTotalCents += reservation.subtotalCostCents;
		grandTotalTaxFeeCents += reservation.taxesAndFees;
		grandTotalPoints += reservation.subtotalPoints;
		grandTotalPackageCost += reservation.packagesTotalCost;
	});

	function renderReservations() {
		return props.reservation.map((item, index) => {
			return (
				<div className={'reservation'} key={index}>
					<Box display={'flex'} justifyContent={'space-between'}>
						<Label variant={'h4'}>{item.name}</Label>
						{!props.paidWithPoints ? (
							<Label variant={'h4'}>${StringUtils.formatMoney(item.subtotalCostCents)}</Label>
						) : (
							<Label variant={'h4'}>{StringUtils.addCommasToNumber(item.subtotalPoints)} points</Label>
						)}
					</Box>
					{size === 'small' ? (
						<Label variant={'body1'}>
							{`${DateUtils.displayUserDate(
								item.arrivalDate,
								'MM/DD/YYYY'
							)} - ${DateUtils.displayUserDate(item.departureDate, 'MM/DD/YYYY')}`}
						</Label>
					) : (
						<Label variant={'body1'}>
							{`${DateUtils.displayUserDate(item.arrivalDate)} - ${DateUtils.displayUserDate(
								item.departureDate
							)}`}
						</Label>
					)}
					<Label variant={'body1'}>
						{DateUtils.daysBetweenStartAndEndDates(
							new Date(item.arrivalDate),
							new Date(item.departureDate)
						)}{' '}
						Nights
					</Label>
				</div>
			);
		});
	}

	return (
		<Paper className={'rsItineraryCostSummaryCard'} boxShadow>
			<Label variant={'h4'}>{props.destinationName}</Label>
			<Label variant={'h4'}>
				{StringUtils.buildAddressString({
					address1: props.address.address1,
					address2: props.address.address2,
					city: props.address.city,
					state: props.address.state,
					zip: props.address.zip.toString() || ''
				})}
			</Label>
			<hr />
			{renderReservations()}
			{!!grandTotalPackageCost && (
				<>
					<Box display={'flex'} justifyContent={'space-between'}>
						<Label variant={'h4'}>PACKAGE TOTAL</Label>
						<Label variant={'h4'}>
							{props.paidWithPoints
								? `${StringUtils.addCommasToNumber(grandTotalPackageCost)} points`
								: `$${StringUtils.formatMoney(grandTotalPackageCost)}`}
						</Label>
					</Box>
					<hr />
				</>
			)}
			{!props.paidWithPoints && (
				<Box display={'flex'} justifyContent={'space-between'}>
					<Label variant={'h4'}>TAXES AND FEES</Label>
					<Label variant={'h4'}>${StringUtils.formatMoney(grandTotalTaxFeeCents)}</Label>
				</Box>
			)}
			{!props.paidWithPoints && <hr />}
			<Box display={'flex'} justifyContent={'space-between'}>
				<Label variant={'h2'}>Total:</Label>
				{!props.paidWithPoints ? (
					<Label variant={'h2'}>
						${StringUtils.formatMoney(grandTotalCents + grandTotalTaxFeeCents + grandTotalPackageCost)}
					</Label>
				) : (
					<Label variant={'h2'}>
						{StringUtils.addCommasToNumber(grandTotalPoints + grandTotalPackageCost)} Points
					</Label>
				)}
			</Box>
		</Paper>
	);
};

export default ItineraryCostSummaryCard;
