import * as React from 'react';
import './BookingFlowPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import { useEffect, useState } from 'react';
import rsToasts from '@bit/redsky.framework.toast';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Accordion from '@bit/redsky.framework.rs.accordion';

interface BookingFlowPageProps {}

const BookingFlowPage: React.FC<BookingFlowPageProps> = (props) => {
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [accommodation, setAccommodation] = useState<Api.Accommodation.Res.Details>();

	useEffect(() => {
		if (!params) return;
		async function getAccommodationDetails() {
			try {
				let response = await accommodationService.getAccommodationDetails(params.data.accommodationId);
				if (!response.data.data) console.log(response.data.data);
				setAccommodation(response.data.data);
			} catch (e) {
				rsToasts.error(e.message);
			}
		}
		getAccommodationDetails().catch(console.error);
	}, []);

	return (
		<Page className={'rsBookingFlowPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box marginTop={80}>
					<Label variant={'h1'}>Booking</Label>
					<Accordion
						hideChevron
						className={'packagesAccordion'}
						backgroundColor={'#fcfbf8'}
						titleReact={<Label variant={'h2'}>Packages</Label>}
					></Accordion>
				</Box>
			</div>
		</Page>
	);
};

export default BookingFlowPage;
