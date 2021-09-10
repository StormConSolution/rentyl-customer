import * as React from 'react';
import './EditExistingPackagesPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import { useEffect, useRef, useState } from 'react';
import PackageService from '../../services/package/package.service';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import LoadingPage from '../loadingPage/LoadingPage';
import Label from '@bit/redsky.framework.rs.label';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import DestinationPackageTile from '../../components/destinationPackageTile/DestinationPackageTile';
import { WebUtils } from '../../utils/utils';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import LabelButton from '../../components/labelButton/LabelButton';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

const EditExistingPackagesPage: React.FC = () => {
	const filterRef = useRef<HTMLElement>(null);
	const reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const packageService = serviceFactory.get<PackageService>('PackageService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [reservation, setReservation] = useState<Api.Reservation.Res.Get>();
	const [page, setPage] = useState<number>(1);
	const perPage = 5;
	const [total, setTotal] = useState<number>(0);
	const [defaultReservationUpsellPackages, setDefaultReservationUpsellPackages] = useState<number[]>([]);
	const [currentReservationPackages, setCurrentReservationPackages] = useState<Api.UpsellPackage.Res.Booked[]>([]);
	const [destinationPackages, setDestinationPackages] = useState<Api.UpsellPackage.Res.Booked[]>([]);
	const params = router.getPageUrlParams<{ reservationId: number }>([
		{ key: 'ri', default: 0, type: 'integer', alias: 'reservationId' }
	]);

	const isModified = checkForModified();

	useEffect(() => {
		async function getServices() {
			try {
				let reservation = await reservationsService.get(params.reservationId);
				if (reservation) {
					console.log('hit', reservation.upsellPackages);
					setReservation(reservation);
					setCurrentReservationPackages(reservation.upsellPackages);
					setDefaultReservationUpsellPackages(
						reservation.upsellPackages
							.map((item) => {
								return item.id;
							})
							.sort((a, b) => a - b)
					);
					await getPackages();
				}
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Cannot get details for this destination.'),
					'Server Error'
				);
			}
		}
		getServices().catch(console.error);
	}, []);

	useEffect(() => {
		getPackages().catch(console.error);
	}, [page, perPage, reservation, currentReservationPackages]);

	function checkForModified() {
		let newCurrentReservationPackages = [...currentReservationPackages];
		let currentReservationPackagesIds = newCurrentReservationPackages
			.map((item) => {
				return item.id;
			})
			.sort((a, b) => a - b);
		return currentReservationPackagesIds.toString() !== defaultReservationUpsellPackages.toString();
	}

	async function getPackages() {
		if (!reservation) return;
		const request: Api.UpsellPackage.Req.Availability = {
			destinationId: reservation.destination.id,
			excludePackageIds: currentReservationPackages.map((item) => item.id),
			startDate: reservation.arrivalDate,
			endDate: reservation.departureDate,
			pagination: { page, perPage }
		};
		if (request.excludePackageIds && request.excludePackageIds.length < 1) delete request.excludePackageIds;
		let otherDestinationPackages = await packageService.getAvailable(request);
		setDestinationPackages(otherDestinationPackages.data);
		setTotal(otherDestinationPackages.total || 0);
	}

	function renderCurrentReservationPackages() {
		if (!ObjectUtils.isArrayWithData(currentReservationPackages)) return;
		return currentReservationPackages.map((item, index) => {
			return (
				<DestinationPackageTile
					key={index}
					text={'Remove'}
					title={item.title}
					description={item.description}
					priceCents={item.priceDetail.amountAfterTax}
					imgPaths={item.media.map((item) => {
						return item.urls.imageKit;
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
						priceCents={item.priceDetail.amountAfterTax}
						imgPaths={item.media.map((item) => {
							return item.urls.imageKit;
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

	async function updateReservationPackages() {
		if (!reservation) return;
		popupController.open(SpinningLoaderPopup);
		let data: Api.Reservation.Req.Update = {
			id: reservation.id,
			rateCode: reservation.rateCode,
			paymentMethodId: reservation.paymentMethod?.id,
			guest: reservation.guest,
			accommodationId: reservation.accommodation.id,
			numberOfAccommodations: 1,
			upsellPackages: currentReservationPackages.map((booked) => {
				return { id: booked.id };
			})
		};
		try {
			await reservationsService.update(data);
			popupController.close(SpinningLoaderPopup);
			router
				.navigate(`/reservations/itinerary/reservation/details?ri=${params.reservationId}`)
				.catch(console.error);
		} catch (e) {
			rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot get details for this destination.'), 'Server Error');
			popupController.close(SpinningLoaderPopup);
		}
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsEditExistingPackagesPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box display={'flex'}>
					<Label className={'filterLabel'} variant={'h1'}>
						Your Current Packages
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
								updateReservationPackages();
							}}
						/>
					</Box>
				</Box>
				<div ref={filterRef} />
				<hr />
				{renderCurrentReservationPackages()}
				<Label className={'filterLabel'} variant={'h1'}>
					Other Services
				</Label>
				<hr />
				{renderDestinationPackages()}
				<PaginationButtons
					selectedRowsPerPage={perPage}
					currentPageNumber={page}
					setSelectedPage={(newPage) => {
						setPage(newPage);
						let filterSection = filterRef.current!.offsetTop;
						window.scrollTo({ top: filterSection, behavior: 'smooth' });
					}}
					total={total}
				/>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default EditExistingPackagesPage;
