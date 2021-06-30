import React, { useEffect, useState } from 'react';
import './BookingFlowAddPackagePage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import router from '../../utils/router';
import DestinationPackageTile from './destinationPackageTile/DestinationPackageTile';
import Box from '../../components/box/Box';
import LabelButton from '../../components/labelButton/LabelButton';

const BookingFlowAddPackagePage = () => {
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [addedPackages, setAddedPackages] = useState<Api.Reservation.Res.BookingPackageDetails[]>([]);
	const [availablePackages, setAvailablePackages] = useState<Api.Reservation.Res.BookingPackageDetails[]>([]);

	useEffect(() => {
		//get available packages for accommodation
	}, []);

	function renderPackages() {
		return addedPackages.map((item, index) => {
			let defaultImage = item.media.find((value) => value.isPrimary);

			return (
				<DestinationPackageTile
					title={item.title}
					description={item.description}
					priceCents={item.priceCents}
					imgUrl={defaultImage?.urls.large || ''}
					onAddPackage={() => {
						let newPackages = [...addedPackages, item];
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
					title={item.title}
					description={item.description}
					priceCents={item.priceCents}
					imgUrl={defaultImage?.urls.large || ''}
					onAddPackage={() => {
						let newPackages = [...addedPackages, item];
						setAddedPackages(newPackages);
					}}
				/>
			);
		});
	}

	return (
		<Page className={'rsBookingFlowAddPackagePage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box className={'addedPackages'}>{renderPackages()}</Box>
				<Box className={'availablePackages'}> {renderAvailablePackages()}</Box>
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'Checkout'}
					onClick={() => {
						let data = params.data;
						data.newRoom.packages = addedPackages.map((p) => p.id);
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
