import * as React from 'react';
import './ComparisonDrawer.scss';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import serviceFactory from '../../services/serviceFactory';
import ComparisonService from '../../services/comparison/comparison.service';
import { ObjectUtils } from '../../utils/utils';
import { Box } from '@bit/redsky.framework.rs.996';
import LinkButton from '../../components/linkButton/LinkButton';

const ComparisonDrawer: React.FC = () => {
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const [recoilComparisonState, setRecoilComparisonState] = useRecoilState<Misc.ComparisonCardInfo[]>(
		globalState.destinationComparison
	);

	function renderComparisonCard() {
		if (!ObjectUtils.isArrayWithData(recoilComparisonState) || recoilComparisonState.length > 3) return;
		return recoilComparisonState.map((item, index) => {
			return (
				<ResortComparisonCard
					key={index}
					logo={item.logo}
					title={item.title}
					selectedRoom={item.selectedRoom || 0}
					roomTypes={item.roomTypes}
					onChange={(item) => {
						let newRecoilState = comparisonService.setSelectedAccommodation(
							index,
							item.value,
							recoilComparisonState
						);
						console.log(newRecoilState);
						setRecoilComparisonState(newRecoilState);
					}}
					onClose={() => {
						let newComparisonItems = comparisonService.resortComparisonCardOnClose(
							item,
							recoilComparisonState
						);
						setRecoilComparisonState(newComparisonItems);
					}}
				/>
			);
		});
	}

	return (
		<Box
			className={`rsComparisonDrawer ${recoilComparisonState.length !== 0 ? 'show' : ''}`}
			display={'flex'}
			alignItems={'center'}
		>
			{!!recoilComparisonState && <Box display={'flex'}>{renderComparisonCard()}</Box>}
			<Box marginLeft={'auto'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
				<LinkButton look={'containedPrimary'} label={'Compare Properties'} path={'/compare'} />
				<LabelButton
					look={'none'}
					variant={'button'}
					label={'Clear All'}
					onClick={() => setRecoilComparisonState([])}
				/>
			</Box>
		</Box>
	);
};

export default ComparisonDrawer;
