import * as React from 'react';
import './ComparisonDrawer.scss';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import Box from '../../components/box/Box';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilState } from 'recoil';
import globalState, { ComparisonCardInfo } from '../../models/globalState';

interface ComparisonDrawerProps {}

const ComparisonDrawer: React.FC<ComparisonDrawerProps> = (props) => {
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
						console.log('Changed: ', item);
					}}
					onClose={() => {
						let newRecoilState = [...comparisonItems];
						setComparisonItems(() => {
							return newRecoilState.filter((remove) => remove.destinationId !== item.destinationId);
						});
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
						console.log('Navigating to Compare all page...');
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
