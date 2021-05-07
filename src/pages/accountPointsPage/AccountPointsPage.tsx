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

const AccountPointsPage: React.FC = () => {
	const size = useWindowResizeChange();
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const userPointService = serviceFactory.get<UserPointService>('UserPointService');
	const [pointHistory, setPointHistory] = useState<Api.UserPoint.Res.Get[]>();
	const pointTypeFilters: SelectOptions[] = [
		{ value: 'ACTION', text: 'Action', selected: false },
		{ value: 'CAMPAIGN', text: 'Campaign', selected: false },
		{ value: 'ADMIN', text: 'Admin', selected: false },
		{ value: 'ORDER', text: 'Order', selected: false },
		{ value: 'BOOKING', text: 'Booking', selected: false },
		{ value: 'RENTAL', text: 'Rental', selected: false },
		{ value: 'VACATION', text: 'Vacation', selected: false }
	];

	useEffect(() => {
		async function getUserPoints() {
			try {
				if (user) {
					let res = await userPointService.getPointTransactionsByUserId(user.id);
					console.log('get user point res', res);
					setPointHistory(res);
				}
			} catch (e) {
				rsToasts.error('An unexpected error occurred on the server.');
			}
		}
		getUserPoints().catch(console.error);
	}, [user]);

	function renderPendingPoints() {
		if (!pointHistory) return;
		return pointHistory.map((point, index) => {
			return (
				<Box className={'pointItemContainer pendingPointItemContainer'}>
					<img
						className={'pointImage'}
						src={
							'https://spire-media-public.s3.us-east-2.amazonaws.com/images/media-service-test-image_S.jpg'
						}
						alt={''}
					/>
					<Box className={'pendingPointsDetailsContainer'}>
						<Label variant={'h3'}>Encore Town Home Rental</Label>
						<Label className={'pointType'} variant={'caption'}>
							Rental
						</Label>
						<Label className={'extraInfo'} variant={'body1'}>
							ReservationDates: 3/5/21 - 12/18/21
						</Label>
					</Box>
					<Label className={'date'} variant={'h2'}>
						1/05/22
					</Label>
					<Label className={'points'} variant={'h2'}>
						13,429
					</Label>
				</Box>
			);
		});
	}

	function renderCompletedPoints() {
		if (!pointHistory) return;
		return pointHistory.map((point, index) => {});
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountPointsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'heroImgTitle'}>
					<Label className={'pageTitle'} variant={'h1'}>
						Redeem Your Points
					</Label>
					<Box height={'clamp(191px, 230px, 700px)'}>
						<UserPointStatusBar />
					</Box>
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
							onClick={() => router.navigate('/')}
						/>
						<LabelButton
							look={'containedSecondary'}
							variant={'button'}
							label={'Learn About Points'}
							onClick={() => router.navigate('/about-spire-points')}
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
							onChange={(value) => console.log('multiSelect Value', value)}
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
									Date Received
								</Label>
								<Label className={'pointAmount'} variant={'body1'}>
									Point Amount
								</Label>
							</Box>
							<div className={'pending pointTableContainer'}>{renderPendingPoints()}</div>
						</div>
						<div className={'completedTransactionsContainer'}>
							<Label variant={'h2'}>Completed Transactions</Label>
							<Box className={'completed pointTableHeader'}>
								<Label className={'transactionType'} variant={'body1'}>
									Transaction type
								</Label>
								<Label className={'dateReceived'} variant={'body1'}>
									Date Received
								</Label>
								<Label className={'pointAmount'} variant={'body1'}>
									Point Amount
								</Label>
							</Box>
							<div className={'completed pointTableContainer'}>{renderCompletedPoints()}</div>
						</div>
					</Paper>
					<Footer links={FooterLinkTestData} />
				</div>
			</div>
		</Page>
	);
};

export default AccountPointsPage;
