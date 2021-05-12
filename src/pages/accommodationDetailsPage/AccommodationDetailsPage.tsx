import * as React from 'react';
import './AccommodationDetailsPage.scss';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import { useEffect, useState } from 'react';
import router from '../../utils/router';
import rsToasts from '@bit/redsky.framework.toast';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import LoadingPage from '../loadingPage/LoadingPage';
import DestinationService from '../../services/destination/destination.service';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import AccommodationInfoCard from '../../components/accommodationInfoCard/AccommodationInfoCard';
import RoomBookNowCard from '../../components/roomBookNowCard/RoomBookNowCard';
import ComparisonService from '../../services/comparison/comparison.service';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalState, { ComparisonCardInfo } from '../../models/globalState';
import IconFeatureTile from '../../components/iconFeatureTile/IconFeatureTile';
import FloorPlanDetailCard from '../../components/floorPlanDetailCard/FloorPlanDetailCard';
import CategoryFeatureIcons from '../../components/categoryFeatureIcons/CategoryFeatureIcons';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import CategoryImageGallery from '../../components/categoryImageGallery/CategoryImageGallery';
import moment from 'moment';
import { formatFilterDateForServer } from '../../utils/utils';
import { animateBackForView } from '@bit/redsky.framework.rs.996/dist/pageAnimation';
import ReservationsService from '../../services/reservations/reservations.service';
import LoginOrCreateAccountPopup, {
	LoginOrCreateAccountPopupProps
} from '../../popups/loginOrCreateAccountPopup/LoginOrCreateAccountPopup';

interface AccommodationDetailsPageProps {}

const AccommodationDetailsPage: React.FC<AccommodationDetailsPageProps> = (props) => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const reservationService = serviceFactory.get<ReservationsService>('ReservationsService');
	const [accommodationDetails, setAccommodationDetails] = useState<Api.Accommodation.Res.Details>();
	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [startDate, setStartDate] = useState<moment.Moment | null>(null);
	const [endDate, setEndDate] = useState<moment.Moment | null>(null);
	const [isValidBookNow, setIsValidBookNow] = useState<boolean>(false);
	const [availabilityObj, setAvailabilityObj] = useState({
		arrivalDate: '',
		departureDate: '',
		adults: 0
	});
	const recoilComparisonState = useRecoilState<ComparisonCardInfo[]>(globalState.destinationComparison);

	const size = useWindowResizeChange();

	const params = router.getPageUrlParams<{ accommodationId: number }>([
		{ key: 'ai', default: 0, type: 'integer', alias: 'accommodationId' }
	]);

	useEffect(() => {
		async function getAccommodationDetails(id: number) {
			try {
				let accommodation = await accommodationService.getAccommodationDetails(id);
				if (accommodation.data.data) {
					setAccommodationDetails(accommodation.data.data);
					let destination = await destinationService.getDestinationDetails(
						accommodation.data.data.destinationId
					);
					if (destination.data.data) setDestinationDetails(destination.data.data);
				}
			} catch (e) {
				rsToasts.error(e.message);
			}
		}
		getAccommodationDetails(params.accommodationId);
	}, []);

	useEffect(() => {
		let isValid =
			!!availabilityObj.arrivalDate.length && !!availabilityObj.departureDate.length && !!availabilityObj.adults;
		setIsValidBookNow(isValid);
	}, [availabilityObj]);

	function updateAvailabilityObj(key: 'arrivalDate' | 'departureDate' | 'adults', value: any) {
		setAvailabilityObj((prev) => {
			let createAvailabilityObj: any = { ...prev };
			createAvailabilityObj[key] = value;
			return createAvailabilityObj;
		});
	}

	function onDatesChange(calendarStartDate: moment.Moment | null, calendarEndDate: moment.Moment | null) {
		setStartDate(calendarStartDate);
		setEndDate(calendarEndDate);
		updateAvailabilityObj('arrivalDate', formatFilterDateForServer(calendarStartDate, 'start'));
		updateAvailabilityObj('departureDate', formatFilterDateForServer(calendarEndDate, 'end'));
	}

	function renderFeatureTiles() {
		if (!accommodationDetails) return '';
		let accommodationDetailsFeaturesActive = accommodationDetails.features.filter((item) => {
			return item.isActive;
		});
		return accommodationDetailsFeaturesActive.map((item) => {
			return <IconFeatureTile key={item.title} title={item.title} icon={item.icon} />;
		});
	}

	function renderCategoryFeatures() {
		if (!accommodationDetails) return '';
		return accommodationDetails.categories.map((item, index) => {
			let features = item.features.map((value) => {
				return {
					title: value.title,
					icon: value.icon
				};
			});
			return <CategoryFeatureIcons key={item.title} title={item.title} features={features} />;
		});
	}

	async function checkIfRoomIsAvailable() {
		if (!accommodationDetails) return;
		let data: any = JSON.stringify({
			...availabilityObj,
			accommodationId: accommodationDetails.id,
			children: 0,
			numberOfAccommodations: 1
		});

		if (!user) {
			popupController.open<LoginOrCreateAccountPopupProps>(LoginOrCreateAccountPopup, {
				query: data
			});
		} else {
			router.navigate(`/booking?data=${data}`).catch(console.error);
		}
	}

	return !accommodationDetails || !destinationDetails ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccommodationDetailsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box className={'sectionOne'} marginBottom={'210px'}>
					<HeroImage image={accommodationDetails.heroUrl} height={'630px'} mobileHeight={'420px'} />
					<Box className={'rsAccommodationInfoCardWrapper'} display={'flex'} alignItems={'flex-end'}>
						<AccommodationInfoCard
							logoImagePath={destinationDetails.logoUrl}
							destinationName={destinationDetails.name}
							width={'536px'}
							height={'371px'}
							accommodationName={accommodationDetails.name}
							accommodationDescription={accommodationDetails.shortDescription}
						/>
						<RoomBookNowCard
							points={2500}
							bookNowDisabled={!isValidBookNow}
							onDatesChange={onDatesChange}
							focusedInput={focusedInput}
							startDate={startDate}
							endDate={endDate}
							onFocusChange={(focusedInput) => {
								setFocusedInput(focusedInput);
							}}
							onGuestChange={(value) => {
								updateAvailabilityObj('adults', +value);
							}}
							compareOnClick={() => {
								comparisonService.addToComparison(recoilComparisonState, {
									destinationId: destinationDetails.id,
									logo: destinationDetails.logoUrl,
									title: destinationDetails.name,
									roomTypes: destinationDetails.accommodationTypes.map((item, index) => {
										return {
											value: item.code,
											text: item.name,
											selected: item.id === accommodationDetails.id
										};
									})
								});
							}}
							bookNowOnClick={() => {
								checkIfRoomIsAvailable().catch(console.error);
							}}
						/>
					</Box>
					<div className={'tanBox'} />
				</Box>
				<Box className={'sectionTwo'} marginBottom={'80px'}>
					<CategoryImageGallery accommodationCategories={accommodationDetails.categories} />
				</Box>
				<Box
					className={'sectionThree'}
					display={'flex'}
					flexWrap={'wrap'}
					justifyContent={'space-evenly'}
					maxWidth={'1084px'}
					margin={'0 auto 110px'}
				>
					{renderFeatureTiles()}
				</Box>
				<Box className={'sectionThree'} marginBottom={'40px'} flexWrap={'wrap'}>
					<FloorPlanDetailCard
						accommodationName={accommodationDetails.name}
						layout={accommodationDetails.layout}
					/>
				</Box>
				{size !== 'small' && (
					<Box
						className={'sectionFour'}
						display={'flex'}
						justifyContent={'center'}
						flexWrap={'wrap'}
						marginBottom={'100px'}
					>
						{renderCategoryFeatures()}
					</Box>
				)}
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default AccommodationDetailsPage;
