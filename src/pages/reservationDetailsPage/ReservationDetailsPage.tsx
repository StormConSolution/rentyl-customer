import * as React from 'react';
import './ReservationDetailsPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import LoadingPage from '../loadingPage/LoadingPage';
import { useRecoilValue } from 'recoil';
import Paper from '../../components/paper/Paper';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import { StringUtils, WebUtils } from '../../utils/utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import globalState from '../../state/globalState';
import ReservationDetailsPaper from '../../components/reservationDetailsPaper/ReservationDetailsPaper';
import SubNavMenu from '../../components/subNavMenu/SubNavMenu';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

const ReservationDetailsPage: React.FC = () => {
	const size = useWindowResizeChange();
	const reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
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
				<ReservationDetailsPaper reservationData={reservation} />
				<Paper boxShadow padding={'24px 28px'}>
					<Box display={'flex'} mb={24}>
						<Box marginRight={56}>
							<Label variant={'h3'} mb={8}>
								CHECK-IN
							</Label>
							<Label variant={'body1'}>
								{StringUtils.convertTwentyFourHourTime(getPoliciesValue('CheckIn'))}
							</Label>
						</Box>
						<div>
							<Label variant={'h3'} mb={8}>
								CHECK-OUT
							</Label>
							<Label variant={'body1'}>
								{StringUtils.convertTwentyFourHourTime(getPoliciesValue('CheckOut'))}
							</Label>
						</div>
					</Box>
					<Label variant={'h3'} mb={24}>
						{reservation.destination.name}
					</Label>
					<div>
						<Label variant={'h3'} mb={8}>
							Cancellation
						</Label>
						<Label variant={'body1'}>{getPoliciesValue('Cancellation')}</Label>
					</div>
				</Paper>
			</div>
		</Page>
	);
};

export default ReservationDetailsPage;
