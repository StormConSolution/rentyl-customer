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

interface BookingFlowPageProps {}

const BookingFlowPage: React.FC<BookingFlowPageProps> = (props) => {
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [accommodation, setAccommodation] = useState<Api.Accommodation.Res.Details>();
	const [fakeData, setFakeData] = useState(FakeBookingData);
	const [addedPackages, setAddedPackages] = useState<Booking.BookingPackageDetails[]>([]);

	useEffect(() => {
		if (!params) return;
		async function getAccommodationDetails() {
			try {
				let response = await accommodationService.getAccommodationDetails(params.data.accommodationId);
				if (response.data.data) {
					console.log(response.data.data);
					setAccommodation(response.data.data);
				}
			} catch (e) {
				rsToasts.error(e.message);
			}
		}
		getAccommodationDetails().catch(console.error);
	}, []);

	function renderDestinationPackages() {
		return fakeData.destinationPackages.map((item, index) => {
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

	return (
		<Page className={'rsBookingFlowPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Label marginTop={80} variant={'h1'}>
					Booking
				</Label>
				<hr />
				<Box
					padding={'0 25px'}
					boxSizing={'border-box'}
					display={'flex'}
					width={'100%'}
					justifyContent={'space-evenly'}
					alignItems={'flex-start'}
					position={'relative'}
					height={'fit-content'}
				>
					<Box width={'50%'} className={'colOne'}>
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
						/>
						<Paper className={'policiesSection'} boxShadow borderRadius={'4px'} padding={'16px'}>
							<Label variant={'h2'} mb={10}>
								Policies:
							</Label>
							<Box display={'flex'} mb={10}>
								<Box marginRight={'50px'}>
									<Label variant={'h4'}>Check-in</Label>
									<Label variant={'body1'}>After {fakeData.checkInTime}</Label>
								</Box>
								<Box>
									<Label variant={'h4'}>Check-out</Label>
									<Label variant={'body1'}>Before {fakeData.checkoutTime}</Label>
								</Box>
							</Box>
							<Label variant={'body1'} mb={10}>
								{fakeData.accommodationName}
							</Label>
							<Label variant={'h4'}>Guarantee Policy</Label>
							<Label variant={'body1'} mb={10}>
								{fakeData.policies.guaranteePolicy}
							</Label>
							<Label variant={'h4'}>Cancel Policy</Label>
							<Label variant={'body1'} mb={10}>
								{fakeData.policies.cancelPolicy}
							</Label>
						</Paper>
						<Paper className={'acknowledgementSection'} boxShadow borderRadius={'4px'} padding={'16px'}>
							<Label variant={'h2'}>Acknowledgement</Label>
							<LabelCheckbox
								value={1}
								text={'* I agree with the Privacy Terms.'}
								isChecked={false}
								onSelect={() => {
									console.log('I agree');
								}}
								onDeselect={() => {
									console.log('I disagree');
								}}
							/>
							<Label variant={'h4'}>
								By completing this booking, I agree with the booking conditions
							</Label>
						</Paper>
						<LabelButton
							className={'completeBookingBtn'}
							look={'containedPrimary'}
							variant={'button'}
							label={'complete booking'}
							onClick={() => {
								console.log('Do stuff to complete booking');
							}}
						/>
					</Box>
					<BookingCartTotalsCard
						checkInTime={fakeData.checkInTime}
						checkoutTime={fakeData.checkoutTime}
						checkInDate={fakeData.checkInDate}
						checkoutDate={fakeData.checkoutDate}
						accommodationName={fakeData.accommodationName}
						taxAndFees={fakeData.taxAndFees}
						costPerNight={fakeData.costPerNight}
						adults={fakeData.adults}
						children={fakeData.children}
						costTotalCents={fakeData.costTotalCents}
						packages={addedPackages}
						onDeletePackage={(packageId) => {
							let newPackages = [...addedPackages];
							newPackages = newPackages.filter((item) => item.id !== packageId);
							setAddedPackages(newPackages);
						}}
					/>
				</Box>
			</div>
		</Page>
	);
};

export default BookingFlowPage;
