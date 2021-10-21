import * as React from 'react';
import './DestinationReviewPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import StarRating from '../../components/starRating/StarRating';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import serviceFactory from '../../services/serviceFactory';
import ReviewService from '../../services/review/review.service';
import ReviewCard from '../../components/reviewCard/ReviewCard';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import LoadingPage from '../loadingPage/LoadingPage';
import LinkButton from '../../components/linkButton/LinkButton';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { ObjectUtils } from '../../utils/utils';

const DestinationReviewPage: React.FC = () => {
	const reviewService = serviceFactory.get<ReviewService>('ReviewService');
	const size = useWindowResizeChange();
	const params = router.getPageUrlParams<{ destinationId: number }>([
		{ key: 'di', default: 0, type: 'integer', alias: 'destinationId' }
	]);
	const [destinationReviews, setDestinationReviews] = useState<Api.Review.Res.ForDestination>();

	useEffect(() => {
		async function getDestinationReviews() {
			try {
				let response = await reviewService.getForDestination(params.destinationId);
				setDestinationReviews(response);
			} catch (e) {
				rsToastify.info("There was an issue getting this destination's reviews", 'Uh Oh!');
			}
		}
		getDestinationReviews().catch(console.error);
	}, []);

	function renderReviews() {
		if (!destinationReviews) return;

		if (!ObjectUtils.isArrayWithData(destinationReviews.reviewRating))
			return <Label variant={'h4'}>No reviews (yet)</Label>;

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
					key={item.id}
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
					{size !== 'small' && <div className={'tanBox'} />}
				</HeroImage>
				<Box className={'contentWrapper'}>
					<Box className={'destinationRatingHeader'}>
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
							look={'containedPrimary'}
						/>
					</Box>
					<Label variant={'h3'} mt={20}>
						Guest Reviews
					</Label>
					<hr />
					{renderReviews()}
				</Box>
				<hr />
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default DestinationReviewPage;
