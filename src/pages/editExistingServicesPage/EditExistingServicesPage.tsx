import * as React from 'react';
import './EditExistingServicesPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import { useEffect, useState } from 'react';
import PackageService from '../../services/package/package.service';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import LoadingPage from '../loadingPage/LoadingPage';
import Label from '@bit/redsky.framework.rs.label';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import DestinationPackageTile from '../../components/destinationPackageTile/DestinationPackageTile';
import rsToasts from '@bit/redsky.framework.toast';
import { WebUtils } from '../../utils/utils';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import LabelButton from '../../components/labelButton/LabelButton';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';

const EditExistingServicesPage: React.FC = () => {
	const reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const packageService = serviceFactory.get<PackageService>('PackageService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [reservation, setReservation] = useState<Api.Reservation.Res.Get>();
	const [defaultReservationUpsellPackages, setDefaultReservationUpsellPackages] = useState<number[]>([]);
	const [currentReservationPackages, setCurrentReservationPackages] = useState<
		Api.UpsellPackage.Res.ForDestination[]
	>([]);
	const [destinationPackages, setDestinationPackages] = useState<Api.UpsellPackage.Res.ForDestination[]>([]);
	const params = router.getPageUrlParams<{ reservationId: number }>([
		{ key: 'ri', default: 0, type: 'integer', alias: 'reservationId' }
	]);

	const isModified = checkForModified();

	function checkForModified() {
		let newCurrentReservationPackages = [...currentReservationPackages];
		let currentReservationPackagesIds = newCurrentReservationPackages
			.map((item) => {
				return item.id;
			})
			.sort((a, b) => a - b);
		return currentReservationPackagesIds.toString() !== defaultReservationUpsellPackages.toString();
	}

	useEffect(() => {
		async function getServices() {
			try {
				let reservation = await reservationsService.get(params.reservationId);
				if (reservation) {
					setReservation(reservation);
					setCurrentReservationPackages(reservation.upsellPackages);
					setDefaultReservationUpsellPackages(
						reservation.upsellPackages
							.map((item) => {
								return item.id;
							})
							.sort((a, b) => a - b)
					);
					let otherDestinationServices = await packageService.forDestination(reservation.destination.id);
					setDestinationPackages(otherDestinationServices);
				}
			} catch (e) {
				rsToasts.error(WebUtils.getAxiosErrorMessage(e), 'Server Error', 8000);
			}
		}

		getServices().catch(console.error);
	}, []);

	function renderCurrentReservationPackages() {
		if (!ObjectUtils.isArrayWithData(currentReservationPackages)) return;
		return currentReservationPackages.map((item, index) => {
			return (
				<DestinationPackageTile
					key={index}
					text={'Remove'}
					title={item.title}
					description={item.description}
					priceCents={item.priceCents}
					imgPaths={item.media.map((item) => {
						return item.urls.large;
					})}
					onAddPackage={() => {
						setCurrentReservationPackages((prevState) => {
							return prevState.filter((service) => service.id !== item.id);
						});
					}}
				/>
			);
		});
	}

	function renderDestinationPackages() {
		if (!ObjectUtils.isArrayWithData(destinationPackages)) return;
		let newCurrentReservationPackages = [...currentReservationPackages];
		let newDestinationPackages = [...destinationPackages];
		let currentReservationPackageIds = newCurrentReservationPackages.map((item) => item.id);
		return newDestinationPackages.map((item, index) => {
			if (currentReservationPackageIds.includes(item.id)) return false;
			else
				return (
					<DestinationPackageTile
						key={index}
						title={item.title}
						description={item.description}
						priceCents={item.priceCents}
						imgPaths={item.media.map((item) => {
							return item.urls.large;
						})}
						onAddPackage={() => {
							setCurrentReservationPackages((prevState) => {
								return [...prevState, item];
							});
						}}
					/>
				);
		});
	}

	async function updateReservationServices() {
		if (!reservation) return;
		popupController.open(SpinningLoaderPopup);
		let newCurrentReservationPackages = [...currentReservationPackages];
		let data: Api.Reservation.Req.Update = {
			id: reservation.id,
			rateCode: reservation.rateCode,
			paymentMethodId: reservation.paymentMethod?.id,
			guest: reservation.guest,
			accommodationId: reservation.accommodation.id,
			numberOfAccommodations: 1,
			upsellPackages: newCurrentReservationPackages
		};
		try {
			let res = await reservationsService.update(data);
			popupController.close(SpinningLoaderPopup);
			router
				.navigate(`/reservations/itinerary/reservation/details?ri=${params.reservationId}`)
				.catch(console.error);
		} catch (e) {
			rsToasts.error(WebUtils.getAxiosErrorMessage(e), 'Server Error', 8000);
			popupController.close(SpinningLoaderPopup);
		}
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsEditExistingServicesPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box display={'flex'}>
					<Label className={'filterLabel'} variant={'h1'}>
						Your Current Services
					</Label>
					<Box className={'cancelSaveButtons'}>
						<LabelButton
							className={'cancelButton'}
							look={!isModified ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Cancel'}
							onClick={() => {
								router
									.navigate(`/reservations/itinerary/reservation/details?ri=${params.reservationId}`)
									.catch(console.error);
							}}
						/>
						<LabelButton
							className={isModified ? 'showBtn' : 'hideBtn'}
							look={'containedPrimary'}
							variant={'button'}
							label={'Save'}
							onClick={() => {
								updateReservationServices();
							}}
						/>
					</Box>
				</Box>
				<hr />
				{renderCurrentReservationPackages()}
				<Label className={'filterLabel'} variant={'h1'}>
					Other Services
				</Label>
				<hr />
				{renderDestinationPackages()}
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default EditExistingServicesPage;
