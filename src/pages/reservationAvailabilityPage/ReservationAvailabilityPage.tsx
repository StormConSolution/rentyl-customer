import React, { ReactText, useEffect, useState } from 'react';
import './ReservationAvailabilityPage.scss';
import { Box, Page, popupController } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import serviceFactory from '../../services/serviceFactory';
import ComparisonDrawer from '../../popups/comparisonDrawer/ComparisonDrawer';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import globalState from '../../state/globalState';
import { useRecoilValue } from 'recoil';
import { ObjectUtils, WebUtils } from '../../utils/utils';
import FilterReservationPopup, {
	FilterReservationPopupProps
} from '../../popups/filterReservationPopup/FilterReservationPopup';
import DestinationSearchResultCard from '../../components/destinationSearchResultCard/DestinationSearchResultCard';
import DestinationService from '../../services/destination/destination.service';
import ComparisonService from '../../services/comparison/comparison.service';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import TopSearchBar from '../../components/topSearchBar/TopSearchBar';
import FilterBarV2 from '../../components/filterBar/FilterBarV2';
import PaginationViewMore from '../../components/paginationViewMore/PaginationViewMore';
import MobileLightBox, { MobileLightBoxProps } from '../../popups/mobileLightBox/MobileLightBox';
import LightBoxCarouselPopup, {
	TabbedCarouselPopupProps
} from '../../popups/lightBoxCarouselPopup/LightBoxCarouselPopup';

const ReservationAvailabilityPage: React.FC = () => {
	const size = useWindowResizeChange();
	const reservationFilters = useRecoilValue<Misc.ReservationFilters>(globalState.reservationFilters);
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const perPage = 10;
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [availabilityTotal, setAvailabilityTotal] = useState<number>(0);
	const [destinations, setDestinations] = useState<Api.Destination.Res.Availability[]>([]);

	useEffect(() => {
		WebUtils.updateUrlParams(reservationFilters);
		async function getReservations() {
			try {
				popupController.open(SpinningLoaderPopup);
				const searchQueryObj: Misc.ReservationFilters = { ...reservationFilters };
				let key: keyof Misc.ReservationFilters;
				for (key in searchQueryObj) {
					if (searchQueryObj[key] === undefined) delete searchQueryObj[key];
				}
				searchQueryObj.pagination = { page, perPage };
				let res = await destinationService.searchAvailableReservations(searchQueryObj);
				setDestinations(res.data);
				setAvailabilityTotal(res.total || 0);
				setIsLoaded(true);
				popupController.close(SpinningLoaderPopup);
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Cannot find available reservations.'), 'Server Error');
				popupController.close(SpinningLoaderPopup);
			}
		}

		getReservations().catch(console.error);
	}, [reservationFilters]);

	function renderDestinationSearchResultCards() {
		if (!ObjectUtils.isArrayWithData(destinations)) return;
		return destinations.map((destination) => {
			let urls: string[] = getImageUrls(destination);
			return (
				<DestinationSearchResultCard
					key={destination.id}
					destinationObj={destination}
					picturePaths={urls}
					onAddCompareClick={() => {
						comparisonService.addToComparison(destination.id).catch(console.error);
					}}
					onRemoveCompareClick={() => {
						comparisonService.removeFromComparison(destination.id);
					}}
					onGalleryClick={() => {
						if (size === 'small') {
							popupController.open<MobileLightBoxProps>(MobileLightBox, {
								imageData: destination.media
							});
						} else {
							popupController.open<TabbedCarouselPopupProps>(LightBoxCarouselPopup, {
								imageData: destination.media
							});
						}
					}}
				/>
			);
		});
	}

	function getImageUrls(destination: Api.Destination.Res.Availability): string[] {
		if (destination.media) {
			let images = destination.media;
			images.sort((a, b) => {
				return b.isPrimary - a.isPrimary;
			});
			return images.map((urlObj) => {
				return urlObj.urls.imageKit?.toString() || urlObj.urls.thumb;
			});
		}
		return [];
	}

	return (
		<Page className={'rsReservationAvailabilityPage'}>
			<div className={'rs-page-content-wrapper'}>
				<TopSearchBar
					onFilterClick={() =>
						popupController.open<FilterReservationPopupProps>(FilterReservationPopup, {
							className: 'filterPopup'
						})
					}
				/>
				<Box
					className={'filterResultsWrapper'}
					padding={size === 'small' ? '0px 30px 20px 10px' : '20px 20px 20px 20px'}
				>
					{size !== 'small' && (
						<>
							<FilterBarV2 />
						</>
					)}
				</Box>
				{isLoaded && (
					<Box className={'searchResultsWrapper'}>
						{destinations.length <= 0 ? (
							<Label variant={'h2'}>No available options.</Label>
						) : (
							renderDestinationSearchResultCards()
						)}
					</Box>
				)}
				<PaginationViewMore
					selectedRowsPerPage={perPage}
					total={availabilityTotal}
					currentPageNumber={page}
					viewMore={(page) => {
						setPage(page);
					}}
				/>
				<ComparisonDrawer />
			</div>
		</Page>
	);
};

export default ReservationAvailabilityPage;
