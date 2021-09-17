import * as React from 'react';
import './ItineraryDetailsPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import HeroImage from '../../components/heroImage/HeroImage';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../../components/labelButton/LabelButton';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import { ObjectUtils, WebUtils } from '../../utils/utils';
import LoadingPage from '../loadingPage/LoadingPage';
import AccordionTitleDescription from '../../components/accordionTitleDescription/AccordionTitleDescription';
import ItineraryInfoCard from '../../components/itineraryInfoCard/ItineraryInfoCard';
import ItineraryCostSummaryCard from '../../components/itineraryCostSummaryCard/ItineraryCostSummaryCard';
import { useRecoilValue } from 'recoil';
import ReservationDetailsAccordion from '../../components/reservationDetailsAccordion/ReservationDetailsAccordion';
import SpinningLoaderPopup, { SpinningLoaderPopupProps } from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import LeaveAReviewPopup, { LeaveAReviewPopupProps } from '../../popups/leaveAReviewPopup/LeaveAReviewPopup';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import Select, { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import globalState from '../../state/globalState';

const ItineraryDetailsPage: React.FC = () => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const params = router.getPageUrlParams<{ itineraryId: string }>([
		{ key: 'ii', default: '', type: 'string', alias: 'itineraryId' }
	]);
	const [itinerary, setItinerary] = useState<Api.Reservation.Res.Itinerary.Get>();
	const [editPaymentCard, setEditPaymentCard] = useState<boolean>(false);
	const [newPaymentMethod, setNewPaymentMethod] = useState<Api.Reservation.PaymentMethod | undefined>();
	const [paymentFormGroup] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('card', 0, [new RsValidator(RsValidatorEnum.REQ, 'Card Selection Required')])
		])
	);

	useEffect(() => {
		async function getItineraryDetails() {
			if (!params.itineraryId) return;
			try {
				let res = await reservationService.getItinerary({ itineraryId: params.itineraryId });
				setItinerary(res);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get itinerary details'),
					'Itinerary unavailable!'
				);
			}
		}
		getItineraryDetails().catch(console.error);
	}, []);

	function renderReservations() {
		if (!itinerary || !ObjectUtils.isArrayWithData(itinerary.stays)) return;

		return itinerary.stays.map((item) => {
			return (
				<ReservationDetailsAccordion
					key={item.reservationId}
					reservationId={item.reservationId}
					accommodationName={item.accommodation.name}
					arrivalDate={item.arrivalDate}
					departureDate={item.departureDate}
					externalConfirmationId={item.externalConfirmationId}
					maxOccupantCount={item.accommodation.maxOccupantCount}
					maxSleeps={item.accommodation.maxSleeps}
					adultCount={item.adultCount}
					childCount={item.childCount}
					adaCompliant={item.accommodation.adaCompliant}
					extraBed={item.accommodation.extraBed}
					floorCount={item.accommodation.floorCount}
					featureIcons={item.accommodation.featureIcons}
					contactInfo={`${item.guest?.firstName} ${item.guest?.lastName}`}
					email={item.guest?.email}
					phone={item.guest?.phone}
					additionalDetails={item.additionalDetails}
					upsellPackages={item.upsellPackages}
				/>
			);
		});
	}

	function renderItineraryCostSummary() {
		if (!itinerary || !ObjectUtils.isArrayWithData(itinerary.stays) || !itinerary.destination) return;
		return (
			<ItineraryCostSummaryCard
				destinationName={itinerary.destination.name}
				address={{
					address1: itinerary.destination.address1,
					address2: itinerary.destination.address2,
					state: itinerary.destination.state,
					zip: itinerary.destination.zip,
					city: itinerary.destination.city
				}}
				reservation={itinerary.stays.map((item) => {
					return {
						name: item.accommodation.name,
						nights: Object.keys(item.priceDetail.accommodationDailyCostsInCents).length,
						subtotalCostCents: item.priceDetail.accommodationTotalInCents,
						arrivalDate: item.arrivalDate,
						departureDate: item.departureDate,
						taxesAndFees: item.priceDetail.taxAndFeeTotalInCents,
						subtotalPoints: item.priceDetail.subtotalPoints,
						packagesTotalCost: item.upsellPackages.reduce((accumulate, booked) => {
							return (
								accumulate +
								(itinerary.paymentMethod
									? booked.priceDetail.amountBeforeTax
									: booked.priceDetail.amountPoints)
							);
						}, 0)
					};
				})}
				paidWithPoints={!itinerary.paymentMethod}
			/>
		);
	}

	function renderSelectOptions(): OptionType[] {
		if (!user)
			return [
				{
					label: 'No Saved Card',
					value: 0
				}
			];

		return user.paymentMethods.map((item) => {
			return {
				label: item.cardNumber,
				value: item.id
			};
		});
	}

	//This will need to be changed to the Reservation level in the future
	//need for certification
	async function saveNewPaymentMethod() {
		if (!newPaymentMethod || !itinerary) return;
		popupController.open<SpinningLoaderPopupProps>(SpinningLoaderPopup, {});
		try {
			let response = await reservationService.updatePaymentMethod({
				itineraryId: params.itineraryId,
				paymentMethodId: newPaymentMethod.id
			});
			setItinerary(response);
			popupController.close(SpinningLoaderPopup);
			rsToastify.success('Successfully updated payment method.', 'Success!');
		} catch (e) {
			rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find reservation.'), 'Server Error');
			popupController.close(SpinningLoaderPopup);
		}
	}

	function checkIfCanLeaveReview(): boolean {
		if (!itinerary) return false;
		let canReview = false;
		itinerary.stays.forEach((item) => {
			let date = new Date(item.departureDate);
			if (date.getTime() < Date.now() && !item.externalCancellationId) {
				canReview = date.getTime() < Date.now() && !item.externalCancellationId;
			}
		});
		return canReview;
	}

	function handleSelect(value: string | number | string[] | number[]) {
		if (!user) return;
		if (typeof value === 'number') {
			return setNewPaymentMethod(user.paymentMethods.find((item) => item.id === value));
		}
		setNewPaymentMethod(undefined);
	}

	return !itinerary || !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsItineraryDetailsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					image={require('../../images/itineraryDetailsPage/heroImg.jpg')}
					height={'464px'}
					mobileHeight={'400px'}
				>
					{itinerary.destination && (
						<ItineraryInfoCard
							backButton={{
								link: '/reservations',
								label: '< Back to itineraries'
							}}
							logoImgUrl={itinerary.destination.logoUrl}
							name={itinerary.destination.name}
							description={itinerary.destination.description}
							callToActionButton={{
								link: `/destination/details?di=${itinerary.destination.id}`,
								label: 'View Destination'
							}}
							callToActionLeaveReview={() => {
								if (!itinerary) return;
								popupController.open<LeaveAReviewPopupProps>(LeaveAReviewPopup, {
									destinationLogo: itinerary.destination.logoUrl,
									destinationName: itinerary.destination.name,
									stays: itinerary.stays.map((item) => {
										return { id: item.reservationId, name: item.accommodation.name };
									})
								});
							}}
							canLeaveReview={checkIfCanLeaveReview()}
						/>
					)}
				</HeroImage>
				<div className={'contentWrapper'}>
					<div className={'reservationsWrapper'}>
						<Label variant={'h1'} mb={40}>
							Itinerary Details
						</Label>
						{renderReservations()}
					</div>
					<div>
						<Label variant={'h1'} mb={40}>
							Itinerary Cost Summary
						</Label>
						<Box position={'sticky'} top={20}>
							{renderItineraryCostSummary()}
							<Label variant={'h1'} mb={40}>
								Payment Information
							</Label>
							{!!itinerary.paymentMethod && (
								<Paper className={'paymentInfoCard'} boxShadow padding={'24px 28px'}>
									<div className={'currentCardWrapper'}>
										<AccordionTitleDescription
											title={'Name on card'}
											description={itinerary.paymentMethod.nameOnCard}
										/>
										<AccordionTitleDescription
											title={'Card Number'}
											description={itinerary.paymentMethod.cardNumber}
										/>
										<AccordionTitleDescription
											title={'Expiration Date'}
											description={`${itinerary.paymentMethod.expirationMonth}/${itinerary.paymentMethod.expirationYear}`}
										/>
										<AccordionTitleDescription
											title={'Card Type'}
											description={itinerary.paymentMethod.type}
										/>
									</div>
									{new Date(itinerary.stays[0].arrivalDate).getTime() > Date.now() && (
										<>
											<hr />
											<div
												className={
													editPaymentCard ? 'newPaymentOptions show' : 'newPaymentOptions'
												}
											>
												<div>
													<Label variant={'h4'} marginBottom={9}>
														OTHER PAYMENT OPTIONS
													</Label>
													<Select
														placeholder={'Please Select A Card'}
														control={paymentFormGroup.get('card')}
														updateControl={(value) => {
															handleSelect(value.value);
														}}
														options={renderSelectOptions()}
													/>
												</div>
												<AccordionTitleDescription
													title={'Name on card'}
													description={newPaymentMethod?.nameOnCard || ''}
												/>
												<AccordionTitleDescription
													title={'Card Number'}
													description={newPaymentMethod?.cardNumber || ''}
												/>
												<AccordionTitleDescription
													title={'Expiration Date'}
													description={
														!!newPaymentMethod
															? `${
																	newPaymentMethod.expirationMonth +
																	'/' +
																	newPaymentMethod.expirationYear
															  }`
															: ''
													}
												/>
											</div>
											<Box position={'relative'} display={'flex'} marginLeft={'auto'} width={210}>
												<LabelButton
													className={editPaymentCard ? 'showBtn' : 'hideBtn'}
													look={'containedPrimary'}
													variant={'button'}
													label={'Save'}
													onClick={() => {
														saveNewPaymentMethod();
													}}
												/>

												<LabelButton
													className={'editCancelBtn'}
													look={editPaymentCard ? 'containedSecondary' : 'containedPrimary'}
													variant={'button'}
													label={editPaymentCard ? 'Cancel' : 'Change'}
													onClick={() => {
														setEditPaymentCard(!editPaymentCard);
													}}
												/>
											</Box>
										</>
									)}
								</Paper>
							)}
						</Box>
					</div>
				</div>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default ItineraryDetailsPage;
