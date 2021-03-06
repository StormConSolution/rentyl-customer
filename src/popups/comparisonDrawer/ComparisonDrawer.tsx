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

const ComparisonDrawer: React.FC = () => {
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const recoilComparisonState = useRecoilState<ComparisonCardInfo[]>(globalState.destinationComparison);
	const [comparisonItems, setComparisonItems] = recoilComparisonState;

	function renderComparisonCard() {
		if (!comparisonItems || comparisonItems.length > 3) return;
		return comparisonItems.map((item, index) => {
			return (
				<ResortComparisonCard
					key={index}
					logo={item.logo}
					title={item.title}
					roomTypes={item.roomTypes}
					onChange={(item) => {
						let newRecoilState = comparisonService.resortComparisonCardOnChange(
							index,
							item,
							comparisonItems
						);
						setComparisonItems(newRecoilState);
					}}
					onClose={() => {
						let newComparisonItems = comparisonService.resortComparisonCardOnClose(item, comparisonItems);
						setComparisonItems(newComparisonItems);
					}}
				/>
			);
		});
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
