import { Service } from '../Service';
import globalState from '../../state/globalState';
import rsToasts from '@bit/redsky.framework.toast';
import { useRecoilState } from 'recoil';

export default class ComparisonService extends Service {
	addToComparison(recoilState: any, compareItem: Misc.ComparisonCardInfo) {
		const [comparisonItems, setComparisonItems] = useRecoilState<Misc.ComparisonCardInfo[]>(
			globalState.destinationComparison
		);

		if (comparisonItems.length === 3) throw rsToasts.info('You can only compare three at a time!');

		let newArray: Misc.ComparisonCardInfo[] = [...comparisonItems, compareItem];
		setComparisonItems(newArray);
	}

	setSelectedAccommodation(indexToChange: number, item: number, comparisonItems: Misc.ComparisonCardInfo[]) {
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
				// selectedRoom: item
			};
		});
	}

	setDefaultAccommodations(comparisonItems: Misc.ComparisonCardInfo[]): Misc.ComparisonCardInfo[] {
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

	resortComparisonCardOnClose(item: Misc.ComparisonCardInfo, comparisonItems: Misc.ComparisonCardInfo[]) {
		let newRecoilState = [...comparisonItems];
		return newRecoilState.filter((remove) => remove !== item);
	}
}
