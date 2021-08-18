import React, { useEffect, useState } from 'react';
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

const BookingFlowAddPackagePage = () => {
	const packageService = serviceFactory.get<PackageService>('PackageService');
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [addedPackages, setAddedPackages] = useState<Api.UpsellPackage.Res.Available[]>([]);
	const [availablePackages, setAvailablePackages] = useState<Api.UpsellPackage.Res.Available[]>([]);

	useEffect(() => {
		async function getPackages() {
			try {
				const response = await packageService.getAvailable({
					destinationId: params.data.destinationId,
					startDate: params.data.newRoom.arrivalDate,
					endDate: params.data.newRoom.departureDate,
					pagination: { page: 1, perPage: 5 }
				});
				setAvailablePackages(response.data);
				let packages: Api.UpsellPackage.Res.Available[] = response.data;
				setAvailablePackages(packages.filter((item) => !params.data.newRoom.packages.includes(item.id)));
				setAddedPackages(packages.filter((item) => params.data.newRoom.packages.includes(item.id)));
			} catch {
				console.error('Cannot get a list of add-on packages.');
			}
		}
		getPackages().catch(console.error);
	}, []);

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
				<Box className={'addedPackages'}>
					<Label variant={'h2'}>Added Packages</Label>
					<hr />
					{renderPackages()}
				</Box>
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
			<Footer links={FooterLinkTestData} />
		</Page>
	);
};

export default BookingFlowAddPackagePage;
