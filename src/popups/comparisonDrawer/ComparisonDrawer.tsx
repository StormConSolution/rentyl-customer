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
import router from '../../utils/router';

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
			{size === 'small' ? (
				<Box className={'comparisonButtons'}>
					<LabelButton
						look={'containedPrimary'}
						variant={'body1'}
						label={'Compare'}
						onClick={() => {
							if (
								ObjectUtils.isArrayWithData(recoilComparisonState.destinationDetails) &&
								recoilComparisonState.destinationDetails.length > 1
							) {
								router.navigate('/compare').catch(console.error);
							} else {
								setRecoilComparisonState((prev) => {
									return {
										destinationDetails: prev.destinationDetails,
										showCompareButton: true
									};
								});
							}
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
					{ObjectUtils.isArrayWithData(recoilComparisonState.destinationDetails) &&
						recoilComparisonState.destinationDetails.length > 1 && (
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
			) : (
				recoilComparisonState.destinationDetails.length > 1 && (
					<Button
						look={'containedSecondary'}
						onClick={() => {
							router.navigate('/compare').catch(console.error);
						}}
					>
						Compare resorts
					</Button>
				)
			)}
		</Box>
	);
};

export default ComparisonDrawer;
