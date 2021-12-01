import React, { useEffect, useRef, useState } from 'react';
import './BookingFlowAddPackagePage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import DestinationPackageTile from '../../components/destinationPackageTile/DestinationPackageTile';
import LabelButton from '../../components/labelButton/LabelButton';
import serviceFactory from '../../services/serviceFactory';
import { ObjectUtils } from '../../utils/utils';
import LoadingPage from '../loadingPage/LoadingPage';
import PackageService from '../../services/package/package.service';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import PaginationViewMore from '../../components/paginationViewMore/PaginationViewMore';

const BookingFlowAddPackagePage = () => {
	const filterRef = useRef<HTMLElement>(null);
	const size = useWindowResizeChange();
	const smallSize = size === 'small';
	const packageService = serviceFactory.get<PackageService>('PackageService');
	const params = router.getPageUrlParams<{ data: Misc.BookingParams }>([
		{ key: 'data', default: 0, type: 'string', alias: 'data' }
	]);
	params.data = ObjectUtils.smartParse((params.data as unknown) as string);
	const [page, setPage] = useState<number>(1);
	const perPage = 5;
	const [total, setTotal] = useState<number>(0);
	const [addedPackages, setAddedPackages] = useState<Api.UpsellPackage.Res.Complete[]>([]);
	const [availablePackages, setAvailablePackages] = useState<Api.UpsellPackage.Res.Complete[]>([]);

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
			setAddedPackages(addedPackages.data);
		}
		getAddedPackages().catch(console.error);
	}, []);

	useEffect(() => {
		async function getPackages() {
			try {
				if (!params.data.newRoom) return;
				const request: Api.UpsellPackage.Req.Availability = {
					destinationId: params.data.destinationId,
					excludePackageIds: addedPackages.map((item) => item.id),
					startDate: params.data.newRoom.arrivalDate,
					endDate: params.data.newRoom.departureDate,
					pagination: { page, perPage }
				};
				if (addedPackages) {
					request.excludePackageIds = addedPackages.map((item) => item.id);
				}
				if (request.excludePackageIds && request.excludePackageIds.length < 1) delete request.excludePackageIds;
				const response = await packageService.getAvailable(request);
				if (response.data.length < 1 && addedPackages.length < 1) {
					throw new Error('No Packages to edit');
				}
				setAvailablePackages((prevState) => {
					return [...prevState, ...response.data];
				});
				setTotal(response.total || 0);
			} catch (e) {
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
	}, [page]);

	function renderAvailablePackages() {
		const packageIds = addedPackages.map((item) => item.id);
		return availablePackages.map((item) => {
			let isAdded = addedPackages.find((value) => value.id === item.id);
			if (isAdded) return false;
			return (
				<DestinationPackageTile
					key={item.id}
					title={item.title || item.externalTitle}
					description={item.description}
					prices={item.priceDetail}
					imgPaths={item.media.map((item, index) => {
						return item.urls.imageKit;
					})}
					onAddPackage={() => {
						let newPackages = [...addedPackages, item];
						setAddedPackages(newPackages);
						let available = availablePackages.filter((availablePackage) => availablePackage.id !== item.id);
						setAvailablePackages(available);
					}}
					text={packageIds.includes(item.id) ? 'added to my stay' : 'Add to my stay'}
					isAdded={packageIds.includes(item.id)}
				/>
			);
		});
	}

	function renderContinueBtn() {
		return (
			<LabelButton
				className="continueButton"
				look={'none'}
				variant={'customTwelve'}
				label={'Continue To book'}
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
		);
	}

	return !ObjectUtils.isArrayWithData(availablePackages) && !ObjectUtils.isArrayWithData(addedPackages) ? (
		<LoadingPage />
	) : (
		<Page className={'rsBookingFlowAddPackagePage'}>
			<Box className="packageSection">
				{smallSize ? renderContinueBtn() : null}
				<div ref={filterRef} />
				<Box className={'availablePackages'}>{renderAvailablePackages()}</Box>
				{renderContinueBtn()}
			</Box>
			<PaginationViewMore
				selectedRowsPerPage={perPage}
				total={total}
				currentPageNumber={page}
				viewMore={(num) => {
					setPage(num);
				}}
			/>
		</Page>
	);
};

export default BookingFlowAddPackagePage;
