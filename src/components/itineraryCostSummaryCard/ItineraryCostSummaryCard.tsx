import * as React from 'react';
import './ItineraryCostSummaryCard.scss';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import { useEffect, useState } from 'react';

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
	}[];
}

const ItineraryCostSummaryCard: React.FC<ItineraryCostSummaryCardProps> = (props) => {
	const [taxesAndFees, setTaxesAndFees] = useState<number>(0);
	const [totalCost, setTotalCost] = useState<number>(0);
	useEffect(() => {
		let taxes = props.reservation.map((item) => item.taxesAndFees);
		let cost = props.reservation.map((item) => item.cost);
		setTotalCost(
			cost.reduce((acc: number, item) => {
				return acc + item;
			})
		);
		setTaxesAndFees(
			taxes.reduce((acc: number, item) => {
				return acc + item;
			})
		);
	});

	function renderReservations() {
		return props.reservation.map((item, index) => {
			return (
				<div className={'reservation'} key={index}>
					<Box display={'flex'} justifyContent={'space-between'}>
						<Label variant={'h4'}>{item.name}</Label>
						<Label variant={'h4'}>${StringUtils.formatMoney(item.cost)}</Label>
					</Box>
					<Label variant={'body1'}>{`${new Date(item.arrivalDate).toDateString()} - ${new Date(
						item.departureDate
					).toDateString()}`}</Label>
					<Label variant={'body1'}>{item.nights} Nights</Label>
				</div>
			);
		});
	}

	// function renderTaxesAndFees() {
	// 	let taxes = props.reservation.reduce((acc: number, value) => {
	// 		return acc + value.taxesAndFees;
	// 	});
	// }

	return (
		<Paper className={'rsItineraryCostSummaryCard'} boxShadow>
			<Label variant={'h4'}>{props.destinationName}</Label>
			<Label variant={'h4'}>{`${props.address.address1} ${props.address.address2 || ''} ${props.address.city}, ${
				props.address.state
			} ${props.address.zip}`}</Label>
			<hr />
			{renderReservations()}
			<Box display={'flex'} justifyContent={'space-between'}>
				<Label variant={'h4'}>TAXES AND FEES</Label>
				<Label variant={'h4'}>${StringUtils.formatMoney(taxesAndFees)}</Label>
			</Box>
			<hr />
			<Box display={'flex'} justifyContent={'space-between'}>
				<Label variant={'h2'}>Total:</Label>
				<Label variant={'h2'}>${StringUtils.formatMoney(totalCost)}</Label>
			</Box>
		</Paper>
	);
};

export default ItineraryCostSummaryCard;
