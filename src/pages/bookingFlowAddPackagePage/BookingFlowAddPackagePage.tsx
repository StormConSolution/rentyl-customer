import React, { useEffect, useRef, useState } from 'react';
import './BookingFlowAddPackagePage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import router from '../../utils/router';
import DestinationPackageTile from '../../components/destinationPackageTile/DestinationPackageTile';
import LabelButton from '../../components/labelButton/LabelButton';
import serviceFactory from '../../services/serviceFactory';
import { ObjectUtils } from '../../utils/utils';
import LoadingPage from '../loadingPage/LoadingPage';
import { FooterLinks } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import PackageService from '../../services/package/package.service';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

const BookingFlowAddPackagePage = () => {
	const filterRef = useRef<HTMLElement>(null);
	const packageService = serviceFactory.get<PackageService>('PackageService');
	const params = router.getPageUrlParams<{ data: Misc.BookingParams }>([
		{ key: 'data', default: 0, type: 'string', alias: 'data' }
	]);
	params.data = ObjectUtils.smartParse((params.data as unknown) as string);
	const [page, setPage] = useState<number>(1);
	const perPage = 5;
	const [total, setTotal] = useState<number>(0);
	const [addedPackages, setAddedPackages] = useState<Api.UpsellPackage.Res.Available[]>([]);
	const [availablePackages, setAvailablePackages] = useState<Api.UpsellPackage.Res.Available[]>([]);

	useEffect(() => {
		if (!params.data.newRoom) {
			rsToastify.error('Invalid URL given, returning to home', 'Invalid URL');
			router.navigate('/reservation/availability').catch(console.error);
			return;
		}

		if (!ObjectUtils.isArrayWithData(params.data?.newRoom?.packages)) {
			setAddedPackages([]);
			return;
		}
		async function getAddedPackages() {
			if (!params.data.newRoom) return;
			const addedPackages = await packageService.getPackagesByIds({
				destinationId: params.data.destinationId,
				packageIds: params.data.newRoom.packages,
				startDate: params.data.newRoom.arrivalDate,
				endDate: params.data.newRoom.departureDate
			});
			setAddedPackages(addedPackages);
		}
		getAddedPackages().catch(console.error);
	}, []);

	useEffect(() => {
		async function getPackages() {
			try {
				if (!params.data.newRoom) return;
				const response = await packageService.getAvailable({
					destinationId: params.data.destinationId,
					startDate: params.data.newRoom.arrivalDate,
					endDate: params.data.newRoom.departureDate,
					pagination: { page, perPage }
				});
				setAvailablePackages(response.data);
				setTotal(response.total || 0);
			} catch {
				rsToasts.error('No packages available, redirecting', 'No Packages');
				if (!params.data.newRoom) return;
				let stays: Misc.StayParams[] = params.data.stays || [];
				stays.push(params.data.newRoom);
				router
					.navigate(
						`/booking/checkout?data=${JSON.stringify({
							destinationId: params.data.destinationId,
							stays
						})}`
					)
					.catch(console.error);
				console.error('Cannot get a list of add-on packages.');
			}
		}
		getPackages().catch(console.error);
	}, [page, perPage]);

	function renderPackages() {
		return addedPackages.map((item) => {
			return (
				<DestinationPackageTile
					key={item.id}
					title={item.title}
					description={item.description}
					priceCents={item.priceCents}
					imgPaths={item.media.map((item) => {
						return item.urls.large;
					})}
					onAddPackage={() => {
						setAvailablePackages([...availablePackages, item]);
						let newPackages = addedPackages.filter((addedPackage) => addedPackage.id !== item.id);
						setAddedPackages(newPackages);
					}}
					text={'Remove Package'}
				/>
			);
		});
	}

	function renderAvailablePackages() {
		return availablePackages.map((item) => {
			let isAdded = addedPackages.find((value) => value.id === item.id);
			if (isAdded) return false;
			return (
				<DestinationPackageTile
					key={item.id}
					title={item.title}
					description={item.description}
					priceCents={item.priceCents}
					imgPaths={item.media.map((item, index) => {
						return item.urls.large;
					})}
					onAddPackage={() => {
						let newPackages = [...addedPackages, item];
						setAddedPackages(newPackages);
						let available = availablePackages.filter((availablePackage) => availablePackage.id !== item.id);
						setAvailablePackages(available);
					}}
					text={'Add Package'}
				/>
			);
		});
	}

	return !ObjectUtils.isArrayWithData(availablePackages) && !ObjectUtils.isArrayWithData(addedPackages) ? (
		<LoadingPage />
	) : (
		<Page className={'rsBookingFlowAddPackagePage'}>
			<div className={'rs-page-content-wrapper'}>
				{addedPackages.length > 0 && (
					<Box className={'addedPackages'}>
						<Label variant={'h2'}>Added Packages</Label>
						<hr />
						{renderPackages()}
					</Box>
				)}
				<div ref={filterRef} />
				<Box className={'availablePackages'}>
					<Label variant={'h2'}>Available Packages</Label>
					<hr />
					{renderAvailablePackages()}
				</Box>
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'Continue To Checkout'}
					onClick={() => {
						if (!params.data.newRoom) return;
						let newStay: Misc.StayParams = params.data.newRoom;
						newStay.packages = addedPackages.map((item) => item.id);
						let stays: Misc.StayParams[] = params.data.stays || [];
						stays.push(newStay);

						let bookingParams: Misc.BookingParams = {
							destinationId: params.data.destinationId,
							stays
						};
						router.navigate(`/booking/checkout?data=${JSON.stringify(bookingParams)}`).catch(console.error);
					}}
				/>
			</div>
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
		</Page>
	);
};

export default BookingFlowAddPackagePage;
