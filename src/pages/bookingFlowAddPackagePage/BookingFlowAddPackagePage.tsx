import React, { useEffect, useState } from 'react';
import './BookingFlowAddPackagePage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import router from '../../utils/router';
import DestinationPackageTile from './destinationPackageTile/DestinationPackageTile';
import Box from '../../components/box/Box';
import LabelButton from '../../components/labelButton/LabelButton';
import serviceFactory from '../../services/serviceFactory';
import ReservationsService from '../../services/reservations/reservations.service';
import { ObjectUtils } from '../../utils/utils';
import LoadingPage from '../loadingPage/LoadingPage';
import { RsResponseData } from '@bit/redsky.framework.rs.http';

const BookingFlowAddPackagePage = () => {
	const reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [addedPackages, setAddedPackages] = useState<Api.Package.Details[]>([]);
	const [availablePackages, setAvailablePackages] = useState<Api.Package.Details[]>([]);
	const [totalPackages, setTotalPackages] = useState<number>(0);

	useEffect(() => {
		async function getPackages() {
			try {
				let data: Api.Package.Req.GetByPage = { filter: '', pagination: '', sort: 'ASC' };
				const response = await reservationsService.getPackages(data);
				setAvailablePackages(response.data.data);
				setTotalPackages(response.data.total);
			} catch {
				console.error('An unexpected error happened on the server.');
			}
		}
		getPackages().catch(console.error);
	}, []);

	function renderPackages() {
		return addedPackages.map((item, index) => {
			let defaultImage = item.media.find((value) => value.isPrimary);
			if (defaultImage === undefined && item.media.length > 0) {
				defaultImage = item.media[0];
			}
			return (
				<DestinationPackageTile
					key={item.id}
					title={item.title}
					description={item.description}
					priceCents={0}
					imgUrl={defaultImage?.urls.large || ''}
					onAddPackage={() => {
						setAvailablePackages([...availablePackages, item]);
						let newPackages = addedPackages.filter((addedPackage) => addedPackage.id !== item.id);
						setAddedPackages(newPackages);
					}}
				/>
			);
		});
	}

	function renderAvailablePackages() {
		return availablePackages.map((item, index) => {
			let defaultImage = item.media.find((value) => value.isPrimary);
			let isAdded = addedPackages.find((value) => value.id === item.id);
			if (isAdded) return false;
			return (
				<DestinationPackageTile
					key={item.id}
					title={item.title}
					description={item.description}
					priceCents={0}
					imgUrl={defaultImage?.urls.large || ''}
					onAddPackage={() => {
						let newPackages = [...addedPackages, item];
						setAddedPackages(newPackages);
						let available = availablePackages.filter((availablePackage) => availablePackage.id !== item.id);
						setAvailablePackages(available);
					}}
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
					{renderPackages()}
					<hr />
				</Box>
				<Box className={'availablePackages'}>
					<Label variant={'h2'}>Available Packages</Label>
					{renderAvailablePackages()}
				</Box>
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'Checkout'}
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
		</Page>
	);
};

export default BookingFlowAddPackagePage;
