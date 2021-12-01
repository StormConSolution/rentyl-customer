import * as React from 'react';
import './AccommodationDetailsPage.scss';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import { useEffect, useState } from 'react';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import LoadingPage from '../loadingPage/LoadingPage';
import DestinationService from '../../services/destination/destination.service';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import AccommodationInfoCard from '../../components/accommodationInfoCard/AccommodationInfoCard';
import RoomBookNowCard from '../../components/roomBookNowCard/RoomBookNowCard';
import ComparisonService from '../../services/comparison/comparison.service';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import IconFeatureTile from '../../components/iconFeatureTile/IconFeatureTile';
import FloorPlanDetailCard from '../../components/floorPlanDetailCard/FloorPlanDetailCard';
import CategoryFeatureIcons from '../../components/categoryFeatureIcons/CategoryFeatureIcons';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import CategoryImageGallery from '../../components/categoryImageGallery/CategoryImageGallery';
import moment from 'moment';
import { DateUtils, formatFilterDateForServer, WebUtils } from '../../utils/utils';
import ReservationsService from '../../services/reservations/reservations.service';
import LoginOrCreateAccountPopup, {
	LoginOrCreateAccountPopupProps
} from '../../popups/loginOrCreateAccountPopup/LoginOrCreateAccountPopup';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import SpinningLoaderPopup from '../../popups/spinningLoaderPopup/SpinningLoaderPopup';

interface AccommodationDetailsPageProps {}

const AccommodationDetailsPage: React.FC<AccommodationDetailsPageProps> = () => {
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const reservationsService = serviceFactory.get<ReservationsService>('ReservationsService');
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ accommodationId: number; startDate?: string; endDate?: string }>([
		{ key: 'ai', default: 0, type: 'integer', alias: 'accommodationId' },
		{ key: 'startDate', default: '', type: 'string', alias: 'startDate' },
		{ key: 'endDate', default: '', type: 'string', alias: 'endDate' }
	]);
	const [available, setAvailable] = useState<boolean>(true);
	const [accommodationDetails, setAccommodationDetails] = useState<Api.Accommodation.Res.Details>();
	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const initialStartDate = params.startDate ? moment(params.startDate) : moment();
	const initialEndDate = params.endDate ? moment(params.endDate) : moment().add(2, 'days');
	const [startDate, setStartDate] = useState<moment.Moment | null>(initialStartDate);
	const [endDate, setEndDate] = useState<moment.Moment | null>(initialEndDate);
	const [availabilityObj, setAvailabilityObj] = useState<{
		arrivalDate: string;
		departureDate: string;
		adults: number;
		rateCode?: string;
	}>({
		arrivalDate: initialStartDate.format('YYYY-MM-DD'),
		departureDate: initialEndDate.format('YYYY-MM-DD'),
		adults: 1
	});

	useEffect(() => {
		async function getAccommodationDetails(id: number) {
			try {
				let accommodation = await accommodationService.getAccommodationDetails(id);
				setAccommodationDetails(accommodation);
				let destination = await destinationService.getDestinationDetails(accommodation.destinationId);
				setDestinationDetails(destination);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Cannot find details, please try again'),
					'Server Error'
				);
			}
		}
		getAccommodationDetails(params.accommodationId);
	}, []);

	useEffect(() => {
		checkAvailability().catch(console.error);
	}, [availabilityObj]);

	async function checkAvailability() {
		if (
			availabilityObj.departureDate === null ||
			availabilityObj.arrivalDate === null ||
			availabilityObj.adults < 1
		)
			return;
		if (!accommodationDetails || !destinationDetails) return false;
		if (accommodationDetails.maxOccupantCount < availabilityObj.adults) {
			setAvailable(false);
			return;
		}
		try {
			popupController.open(SpinningLoaderPopup, { preventCloseByBackgroundClick: true });
			let data: Api.Reservation.Req.Verification = {
				accommodationId: accommodationDetails.id,
				destinationId: destinationDetails.id,
				adultCount: availabilityObj.adults,
				childCount: 0,
				arrivalDate: DateUtils.clientToServerDate(new Date(availabilityObj.arrivalDate)),
				departureDate: DateUtils.clientToServerDate(new Date(availabilityObj.departureDate)),
				numberOfAccommodations: 1
			};
			if (availabilityObj.rateCode) {
				data.rateCode = availabilityObj.rateCode;
			}
			await reservationsService.verifyAvailability(data);
			setAvailable(true);
			popupController.close(SpinningLoaderPopup);
			return true;
		} catch {
			setAvailable(false);
			popupController.closeAll();
			return false;
		}
	}

	function updateAvailabilityObj(key: 'arrivalDate' | 'departureDate' | 'adults' | 'rateCode', value: any) {
		setAvailabilityObj((prev) => {
			let createAvailabilityObj: any = { ...prev };
			if (value === '') delete createAvailabilityObj[key];
			else createAvailabilityObj[key] = value;
			return createAvailabilityObj;
		});
	}

	function onDatesChange(calendarStartDate: moment.Moment | null, calendarEndDate: moment.Moment | null) {
		setStartDate(calendarStartDate);
		setEndDate(calendarEndDate);
		if (calendarStartDate === null || calendarEndDate === null) return;
		setAvailable(true);
		updateAvailabilityObj('arrivalDate', formatFilterDateForServer(calendarStartDate, 'start'));
		updateAvailabilityObj('departureDate', formatFilterDateForServer(calendarEndDate, 'end'));
	}

	function renderFeatureTiles() {
		if (!accommodationDetails) return '';
		return accommodationDetails.amenities.map((item) => {
			return <IconFeatureTile key={item.title} title={item.title} icon={item.icon} />;
		});
	}

	function renderCategoryFeatures() {
		if (!accommodationDetails) return '';
		return accommodationDetails.categories.map((item) => {
			let features = item.features.map((value) => {
				return {
					title: value.title,
					icon: value.icon
				};
			});
			if (!ObjectUtils.isArrayWithData(features)) return [];
			else return <CategoryFeatureIcons key={item.title} title={item.title} features={features} />;
		});
	}

	async function bookNow() {
		if (!accommodationDetails || !destinationDetails) return;
		let data: Misc.StayParams = {
			uuid: Date.now(),
			adults: availabilityObj.adults,
			children: 0,
			accommodationId: accommodationDetails.id,
			arrivalDate: availabilityObj.arrivalDate,
			departureDate: availabilityObj.departureDate,
			packages: [],
			rateCode: ''
		};
		if (availabilityObj.rateCode) data.rateCode = availabilityObj.rateCode;
		const stringedParams: string = JSON.stringify({
			destinationId: destinationDetails.id,
			newRoom: data
		});
		if (!user) {
			popupController.open<LoginOrCreateAccountPopupProps>(LoginOrCreateAccountPopup, {
				query: stringedParams
			});
		} else {
			router.navigate(`/booking/packages?data=${stringedParams}`).catch(console.error);
		}
	}

	return !accommodationDetails || !destinationDetails ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccommodationDetailsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box className={'sectionOne'} marginBottom={size === 'small' ? '450px' : '210px'}>
					<HeroImage image={accommodationDetails.heroUrl} height={'630px'} mobileHeight={'420px'} />
					<Box className={'rsAccommodationInfoCardWrapper'} display={'flex'} alignItems={'flex-end'}>
						<AccommodationInfoCard
							logoImagePath={destinationDetails.logoUrl}
							destinationName={destinationDetails.name}
							width={'536px'}
							height={'371px'}
							accommodationName={accommodationDetails.name}
							accommodationDescription={accommodationDetails.longDescription}
						/>
						<RoomBookNowCard
							points={2500}
							isAvailable={available}
							onDatesChange={onDatesChange}
							focusedInput={focusedInput}
							startDate={startDate}
							endDate={endDate}
							rateCode={availabilityObj.rateCode}
							errorMessage={
								available
									? ''
									: accommodationDetails.maxOccupantCount < availabilityObj.adults
									? 'Max Occupancy Exceeded'
									: 'Invalid Rate Code Or Time Frame'
							}
							onFocusChange={(focusedInput) => {
								setFocusedInput(focusedInput);
							}}
							onGuestChange={(value) => {
								if (
									accommodationDetails?.maxOccupantCount &&
									accommodationDetails.maxOccupantCount < value
								) {
									rsToastify.info(
										`The maximum number of guests is exceeded, this location can have a max occupancy of ${accommodationDetails.maxOccupantCount}.`,
										'Max Occupancy Exceeded',
										{ position: 'top-center' }
									);
								}
								updateAvailabilityObj('adults', +value);
								setAvailable(true);
							}}
							onRateCodeChange={(value) => {
								updateAvailabilityObj('rateCode', value);
								setAvailable(true);
							}}
							guestValue={availabilityObj.adults}
							bookNowOnClick={() => {
								bookNow().catch(console.error);
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
				{ObjectUtils.isArrayWithData(accommodationDetails.layout) && (
					<Box className={'sectionThree'} marginBottom={'40px'} flexWrap={'wrap'}>
						<FloorPlanDetailCard
							accommodationName={accommodationDetails.name}
							layout={accommodationDetails.layout}
						/>
					</Box>
				)}
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
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default AccommodationDetailsPage;
