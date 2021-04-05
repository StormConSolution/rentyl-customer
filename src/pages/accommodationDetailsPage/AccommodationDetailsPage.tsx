import * as React from 'react';
import './AccommodationDetailsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
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
import { useRecoilState } from 'recoil';
import globalState, { ComparisonCardInfo } from '../../models/globalState';
import IconFeatureTile from '../../components/iconFeatureTile/IconFeatureTile';
import FloorPlanDetailCard from '../../components/floorPlanDetailCard/FloorPlanDetailCard';
import CategoryFeatureIcons from '../../components/categoryFeatureIcons/CategoryFeatureIcons';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import CategoryImageGallery from '../../components/categoryImageGallery/CategoryImageGallery';
import moment from 'moment';

interface AccommodationDetailsPageProps {}

const AccommodationDetailsPage: React.FC<AccommodationDetailsPageProps> = (props) => {
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const [accommodationDetails, setAccommodationDetails] = useState<Api.Accommodation.Res.Details>();
	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();
	const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
	const [startDateControl, setStartDateControl] = useState<moment.Moment | null>(null);
	const [endDateControl, setEndDateControl] = useState<moment.Moment | null>(null);
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

	function onDatesChange(calendarStartDate: moment.Moment | null, calendarEndDate: moment.Moment | null) {
		setStartDateControl(calendarStartDate);
		setEndDateControl(calendarEndDate);
	}

	function renderFeatureTiles() {
		if (!accommodationDetails) return '';
		let accommodationDetailsFeaturesActive = accommodationDetails.features.filter((item) => {
			return item.isActive;
		});
		return accommodationDetailsFeaturesActive.map((item) => {
			return <IconFeatureTile title={item.title} icon={item.icon} />;
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
			return <CategoryFeatureIcons title={item.title} features={features} />;
		});
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
							onDatesChange={(startDate, endDate) => {
								onDatesChange(startDate, endDate);
							}}
							focusedInput={focusedInput}
							startDate={startDateControl}
							endDate={endDateControl}
							onFocusChange={(focusedInput) => {
								setFocusedInput(focusedInput);
							}}
							compareOnClick={() => {
								comparisonService.addToComparison(recoilComparisonState, {
									destinationId: Date.now(),
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
