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
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import PackageService from '../../services/package/package.service';
import PaginationButtons from '../../components/paginationButtons/PaginationButtons';

const BookingFlowAddPackagePage = () => {
	const filterRef = useRef<HTMLElement>(null);
	const packageService = serviceFactory.get<PackageService>('PackageService');
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [page, setPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(5);
	const [total, setTotal] = useState<number>(0);
	const [addedPackages, setAddedPackages] = useState<Api.UpsellPackage.Res.Available[]>([]);
	const [availablePackages, setAvailablePackages] = useState<Api.UpsellPackage.Res.Available[]>([]);

	useEffect(() => {
		async function getAddedPackages() {
			const addedPackages = await packageService.getPackagesByIds(params.data.newRoom.packages);
			let convertedPackages: Api.UpsellPackage.Res.Available[] = addedPackages.map((item) => {
				return {
					priceCents: 0,
					media: item.media,
					id: item.id,
					companyId: item.companyId,
					destinationId: item.destinationId,
					title: item.title,
					description: item.description,
					code: item.code,
					isActive: item.isActive,
					startDate: item.startDate,
					endDate: item.endDate
				};
			});
			setAddedPackages(convertedPackages);
		}
		getAddedPackages().catch(console.error);
	}, []);

	useEffect(() => {
		async function getPackages() {
			try {
				const response = await packageService.getAvailable({
					destinationId: params.data.destinationId,
					startDate: params.data.newRoom.arrivalDate,
					endDate: params.data.newRoom.departureDate,
					pagination: { page, perPage }
				});
				setAvailablePackages(response.data);
				setTotal(response.total || 0);
			} catch {
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
						let data = params.data;
						data.newRoom.packages = addedPackages.map((item) => item.id);
						if (data.stays) data.stays = [...data.stays, data.newRoom];
						else data.stays = [data.newRoom];
						delete data.newRoom;
						router.navigate(`/booking/checkout?data=${JSON.stringify(data)}`).catch(console.error);
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
			<Footer links={FooterLinkTestData} />
		</Page>
	);
};

export default BookingFlowAddPackagePage;
