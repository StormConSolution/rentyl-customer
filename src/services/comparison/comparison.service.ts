import { Service } from '../Service';
import { ComparisonCardInfo } from '../../models/globalState';
import rsToasts from '@bit/redsky.framework.toast';

export default class ComparisonService extends Service {
	addToComparison(recoilState: any, compareItem: ComparisonCardInfo) {
		const [comparisonItems, setComparisonItems] = recoilState;

		if (comparisonItems.length === 3) throw rsToasts.info('You can only compare three at a time!');

		let newArray: ComparisonCardInfo[] = [...comparisonItems, compareItem];
		setComparisonItems(newArray);
	}
}
