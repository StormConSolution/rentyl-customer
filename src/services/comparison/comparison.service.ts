import { Service } from '../Service';
import rsToasts from '@bit/redsky.framework.toast';
import { ObjectUtils } from '../../utils/utils';
import globalState, { getRecoilExternalValue, setRecoilExternalValue } from '../../state/globalState';

export default class ComparisonService extends Service {
	addToComparison(destination: Misc.ComparisonCardInfo) {
		let comparisonItems = getRecoilExternalValue<Misc.ComparisonState>(globalState.destinationComparison);
		if (
			ObjectUtils.isArrayWithData(comparisonItems.destinationDetails) &&
			comparisonItems.destinationDetails.length === 3
		)
			throw rsToasts.info('You can only compare three at a time!');
		comparisonItems = {
			destinationDetails: [...(comparisonItems.destinationDetails || []), destination],
			showCompareButton: comparisonItems.showCompareButton
		};
		setRecoilExternalValue<Misc.ComparisonState>(globalState.destinationComparison, comparisonItems);
	}

	removeFromComparison(destinationId: number) {
		let comparisonItems = getRecoilExternalValue<Misc.ComparisonState>(globalState.destinationComparison);
		if (ObjectUtils.isArrayWithData(comparisonItems.destinationDetails)) {
			comparisonItems = {
				destinationDetails: comparisonItems.destinationDetails.filter(
					(destinationDetail) => destinationDetail.destinationId !== destinationId
				),
				showCompareButton: comparisonItems.showCompareButton
			};
		}
		setRecoilExternalValue<Misc.ComparisonState>(globalState.destinationComparison, comparisonItems);
	}
}
