import * as React from 'react';
import './ComparisonDrawer.scss';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilState } from 'recoil';
import globalState, { ComparisonCardInfo } from '../../state/globalState';
import serviceFactory from '../../services/serviceFactory';
import ComparisonService from '../../services/comparison/comparison.service';
import { ObjectUtils } from '../../utils/utils';
import { Box } from '@bit/redsky.framework.rs.996';
import LinkButton from '../../components/linkButton/LinkButton';

const ComparisonDrawer: React.FC = () => {
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const recoilComparisonState = useRecoilState<ComparisonCardInfo[]>(globalState.destinationComparison);
	const [comparisonItems, setComparisonItems] = recoilComparisonState;

	function renderComparisonCard() {
		if (!ObjectUtils.isArrayWithData(comparisonItems) || comparisonItems.length > 3) return;
		return comparisonItems.map((item, index) => {
			return (
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
	}

	return (
		<Box
			className={`rsComparisonDrawer ${comparisonItems.length !== 0 ? 'show' : ''}`}
			display={'flex'}
			alignItems={'center'}
		>
			{!!comparisonItems && <Box display={'flex'}>{renderComparisonCard()}</Box>}
			<Box marginLeft={'auto'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
				<LinkButton look={'containedPrimary'} label={'Compare Properties'} path={'/compare'} />
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
