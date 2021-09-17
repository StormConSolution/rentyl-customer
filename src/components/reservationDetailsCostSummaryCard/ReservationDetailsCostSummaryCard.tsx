import * as React from 'react';
import './ReservationDetailsCostSummaryCard.scss';
import Paper from '../paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import { DateUtils } from '../../utils/utils';
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
	upsellPackages: Api.UpsellPackage.Res.Complete[];
	costPerNight: { [date: string]: number };
	accommodationTotalCents: number;
	grandTotalCents: number;
	points: number;
	paidWithPoints: boolean;
}

const ReservationDetailsCostSummaryCard: React.FC<ReservationDetailsCostSummaryCartProps> = (props) => {
	function renderItemizedCostPerNight() {
		let itemizedCostPerNight: React.ReactNodeArray = [];
		for (let i in props.costPerNight) {
			itemizedCostPerNight.push(
				<Box display={'flex'} alignItems={'center'} key={i}>
					<Label variant={'body1'}>{DateUtils.displayUserDate(i)}</Label>
					<Label variant={'body1'} marginLeft={'auto'}>
						${StringUtils.formatMoney(props.costPerNight[i])}
					</Label>
				</Box>
			);
		}

		return itemizedCostPerNight;
	}

	function renderUpsellPackages() {
		return props.upsellPackages.map((item) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={item.id}>
					<Label variant={'body1'}>{item.title}</Label>
					<Label variant={'body1'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.priceDetail.amountAfterTax)}
					</Label>
				</Box>
			);
		});
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
			<Label variant={'body1'}>{`${DateUtils.displayUserDate(props.arrivalDate)} - ${DateUtils.displayUserDate(
				props.departureDate
			)}`}</Label>
			<hr />
			<Box display={'flex'} mb={16}>
				<Box marginRight={44}>
					<Label variant={'h4'} mb={8}>
						CHECK-IN
					</Label>
					<Label variant={'body1'}>{StringUtils.convertTwentyFourHourTime(props.checkInTime)}</Label>
				</Box>
				<div>
					<Label variant={'h4'} mb={8}>
						CHECK-OUT
					</Label>
					<Label variant={'body1'}>{StringUtils.convertTwentyFourHourTime(props.checkOutTime)}</Label>
				</div>
			</Box>
			<hr />
			<Label variant={'h4'}>GUEST</Label>
			<Label variant={'body1'}>{`${props.adultCount} Adults`}</Label>
			<Label variant={'body1'}>{`${props.childCount} Children`}</Label>
			<hr />
			<Accordion isOpen titleReact={<Label variant={'h4'}>DATES</Label>}>
				<Label variant={'body1'}>
					{DateUtils.daysBetweenStartAndEndDates(new Date(props.departureDate), new Date(props.arrivalDate))}{' '}
					Nights
				</Label>
				{renderItemizedCostPerNight()}
				<Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
					<Label variant={'h4'}>Total: </Label>
					<Label variant={'h4'}>${StringUtils.formatMoney(props.accommodationTotalCents)}</Label>
				</Box>
			</Accordion>
			<Label variant={'body1'}>
				{DateUtils.daysBetweenStartAndEndDates(new Date(props.departureDate), new Date(props.arrivalDate))}{' '}
				Nights
			</Label>
			<hr />
			{props.upsellPackages.length > 0 && (
				<>
					<Accordion isOpen titleReact={<Label variant={'h4'}>PACKAGES</Label>}>
						{renderUpsellPackages()}
						<Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
							<Label variant={'h4'}>Total: </Label>
							<Label variant={'h4'}>
								{StringUtils.formatMoney(
									props.upsellPackages.reduce((total, item) => {
										return total + item.priceDetail.amountAfterTax;
									}, 0)
								)}
							</Label>
						</Box>
					</Accordion>
					<hr />
				</>
			)}
			{!props.paidWithPoints && (
				<Accordion isOpen titleReact={<Label variant={'h4'}>TAXES AND FEES</Label>}>
					{renderTaxesAndFees()}
					<Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
						<Label variant={'h4'}>Total: </Label>
						<Label variant={'h4'}>
							{StringUtils.formatMoney(
								props.taxAndFeeTotalsInCents.reduce((total, item) => total + item.amount, 0)
							)}
						</Label>
					</Box>
				</Accordion>
			)}
			{!props.paidWithPoints && <hr />}
			<Box display={'flex'} justifyContent={'space-between'}>
				<Label variant={'h2'}>Total:</Label>
				{!props.paidWithPoints ? (
					<Label variant={'h2'}>${StringUtils.formatMoney(props.grandTotalCents)}</Label>
				) : (
					<Label variant={'h2'}>{StringUtils.addCommasToNumber(props.points)} Points</Label>
				)}
			</Box>
		</Paper>
	);
};

export default ReservationDetailsCostSummaryCard;
