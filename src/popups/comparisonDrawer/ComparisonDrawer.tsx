import * as React from 'react';
import './ComparisonDrawer.scss';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import { ObjectUtils } from '../../utils/utils';
import { Box } from '@bit/redsky.framework.rs.996';
import LinkButton from '../../components/linkButton/LinkButton';
import { useEffect, useState } from 'react';

const ComparisonDrawer: React.FC = () => {
	const [recoilComparisonState, setRecoilComparisonState] = useRecoilState<Misc.ComparisonCardInfo[]>(
		globalState.destinationComparison
	);
	const [comparisonItems, setComparisonItems] = useState<Misc.ComparisonCardInfo[]>(recoilComparisonState);

	useEffect(() => {
		setComparisonItems(recoilComparisonState);
	}, [recoilComparisonState]);

	function renderComparisonCard() {
		if (!ObjectUtils.isArrayWithData(comparisonItems) || comparisonItems.length > 3) return;
		return comparisonItems.map((item) => {
			return <ResortComparisonCard key={item.comparisonId} destinationDetails={item} />;
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
