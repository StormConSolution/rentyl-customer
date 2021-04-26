import * as React from 'react';
import './BookingCartTotalsCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Accordion from '@bit/redsky.framework.rs.accordion';
import { ObjectUtils, StringUtils } from '@bit/redsky.framework.rs.utils';
import Paper from '../../../components/paper/Paper';
import { Booking } from '../fakeBookingData';
import Icon from '@bit/redsky.framework.rs.icon';
import useWindowResizeChange from '../../../customHooks/useWindowResizeChange';

interface BookingCartTotalsCardProps {
	checkInTime: string;
	checkoutTime: string;
	checkInDate: string;
	checkoutDate: string;
	accommodationName: string;
	taxAndFees: { title: string; priceCents: number }[];
	costPerNight: { date: string; priceCents: number }[];
	costTotalCents: number;
	adults: number;
	children: number;
	packages?: Booking.BookingPackageDetails[];
	onDeletePackage: (packageId: number) => void;
}

const BookingCartTotalsCard: React.FC<BookingCartTotalsCardProps> = (props) => {
	const size = useWindowResizeChange();
	function getRoomTotal() {
		let cost = 0;
		props.costPerNight.forEach((item) => (cost += item.priceCents));
		return StringUtils.formatMoney(cost);
	}

	function getTaxesAndFeesTotal() {
		let cost = 0;
		props.taxAndFees.forEach((item) => {
			cost += item.priceCents;
		});
		return StringUtils.formatMoney(cost);
	}

	function renderItemizedCostPerNight() {
		return props.costPerNight.map((item, index) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={index}>
					<Label variant={'body2'} width={'170px'}>
						{new Date(item.date).toDateString()}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.priceCents)}
					</Label>
				</Box>
			);
		});
	}

	function renderTaxesAndFees() {
		return props.taxAndFees.map((item, index) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={index}>
					<Label variant={'body2'} width={'170px'}>
						{item.title}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.priceCents)}
					</Label>
				</Box>
			);
		});
	}

	function getPackageTotal() {
		if (!props.packages) return;
		let total = 0;
		props.packages.forEach((item) => (total += item.priceCents));
		return `${StringUtils.formatMoney(total)}`;
	}

	function getCartTotal() {
		if (props.costTotalCents && !ObjectUtils.isArrayWithData(props.packages)) {
			return `${StringUtils.formatMoney(props.costTotalCents)}`;
		} else if (props.packages && ObjectUtils.isArrayWithData(props.packages)) {
			let packagesTotals = props.costTotalCents;
			props.packages.forEach((item) => (packagesTotals += item.priceCents));
			return `${StringUtils.formatMoney(packagesTotals)}`;
		}
	}

	function renderPackages() {
		if (!props.packages || !ObjectUtils.isArrayWithData(props.packages)) return [];

		return props.packages.map((item, index) => {
			return (
				<Box key={item.id} display={'flex'} alignItems={'center'} mb={10}>
					<Label variant={'body2'} width={'170px'}>
						{item.title}
						<Icon
							iconImg={'icon-trash'}
							size={12}
							cursorPointer
							onClick={() => {
								props.onDeletePackage(item.id);
							}}
						/>
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.priceCents)}
					</Label>
				</Box>
			);
		});
	}

	return (
		<Paper
			width={size === 'small' ? '100%' : '410px'}
			className={'rsBookingCartTotalsCard'}
			borderRadius={'4px'}
			boxShadow
			padding={'16px'}
		>
			<Label variant={'h2'} marginBottom={'10px'}>
				Your Stay
			</Label>
			<Box display={'flex'}>
				<Box marginRight={'50px'}>
					<Label variant={'h4'}>Check-in</Label>
					<Label variant={'body1'}>After {props.checkInTime}</Label>
				</Box>
				<Box>
					<Label variant={'h4'}>Check-out</Label>
					<Label variant={'body1'}>Before {props.checkoutTime}</Label>
				</Box>
			</Box>
			<hr />
			<Box marginBottom={'10px'}>
				<Label variant={'body1'}>
					{new Date(props.checkInDate).toDateString()} - {new Date(props.checkoutDate).toDateString()}
				</Label>
				<Label variant={'body1'}>{props.adults} Adults</Label>
				{props.children && <Label variant={'body1'}>{props.children} Children</Label>}
			</Box>
			<Box display={'flex'} alignItems={'center'}>
				<Label variant={'h4'} width={'170px'}>
					{props.accommodationName}
				</Label>
				<Label variant={'h4'} marginLeft={'auto'}>
					${getRoomTotal()}
				</Label>
			</Box>
			<Accordion titleReact={<Label variant={'body1'}>{props.costPerNight.length} Nights</Label>}>
				{renderItemizedCostPerNight()}
			</Accordion>
			{ObjectUtils.isArrayWithData(props.packages) && (
				<>
					<Box display={'flex'} alignItems={'center'} marginBottom={10}>
						<Label variant={'h4'} width={'170px'}>
							Packages
						</Label>
						<Label variant={'h4'} marginLeft={'auto'}>
							${getPackageTotal()}
						</Label>
					</Box>
					{renderPackages()}
				</>
			)}
			<Box display={'flex'} alignItems={'center'}>
				<Label variant={'h4'} width={'170px'}>
					Taxes and Fees
				</Label>
				<Label variant={'h4'} marginLeft={'auto'}>
					${getTaxesAndFeesTotal()}
				</Label>
			</Box>
			<Accordion titleReact={<Label variant={'body1'}>Details</Label>}>{renderTaxesAndFees()}</Accordion>
			<hr />
			<Box display={'flex'} alignItems={'center'}>
				<Label variant={'h3'} width={'170px'}>
					Total:
				</Label>
				<Label variant={'h3'} marginLeft={'auto'}>
					${getCartTotal()}
				</Label>
			</Box>
		</Paper>
	);
};

export default BookingCartTotalsCard;
