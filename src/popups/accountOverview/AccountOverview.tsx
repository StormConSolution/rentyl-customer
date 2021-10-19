import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './AccountOverview.scss';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import LabelLink from '../../components/labelLink/LabelLink';
import Icon from '@bit/redsky.framework.rs.icon';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import { Box } from '@bit/redsky.framework.rs.996';
import { DateUtils, StringUtils } from '../../utils/utils';

interface AccountOverviewProps {
	isOpen: boolean;
	onToggle: () => void;
	onClose: () => void;
}

const AccountOverview: React.FC<AccountOverviewProps> = (props) => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const popupRef = useRef<HTMLElement>(null);
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [upComingReservation, setUpComingReservation] = useState<Api.Reservation.Res.Upcoming>();

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (popupRef && popupRef.current && !popupRef.current.contains(event.target)) {
				document.getElementsByTagName('body')[0].style.overflow = '';
				props.onClose();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		async function getUpcomingReservationForUser() {
			try {
				let res = await reservationService.upcoming(1);
				setUpComingReservation(res[0]);
			} catch (e) {
				console.error(e);
			}
		}
		getUpcomingReservationForUser().catch(console.error);
	}, []);

	/*
		This Component needs to have an end point written to get back the correct data. As of right now we are blocked.
		We need to hook this up to use the user id, once logged in, to go and fetch their upcoming reservation. There is
		a lot of backend info that is still needing to be figured out.
	*/

	return (
		<div ref={popupRef} className={`rsAccountOverview ${props.isOpen ? 'opened' : ''}`}>
			<Paper height={'fit-content'} backgroundColor={'#FCFBF8'} padding={'20px 18px 17px'}>
				<Label variant={'h4'}>Account Overview</Label>
				<Box display={'flex'} marginBottom={'10px'}>
					<Label variant={'h2'}>{StringUtils.addCommasToNumber(user?.availablePoints)}</Label>
					<Label variant={'caption'}>
						CURRENT
						<br /> POINTS
					</Label>
				</Box>
				<LabelLink
					path={`/account/personal-info`}
					externalLink={false}
					label={'My Account'}
					variant={'button'}
					onClick={() => {
						router.navigate('/account/personal-info').catch(console.error);
						props.onClose();
					}}
					iconRight={'icon-chevron-right'}
					iconSize={7}
				/>
				<hr />
				<Label variant={'h4'}>Upcoming Stay</Label>
				{!!upComingReservation ? (
					<>
						<Box display={'flex'}>
							<img src={upComingReservation.destination.logoUrl} alt={''} />
							<Label
								className={'yellow'}
								variant={'h4'}
								textOverflow={'ellipsis'}
								whiteSpace={'non-wrap'}
								overflow={'hidden'}
							>
								{upComingReservation.accommodation.name}
							</Label>
						</Box>
						<Box marginBottom={15}>
							<Label variant={'caption'}>Dates</Label>
							<Label variant={'body1'}>
								{DateUtils.displayUserDate(upComingReservation.arrivalDate, 'MM/DD/YYYY')} -{' '}
								{DateUtils.displayUserDate(upComingReservation.departureDate, 'MM/DD/YYYY')}
							</Label>
						</Box>
						<Box marginBottom={15}>
							<Label variant={'caption'}>Confirmation Code</Label>
							<Label variant={'body1'}>{upComingReservation.externalConfirmationId}</Label>
						</Box>
						<LabelLink
							path={`/reservations/itinerary/reservation/details?ri=${upComingReservation.id}`}
							externalLink={false}
							label={'View Booking Details'}
							variant={'button'}
							iconRight={'icon-chevron-right'}
							iconSize={7}
							onClick={() => {
								router
									.navigate(
										`/reservations/itinerary/reservation/details?ri=${upComingReservation.id}`
									)
									.catch(console.error);
								props.onClose();
							}}
						/>
					</>
				) : (
					<Label variant={'h4'}>You have no upcoming stays</Label>
				)}
			</Paper>
			<Box className={'tab'} onClick={props.onToggle}>
				<Icon
					iconImg={'icon-chevron-left'}
					className={props.isOpen ? 'iconSpinDown' : 'iconSpinUp'}
					color={'#ffffff'}
				/>
			</Box>
		</div>
	);
};

export default AccountOverview;
