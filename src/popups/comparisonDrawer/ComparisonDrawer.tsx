import * as React from 'react';
import './ComparisonDrawer.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import { ObjectUtils } from '../../utils/utils';
import { Box } from '@bit/redsky.framework.rs.996';
import LinkButton from '../../components/linkButton/LinkButton';
import { useEffect, useState } from 'react';
import Icon from '@bit/redsky.framework.rs.icon';

const ComparisonDrawer: React.FC = () => {
	const size = useWindowResizeChange();
	const [recoilComparisonState, setRecoilComparisonState] = useRecoilState<Misc.ComparisonState>(
		globalState.destinationComparison
	);
	const [comparisonItems, setComparisonItems] = useState<Misc.ComparisonCardInfo[]>(recoilComparisonState);

	useEffect(() => {
		setComparisonItems(recoilComparisonState);
	}, [recoilComparisonState]);

	function renderComparisonCard() {
		if (size === 'small') return;
		if (!ObjectUtils.isArrayWithData(comparisonItems) || comparisonItems.length > 3) return;
		return comparisonItems.map((item) => {
			return <ResortComparisonCard key={item.comparisonId} destinationDetails={item} />;
		});
	}

	return (
		<Box className={`rsComparisonDrawer ${recoilComparisonState.length !== 0 || size === 'small' ? 'show' : ''}`}>
			{!!recoilComparisonState && <Box display={'flex'}>{renderComparisonCard()}</Box>}
			<Box className={'comparisonButtons'}>
				<LinkButton look={'containedPrimary'} label={'Compare'} path={'/compare'}>
					<Icon iconImg={'icon-plus'} />
				</LinkButton>
				{comparisonItems.length > 0 && (
					<LabelButton
						look={'none'}
						variant={'button'}
						label={'Clear All'}
						onClick={() => setRecoilComparisonState([])}
					/>
				)}
			</Box>
		</Box>
	);
};

export default ComparisonDrawer;
