import * as React from 'react';
import './ReservationDetailsPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import LoadingPage from '../loadingPage/LoadingPage';
import { useRecoilState, useRecoilValue } from 'recoil';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import { StringUtils, WebUtils } from '../../utils/utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import globalState from '../../state/globalState';
import ReservationDetailsPaper from '../../components/reservationDetailsPaper/ReservationDetailsPaper';
import SubNavMenu from '../../components/subNavMenu/SubNavMenu';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import BookingSummaryCard from '../../components/bookingSummaryCard/BookingSummaryCard';
import moment from 'moment';

const ReservationDetailsPage: React.FC = () => {
	const size = useWindowResizeChange();
	const smallSize = size === 'small';
	const reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const checkoutUser = useRecoilValue<Api.User.Req.Checkout | undefined>(globalState.checkoutUser);
	const [verifiedAccommodation, setVerifiedAccommodation] = useRecoilState<
		Api.Reservation.Res.Verification | undefined
	>(globalState.verifiedAccommodation);
	const params = router.getPageUrlParams<{ reservationId: number }>([
		{ key: 'ri', default: 0, type: 'integer', alias: 'reservationId' }
	]);
	const [reservation, setReservation] = useState<Api.Reservation.Res.Get>();

	useEffect(() => {
		async function getReservationData(id: number) {
			try {
				let res = await reservationsService.get(id);
				setReservation(res);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get reservation information.'),
					'Server Error'
				);
			}
		}
		getReservationData(params.reservationId).catch(console.error);
	}, []);

	useEffect(() => {
		if (!reservation) return;
		let mockReservation: Api.Reservation.Res.Verification = {
			accommodationId: reservation.accommodation.id,
			accommodationName: reservation.accommodation.name,
			adultCount: reservation.adultCount,
			arrivalDate: moment(reservation.arrivalDate).format('MM-DD-YYYY'),
			checkInTime: StringUtils.convertTwentyFourHourTime(getPoliciesValue('CheckIn')),
			checkOutTime: StringUtils.convertTwentyFourHourTime(getPoliciesValue('CheckOut')),
			childCount: reservation.childCount,
			departureDate: moment(reservation.departureDate).format('MM-DD-YYYY'),
			destinationName: reservation.destination.name,
			maxOccupantCount: reservation.accommodation.maxOccupantCount,
			policies: reservation.destination.policies,
			prices: reservation.priceDetail,
			rateCode: reservation.rateCode,
			upsellPackages: reservation.upsellPackages
		};
		setVerifiedAccommodation(mockReservation);
	}, [reservation]);

	function getPoliciesValue(option: 'CheckIn' | 'CheckOut' | 'Cancellation') {
		if (!reservation) return '';
		let time = reservation.destination.policies.find((item) => {
			return item.type === option;
		});
		if (time !== undefined) return time.value;
		else return '';
	}

	async function updateReservation(data: Api.Reservation.Req.Update) {
		if (!reservation) return;
		try {
			popupController.open(SpinningLoaderPopup);
			let res = await reservationsService.update(data);
			setReservation(res);
			popupController.close(SpinningLoaderPopup);
			popupController.closeAll();
		} catch (e) {
			if (e.response.data.msg.ErrorCode === 'ModificationNotAllowed') {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot modify this reservation.'), 'Error!');
			} else {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Failure to update.'), 'Server Error');
				console.error(e.message, e.msg);
			}
			popupController.closeAll();
		}
	}

	return !reservation || !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsReservationDetailsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<SubNavMenu
					title={size === 'small' ? 'Your Itinerary' : `Your itinerary at ${reservation.destination.name}`}
				/>
				<div id="desktopView">
					{verifiedAccommodation && (
						<Box className={'bookingCard'}>
							<BookingSummaryCard
								bookingData={verifiedAccommodation}
								canHide={smallSize}
								usePoints={!reservation.paymentMethod}
							/>
						</Box>
					)}
					<ReservationDetailsPaper reservationData={reservation} id="reservationDetails" />
					<Box className="policyCard">
						<Label variant={smallSize ? 'reservationDetailsCustomOne' : 'reservationDetailsCustomOne'}>
							Policies
						</Label>
						<Box display={'flex'} justifyContent={smallSize ? 'space-between' : 'block'} mb={24}>
							<Box id="checkInContainer">
								<Label
									variant={smallSize ? 'reservationDetailsCustomOne' : 'reservationDetailsCustomOne'}
									mb={8}
								>
									CHECK-IN
								</Label>
								<Label
									variant={smallSize ? 'reservationDetailsCustomTwo' : 'reservationDetailsCustomTwo'}
								>
									{StringUtils.convertTwentyFourHourTime(getPoliciesValue('CheckIn'))}
								</Label>
							</Box>
							<Box id="checkOutContainer">
								<Label
									variant={smallSize ? 'reservationDetailsCustomOne' : 'reservationDetailsCustomOne'}
									mb={8}
								>
									CHECK-OUT
								</Label>
								<Label
									variant={smallSize ? 'reservationDetailsCustomTwo' : 'reservationDetailsCustomTwo'}
								>
									{StringUtils.convertTwentyFourHourTime(getPoliciesValue('CheckOut'))}
								</Label>
							</Box>
						</Box>
						<Label
							variant={smallSize ? 'reservationDetailsCustomTwo' : 'reservationDetailsCustomTwo'}
							mb={24}
						>
							{reservation.accommodation.name.toUpperCase()}
						</Label>

						<div>
							<Label
								variant={smallSize ? 'reservationDetailsCustomOne' : 'reservationDetailsCustomOne'}
								mb={8}
							>
								Cancellation Policy
							</Label>
							<Label variant={smallSize ? 'reservationDetailsCustomTwo' : 'reservationDetailsCustomTwo'}>
								{getPoliciesValue('Cancellation')}
							</Label>
						</div>
					</Box>
				</div>
			</div>
		</Page>
	);
};

export default ReservationDetailsPage;
