import * as React from 'react';
import './ReservationSummaryCard.scss';
import Paper from '../paper/Paper';
import { Box } from '@bit/redsky.framework.rs.996';
import OtherPaymentCard from '../otherPaymentsCard/OtherPaymentCard';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { ObjectUtils, StringUtils } from '@bit/redsky.framework.rs.utils';
import Accordion from '@bit/redsky.framework.rs.accordion';
import { DateUtils } from '../../utils/utils';

interface ReservationSummaryCardProps {
	fullName: string;
	paymentMethod: Api.Reservation.PaymentMethod;
	billingAddress: Api.Reservation.BillingAddressDetails;
	priceDetails: Api.Reservation.PriceDetail;
	packages: Api.Package.Res.Get[];
}

const ReservationSummaryCard: React.FC<ReservationSummaryCardProps> = (props) => {
	function renderItemizedCostPerNight() {
		let itemizedCostPerNight: React.ReactNodeArray = [];
		for (let i in props.priceDetails.accommodationDailyCostsInCents) {
			itemizedCostPerNight.push(
				<Box display={'flex'} alignItems={'center'} key={i}>
					<Label variant={'body2'} width={'170px'}>
						{DateUtils.displayUserDate(i)}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(props.priceDetails.accommodationDailyCostsInCents[i])}
					</Label>
				</Box>
			);
		}
		return itemizedCostPerNight;
	}

	function renderItemizedTaxes() {
		return props.priceDetails.taxTotalsInCents.map((item, index) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={index}>
					<Label variant={'body2'} width={'170px'}>
						{item.name}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.amount)}
					</Label>
				</Box>
			);
		});
	}

	function renderPackageDetails() {
		if (!ObjectUtils.isArrayWithData(props.packages)) return [];
		return props.packages.map((item) => {
			return (
				<Box key={item.id} display={'flex'} alignItems={'center'} mb={10}>
					<Label variant={'body2'} width={'170px'}>
						{item.title}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(0)}
					</Label>
				</Box>
			);
		});
	}

	function renderItemizedFees() {
		return props.priceDetails.feeTotalsInCents.map((item, index) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={index}>
					<Label variant={'body2'} width={'170px'}>
						{item.name}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.amount)}
					</Label>
				</Box>
			);
		});
	}

	return (
		<Paper boxShadow className={'rsReservationSummaryCard'} backgroundColor={'#FCFBF8'}>
			<Box padding={'25px 40px'}>
				<Label variant={'h4'}>Cost Per Night</Label>
				<Accordion
					isOpen={true}
					titleReact={
						<Label variant={'body1'}>
							{Object.keys(props.priceDetails.accommodationDailyCostsInCents).length} Nights
						</Label>
					}
				>
					{renderItemizedCostPerNight()}
				</Accordion>
				<Accordion isOpen titleReact={<Label variant={'h4'}>Packages</Label>}>
					{renderPackageDetails()}
					<Box display={'flex'} justifyContent={'space-between'}>
						<Label variant={'body1'}>Total: </Label>
						<Label variant={'body1'}>
							${StringUtils.formatMoney(props.packages.reduce((total, item) => (total += 0), 0))}
						</Label>
					</Box>
				</Accordion>
				<Label variant={'h4'} mt={20}>
					Fees
				</Label>
				<Accordion isOpen={true} titleReact={<Label variant={'body1'}>Details</Label>}>
					{renderItemizedFees()}
				</Accordion>
				<Label variant={'h4'} mt={20}>
					Taxes
				</Label>
				<Accordion isOpen={true} titleReact={<Label variant={'body1'}>Details</Label>}>
					{renderItemizedTaxes()}
				</Accordion>
				<hr />
				<Box margin={'0 auto'} width={'fit-content'}>
					<Label variant={'h4'} mt={20}>
						Total
					</Label>
					<h1>${StringUtils.formatMoney(props.priceDetails.grandTotalCents)}</h1>
				</Box>
			</Box>
			<hr />
			<Box padding={'25px 40px'} display={'flex'}>
				<Box>
					<Label variant={'h4'} mb={10}>
						Payment Method
					</Label>
					<OtherPaymentCard
						name={props.paymentMethod.nameOnCard}
						cardNumber={props.paymentMethod.cardNumber}
						expDate={`${props.paymentMethod?.expirationMonth}/${props.paymentMethod?.expirationYear}`}
					/>
				</Box>
				{!ObjectUtils.isEmptyObject(props.billingAddress) && (
					<Box>
						<Label variant={'h4'} mb={10}>
							Billing Address
						</Label>
						<Label variant={'body1'}>{props.fullName}</Label>
						<Label variant={'body1'}>{`${props.billingAddress.address1} ${
							props.billingAddress.address2 || ''
						}`}</Label>
						<Label variant={'body1'}>
							{props.billingAddress.city}, {props.billingAddress.state} {props.billingAddress.zip}
						</Label>
					</Box>
				)}
			</Box>
		</Paper>
	);
};

export default ReservationSummaryCard;
