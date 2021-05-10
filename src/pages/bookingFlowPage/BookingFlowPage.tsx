import * as React from 'react';
import './BookingFlowPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import rsToasts from '@bit/redsky.framework.toast';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Paper from '../../components/paper/Paper';
import { Booking, FakeBookingData } from './fakeBookingData';
import BookingCartTotalsCard from './bookingCartTotalsCard/BookingCartTotalsCard';
import ContactInfoAndPaymentCard from './contactInfoAndPaymentCard/ContactInfoAndPaymentCard';
import DestinationPackageTile from './destinationPackageTile/DestinationPackageTile';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import LabelButton from '../../components/labelButton/LabelButton';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ReservationsService from '../../services/reservations/reservations.service';
import LoadingPage from '../loadingPage/LoadingPage';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import { convertTwentyFourHourTime } from '../../utils/utils';

interface BookingFlowPageProps {}

const BookingFlowPage: React.FC<BookingFlowPageProps> = (props) => {
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [reservationData, setReservationData] = useState<Api.Reservation.Res.Verification>();
	const [addedPackages, setAddedPackages] = useState<Booking.BookingPackageDetails[]>([]);

	useEffect(() => {
		if (!params) return;
		async function getAccommodationDetails() {
			params.data.numberOfAccommodations = 1;
			try {
				console.log(params.data);
				let response = await reservationService.verifyAvailability(params.data);
				if (response.data.data) {
					console.log(response.data.data);
					setReservationData(response.data.data);
					// setAccommodation(response.data.data);
				}
			} catch (e) {
				rsToasts.error(e.message);
			}
		}
		getAccommodationDetails().catch(console.error);
	}, []);

	useEffect(() => {
		setIsDisabled(!hasAgreedToTerms || !isFormValid);
	}, [hasAgreedToTerms, isFormValid]);

	function renderDestinationPackages() {
		if (!reservationData) return;
		return reservationData.destinationPackages.map((item, index) => {
			let defaultImage = item.media.find((value) => value.isPrimary);
			let isAdded = addedPackages.find((value) => value.id === item.id);
			if (isAdded) return false;

			return (
				<DestinationPackageTile
					title={item.title}
					description={item.description}
					priceCents={item.priceCents}
					imgUrl={defaultImage ? defaultImage.urls.large : ''}
					onAddPackage={() => {
						let newPackages = [...addedPackages, item];
						setAddedPackages(newPackages);
					}}
				/>
			);
		});
	}

	function renderPolicies() {
		if (!reservationData) return '';
		let policies: React.ReactNodeArray = [];
		for (let i in reservationData.policies) {
			if (i === 'CheckIn' || i === 'CheckOut') continue;
			policies.push(
				<>
					<Label variant={'h4'}>{i}</Label>
					<Label variant={'body1'} mb={10}>
						{reservationData.policies[i]}
					</Label>
				</>
			);
		}
		return policies;
	}

	async function completeBooking() {
		if (!reservationData) return;
		setIsDisabled(true);
		let data = {
			accommodationId: params.data.accommodationId,
			adults: reservationData.adults,
			children: reservationData.children,
			arrivalDate: reservationData.checkInDate,
			departureDate: reservationData.checkoutDate,
			rateCode: reservationData.rateCode,
			numberOfAccommodations: 1
		};
		try {
			let res = await reservationService.create(data);
			console.log(res.data.data);
			if (res.data.data) rsToasts.success('The accommodation has been booked!');
			setIsDisabled(false);
		} catch (e) {
			console.error(e.message);
			setIsDisabled(false);
		}
	}

	return !reservationData ? (
		<LoadingPage />
	) : (
		<Page className={'rsBookingFlowPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Label marginTop={80} marginLeft={size === 'small' ? '15px' : ''} variant={'h1'}>
					Booking
				</Label>
				<hr />
				<Box
					padding={size === 'small' ? '0 15px' : '0 25px'}
					boxSizing={'border-box'}
					display={'flex'}
					width={'100%'}
					justifyContent={'space-evenly'}
					alignItems={'flex-start'}
					position={'relative'}
					height={'fit-content'}
				>
					<Box width={size === 'small' ? '100%' : '50%'} className={'colOne'}>
						<Paper
							className={'packagesAccordion'}
							backgroundColor={'#f0f0f0'}
							boxShadow
							borderRadius={'4px'}
							padding={'16px'}
						>
							<Label variant={'h2'}>Packages</Label>
							{renderDestinationPackages()}
						</Paper>
						<ContactInfoAndPaymentCard
							onContactChange={(value) => {
								console.log('Contact Form: ', value);
							}}
							onCreditCardChange={(value) => {
								console.log('Credit Card Form: ', value);
							}}
							isValidForm={(isValid) => {
								setIsFormValid(isValid);
							}}
						/>
						<Paper className={'policiesSection'} boxShadow borderRadius={'4px'} padding={'16px'}>
							<Label variant={'h2'} mb={10}>
								Policies:
							</Label>
							<Box display={'flex'} mb={10}>
								<Box marginRight={'50px'}>
									<Label variant={'h4'}>Check-in</Label>
									<Label variant={'body1'}>
										After {convertTwentyFourHourTime(reservationData.checkInTime)}
									</Label>
								</Box>
								<Box>
									<Label variant={'h4'}>Check-out</Label>
									<Label variant={'body1'}>
										Before {convertTwentyFourHourTime(reservationData.checkoutTime)}
									</Label>
								</Box>
							</Box>
							<Label variant={'body1'} mb={10}>
								{reservationData.accommodationName}
							</Label>
							{renderPolicies()}
						</Paper>
						{size === 'small' && (
							<BookingCartTotalsCard
								checkInTime={'4:00 pm'}
								checkoutTime={'11:00 am'}
								checkInDate={reservationData.checkInDate}
								checkoutDate={reservationData.checkoutDate}
								accommodationName={reservationData.accommodationName}
								accommodationTotalInCents={reservationData.prices.accommodationTotalInCents}
								taxAndFeeTotalInCent={reservationData.prices.taxAndFeeTotalInCents}
								feeTotalsInCents={reservationData.prices.feeTotalsInCents}
								taxTotalsInCents={reservationData.prices.taxTotalsInCents}
								costPerNight={reservationData.prices.accommodationDailyCostsInCents}
								adults={reservationData.adults}
								children={reservationData.children}
								grandTotalCents={reservationData.prices.accommodationTotalInCents}
								packages={addedPackages}
								onDeletePackage={(packageId) => {
									let newPackages = [...addedPackages];
									newPackages = newPackages.filter((item) => item.id !== packageId);
									setAddedPackages(newPackages);
								}}
							/>
						)}

						<Paper className={'acknowledgementSection'} boxShadow borderRadius={'4px'} padding={'16px'}>
							<Label variant={'h2'}>Acknowledgement</Label>
							<LabelCheckbox
								value={1}
								text={'* I agree with the Privacy Terms.'}
								isChecked={false}
								onSelect={() => {
									setHasAgreedToTerms(true);
								}}
								onDeselect={() => {
									setHasAgreedToTerms(false);
								}}
							/>
							<Label variant={'h4'}>
								By completing this booking, I agree with the booking conditions
							</Label>
						</Paper>
						<LabelButton
							className={'completeBookingBtn'}
							look={isDisabled ? 'containedSecondary' : 'containedPrimary'}
							variant={'button'}
							label={'complete booking'}
							onClick={() => {
								completeBooking().catch(console.error);
							}}
							disabled={isDisabled}
						/>
					</Box>
					{size !== 'small' && (
						<BookingCartTotalsCard
							checkInTime={reservationData.checkInTime}
							checkoutTime={reservationData.checkoutTime}
							checkInDate={reservationData.checkInDate}
							checkoutDate={reservationData.checkoutDate}
							accommodationName={reservationData.accommodationName}
							accommodationTotalInCents={reservationData.prices.accommodationTotalInCents}
							taxAndFeeTotalInCent={reservationData.prices.taxAndFeeTotalInCents}
							feeTotalsInCents={reservationData.prices.feeTotalsInCents}
							taxTotalsInCents={reservationData.prices.taxTotalsInCents}
							costPerNight={reservationData.prices.accommodationDailyCostsInCents}
							adults={reservationData.adults}
							children={reservationData.children}
							grandTotalCents={reservationData.prices.grandTotalCents}
							packages={addedPackages}
							onDeletePackage={(packageId) => {
								let newPackages = [...addedPackages];
								newPackages = newPackages.filter((item) => item.id !== packageId);
								setAddedPackages(newPackages);
							}}
						/>
					)}
				</Box>
			</div>
		</Page>
	);
};

export default BookingFlowPage;
