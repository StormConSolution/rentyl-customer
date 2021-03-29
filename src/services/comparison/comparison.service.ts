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

	setSelectedAccommodation(indexToChange: number, item: string, comparisonItems: ComparisonCardInfo[]) {
		let modifiedComparisonItems = [...comparisonItems];
		return modifiedComparisonItems.map((element, index) => {
			if (index !== indexToChange) return element;
			return {
				destinationId: element.destinationId,
				logo: element.logo,
				roomTypes: element.roomTypes.map((value) => {
					return {
						text: value.text,
						value: value.value,
						selected: value.value === item
					};
				}),
				title: element.title
			};
		});
	}

	setDefaultAccommodations(comparisonItems: ComparisonCardInfo[]): ComparisonCardInfo[] {
		let modifiedComparisonItems = [...comparisonItems];
		return modifiedComparisonItems.map((element) => {
			let selected = false;
			let modifiedRoomTypes = element.roomTypes.map((value) => {
				if (value.selected) selected = true;
				return {
					text: value.text,
					value: value.value,
					selected: value.selected
				};
			});
			if (!selected) modifiedRoomTypes[0].selected = true;
			return {
				destinationId: element.destinationId,
				logo: element.logo,
				roomTypes: modifiedRoomTypes,
				title: element.title
			};
		});
	}

	resortComparisonCardOnClose(item: ComparisonCardInfo, comparisonItems: ComparisonCardInfo[]) {
		let newRecoilState = [...comparisonItems];
		return newRecoilState.filter((remove) => remove.destinationId !== item.destinationId);
	}
}
