import { Service } from '../Service';
import rsToasts from '@bit/redsky.framework.toast';
import { RsFormControl } from '@bit/redsky.framework.rs.form';
import { ObjectUtils } from '../../utils/utils';

export default class ComparisonService extends Service {
	addToComparison(recoilState: any, compareItem: Misc.ComparisonCardInfo) {
		const [comparisonItems, setComparisonItems] = recoilState;

		if (comparisonItems.length === 3) throw rsToasts.info('You can only compare three at a time!');
		let newComparisonItem: Misc.ComparisonCardInfo = compareItem;
		if (!ObjectUtils.isArrayWithData(comparisonItems)) {
			newComparisonItem.comparisonId = 1;
		} else {
			const comparisonIds = comparisonItems.map((item: Misc.ComparisonCardInfo) => {
				return item.comparisonId;
			});
			const lastId = Math.max(comparisonIds);
			newComparisonItem.comparisonId = lastId + 1;
		}
		let newArray: Misc.ComparisonCardInfo[] = [...comparisonItems, newComparisonItem];
		setComparisonItems(newArray);
	}

	setSelectedAccommodation(
		comparisonId: number,
		selectedAccommodation: number,
		comparisonItems: Misc.ComparisonCardInfo[]
	): Misc.ComparisonCardInfo[] {
		let modifiedComparisonItems = [...comparisonItems];
		return modifiedComparisonItems.map((element) => {
			if (element.comparisonId === comparisonId) {
				return {
					comparisonId: element.comparisonId,
					destinationId: element.destinationId,
					logo: element.logo,
					roomTypes: element.roomTypes,
					title: element.title,
					selectedRoom: selectedAccommodation
				};
			} else {
				return element;
			}
		});
	}

	resortComparisonCardOnClose(item: Misc.ComparisonCardInfo, comparisonItems: Misc.ComparisonCardInfo[]) {
		let newRecoilState = [...comparisonItems];
		return newRecoilState.filter((remove) => remove !== item);
	}
}
