import { Service } from '../Service';
import rsToasts from '@bit/redsky.framework.toast';

export default class ComparisonService extends Service {
	addToComparison(recoilState: any, compareItem: Misc.ComparisonCardInfo) {
		const [comparisonItems, setComparisonItems] = recoilState;

		if (comparisonItems.length === 3) throw rsToasts.info('You can only compare three at a time!');

		let newArray: Misc.ComparisonCardInfo[] = [...comparisonItems, compareItem];
		setComparisonItems(newArray);
	}

	setSelectedAccommodation(indexToChange: number, item: string, comparisonItems: Misc.ComparisonCardInfo[]) {
		let modifiedComparisonItems = [...comparisonItems];
		return modifiedComparisonItems.map((element, index) => {
			if (index !== indexToChange) return element;
			let compareSelected: string | number = 0;
			return {
				destinationId: element.destinationId,
				logo: element.logo,
				roomTypes: element.roomTypes.map((value) => {
					if (value.value === item) {
						compareSelected = value.value;
					}
					return {
						text: value.text,
						value: value.value,
						selected: value.value === item
					};
				}),
				title: element.title,
				selectedRoom: compareSelected
			};
		});
	}

	setDefaultAccommodations(comparisonItems: Misc.ComparisonCardInfo[]): Misc.ComparisonCardInfo[] {
		let modifiedComparisonItems = [...comparisonItems];
		return modifiedComparisonItems.map((element) => {
			let selected = false;
			let compareSelected: string | number = 0;
			let modifiedRoomTypes = element.roomTypes.map((value) => {
				if (value.selected) {
					selected = true;
					compareSelected = value.value;
				}
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
				title: element.title,
				selectedRoom: compareSelected
			};
		});
	}

	resortComparisonCardOnClose(item: Misc.ComparisonCardInfo, comparisonItems: Misc.ComparisonCardInfo[]) {
		let newRecoilState = [...comparisonItems];
		return newRecoilState.filter((remove) => remove !== item);
	}
}
