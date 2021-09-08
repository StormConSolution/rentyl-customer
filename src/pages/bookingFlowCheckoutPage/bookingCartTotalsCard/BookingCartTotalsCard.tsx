import * as React from 'react';
import './BookingCartTotalsCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Accordion from '@bit/redsky.framework.rs.accordion';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import Icon from '@bit/redsky.framework.rs.icon';
import { DateUtils, NumberUtils, StringUtils, WebUtils } from '../../../utils/utils';
import { useEffect, useRef, useState } from 'react';
import LabelButton from '../../../components/labelButton/LabelButton';
import serviceFactory from '../../../services/serviceFactory';
import ReservationsService from '../../../services/reservations/reservations.service';
import { useRecoilState } from 'recoil';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import globalState from '../../../state/globalState';

interface BookingCartTotalsCardProps {
	uuid: number;
	adults: number;
	children: number;
	accommodationId: number;
	arrivalDate: string;
	departureDate: string;
	upsellPackages: number[];
	destinationId: number;
	rateCode?: string;
	removeAccommodation: (needsConfirmation: boolean) => void;
	editAccommodation: () => void;
	changeRoom: () => void;
	editPackages?: () => void;
	cancellable: boolean;
	usePoints: boolean;
}

const BookingCartTotalsCard: React.FC<BookingCartTotalsCardProps> = (props) => {
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const whiteBox = useRef<HTMLElement>(null);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [verifyStatus, setVerifyStatus] = useState<'verifying' | 'available' | 'notAvailable'>('verifying');
	const [verifiedAccommodation, setVerifiedAccommodation] = useRecoilState<{
		[uuid: number]: Api.Reservation.Res.Verification;
	}>(globalState.verifiedAccommodations);
	const [pointTotal, setPointTotal] = useState<number>(0);
	const localAccommodation = verifiedAccommodation[props.uuid];

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
				setVerifyStatus('verifying');
				let verifyData: Api.Reservation.Req.Verification = {
					accommodationId: props.accommodationId,
					destinationId: props.destinationId,
					adultCount: props.adults,
					childCount: props.children,
					arrivalDate: props.arrivalDate,
					departureDate: props.departureDate,
					numberOfAccommodations: 1
				};
				if (props.rateCode) verifyData.rateCode = props.rateCode;
				if (ObjectUtils.isArrayWithData(props.upsellPackages)) {
					verifyData.upsellPackages = props.upsellPackages.map((item: number) => {
						return { id: item };
					});
				}

				let response = await reservationService.verifyAvailability(verifyData);
				setVerifiedAccommodation((prev) => {
					return { ...prev, [props.uuid]: response };
				});
				setPointTotal(
					//TODO: set points to correct value once endpoint finished

					// response.points.accommodationTotalInPoints
					1000
				);
				setVerifyStatus('available');
			} catch (e) {
				setVerifyStatus('notAvailable');
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'This accommodation is no longer available for these dates'),
					'No Longer Available'
				);
				let updatedVerifiedAccommodation = { ...verifiedAccommodation };
				delete updatedVerifiedAccommodation[props.uuid];
				setVerifiedAccommodation(updatedVerifiedAccommodation);
				props.removeAccommodation(false);
			}
		}
		verifyAvailability().catch(console.error);
		console.log(localAccommodation);
	}, [props.adults, props.children, props.arrivalDate, props.departureDate]);

	function totalPackages(packages: Api.UpsellPackage.Res.Booked[]): number {
		return packages.reduce((total, item) => {
			if (props.usePoints) return total + item.priceDetail.amountAfterTax;
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
						e.stopPropagation();
						props.removeAccommodation(true);
					}}
				/>
				<LabelButton
					look={'none'}
					variant={'body1'}
					label={'CHANGE ROOM'}
					onClick={() => {
						props.changeRoom();
					}}
				/>
				<LabelButton
					look={'none'}
					variant={'body1'}
					label={'EDIT PACKAGES'}
					onClick={() => {
						if (props.editPackages) props.editPackages();
					}}
				/>
				<LabelButton
					look={'none'}
					variant={'body1'}
					label={'EDIT DETAILS'}
					onClick={(e) => {
						e.stopPropagation();
						props.editAccommodation();
					}}
				/>
			</div>
		);
	}

	function renderItemizedCostPerNight() {
		if (!localAccommodation) return;
		let itemizedCostPerNight: React.ReactNodeArray = [];
		Object.keys(localAccommodation.prices.accommodationDailyCostsInCents).forEach((night, index) => {
			const costPerNight = localAccommodation.prices.accommodationDailyCostsInCents;
			itemizedCostPerNight.push(
				<Box display={'flex'} alignItems={'center'} key={night} justifyContent={'space-between'}>
					<Label variant={'body2'} width={'170px'}>
						{props.usePoints ? null : DateUtils.displayUserDate(night)}
					</Label>
					<div>
						<Label variant={'body2'} marginLeft={'auto'}>
							{props.usePoints ? null : '$' + StringUtils.formatMoney(costPerNight[night])}
						</Label>
					</div>
				</Box>
			);
		});
		return itemizedCostPerNight;
	}

	function renderTaxesAndFees() {
		if (!localAccommodation) return;
		let index = 0;
		let taxes = localAccommodation.prices.taxTotalsInCents.map((item) => {
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
		let fees = localAccommodation.prices.feeTotalsInCents.map((item) => {
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
		if (!localAccommodation?.upsellPackages || !ObjectUtils.isArrayWithData(localAccommodation.upsellPackages))
			return [];
		return localAccommodation.upsellPackages.map((item) => {
			//TODO: add points per package
			return (
				<Box key={item.id} display={'flex'} alignItems={'center'} mb={10}>
					<Label variant={'body2'} width={'170px'}>
						{item.title}
					</Label>
					<Box display={'flex'} marginLeft={'auto'}>
						{props.usePoints ? pointTotal : item.priceDetail.amountAfterTax}
					</Box>
				</Box>
			);
		});
	}

	function renderCardHolder() {
		return (
			<div className={'rsBookingCartTotalsCard unavailable'}>
				<Box marginBottom={'10px'}>
					<Label variant={'body1'}>
						{DateUtils.displayUserDate(props.arrivalDate)}
						{' - '}
						{DateUtils.displayUserDate(props.departureDate)}
					</Label>
					<Label variant={'body1'}>{props.adults} Adults</Label>
					<Label variant={'body1'}>{props.children} Children</Label>
				</Box>
				<Label variant={'h4'}>
					{DateUtils.daysBetweenStartAndEndDates(new Date(props.arrivalDate), new Date(props.departureDate))}{' '}
					Nights
				</Label>
				<Box display={'flex'} alignItems={'center'} mb={20}>
					<Label variant={'h3'} width={'170px'}>
						Total:
					</Label>
					<Label variant={'h3'} marginLeft={'auto'}>
						Unknown
					</Label>
				</Box>
			</div>
		);
	}

	function renderCard() {
		if (!localAccommodation) return null;
		return (
			<Accordion
				isOpen
				className={`rsBookingCartTotalsCard`}
				hideHoverEffect
				titleReact={
					<Box display={'flex'} alignItems={'center'}>
						<Label variant={'h4'} width={'170px'}>
							{localAccommodation.accommodationName}
						</Label>
						<div style={{ position: 'relative' }}>
							<Icon
								className={'editButton'}
								iconImg={'icon-edit'}
								cursorPointer
								onClick={(event) => {
									event.stopPropagation();
									setShowOptions(!showOptions);
								}}
							/>
							{renderEditOptions()}
						</div>
					</Box>
				}
			>
				<Box display={'flex'}>
					<Box marginRight={'50px'}>
						<Label variant={'h4'}>Check-in</Label>
						<Label variant={'body1'}>
							After {StringUtils.convertTwentyFourHourTime(localAccommodation.checkInTime)}
						</Label>
					</Box>
					<Box>
						<Label variant={'h4'}>Check-out</Label>
						<Label variant={'body1'}>
							Before {StringUtils.convertTwentyFourHourTime(localAccommodation.checkOutTime)}
						</Label>
					</Box>
				</Box>
				<hr />
				<Box marginBottom={'10px'}>
					<Label variant={'body1'}>
						{DateUtils.displayUserDate(localAccommodation.arrivalDate)}
						{' - '}
						{DateUtils.displayUserDate(localAccommodation.departureDate)}
					</Label>
					<Label variant={'body1'}>{localAccommodation.adultCount} Adults</Label>
					<Label variant={'body1'}>{localAccommodation.childCount} Children</Label>
				</Box>

				<Accordion
					titleReact={
						<Box display={'flex'} alignItems={'center'}>
							<Label variant={'h4'}>
								{Object.keys(localAccommodation.prices.accommodationDailyCostsInCents).length} Nights
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
									? pointTotal //TODO: add localAccommodation.points.accommodationTotalPoints
									: localAccommodation.prices.accommodationTotalInCents,
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
								totalPackages(localAccommodation.upsellPackages || []),
								pointsOrCash()
							)}
						</Label>
					</Box>
				</Accordion>
				{!props.usePoints && (
					<Accordion
						isOpen
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
									? NumberUtils.displayPointsOrCash(
											localAccommodation.prices.taxAndFeeTotalInCents,
											'cash'
									  )
									: null}
							</Label>
						</Box>
					</Accordion>
				)}
				<Box display={'flex'} alignItems={'center'} mb={20}>
					<Label variant={'h3'} width={'170px'}>
						Total:
					</Label>
					<Label variant={'h3'} marginLeft={'auto'}>
						{NumberUtils.displayPointsOrCash(
							props.usePoints
								? localAccommodation.prices.grandTotalPoints
								: localAccommodation.prices.grandTotalCents,
							pointsOrCash()
						)}
					</Label>
				</Box>
			</Accordion>
		);
	}

	return verifyStatus === 'verifying' ? (
		<div className={'rsBookingCartTotalsCard'}>
			<div className={'loader'} />
		</div>
	) : verifyStatus === 'available' ? (
		renderCard()
	) : (
		renderCardHolder()
	);
};

export default BookingCartTotalsCard;
