import * as React from 'react';
import './CheckoutFlowPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import ConfirmationImageSummary from '../../components/confirmationImageSummary/ConfirmationImageSummary';
import ThankYouCard from '../../components/thankYouCard/ThankYouCard';
import PersonalInformation from '../../components/personalInformation/PersonalInformation';
import PaymentMethod from '../../components/paymentMethod/PaymentMethod';
import Policies from '../../components/policies/Policies';
import OrderSummary from '../../components/orderSummary/OrderSummary';
import PrintableQrCode from '../../components/printableQrCode/PrintableQrCode';
import Button from '@bit/redsky.framework.rs.button';
import BookingSummaryCard from '../../components/bookingSummaryCard/BookingSummaryCard';

interface CheckoutFlowPageProps {}

const CheckoutFlowPage: React.FC<CheckoutFlowPageProps> = (props) => {
	return (
		<Page className={'rsCheckoutFlowPage'}>
			<div className={'leftColumnWrapper'}>
				<ConfirmationImageSummary
					images={[
						'../../images/featureAndBenefits/house.png',
						'../../images/featureAndBenefits/house.png',
						'../../images/featureAndBenefits/house.png'
					]}
				/>
				<ThankYouCard reservationNumber={182547194578923} />
				<PersonalInformation
					personalInfo={{
						fullName: 'Jane Banks',
						street: '17 Cherry Tree Lane',
						city: 'Kensington',
						state: 'London',
						zipcode: 'SW7 5EZ'
					}}
					billingInfo={{
						fullName: 'Michael Banks',
						street: '17 Cherry Tree Lane',
						city: 'Kensington',
						state: 'London',
						zipcode: 'SW7 5EZ'
					}}
					// onEditClickCallback={() => console.log('edit')}
				/>
				<PaymentMethod
					cardHolderName={'Jane Banks'}
					cardBrand={'Visa'}
					lastFourDigits={4111}
					// onEditClickCallback={() => console.log('edit')}
				/>
				<Policies
					checkInTime={'4:00pm'}
					checkOutTime={'10:00am'}
					bookingDescription={'ROOM 1 4 BEDROOM HOME, 4 BEDROOM HOME EASTSIDE'}
					guaranteePolicy={
						'10% of the total price is required at the time of booking to guarantee the reservation.'
					}
					cancellationPolicy={
						'Reservations for 4 to 8-Bedroom Homes must be canceled at least 15 days prior to arrival and 9 to 13 Bedroom Homes at least 31 days prior to arrival or guest will be charged for all nights of the reservation. Changes may be permitted based on availability.'
					}
				/>
				<OrderSummary
					orders={[
						{
							image: '../../images/featureAndBenefits/house.png',
							title: 'VIP Suite',
							price: 982.34,
							dateBooked: '11-20-21'
						},
						{
							image: '../../images/featureAndBenefits/house.png',
							title: 'VIP Suite',
							price: 1002.34,
							dateBooked: '11-25-21'
						}
					]}
				/>
			</div>
			<div className={'bookingSummary'}>
				{/*<PrintableQrCode qrCode={'../../images/checkoutPage/rentylResortsQR.jpg'} />*/}
				<Button className={'printConfirmButton yellow'} look={'containedPrimary'}>
					Print Confirmation
				</Button>

				<BookingSummaryCard
					bookingData={{
						accommodationId: 23645,
						accommodationName: 'VIP Suite',
						destinationName: 'disneyland',
						arrivalDate: '09-24-2021',
						departureDate: '09-30-2021',
						rateCode: 'rate code',
						adultCount: 3,
						childCount: 2,
						maxOccupantCount: 9,
						upsellPackages: [],
						prices: {
							accommodationDailyCostsInCents: {
								'2020-10-11': 100000
							},
							accommodationTotalInCents: 100000,
							feeTotalsInCents: [],
							taxTotalsInCents: [],
							taxAndFeeTotalInCents: 0,
							subtotalInCents: 100000,
							subtotalPoints: 1000,
							upsellPackageTotalInCents: 0,
							upsellPackageTotalPoints: 0,
							grandTotalCents: 100000,
							grandTotalPoints: 1000
						},
						policies: [{ type: 'CheckIn', value: 'The check in policy' }],
						checkInTime: '10:00',
						checkOutTime: '11:00'
					}}
					canHide={false}
				/>
			</div>
		</Page>
	);
};

export default CheckoutFlowPage;
