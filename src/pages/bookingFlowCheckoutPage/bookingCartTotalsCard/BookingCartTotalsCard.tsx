import * as React from 'react';
import './BookingCartTotalsCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Accordion from '@bit/redsky.framework.rs.accordion';
import { ObjectUtils, StringUtils } from '@bit/redsky.framework.rs.utils';
import Icon from '@bit/redsky.framework.rs.icon';
import { convertTwentyFourHourTime, DateUtils } from '../../../utils/utils';
import moment from 'moment';
import AccommodationOptionsPopup, {
	AccommodationOptionsPopupProps
} from '../../../popups/accommodationOptionsPopup/AccommodationOptionsPopup';

interface BookingCartTotalsCardProps {
	checkInTime: string;
	checkoutTime: string;
	checkInDate: string | Date;
	checkoutDate: string | Date;
	accommodationName: string;
	feeTotalsInCents: { name: string; amount: number }[];
	taxTotalsInCents: { name: string; amount: number }[];
	costPerNight: { [date: string]: number };
	grandTotalCents: number;
	taxAndFeeTotalInCent: number;
	accommodationTotalInCents: number;
	adults: number;
	children: number;
	packages?: Api.Reservation.Res.BookingPackageDetails[];
	onDeletePackage: (packageId: number) => void;
	accommodationId?: number;
	remove?: (accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) => void;
	edit?: (accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) => void;
	changeRoom?: (accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) => void;
	cancellable: boolean;
}

const BookingCartTotalsCard: React.FC<BookingCartTotalsCardProps> = (props) => {
	function renderItemizedCostPerNight() {
		let itemizedCostPerNight: React.ReactNodeArray = [];
		for (let i in props.costPerNight) {
			itemizedCostPerNight.push(
				<Box display={'flex'} alignItems={'center'} key={i}>
					<Label variant={'body2'} width={'170px'}>
						{new Date(i).toDateString()}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(props.costPerNight[i])}
					</Label>
				</Box>
			);
		}
		return itemizedCostPerNight;
	}

	function renderTaxesAndFees() {
		let index = 0;
		let taxes = props.taxTotalsInCents.map((item) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={++index}>
					<Label variant={'body2'} width={'170px'}>
						{item.name}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.amount)}
					</Label>
				</Box>
			);
		});
		let fees = props.feeTotalsInCents.map((item) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={++index}>
					<Label variant={'body2'} width={'170px'}>
						{item.name}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.amount)}
					</Label>
				</Box>
			);
		});

		return [...taxes, ...fees];
	}

	function getPackageTotal() {
		if (!props.packages) return;
		let total = 0;
		props.packages.forEach((item) => (total += item.priceCents));
		return `${StringUtils.formatMoney(total)}`;
	}

	function getCartTotal() {
		if (props.grandTotalCents && !ObjectUtils.isArrayWithData(props.packages)) {
			return `${StringUtils.formatMoney(props.grandTotalCents)}`;
		} else if (props.packages && ObjectUtils.isArrayWithData(props.packages)) {
			let packagesTotals = props.grandTotalCents;
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
		<Accordion
			isOpen
			className={'rsBookingCartTotalsCard'}
			hideHoverEffect
			titleReact={
				<Box display={'flex'} alignItems={'center'}>
					<Label variant={'h4'} width={'170px'}>
						{props.accommodationName}
					</Label>
					{props.edit && (
						<Icon
							iconImg={'icon-edit'}
							cursorPointer
							onClick={(event) => {
								event.stopPropagation();
								popupController.open<AccommodationOptionsPopupProps>(AccommodationOptionsPopup, {
									onChangeRoom: () => {
										popupController.close(AccommodationOptionsPopup);
										if (props.changeRoom)
											props.changeRoom(
												props.accommodationId || 0,
												props.checkInDate,
												props.checkoutDate
											);
									},
									onEditRoom: () => {
										if (props.edit)
											props.edit(
												props.accommodationId || 0,
												props.checkInDate,
												props.checkoutDate
											);
									},
									onRemove: () => {
										if (props.remove)
											props.remove(
												props.accommodationId || 0,
												props.checkInDate,
												props.checkoutDate
											);
									},
									cancellable: props.cancellable
								});
							}}
						/>
					)}
				</Box>
			}
		>
			<Box display={'flex'}>
				<Box marginRight={'50px'}>
					<Label variant={'h4'}>Check-in</Label>
					<Label variant={'body1'}>After {convertTwentyFourHourTime(props.checkInTime)}</Label>
				</Box>
				<Box>
					<Label variant={'h4'}>Check-out</Label>
					<Label variant={'body1'}>Before {convertTwentyFourHourTime(props.checkoutTime)}</Label>
				</Box>
			</Box>
			<hr />
			<Box marginBottom={'10px'}>
				<Label variant={'body1'}>
					{DateUtils.displayUserDate(props.checkInDate)}
					{' - '}
					{DateUtils.displayUserDate(props.checkoutDate)}
				</Label>
				<Label variant={'body1'}>{props.adults} Adults</Label>
				<Label variant={'body1'}>{props.children} Children</Label>
			</Box>

			<Accordion
				titleReact={
					<Box display={'flex'} alignItems={'center'}>
						<Label variant={'body1'}>{Object.keys(props.costPerNight).length} Nights</Label>
					</Box>
				}
			>
				{renderItemizedCostPerNight()}
				<Box display={'flex'} alignItems={'center'}>
					<Label variant={'h4'}>Total:</Label>
					<Label variant={'h4'} marginLeft={'auto'}>
						${StringUtils.formatMoney(props.accommodationTotalInCents)}
					</Label>
				</Box>
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
			<Accordion
				titleReact={
					<Label variant={'body2'} width={'170px'}>
						Taxes and Fees
					</Label>
				}
			>
				{renderTaxesAndFees()}
				<Box alignItems={'center'} display={'flex'}>
					<Label variant={'h4'}>Total</Label>
					<Label variant={'h4'} marginLeft={'auto'}>
						${StringUtils.formatMoney(props.taxAndFeeTotalInCent)}
					</Label>
				</Box>
			</Accordion>
			<Box display={'flex'} alignItems={'center'}>
				<Label variant={'h3'} width={'170px'}>
					Total:
				</Label>
				<Label variant={'h3'} marginLeft={'auto'}>
					${getCartTotal()}
				</Label>
			</Box>
			<hr />
		</Accordion>
	);
};

export default BookingCartTotalsCard;
