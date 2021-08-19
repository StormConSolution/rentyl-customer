import * as React from 'react';
import './BookingCartTotalsCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Accordion from '@bit/redsky.framework.rs.accordion';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import Icon from '@bit/redsky.framework.rs.icon';
import { convertTwentyFourHourTime, DateUtils, StringUtils } from '../../../utils/utils';
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
	packages?: Api.UpsellPackage.Res.Booked[];
	accommodationId?: number;
	remove?: (accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) => void;
	edit?: (accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) => void;
	changeRoom?: (accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) => void;
	cancellable: boolean;
	points: number;
	usePoints: boolean;
}

const BookingCartTotalsCard: React.FC<BookingCartTotalsCardProps> = (props) => {
	function renderItemizedCostPerNight() {
		let itemizedCostPerNight: React.ReactNodeArray = [];
		let difference: number = props.points - StringUtils.convertCentsToPoints(props.accommodationTotalInCents, 10);
		let offset: number = difference / DateUtils.daysBetween(props.checkInDate, props.checkoutDate);
		Object.keys(props.costPerNight).forEach((night, index) => {
			let point: number =
				index === Object.keys(props.costPerNight).length - 1 ? Math.ceil(offset) : Math.floor(offset);
			itemizedCostPerNight.push(
				<Box display={'flex'} alignItems={'center'} key={night} justifyContent={'space-between'}>
					<Label variant={'body2'} width={'170px'}>
						{DateUtils.displayUserDate(night)}
					</Label>
					<div>
						{!props.usePoints ? (
							<Label variant={'body2'} marginLeft={'auto'}>
								${StringUtils.formatMoney(props.costPerNight[night])}
							</Label>
						) : (
							<Label variant={'body2'}>
								{StringUtils.addCommasToNumber(
									StringUtils.convertCentsToPoints(props.costPerNight[night], 10) + point
								)}{' '}
								points
							</Label>
						)}
					</div>
				</Box>
			);
		});
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
						{!props.usePoints
							? '$' + StringUtils.formatMoney(item.amount)
							: StringUtils.addCommasToNumber(item.amount) + ' pts'}
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
						{!props.usePoints
							? '$' + StringUtils.formatMoney(item.amount)
							: StringUtils.addCommasToNumber(StringUtils.convertCentsToPoints(item.amount, 10)) + ' pts'}
					</Label>
				</Box>
			);
		});

		return [...taxes, ...fees];
	}

	function getPackageTotal() {
		if (!ObjectUtils.isArrayWithData(props.packages)) return `${StringUtils.formatMoney(0)}`;
		let total = props.packages?.reduce((sum, item) => {
			return sum + item.priceDetail.amountAfterTax;
		}, 0);
		total = total || 0;
		return !props.usePoints
			? `${StringUtils.formatMoney(total * 100)}`
			: StringUtils.addCommasToNumber(Math.floor(total * 10));
	}

	function getCartTotal() {
		if (props.grandTotalCents && !ObjectUtils.isArrayWithData(props.packages)) {
			return !props.usePoints ? `${StringUtils.formatMoney(props.grandTotalCents)}` : props.grandTotalCents;
		} else if (props.packages && ObjectUtils.isArrayWithData(props.packages)) {
			const packagesTotals = props.packages.reduce((total, item) => {
				return total + item.priceDetail.amountAfterTax * 100;
			}, props.grandTotalCents);
			return !props.usePoints ? `${StringUtils.formatMoney(packagesTotals)}` : packagesTotals;
		}
	}

	function renderPackages() {
		if (!props.packages || !ObjectUtils.isArrayWithData(props.packages)) return [];
		return props.packages.map((item, index) => {
			return (
				<Box key={item.id} display={'flex'} alignItems={'center'} mb={10}>
					<Label variant={'body2'} width={'170px'}>
						{item.title}
					</Label>
					<Box display={'flex'} marginLeft={'auto'}>
						{!props.usePoints ? (
							<Label variant={'body2'} display={'flex'}>
								${StringUtils.formatMoney(Math.floor(item.priceDetail.amountAfterTax * 100))}
							</Label>
						) : (
							<Label variant={'body2'}>
								{StringUtils.addCommasToNumber(Math.floor(item.priceDetail.amountAfterTax * 10))} points
							</Label>
						)}
					</Box>
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
						<Label variant={'h4'}>{Object.keys(props.costPerNight).length} Nights</Label>
					</Box>
				}
				isOpen
			>
				{renderItemizedCostPerNight()}
				<Box display={'flex'} alignItems={'center'}>
					<Label variant={'h4'}>Total:</Label>
					<Label variant={'h4'} marginLeft={'auto'}>
						{!props.usePoints
							? '$' + StringUtils.formatMoney(props.accommodationTotalInCents)
							: StringUtils.addCommasToNumber(props.points) + ' pts'}
					</Label>
				</Box>
			</Accordion>
			<Accordion
				titleReact={
					<Label variant={'h4'} width={'170px'}>
						Packages
					</Label>
				}
			>
				{renderPackages()}
				<Box display={'flex'} justifyContent={'space-between'}>
					<Label variant={'h4'}>Total: </Label>
					<Label variant={'h4'} marginLeft={'auto'}>
						{!props.usePoints ? '$' + getPackageTotal() : getPackageTotal() + ' pts'}
					</Label>
				</Box>
			</Accordion>
			{!props.usePoints && (
				<Accordion
					titleReact={
						<Label variant={'h4'} width={'170px'}>
							Taxes and Fees
						</Label>
					}
				>
					{renderTaxesAndFees()}
					<Box alignItems={'center'} display={'flex'}>
						<Label variant={'h4'}>Total</Label>
						<Label variant={'h4'} marginLeft={'auto'}>
							{!props.usePoints
								? '$' + StringUtils.formatMoney(props.taxAndFeeTotalInCent)
								: StringUtils.addCommasToNumber(props.taxAndFeeTotalInCent) + ' pts'}
						</Label>
					</Box>
				</Accordion>
			)}
			<Box display={'flex'} alignItems={'center'}>
				<Label variant={'h3'} width={'170px'}>
					Total:
				</Label>
				{!props.usePoints ? (
					<Label variant={'h3'} marginLeft={'auto'}>
						${getCartTotal()}
					</Label>
				) : (
					<Label variant={'h3'} marginLeft={'auto'}>
						{StringUtils.addCommasToNumber(props.points + parseInt(getPackageTotal())) + ' pts'}
					</Label>
				)}
			</Box>
			<hr />
		</Accordion>
	);
};

export default BookingCartTotalsCard;
