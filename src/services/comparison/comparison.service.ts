import { Service } from '../Service';
import rsToasts from '@bit/redsky.framework.toast';
import { ObjectUtils } from '../../utils/utils';
import globalState, { getRecoilExternalValue, setRecoilExternalValue } from '../../state/globalState';
import serviceFactory from '../serviceFactory';
import DestinationService from '../destination/destination.service';

export default class ComparisonService extends Service {
	async addToComparison(destinationId: number) {
		let comparisonItems = getRecoilExternalValue<Misc.ComparisonState>(globalState.destinationComparison);
		if (
			ObjectUtils.isArrayWithData(comparisonItems.destinationDetails) &&
			comparisonItems.destinationDetails.length === 3
		)
			throw rsToasts.info('You can only compare three at a time!');
		const destinationService = serviceFactory.get<DestinationService>('DestinationService');
		const details = await destinationService.getDestinationDetails(destinationId);
		comparisonItems = {
			destinationDetails: [
				...(comparisonItems.destinationDetails || []),
				{
					destinationId: details.id,
					accommodationOptions: details.accommodations.map((accommodation) => {
						return { value: accommodation.id, label: accommodation.name };
					}),
					selectedAccommodationId: details.accommodations[0].id,
					logo: details.logoUrl,
					title: details.name
				}
			],
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

	changeAccommodation(accommodationId: number, destinationId: number) {
		let comparisonItems = getRecoilExternalValue<Misc.ComparisonState>(globalState.destinationComparison);
		if (ObjectUtils.isArrayWithData(comparisonItems.destinationDetails)) {
			comparisonItems = ObjectUtils.clone(comparisonItems);
			let destinationDetails = comparisonItems.destinationDetails;
			let indexToChange = destinationDetails.findIndex(
				(destination) => destination.destinationId === destinationId
			);
			if (indexToChange < 0) return;
			destinationDetails[indexToChange].selectedAccommodationId = accommodationId;
			comparisonItems.destinationDetails = destinationDetails;
		}
		setRecoilExternalValue<Misc.ComparisonState>(globalState.destinationComparison, comparisonItems);
	}
}
