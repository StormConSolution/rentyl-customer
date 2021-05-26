import * as React from 'react';
import './ReservationDetailsPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import HeroImage from '../../components/heroImage/HeroImage';
import { useEffect, useState } from 'react';
import Paper from '../../components/paper/Paper';
import LabelLink from '../../components/labelLink/LabelLink';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelButton from '../../components/labelButton/LabelButton';
import ReservationInfoCard from '../../components/reservationInfoCard/ReservationInfoCard';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';

interface ReservationDetailsPageProps {}

const ReservationDetailsPage: React.FC<ReservationDetailsPageProps> = (props) => {
	const params = router.getPageUrlParams<{ reservationId: number }>([
		{ key: 'ri', default: 0, type: 'integer', alias: 'reservationId' }
	]);
	const [reservation, setReservation] = useState<any>();

	useEffect(() => {
		async function getReservationData(id: number) {
			try {
			} catch (e) {}
		}
		getReservationData(params.reservationId).catch(console.error);
	}, [params]);

	return (
		<Page className={'rsReservationDetailsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					image={require('../../images/destinationResultsPage/momDaughterHero.jpg')}
					height={'420px'}
					mobileHeight={'420px'}
				>
					<Paper padding={'50px'} width={'536px'} boxShadow>
						<LabelLink path={'/reservations'} label={'< Back to reservations'} variant={'caption'} />
						<Label m={'40px 0 10px 0'} variant={'h2'}>
							Your reservation at *Insert Dest Logo*
						</Label>
						<Label variant={'h1'} mb={20}>
							VIP Suite
						</Label>
						<Box display={'flex'} mb={20}>
							<Box mr={50}>
								<Label variant={'h4'} color={'#cc9e0d'}>
									Check-in
								</Label>
								<Label variant={'h2'}>May 16, 2020</Label>
							</Box>
							<div>
								<Label variant={'h4'} color={'#cc9e0d'}>
									Check-out
								</Label>
								<Label variant={'h2'}>May 22, 2020</Label>
							</div>
						</Box>
						<LabelButton look={'containedPrimary'} variant={'button'} label={'View Destination'} />
					</Paper>
					<div className={'tanBox'} />
				</HeroImage>
				<Box className={'mainSection'}>
					<Box className={'columnOne'}>
						<Label variant={'h1'} mb={30}>
							Reservation Details
						</Label>
						<ReservationInfoCard
							reservationDates={{ startDate: 'May 16, 2020', endDate: 'May 22, 2020' }}
							propertyType={'Villa'}
							sleeps={5}
							amenities={[
								'cms-icon-0419',
								'cms-icon-0417',
								'cms-icon-0475',
								'cms-icon-0455',
								'cms-icon-0426'
							]}
							maxOccupancy={8}
							misc={[
								{ title: 'Reservation Number', data: '2lkx93llskjhh3o' },
								{ title: 'Adults', data: 2 },
								{ title: 'Children', data: 0 }
							]}
						/>
					</Box>
					<Box className={'columnTwo'}>
						<Label variant={'h1'} mb={30}>
							Reservation Cost Summary
						</Label>
						<Paper padding={'25px 40px'} boxShadow></Paper>
					</Box>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default ReservationDetailsPage;
