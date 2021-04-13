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
import Paper from '../../components/paper/Paper';
import { FakeBookingData } from './fakeBookingData';
import { ObjectUtils, StringUtils } from '@bit/redsky.framework.rs.utils';

interface BookingFlowPageProps {}

const BookingFlowPage: React.FC<BookingFlowPageProps> = (props) => {
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	params.data = JSON.parse(params.data);
	const [accommodation, setAccommodation] = useState<Api.Accommodation.Res.Details>();
	const [fakeData, setFakeData] = useState(FakeBookingData);

	useEffect(() => {
		if (!params) return;
		async function getAccommodationDetails() {
			try {
				let response = await accommodationService.getAccommodationDetails(params.data.accommodationId);
				if (response.data.data) {
					console.log(response.data.data);
					setAccommodation(response.data.data);
				}
			} catch (e) {
				rsToasts.error(e.message);
			}
		}
		getAccommodationDetails().catch(console.error);
	}, []);

	function getRoomTotal() {
		let cost = 0;
		fakeData.costPerNight.forEach((item) => (cost += item.priceCents));
		return StringUtils.formatMoney(cost);
	}

	function getTaxesAndFeesTotal() {
		let cost = 0;
		fakeData.taxAndFees.forEach((item) => {
			cost += item.priceCents;
		});
		return StringUtils.formatMoney(cost);
	}

	function renderItemizedCostPerNight() {
		return fakeData.costPerNight.map((item, index) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={index}>
					<Label variant={'body2'} width={'170px'}>
						{new Date(item.date).toDateString()}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.priceCents)}
					</Label>
				</Box>
			);
		});
	}

	function renderTaxesAndFees() {
		return fakeData.taxAndFees.map((item, index) => {
			return (
				<Box display={'flex'} alignItems={'center'} key={index}>
					<Label variant={'body2'} width={'170px'}>
						{item.title}
					</Label>
					<Label variant={'body2'} marginLeft={'auto'}>
						${StringUtils.formatMoney(item.priceCents)}
					</Label>
				</Box>
			);
		});
	}

	function renderCart() {
		return (
			<Paper width={'410px'} className={'cartDisplay'} borderRadius={'4px'} boxShadow padding={'16px'}>
				<Label variant={'h2'} marginBottom={'10px'}>
					Your Stay
				</Label>
				<Box display={'flex'}>
					<Box marginRight={'50px'}>
						<Label variant={'h4'}>Check-in</Label>
						<Label variant={'body1'}>After {fakeData.checkInTime}</Label>
					</Box>
					<Box>
						<Label variant={'h4'}>Check-out</Label>
						<Label variant={'body1'}>Before {fakeData.checkoutTime}</Label>
					</Box>
				</Box>
				<hr />
				<Box marginBottom={'10px'}>
					<Label variant={'body1'}>
						{new Date(fakeData.checkInDate).toDateString()} -{' '}
						{new Date(fakeData.checkoutDate).toDateString()}
					</Label>
					<Label variant={'body1'}>{fakeData.adults} Adults</Label>
					{fakeData.children && <Label variant={'body1'}>{fakeData.children} Children</Label>}
				</Box>
				<Box display={'flex'} alignItems={'center'}>
					<Label variant={'h4'} width={'170px'}>
						{fakeData.accommodationName}
					</Label>
					<Label variant={'h4'} marginLeft={'auto'}>
						${getRoomTotal()}
					</Label>
				</Box>
				<Accordion titleReact={<Label variant={'body1'}>{fakeData.costPerNight.length} Nights</Label>}>
					{renderItemizedCostPerNight()}
				</Accordion>
				<Box display={'flex'} alignItems={'center'}>
					<Label variant={'h4'} width={'170px'}>
						Taxes and Fees
					</Label>
					<Label variant={'h4'} marginLeft={'auto'}>
						${getTaxesAndFeesTotal()}
					</Label>
				</Box>
				<Accordion titleReact={<Label variant={'body1'}>Details</Label>}>{renderTaxesAndFees()}</Accordion>
			</Paper>
		);
	}

	return (
		<Page className={'rsBookingFlowPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Label marginTop={80} variant={'h1'}>
					Booking
				</Label>
				<hr />
				<Box
					marginBottom={2000}
					padding={'0 25px'}
					boxSizing={'border-box'}
					display={'flex'}
					width={'100%'}
					justifyContent={'space-evenly'}
					alignItems={'flex-start'}
					position={'relative'}
					height={'fit-content'}
				>
					<Accordion
						hideChevron
						className={'packagesAccordion'}
						backgroundColor={'#f0f0f0'}
						hideHoverEffect
						titleReact={<Label variant={'h2'}>Packages</Label>}
					></Accordion>
					{renderCart()}
				</Box>
			</div>
		</Page>
	);
};

export default BookingFlowPage;
