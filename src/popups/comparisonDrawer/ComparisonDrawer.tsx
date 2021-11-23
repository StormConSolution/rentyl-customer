import * as React from 'react';
import './ComparisonDrawer.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ResortComparisonCard from '../../components/resortComparisonCard/ResortComparisonCard';
import LabelButton from '../../components/labelButton/LabelButton';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import { ObjectUtils } from '../../utils/utils';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

const ComparisonDrawer: React.FC = () => {
	const size = useWindowResizeChange();
	const [recoilComparisonState, setRecoilComparisonState] = useRecoilState<Misc.ComparisonState>(
		globalState.destinationComparison
	);

	function renderComparisonCard() {
		if (size === 'small') return;
		if (
			!ObjectUtils.isArrayWithData(recoilComparisonState.destinationDetails) ||
			recoilComparisonState.destinationDetails.length > 3
		)
			return;
		return recoilComparisonState.destinationDetails.map((item) => {
			return (
				<ResortComparisonCard
					key={item.destinationId}
					destinationDetails={item}
					handlePinToFirst={(pinToFirst: boolean, comparisonId: number) => {}}
				/>
			);
		});
		return;
	}

	return (
		<Box
			className={`rsComparisonDrawer ${
				size === 'small' || ObjectUtils.isArrayWithData(recoilComparisonState.destinationDetails) ? 'show' : ''
			}`}
		>
			{!!recoilComparisonState && <Box display={'flex'}>{renderComparisonCard()}</Box>}
			<Box className={'comparisonButtons'}>
				<LabelButton
					look={'containedPrimary'}
					variant={'body1'}
					label={'Compare'}
					onClick={() => {
						setRecoilComparisonState((prev) => {
							return {
								destinationDetails: prev.destinationDetails,
								showCompareButton: true
							};
						});
					}}
				>
					{!ObjectUtils.isArrayWithData(recoilComparisonState.destinationDetails) ? (
						<div className={'plusCompareIcon'}>
							<Icon iconImg={'icon-plus'} size={13} color={'#ffffff'} />
						</div>
					) : (
						<Label variant={'caption1'}>{recoilComparisonState.destinationDetails.length}</Label>
					)}
				</LabelButton>
				{ObjectUtils.isArrayWithData(recoilComparisonState.destinationDetails) && size === 'small' && (
					<Button
						className={'clearButton'}
						look={'none'}
						onClick={() => {
							setRecoilComparisonState({ destinationDetails: [], showCompareButton: false });
						}}
					>
						<Icon iconImg={'icon-solid-plus'} color={'#ffffff'} />
					</Button>
				)}
			</Box>
		</Box>
	);
};

export default ComparisonDrawer;
