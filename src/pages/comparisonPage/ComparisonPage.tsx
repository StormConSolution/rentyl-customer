import React, { useEffect, useState } from 'react';
import './ComparisonPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Paper from '../../components/paper/Paper';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import globalState from '../../state/globalState';
import { useRecoilState } from 'recoil';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import LoadingPage from '../loadingPage/LoadingPage';
import router from '../../utils/router';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import { ObjectUtils, WebUtils } from '../../utils/utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import ComparisonTable from '../../components/comparisonTable/ComparisonTable';

const ComparisonPage: React.FC = () => {
	const size = useWindowResizeChange();
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const recoilComparisonState = useRecoilState<Misc.ComparisonCardInfo[]>(globalState.destinationComparison);
	const [comparisonItems, setComparisonItems] = recoilComparisonState;
	const [accommodationDetailList, setAccommodationDetailList] = useState<Api.Accommodation.Res.Details[]>([]);
	const [waitToLoad, setWaitToLoad] = useState<boolean>(true);

	useEffect(() => {
		setComparisonItems(recoilComparisonState[0]);
		setWaitToLoad(false);
		document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.remove('show');
	}, []);

	useEffect(() => {
		let id = router.subscribeToBeforeRouterNavigate(() => {
			if (!ObjectUtils.isArrayWithData(comparisonItems))
				document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.remove('show');
			else document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.add('show');
		});
		return () => {
			router.unsubscribeFromBeforeRouterNavigate(id);
		};
	}, [comparisonItems]);

	useEffect(() => {
		async function getAccommodation() {
			try {
				const accommodationIds = comparisonItems.map((accommodation, index) => {
					if (accommodation.selectedRoom === 0) {
						return accommodation.roomTypes[0].value as number;
					}
					return accommodation.selectedRoom;
				});
				if (accommodationIds) {
					let res = await accommodationService.getManyAccommodationDetails(accommodationIds);
					setAccommodationDetailList(res);
				}
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get details for these locations'),
					'Server Error'
				);
			}
		}
		getAccommodation().catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [comparisonItems]);

	function renderComparisonTable() {
		return <ComparisonTable comparisonItems={comparisonItems} accommodationDetailList={accommodationDetailList} />;
	}

	return waitToLoad ? (
		<LoadingPage />
	) : (
		<Page className={'rsComparisonPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					className={'heroImage'}
					image={require('../../images/destinationResultsPage/momDaughterHero.jpg')}
					height={'200px'}
					mobileHeight={'100px'}
				/>
				<Paper
					className={'formPaper'}
					width={'100%'}
					height={'100%'}
					backgroundColor={'#FFFFFF'}
					padding={size === 'small' ? '5px' : '0'}
				>
					<Label variant={'caption'} onClick={() => router.back()} className={'backNavigation'}>
						{'<'} back to previous page
					</Label>
					{renderComparisonTable()}
				</Paper>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default ComparisonPage;
