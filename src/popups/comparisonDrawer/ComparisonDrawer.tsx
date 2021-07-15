import * as React from 'react';
import './ComparisonDrawer.scss';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import Box from '../../components/box/Box';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilState } from 'recoil';
import globalState, { ComparisonCardInfo } from '../../models/globalState';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import ComparisonService from '../../services/comparison/comparison.service';
import LabelSelect from '../../components/labelSelect/LabelSelect';
import { useEffect, useState } from 'react';
import DestinationService from '../../services/destination/destination.service';
import { ObjectUtils } from '../../utils/utils';
import AccommodationService from '../../services/accommodation/accommodation.service';
import FilterQueryValue = RedSky.FilterQueryValue;

interface Accommodation {
	id: number;
	name: string;
	shortDescription: string;
	longDescription: string;
}
const ComparisonDrawer: React.FC = () => {
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const destinationsService = serviceFactory.get<DestinationService>('DestinationService');
	const accommodationsService = serviceFactory.get<AccommodationService>('AccommodationService');
	const recoilComparisonState = useRecoilState<ComparisonCardInfo[]>(globalState.destinationComparison);
	const [comparisonItems, setComparisonItems] = recoilComparisonState;
	const [destinations, setDestinations] = useState<Api.Destination.Res.Details[]>([]);
	const [destinationId, setDestinationId] = useState<number>(0);
	const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

	useEffect(() => {
		async function getDestinations() {
			let results = await destinationsService.getDestinations();
			setDestinations(results);
		}
		if (!comparisonItems) return;
		getDestinations().catch(console.error);
	}, []);

	useEffect(() => {
		if (destinationId === 0 || !destinations) return;
		let destination = destinations.find((destination) => destination.id === destinationId);
		if (destination) setAccommodations(destination.accommodations);
		// getAccommodations(destinationId).catch(console.error);
	}, [destinationId]);

	async function getAccommodations(id: number) {
		let filterQuery: FilterQueryValue = { column: 'destinationId', value: id };
		let results = await accommodationsService.getByPage([filterQuery]);
		console.log(results);
		setAccommodations(results.data);
		// .sort(
		// 		(room1: Api.Destination.Res.Accommodation, room2: Api.Destination.Res.Accommodation) =>
		// 			room1.maxOccupantCount - room2.maxOccupantCount
		// 	)
	}

	function renderComparisonCard() {
		if (!ObjectUtils.isArrayWithData(comparisonItems) || comparisonItems.length > 3) return;
		let items = [];
		comparisonItems.forEach((item, index) => {
			if (index > 2) return;
			items.push(
				<ResortComparisonCard
					key={index}
					logo={item.logo}
					title={item.title}
					roomTypes={item.roomTypes}
					onChange={(item) => {
						let newRecoilState = comparisonService.setSelectedAccommodation(index, item, comparisonItems);
						setComparisonItems(newRecoilState);
					}}
					onClose={() => {
						let newComparisonItems = comparisonService.resortComparisonCardOnClose(item, comparisonItems);
						setComparisonItems(newComparisonItems);
					}}
				/>
			);
		});
		while (items.length < 3) {
			items.push(
				<Box key={items.length}>
					<LabelSelect
						title={'Select Destinatiion'}
						onChange={(item) => {
							setDestinationId(item);
						}}
						selectOptions={destinations?.map((destination) => {
							return {
								value: destination.id,
								text: destination.name,
								selected: destinationId === destination.id
							};
						})}
					/>
					<LabelSelect
						title={'Select Accommodation'}
						onChange={(item) => {
							console.log(item);
							comparisonService.setSelectedAccommodation(-1, item, comparisonItems);
						}}
						selectOptions={accommodations.map((item) => {
							return { value: item.id, text: item.name, selected: false };
						})}
					/>
				</Box>
			);
		}
		return items;
		// return comparisonItems.map((item, index) => {
		// 	return (
		// 		<ResortComparisonCard
		// 			key={index}
		// 			logo={item.logo}
		// 			title={item.title}
		// 			roomTypes={item.roomTypes}
		// 			onChange={(item) => {
		// 				let newRecoilState = comparisonService.setSelectedAccommodation(index, item, comparisonItems);
		// 				setComparisonItems(newRecoilState);
		// 			}}
		// 			onClose={() => {
		// 				let newComparisonItems = comparisonService.resortComparisonCardOnClose(item, comparisonItems);
		// 				setComparisonItems(newComparisonItems);
		// 			}}
		// 		/>
		// 	);
		// });
	}

	return (
		<Box
			className={`rsComparisonDrawer ${comparisonItems.length !== 0 ? 'show' : ''}`}
			display={'flex'}
			alignItems={'center'}
		>
			{!!comparisonItems && <Box display={'flex'}>{renderComparisonCard()}</Box>}
			<Box marginLeft={'auto'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
				<LabelButton
					look={'containedPrimary'}
					variant={'button'}
					label={'Compare Properties'}
					onClick={() => {
						router.navigate('/compare');
					}}
				/>
				<LabelButton
					look={'none'}
					variant={'button'}
					label={'Clear All'}
					onClick={() => setComparisonItems([])}
				/>
			</Box>
		</Box>
	);
};

export default ComparisonDrawer;
