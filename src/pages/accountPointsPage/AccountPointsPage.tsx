import React, { useEffect, useState } from 'react';
import './AccountPointsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserPointService from '../../services/userPoint/userPoint.service';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import router from '../../utils/router';
import rsToasts from '@bit/redsky.framework.toast';
import LoadingPage from '../loadingPage/LoadingPage';
import LabelButton from '../../components/labelButton/LabelButton';
import UserPointStatusBar from '../../components/userPointStatusBar/UserPointStatusBar';
import Paper from '../../components/paper/Paper';
import MultiSelect from '../../components/multiSelect/MultiSelect';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import globalState from '../../models/globalState';
import { useRecoilValue } from 'recoil';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { SelectOptions } from '../../components/Select/Select';
import { capitalize, formatDateForUser } from '../../utils/utils';
import HeroImage from '../../components/heroImage/HeroImage';

const AccountPointsPage: React.FC = () => {
	const size = useWindowResizeChange();
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const userPointService = serviceFactory.get<UserPointService>('UserPointService');
	const [pointHistory, setPointHistory] = useState<Api.UserPoint.Res.Verbose[]>();
	const pointTypeFilters: SelectOptions[] = [
		{ value: 'ACTION', text: 'Action', selected: false },
		{ value: 'CAMPAIGN', text: 'Campaign', selected: false },
		{ value: 'ADMIN', text: 'Admin', selected: false },
		{ value: 'ORDER', text: 'Order', selected: false },
		{ value: 'BOOKING', text: 'Booking', selected: false },
		{ value: 'RENTAL', text: 'Rental', selected: false },
		{ value: 'VACATION', text: 'Vacation', selected: false }
	];
	const [filterBy, setFilterBy] = useState<React.ReactText[]>(['ADMIN', 'ACTION']);

	useEffect(() => {
		async function getUserPoints() {
			try {
				if (user) {
					let res = await userPointService.getPointTransactionsByUserId();
					console.log('res', res);
					setPointHistory(res);
				}
			} catch (e) {
				rsToasts.error('An unexpected error occurred on the server.');
			}
		}
		getUserPoints().catch(console.error);
	}, [user]);

	function getMedia(point: Api.UserPoint.Res.Verbose) {
		if (!point.media) return '';
		if (point.media.length === 1) return point.media[0].urls.small;
		for (let i in point.media) {
			if (point.media[i].isPrimary === 1) return point.media[i].urls.small;
		}
		return point.media[0].urls.small;
	}

	function getPointAmount(point: Api.UserPoint.Res.Verbose) {
		if (point.status === 'PENDING' || point.status === 'RECEIVED') {
			return point.pointAmount;
		} else if (
			point.status === 'REVOKED' ||
			point.status === 'EXPIRED' ||
			point.status === 'CANCELED' ||
			point.status === 'REDEEMED'
		) {
			return `-${point.pointAmount}`;
		} else {
			return '';
		}
	}

	function renderPointsWithFilter() {
		if (!pointHistory) return;
		let allPointHistory = [...pointHistory];
		let filteredPointHistory: Api.UserPoint.Res.Verbose[] = [];

		for (let i in filterBy) {
			let newPointHistory = allPointHistory.filter((point) => point.pointType === filterBy[i]);
			filteredPointHistory = newPointHistory.concat(filteredPointHistory);
		}
		console.log('filteredPointHistory', filteredPointHistory);
	}

	function renderPoints(type: string) {
		if (!pointHistory) return;
		return pointHistory.map((point, index) => {
			if (type === 'pending' && point.status !== 'PENDING') return;
			if (type === 'completed' && point.status === 'PENDING') return;
			return (
				<Box key={index} className={'pointItemContainer pendingPointItemContainer'}>
					<img className={'pointImage'} src={getMedia(point)} alt={''} />
					<Box className={'pendingPointsDetailsContainer'}>
						<Label variant={'h3'}>{capitalize(point.title)}</Label>
						<Label className={'pointType'} variant={'caption'}>
							{point.pointType}
						</Label>
					</Box>
					<Label className={'date'} variant={'h2'}>
						{formatDateForUser(point.createdOn.toString())}
					</Label>
					<Label className={'points'} variant={'h2'}>
						{getPointAmount(point)}
					</Label>
				</Box>
			);
		});
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountPointsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					image={'../../images/pointsPage/PointsPageHero2x.jpg'}
					height={'300px'}
					mobileHeight={'300px'}
					backgroundPosition={'center 78%'}
					position={'relative'}
				>
					<h1>Redeem Your Points</h1>
					<UserPointStatusBar />
				</HeroImage>

				<div className={'heroImgTitle'}>
					<Box
						className={'pointButtonsContainer'}
						display={'flex'}
						justifyContent={'center'}
						marginTop={'40px'}
					>
						<LabelButton
							look={'containedPrimary'}
							variant={'button'}
							label={'Purchase Points'}
							onClick={() => router.navigate('/').catch(console.error)}
						/>
						<LabelButton
							look={'containedSecondary'}
							variant={'button'}
							label={'Learn About Points'}
							onClick={() => router.navigate('/about-spire-points').catch(console.error)}
						/>
					</Box>
					<Box
						className={'headerAndFilterContainer'}
						display={'flex'}
						justifyContent={'space-between'}
						padding={size === 'small' ? '0 20px' : '0 140px'}
					>
						<Label variant={'h1'}>Your Point History</Label>
						<MultiSelect
							placeHolder={'filter by'}
							onChange={(value) => {
								setFilterBy(value);
								renderPointsWithFilter();
								console.log('multiSelect Value', value);
							}}
							options={pointTypeFilters}
							showSelectedAsPlaceHolder
						/>
					</Box>
					<Paper
						className={'pointHistoryContainer'}
						backgroundColor={'#fbfcf8'}
						padding={size === 'small' ? '10px' : '40px'}
						boxShadow
					>
						<div className={'pendingPointsContainer'}>
							<Label variant={'h2'}>Pending Points</Label>
							<Box className={'pending pointTableHeader'}>
								<Label className={'transactionType'} variant={'body1'}>
									Transaction type
								</Label>
								<Label className={'dateReceived'} variant={'body1'}>
									Date
								</Label>
								<Label className={'pointAmount'} variant={'body1'}>
									Point Amount
								</Label>
							</Box>
							<div className={'pending pointTableContainer'}>{renderPoints('pending')}</div>
						</div>
						<div className={'completedTransactionsContainer'}>
							<Label variant={'h2'}>Completed Transactions</Label>
							<Box className={'completed pointTableHeader'}>
								<Label className={'transactionType'} variant={'body1'}>
									Transaction type
								</Label>
								<Label className={'dateReceived'} variant={'body1'}>
									Date
								</Label>
								<Label className={'pointAmount'} variant={'body1'}>
									Point Amount
								</Label>
							</Box>
							<div className={'completed pointTableContainer'}>{renderPoints('completed')}</div>
						</div>
					</Paper>
					<Footer links={FooterLinkTestData} />
				</div>
			</div>
		</Page>
	);
};

export default AccountPointsPage;
