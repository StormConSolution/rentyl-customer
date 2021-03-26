import * as React from 'react';
import './DestinationDetailsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import { useEffect, useRef, useState } from 'react';
import router from '../../utils/router';
import rsToasts from '@bit/redsky.framework.toast';
import serviceFactory from '../../services/serviceFactory';
import DestinationService from '../../services/destination/destination.service';
import LoadingPage from '../loadingPage/LoadingPage';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import DestinationInfoCard from '../../components/destinationInfoCard/DestinationInfoCard';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import FeatureRoomCard from '../../components/featureRoomCard/FeatureRoomCard';
import CarouselButtons from '../../components/carouselButtons/CarouselButtons';
import Label from '@bit/redsky.framework.rs.label';
import LabelImage from '../../components/labelImage/LabelImage';
import TabbedImageCarousel from '../../components/tabbedImageCarousel/TabbedImageCarousel';
import { ObjectUtils } from '@bit/redsky.framework.rs.utils';
import Icon from '@bit/redsky.framework.rs.icon';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Carousel from '../../components/carousel/Carousel';

interface DestinationDetailsPageProps {}

const DestinationDetailsPage: React.FC<DestinationDetailsPageProps> = (props) => {
	const parentRef = useRef<HTMLElement>(null);
	const childRef = useRef<HTMLElement>(null);
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const [destinationDetails, setDestinationDetails] = useState<Api.Destination.Res.Details>();

	const size = useWindowResizeChange();

	const params = router.getPageUrlParams<{ destinationId: number }>([
		{ key: 'di', default: 0, type: 'integer', alias: 'destinationId' }
	]);

	useEffect(() => {
		async function getDestinationDetails(id: number) {
			try {
				let response = await destinationService.getDestinationDetails(id);
				if (response.data.data) setDestinationDetails(response.data.data);
			} catch (e) {
				rsToasts.error(e.message);
			}
		}

		getDestinationDetails(params.destinationId);
	}, []);

	useEffect(() => {
		console.log(destinationDetails);
	}, [destinationDetails]);

	let imageIndex = 0;

	function moveImagesRight() {
		if (parentRef.current!.childElementCount - 1 === imageIndex) {
			imageIndex = 0;
		}
		imageIndex++;
		let childWidth = childRef.current!.offsetWidth;
		parentRef.current!.style.transform = `translateX(-${imageIndex * childWidth}px)`;
	}

	function moveImagesLeft() {
		if (imageIndex === 0) imageIndex = parentRef.current!.childElementCount;
		imageIndex--;
		let childWidth = childRef.current!.offsetWidth;
		parentRef.current!.style.transform = `translateX(-${imageIndex * childWidth}px)`;
	}

	function renderFeatures() {
		if (!destinationDetails || !destinationDetails.features) return;
		let featureArray: any = [];
		destinationDetails.features.forEach((item, index) => {
			if (!item.isActive || item.isCarousel) return false;
			let primaryMedia: any = '';
			for (let value of item.media) {
				if (!value.isPrimary) continue;
				primaryMedia = value.urls.large;
				break;
			}
			if (primaryMedia === '') return false;
			featureArray.push(<LabelImage key={item.id} mainImg={primaryMedia} textOnImg={item.title} />);
		});
		return featureArray;
	}

	function renderFeatureCarousel() {
		if (!destinationDetails || !ObjectUtils.isArrayWithData(destinationDetails.features)) return;
		let carouselItems: any = [];
		for (let item of destinationDetails.features) {
			if (!item.isActive || !item.isCarousel) continue;
			let img = item.media.filter((value) => value.isPrimary);
			carouselItems.push({
				name: item.title,
				title: item.title,
				imagePath: ObjectUtils.isArrayWithData(img) ? img[0].urls.large : '',
				description: item.description,
				buttonLabel: 'View Photos'
			});
		}
		return <TabbedImageCarousel tabs={carouselItems} />;
	}

	function renderMapSource() {
		if (!destinationDetails) return;
		let address = `${destinationDetails.address1} ${destinationDetails.city} ${destinationDetails.state} ${destinationDetails.zip}`;
		address = address.replace(/ /g, '+');
		return `https://www.google.com/maps/embed/v1/place?q=${address}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
	}

	return !destinationDetails ? (
		<LoadingPage />
	) : (
		<Page className={'rsDestinationDetailsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box className={'sectionOne'}>
					<HeroImage image={destinationDetails.heroUrl} height={'420px'} mobileHeight={'420px'} />
					<Box className={'headerWrapper'}>
						<Box className={'destinationInfoCardWrapper'}>
							<DestinationInfoCard
								destinationId={destinationDetails.id}
								destinationName={destinationDetails.name}
								destinationImage={destinationDetails.logoUrl}
								address={destinationDetails.address1}
								city={destinationDetails.city}
								state={destinationDetails.state}
								zip={destinationDetails.zip}
								rating={4.5}
								longDescription={destinationDetails.description}
							/>
							{size !== 'small' && (
								<CarouselButtons
									onClickLeft={() => {
										moveImagesLeft();
									}}
									onClickRight={() => {
										moveImagesRight();
									}}
									position={'absolute'}
									bottom={'0'}
									right={'-40px'}
								/>
							)}
						</Box>
						{size !== 'small' ? (
							<Box overflow={'hidden'}>
								<div ref={parentRef} className={'featureSlider'}>
									<div ref={childRef}>
										<FeatureRoomCard
											mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
											title={'8 bedroom villa'}
											discountAmount={150}
											limitedOffer
											bookNowPath={() => {
												console.log('book now');
											}}
										/>
									</div>

									<div>
										<FeatureRoomCard
											mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
											title={'8 bedroom villa'}
											discountAmount={150}
											limitedOffer
											bookNowPath={() => {
												console.log('book now');
											}}
										/>
									</div>
									<div>
										<FeatureRoomCard
											mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
											title={'8 bedroom villa'}
											discountAmount={150}
											limitedOffer
											bookNowPath={() => {
												console.log('book now');
											}}
										/>
									</div>
									<div>
										<FeatureRoomCard
											mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
											title={'8 bedroom villa'}
											discountAmount={150}
											limitedOffer
											bookNowPath={() => {
												console.log('book now');
											}}
										/>
									</div>
									<div>
										<FeatureRoomCard
											mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
											title={'8 bedroom villa'}
											discountAmount={150}
											limitedOffer
											bookNowPath={() => {
												console.log('book now');
											}}
										/>
									</div>
								</div>
							</Box>
						) : (
							<Carousel
								children={[
									<FeatureRoomCard
										mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
										title={'8 bedroom villa'}
										discountAmount={150}
										limitedOffer
										bookNowPath={() => {
											console.log('book now');
										}}
									/>,
									<FeatureRoomCard
										mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
										title={'8 bedroom villa'}
										discountAmount={150}
										limitedOffer
										bookNowPath={() => {
											console.log('book now');
										}}
									/>,
									<FeatureRoomCard
										mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
										title={'8 bedroom villa'}
										discountAmount={150}
										limitedOffer
										bookNowPath={() => {
											console.log('book now');
										}}
									/>,
									<FeatureRoomCard
										mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
										title={'8 bedroom villa'}
										discountAmount={150}
										limitedOffer
										bookNowPath={() => {
											console.log('book now');
										}}
									/>,
									<FeatureRoomCard
										mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
										title={'8 bedroom villa'}
										discountAmount={150}
										limitedOffer
										bookNowPath={() => {
											console.log('book now');
										}}
									/>,
									<FeatureRoomCard
										mainImg={require('../../images/landingPage/Margaritaville-Villa-Stay2x.png')}
										title={'8 bedroom villa'}
										discountAmount={150}
										limitedOffer
										bookNowPath={() => {
											console.log('book now');
										}}
									/>
								]}
							/>
						)}
					</Box>
				</Box>
				<Box className={'sectionTwo'} marginBottom={'160px'}>
					<Label variant={'h1'}>Features</Label>
					<Box display={'flex'} justifyContent={'center'} width={'100%'} flexWrap={'wrap'}>
						{size === 'small' ? <Carousel children={renderFeatures()} /> : renderFeatures()}
					</Box>
				</Box>
				<Box className={'sectionThree'} marginBottom={'190px'}>
					{renderFeatureCarousel()}
					<div className={'yellowSquare'} />
				</Box>
				<Box
					className={'sectionFour'}
					marginBottom={'124px'}
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
					flexWrap={'wrap'}
				>
					<Box width={size === 'small' ? '300px' : '420px'} marginRight={size === 'small' ? '0px' : '100px'}>
						<Label variant={'h1'}>Location</Label>
						<Label variant={'body2'}>
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
							invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
							et justo duo dolores et ea rebum. Stet clita kasd.
						</Label>
						<Label variant={'body2'}>
							<Icon iconImg={'icon-map-solid'} size={12} />
							{destinationDetails.address1} {destinationDetails.city}, {destinationDetails.state}{' '}
							{destinationDetails.zip}
						</Label>
					</Box>
					<Box width={size === 'small' ? '300px' : '570px'} height={size === 'small' ? '300px' : '450px'}>
						<iframe frameBorder="0" src={renderMapSource()}></iframe>
					</Box>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default DestinationDetailsPage;
