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

const ComparisonDrawer: React.FC = () => {
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const destinationsService = serviceFactory.get<DestinationService>('DestinationService');
	const recoilComparisonState = useRecoilState<ComparisonCardInfo[]>(globalState.destinationComparison);
	const [comparisonItems, setComparisonItems] = recoilComparisonState;
	const [destinations, setDestinations] = useState<Api.Destination.Res.Details[]>([]);
	const [destinationId, setDestinationId] = useState<number>(0);
	const [accommodations, setAccommodations] = useState<any>([]);

	useEffect(() => {
		async function getDestinations() {
			setDestinations(await destinationsService.getDestinations());
		}
		getDestinations().catch(console.error);
	}, []);

	useEffect(() => {
		getAccommodations().catch(console.error);
	}, [destinationId]);

	async function getAccommodations() {
		setAccommodations(await destinationsService.getDestinationAccommodations(destinationId));
	}

	function renderComparisonCard() {
		if (!comparisonItems || comparisonItems.length > 3) return;
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
				<Box>
					<LabelSelect
						title={'Select Destinatiion'}
						onChange={(item) => {
							setDestinationId(item);
						}}
						selectOptions={destinations.map((destination) => {
							return {
								value: destination.id,
								text: destination.name,
								selected: destinationId === destination.id
							};
						})}
					/>
					<LabelSelect title={'Select Accommodation'} onChange={(item) => {}} selectOptions={[]} />
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
