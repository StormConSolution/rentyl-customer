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
import LoadingPage from '../loadingPage/LoadingPage';
import router from '../../utils/router';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import { ObjectUtils, WebUtils } from '../../utils/utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import ComparisonTable from '../../components/comparisonTable/ComparisonTable';
import DestinationService from '../../services/destination/destination.service';

const ComparisonPage: React.FC = () => {
	const size = useWindowResizeChange();
	const destinationService = serviceFactory.get<DestinationService>('DestinationService');
	const [recoilComparisonState, setRecoilComparisonState] = useRecoilState<Misc.ComparisonState>(
		globalState.destinationComparison
	);
	const [destinationList, setDestinationList] = useState<Api.Destination.Res.Get[]>([]);
	const [waitToLoad, setWaitToLoad] = useState<boolean>(true);

	// useEffect(() => {
	// 	setWaitToLoad(false);
	// 	document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.remove('show');
	// }, []);

	useEffect(() => {
		let id = router.subscribeToBeforeRouterNavigate(() => {
			if (!ObjectUtils.isArrayWithData(recoilComparisonState.destinationDetails))
				document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.remove('show');
			else document.querySelector<HTMLElement>('.rsComparisonDrawer')!.classList.add('show');
		});
		return () => {
			router.unsubscribeFromBeforeRouterNavigate(id);
		};
	}, [recoilComparisonState.destinationDetails]);

	useEffect(() => {
		async function getDestinations() {
			try {
				// for (let destination of recoilComparisonState.destinationDetails) {
				// 	const result = await destinationService.getDestinationDetails(destination.destinationId);
				// 	setDestinationList((prev) => [...prev, result]);
				// }
				// const destinations = await destinationService.getDestinationByIds({
				// 	ids: recoilComparisonState.destinationDetails.map((destination) => destination.destinationId)
				// });
				// setDestinationList(destinations);
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get details for these locations'),
					'Server Error'
				);
			}
		}
		getDestinations().catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recoilComparisonState.destinationDetails]);

	function renderComparisonTable() {
		return <ComparisonTable comparisonState={recoilComparisonState} destinationDetailList={destinationList} />;
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
