import * as React from 'react';
import './BookingSummaryCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import { useState } from 'react';
import { Box } from '@bit/redsky.framework.rs.996';
interface BookingSummaryCardProps {
	bookingData: Api.Reservation.Res.Verification;
	canHide: boolean;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = (props) => {
	const [hideSummary, setHideSummary] = useState<boolean>(false);
	const [hideTaxesAndFees, setHideTaxesAndFees] = useState<boolean>(false);

	function renderStayInfo() {
		let date1 = new Date(props.bookingData.arrivalDate);
		let date2 = new Date(props.bookingData.departureDate);
		let timeDiff = Math.abs(date2.getTime() - date1.getTime());
		let numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

		return (
			<div>
				<Label variant={'customThree'}>{props.bookingData.accommodationName}</Label>
				<Box display={'flex'} justifyContent={'space-between'}>
					<Label variant={'bookingSummaryCustomThree'}>{`${numberOfNights} night${
						numberOfNights > 1 ? 's' : ''
					}`}</Label>
					<Label variant={'customThree'}>
						${(props.bookingData.prices.accommodationTotalInCents / 100).toFixed(2)}
					</Label>
				</Box>
			</div>
		);
	}

	function renderPackages() {
		let packageItems: JSX.Element[] = [];

		props.bookingData.upsellPackages.forEach((packageItem: Api.UpsellPackage.Res.Complete, index: number) => {
			packageItems.push(
				<div key={`package${index}`}>
					<Label variant={'customThree'} marginTop={16}>
						{packageItem.title}
					</Label>
					<Box display={'flex'} justifyContent={'space-between'}>
						<Label variant={'bookingSummaryCustomThree'}>
							x{props.bookingData.upsellPackages.filter((value) => value.id === packageItem.id).length}
						</Label>
						<Label variant={'customThree'}>
							${(packageItem.priceDetail.amountBeforeTax / 100).toFixed(2)}
						</Label>
					</Box>
				</div>
			);
		});
		return packageItems;
	}

	function renderTaxesAndFees() {
		return (
			<div className={'taxesAndFees'}>
				<div className={'taxBreakdown'}>
					<Label variant={'customThree'}>Taxes</Label>
					{props.bookingData.prices.taxTotalsInCents.forEach((value) => {
						return (
							<Box display={'flex'} justifyContent={'space-between'}>
								<Label variant={'bookingSummaryCustomFour'} paddingLeft={5}>
									{value.name}
								</Label>
								<Label variant={'bookingSummaryCustomFour'} paddingLeft={5}>
									{(value.amount / 100).toFixed(2)}
								</Label>
							</Box>
						);
					})}
				</div>
				<div className={'feeBreakdown'}>
					<Label variant={'customThree'}>Fees</Label>
					{props.bookingData.prices.feeTotalsInCents.forEach((value) => {
						return (
							<Box display={'flex'} justifyContent={'space-between'}>
								<Label variant={'bookingSummaryCustomFour'} paddingLeft={5}>
									{value.name}
								</Label>
								<Label variant={'bookingSummaryCustomFour'} paddingLeft={5}>
									( value.amount / 100 ).toFixed(2)
								</Label>
							</Box>
						);
					})}
				</div>
			</div>
		);
	}

	return (
		<div className={'rsBookingSummaryCard'}>
			<Box display={'flex'} justifyContent={'space-between'}>
				<Label variant={'customFive'}>Booking Summary</Label>
				{props.canHide ? (
					<Icon
						iconImg={hideSummary ? 'icon-chevron-up' : 'icon-chevron-down'}
						onClick={() => setHideSummary(!hideSummary)}
					/>
				) : (
					<></>
				)}
			</Box>
			{hideSummary ? (
				<></>
			) : (
				<>
					<Label
						variant={'caption3'}
						marginTop={20}
					>{`${props.bookingData.accommodationName} at ${props.bookingData.destinationName}`}</Label>
					<div className={'checkInInfo'}>
						<div className={'cell'}>
							<Label variant={'bookingSummaryCustomOne'}>Check In</Label>
							<Label variant={'bookingSummaryCustomTwo'}>{props.bookingData.arrivalDate}</Label>
						</div>
						<div className={'cell'}>
							<Label variant={'bookingSummaryCustomOne'}>Check Out</Label>
							<Label variant={'bookingSummaryCustomTwo'}>{props.bookingData.departureDate}</Label>
						</div>
						<div className={'cell'}>
							<Label variant={'bookingSummaryCustomOne'}>Guests</Label>
							<Label variant={'bookingSummaryCustomTwo'}>{`${
								props.bookingData.adultCount + props.bookingData.childCount
							} guest${
								props.bookingData.adultCount + props.bookingData.childCount > 1 ? 's' : ''
							}`}</Label>
						</div>
					</div>
					{renderStayInfo()}
					<hr />
					{renderPackages()}
					<Box display={'flex'} justifyContent={'space-between'} marginTop={20}>
						<Box display={'flex'}>
							<Label variant={'bookingSummaryCustomThree'}>Taxes and fees</Label>
							<Icon
								iconImg={hideTaxesAndFees ? 'icon-chevron-up' : 'icon-chevron-down'}
								onClick={() => setHideTaxesAndFees(!hideTaxesAndFees)}
								className={'taxIcon'}
							/>
						</Box>
						<Label variant={'customThree'} className={'totalTax'}>
							${(props.bookingData.prices.taxAndFeeTotalInCents / 100).toFixed(2)}
						</Label>
					</Box>
					{hideTaxesAndFees ? <></> : renderTaxesAndFees()}
					<Box display={'flex'} justifyContent={'space-between'}>
						<Label variant={'customFour'} marginTop={20}>
							Total
						</Label>
						<Label variant={'customThree'} marginTop={20}>
							${(props.bookingData.prices.grandTotalCents / 100).toFixed(2)}
						</Label>
					</Box>
				</>
			)}
		</div>
	);
};
export default BookingSummaryCard;