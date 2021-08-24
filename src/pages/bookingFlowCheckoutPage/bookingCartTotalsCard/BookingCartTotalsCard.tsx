import * as React from 'react';
import './BookingCartTotalsCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Accordion from '@bit/redsky.framework.rs.accordion';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import Icon from '@bit/redsky.framework.rs.icon';
import { DateUtils, NumberUtils, StringUtils } from '../../../utils/utils';
import { useEffect, useRef, useState } from 'react';
import LabelButton from '../../../components/labelButton/LabelButton';
import serviceFactory from '../../../services/serviceFactory';
import ReservationsService from '../../../services/reservations/reservations.service';
import rsToasts from '@bit/redsky.framework.toast';

interface BookingCartTotalsCardProps {
	adults: number;
	children: number;
	accommodationId: number;
	arrivalDate: string;
	departureDate: string;
	upsellPackages: number[];
	destinationId: number;
	rateCode?: string;
	addAccommodation: (accommodation: Api.Reservation.Res.Verification) => void;
	remove?: (accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) => void;
	edit?: (accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) => void;
	changeRoom?: (accommodation: number, checkInDate: string | Date, checkoutDate: string | Date) => void;
	editPackages?: () => void;
	cancellable: boolean;
	usePoints: boolean;
}

const BookingCartTotalsCard: React.FC<BookingCartTotalsCardProps> = (props) => {
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const whiteBox = useRef<HTMLElement>(null);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [verifyStatus, setVerifyStatus] = useState<'verifying' | 'available' | 'notAvailable'>('verifying');
	const [verifiedAccommodation, setVerifiedAccommodation] = useState<Api.Reservation.Res.Verification>();
	const [pointTotal, setPointTotal] = useState<number>(0);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (
				whiteBox &&
				whiteBox.current &&
				!whiteBox.current.contains(event.target) &&
				!event.target.className.includes('editButton') &&
				!event.target.parentNode.className.includes('editButton')
			) {
				setShowOptions(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		async function verifyAvailability() {
			try {
				let verifyData: Api.Reservation.Req.Verification = {
					accommodationId: props.accommodationId,
					destinationId: props.destinationId,
					adults: props.adults,
					children: props.children,
					rateCode: props.rateCode,
					arrivalDate: props.arrivalDate,
					departureDate: props.departureDate,
					numberOfAccommodations: 1,
					upsellPackages: props.upsellPackages.map((item: number) => {
						return { id: item };
					})
				};
				if (!!!verifyData.rateCode) delete verifyData.rateCode;
				if (!ObjectUtils.isArrayWithData(verifyData.upsellPackages)) delete verifyData.upsellPackages;
				let response = await reservationService.verifyAvailability(verifyData);
				setVerifiedAccommodation(response);
				setPointTotal(
					NumberUtils.roundPointsToThousand(
						NumberUtils.convertCentsToPoints(response.prices.accommodationTotalInCents, 10)
					)
				);
				props.addAccommodation(response);
				setVerifyStatus('available');
			} catch (e) {
				setVerifyStatus('notAvailable');
				rsToasts.error('This accommodation is no longer available for these dates');
			}
		}
		verifyAvailability().catch(console.error);
	}, []);

	function totalPackages(packages: Api.UpsellPackage.Res.Booked[]): number {
		return packages.reduce((total, item) => {
			return total + item.priceDetail.amountAfterTax;
		}, 0);
	}

	function pointsOrCash(): 'points' | 'cash' {
		return props.usePoints ? 'points' : 'cash';
	}

	function renderEditOptions() {
		return (
			<div ref={whiteBox} className={`whiteBox ${showOptions ? 'open' : ''}`}>
				<LabelButton
					look={'none'}
					variant={'body1'}
					label={'REMOVE'}
					onClick={(e) => {
						if (props.remove)
							props.remove(props.accommodationId || 0, props.arrivalDate, props.departureDate);
					}}
				/>
				<LabelButton
					look={'none'}
					variant={'body1'}
					label={'CHANGE ROOM'}
					onClick={(e) => {
						if (props.changeRoom)
							props.changeRoom(props.accommodationId || 0, props.arrivalDate, props.departureDate);
					}}
				/>
				<LabelButton
					look={'none'}
					variant={'body1'}
					label={'EDIT PACKAGES'}
					onClick={(e) => {
						if (props.editPackages) props.editPackages();
					}}
				/>
				<LabelButton
					look={'none'}
					variant={'body1'}
					label={'EDIT DETAILS'}
					onClick={(e) => {
						e.stopPropagation();
						if (props.edit) props.edit(props.accommodationId || 0, props.arrivalDate, props.departureDate);
					}}
				/>
			</div>
		);
	}

	function renderItemizedCostPerNight() {
		if (!verifiedAccommodation) return;
		let itemizedCostPerNight: React.ReactNodeArray = [];
		let difference: number =
			pointTotal - NumberUtils.convertCentsToPoints(verifiedAccommodation.prices.accommodationTotalInCents, 10);
		let offset: number =
			(difference /
				DateUtils.daysBetween(verifiedAccommodation.checkInDate, verifiedAccommodation.checkoutDate)) *
			10;
		Object.keys(verifiedAccommodation.prices.accommodationDailyCostsInCents).forEach((night, index) => {
			const costPerNight = verifiedAccommodation.prices.accommodationDailyCostsInCents;
			let point: number = index === Object.keys(costPerNight).length - 1 ? Math.ceil(offset) : Math.floor(offset);
			itemizedCostPerNight.push(
				<Box display={'flex'} alignItems={'center'} key={night} justifyContent={'space-between'}>
					<Label variant={'body2'} width={'170px'}>
						{DateUtils.displayUserDate(night)}
					</Label>
					<div>
						<Label variant={'body2'} marginLeft={'auto'}>
							{NumberUtils.displayPointsOrCash(
								props.usePoints ? costPerNight[night] + point : costPerNight[night],
								props.usePoints ? 'points' : 'cash'
							)}
						</Label>
					</div>
				</Box>
			);
		});
		return itemizedCostPerNight;
	}

	function renderTaxesAndFees() {
		if (!verifiedAccommodation) return;
		let index = 0;
		let taxes = verifiedAccommodation.prices.taxTotalsInCents.map((item) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={++index}>
					<Label variant={'body2'} width={'170px'}>
						{item.name}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						{NumberUtils.displayPointsOrCash(item.amount, pointsOrCash())}
					</Label>
				</Box>
			);
		});
		let fees = verifiedAccommodation.prices.feeTotalsInCents.map((item) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={++index}>
					<Label variant={'body2'} width={'170px'}>
						{item.name}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						{NumberUtils.displayPointsOrCash(item.amount, pointsOrCash())}
					</Label>
				</Box>
			);
		});

		return [...taxes, ...fees];
	}

	function renderPackages() {
		if (
			!verifiedAccommodation?.upsellPackages ||
			!ObjectUtils.isArrayWithData(verifiedAccommodation.upsellPackages)
		)
			return [];
		return verifiedAccommodation.upsellPackages.map((item, index) => {
			return (
				<Box key={item.id} display={'flex'} alignItems={'center'} mb={10}>
					<Label variant={'body2'} width={'170px'}>
						{item.title}
					</Label>
					<Box display={'flex'} marginLeft={'auto'}>
						{NumberUtils.displayPointsOrCash(Math.floor(item.priceDetail.amountAfterTax), pointsOrCash())}
					</Box>
				</Box>
			);
		});
	}

	return !verifiedAccommodation ? (
		<div className={'rsBookingCartTotalsCard'}>
			<Label variant={'h1'}>Verifying Availability...</Label>{' '}
		</div>
	) : (
		<Accordion
			isOpen
			className={`rsBookingCartTotalsCard ${verifyStatus}`}
			hideHoverEffect
			titleReact={
				<Box display={'flex'} alignItems={'center'}>
					<Label variant={'h4'} width={'170px'}>
						{verifiedAccommodation.accommodationName}
					</Label>
					<div style={{ position: 'relative' }}>
						{props.edit && (
							<Icon
								className={'editButton'}
								iconImg={'icon-edit'}
								cursorPointer
								onClick={(event) => {
									event.stopPropagation();
									setShowOptions(!showOptions);
								}}
							/>
						)}
						{renderEditOptions()}
					</div>
				</Box>
			}
		>
			<Box display={'flex'}>
				<Box marginRight={'50px'}>
					<Label variant={'h4'}>Check-in</Label>
					<Label variant={'body1'}>
						After {StringUtils.convertTwentyFourHourTime(verifiedAccommodation.checkInTime)}
					</Label>
				</Box>
				<Box>
					<Label variant={'h4'}>Check-out</Label>
					<Label variant={'body1'}>
						Before {StringUtils.convertTwentyFourHourTime(verifiedAccommodation.checkoutTime)}
					</Label>
				</Box>
			</Box>
			<hr />
			<Box marginBottom={'10px'}>
				<Label variant={'body1'}>
					{DateUtils.displayUserDate(verifiedAccommodation.checkInDate)}
					{' - '}
					{DateUtils.displayUserDate(verifiedAccommodation.checkoutDate)}
				</Label>
				<Label variant={'body1'}>{verifiedAccommodation.adults} Adults</Label>
				<Label variant={'body1'}>{verifiedAccommodation.children} Children</Label>
			</Box>

			<Accordion
				titleReact={
					<Box display={'flex'} alignItems={'center'}>
						<Label variant={'h4'}>
							{Object.keys(verifiedAccommodation.prices.accommodationDailyCostsInCents).length} Nights
						</Label>
					</Box>
				}
				isOpen
			>
				{renderItemizedCostPerNight()}
				<Box display={'flex'} alignItems={'center'}>
					<Label variant={'h4'}>Total:</Label>
					<Label variant={'h4'} marginLeft={'auto'}>
						{NumberUtils.displayPointsOrCash(
							props.usePoints
								? NumberUtils.roundPointsToThousand(
										NumberUtils.convertCentsToPoints(
											verifiedAccommodation.prices.accommodationTotalInCents,
											10
										)
								  ) * 10
								: verifiedAccommodation.prices.accommodationTotalInCents,
							pointsOrCash()
						)}
					</Label>
				</Box>
			</Accordion>
			<Accordion
				isOpen
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
						{NumberUtils.displayPointsOrCash(
							totalPackages(verifiedAccommodation.upsellPackages || []),
							pointsOrCash()
						)}
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
							{NumberUtils.displayPointsOrCash(
								verifiedAccommodation.prices.taxAndFeeTotalInCents,
								pointsOrCash()
							)}
						</Label>
					</Box>
				</Accordion>
			)}
			<Box display={'flex'} alignItems={'center'}>
				<Label variant={'h3'} width={'170px'}>
					Total:
				</Label>
				<Label variant={'h3'} marginLeft={'auto'}>
					{NumberUtils.displayPointsOrCash(
						props.usePoints
							? NumberUtils.roundPointsToThousand(
									NumberUtils.convertCentsToPoints(
										verifiedAccommodation.prices.accommodationTotalInCents,
										10
									)
							  ) *
									10 +
									totalPackages(verifiedAccommodation.upsellPackages)
							: verifiedAccommodation.prices.grandTotalCents,
						pointsOrCash()
					)}
				</Label>
			</Box>
			<hr />
		</Accordion>
	);
};

export default BookingCartTotalsCard;
