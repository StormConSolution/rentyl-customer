import * as React from 'react';
import './DestinationReviewPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import StarRating from '../../components/starRating/StarRating';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import rsToasts from '@bit/redsky.framework.toast';
import { ObjectUtils, WebUtils } from '../../utils/utils';
import serviceFactory from '../../services/serviceFactory';
import ReviewService from '../../services/review/review.service';
import ReviewCard from '../../components/reviewCard/ReviewCard';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import LoadingPage from '../loadingPage/LoadingPage';
import LabelButton from '../../components/labelButton/LabelButton';
import LinkButton from '../../components/linkButton/LinkButton';

const DestinationReviewPage: React.FC = () => {
	const rewardService = serviceFactory.get<ReviewService>('ReviewService');
	const params = router.getPageUrlParams<{ destinationId: number }>([
		{ key: 'di', default: 0, type: 'integer', alias: 'destinationId' }
	]);
	const [destinationReviews, setDestinationReviews] = useState<Api.Review.Res.ForDestination>();

	useEffect(() => {
		async function getDestinationReviews() {
			try {
				let response = await rewardService.getForDestination(params.destinationId);
				console.log(response);
				setDestinationReviews(response);
			} catch (e) {
				rsToasts.error(WebUtils.getAxiosErrorMessage(e), 'Server Error', 8000);
			}
		}
		getDestinationReviews().catch(console.error);
	}, []);

	function renderReviews() {
		if (!destinationReviews) return;

		return destinationReviews.reviews.map((item, index) => {
			let guestName = `${item.guest.firstName} ${item.guest.lastName}`;
			let packages: string[] = [];

			if (item.packages !== null) {
				packages = item.packages.map((packageName) => {
					return packageName.name;
				});
			}

			return (
				<ReviewCard
					guestName={guestName}
					createdOn={item.createdOn}
					rating={item.rating}
					message={item.message}
					packages={packages}
					accommodationName={item.accommodation.name}
				/>
			);
		});
	}

	return !destinationReviews ? (
		<LoadingPage />
	) : (
		<Page className={'rsDestinationReviewPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					image={destinationReviews.heroUrl}
					height={'300px'}
					mobileHeight={'150px'}
					position={'relative'}
				>
					<div className={'tanBox'} />
				</HeroImage>
				<Box className={'contentWrapper'}>
					<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
						<div>
							<img src={require('../../images/encore-resort.png')} alt={destinationReviews.name} />
							<Label variant={'h1'} margin={'15px 0 10px'}>
								{destinationReviews.name}
							</Label>
							<StarRating size={'medium24px'} rating={destinationReviews.reviewRating} />
						</div>
						<LinkButton
							path={`/destination/details?di=${params.destinationId}`}
							label={'View Destination'}
							onClick={() => {
								router.navigate(`/destination/details?di=${params.destinationId}`).catch(console.error);
							}}
						/>
					</Box>

					<hr />
					{renderReviews()}
				</Box>
				<hr />
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default DestinationReviewPage;
