import * as React from 'react';
import './CheckoutFlowPage.scss';
import { useRef } from 'react';
import { Page } from '@bit/redsky.framework.rs.996';
import ConfirmationImageSummary from '../../components/confirmationImageSummary/ConfirmationImageSummary';
import ThankYouCard from '../../components/thankYouCard/ThankYouCard';
import PersonalInformation from '../../components/personalInformation/PersonalInformation';
import PaymentMethod from '../../components/paymentMethod/PaymentMethod';
import Policies from '../../components/policies/Policies';
import CheckoutReservationSummary from '../../components/checkoutReservationSummary/CheckoutReservationSummary';
import CheckoutBreadcrumbs from '../../components/checkoutBreadcrumbs/CheckoutBreadcrumbs';
import PrintableQrCode from '../../components/printableQrCode/PrintableQrCode';
import BookingSummaryCard from '../../components/bookingSummaryCard/BookingSummaryCard';
import Button from '@bit/redsky.framework.rs.button';
import { useReactToPrint } from 'react-to-print';
import router from '../../utils/router';

interface CheckoutFlowPageProps {}

const CheckoutFlowPage: React.FC<CheckoutFlowPageProps> = (props) => {
	const params = router.getPageUrlParams<{ stage: number }>([
		{ key: 's', default: 0, type: 'integer', alias: 'stage' }
	]);

	const printRef = useRef(null);

	const handlePrint = useReactToPrint({
		content: () => printRef.current,
		pageStyle: 'body {zoom: 50%} @page {margin: 0}'
	});

	async function handleBackButtonClick() {
		if (params.stage === 0) {
			await router.navigate('/');
			return;
		}
		await router.navigate(`/booking/checkout?s=${params.stage - 1}`);
	}

	async function handleForwardButtonClick() {
		await router.navigate(`/booking/checkout?s=${params.stage + 1}`);
	}

	function renderMissingView(name: string) {
		return <div className={'missingView'}>"{name}" view is missing.</div>;
	}

	function renderViewsByStage() {
		const views = [renderMissingView('Info'), renderMissingView('Payment'), renderRemainingViews()];
		if (params.stage > 1) {
			return views[2];
		}

		return views[params.stage];
	}

	function handleButtonText() {
		const buttons = ['Sign in for a faster checkout', 'Review & book', 'Book now', 'Print confirmation'];
		if (params.stage > 2) {
			return buttons[3];
		}

		return buttons[params.stage];
	}

	function renderRemainingViews() {
		return (
			<>
				{params.stage > 2 && (
					<>
						<ConfirmationImageSummary
							images={[
								'../../images/featureAndBenefits/house.png',
								'../../images/landingPage/travel2x.png',
								'../../images/rewardItemPage/house2x.jpg'
							]}
						/>
						<ThankYouCard reservationNumber={182547194578923} />
					</>
				)}
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
					onEditClickCallback={params.stage === 2 ? () => console.log('edit clicked') : undefined}
				/>
				<PaymentMethod
					cardHolderName={'Jane Banks'}
					cardBrand={'Visa'}
					lastFourDigits={4111}
					onEditClickCallback={params.stage === 2 ? () => console.log('edit clicked') : undefined}
				/>
				<Policies
					checkInTime={'4:00pm'}
					checkOutTime={'10:00am'}
					bookingDescription={'ROOM 1 4 BEDROOM HOME, 4 BEDROOM HOME EASTSIDE'}
					guaranteePolicy={
						'10% of the total price is required at the time of booking to guarantee the reservation.'
					}
					cancellationPolicy={
						'Reservations for 4 to 8-Bedroom Homes must be canceled at least 15 days prior to arrival ' +
						'and 9 to 13 Bedroom Homes at least 31 days prior to arrival or guest will be charged for ' +
						'all nights of the reservation. Changes may be permitted based on availability.'
					}
				/>
				{params.stage > 2 && (
					<CheckoutReservationSummary
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
				)}
			</>
		);
	}

	return (
		<Page className={'rsCheckoutFlowPage'}>
			{params.stage < 4 && (
				<CheckoutBreadcrumbs activeStage={params.stage} onBackButtonClick={handleBackButtonClick} />
			)}
			<div className={'printableContentWrapper'} ref={printRef}>
				<div className={'leftColumn'}>{renderViewsByStage()}</div>
				<div className={'bookingSummaryColumn'}>
					{params.stage > 3 ? (
						<PrintableQrCode qrCode={'../../images/checkoutPage/rentylResortsQR.jpg'} />
					) : (
						<Button
							className={`printConfirmButton yellow${params.stage < 1 ? ' blue' : ''}`}
							look={'containedPrimary'}
							onClick={handleForwardButtonClick}
						>
							{handleButtonText()}
						</Button>
					)}
					<BookingSummaryCard
						bookingData={{
							accommodationId: 23645,
							accommodationName: 'VIP Suite',
							destinationName: 'Disney World',
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
			</div>
		</Page>
	);
};

export default CheckoutFlowPage;
