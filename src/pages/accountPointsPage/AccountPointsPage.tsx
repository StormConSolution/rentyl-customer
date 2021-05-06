import React, { useEffect, useState } from 'react';
import './AccountPointsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
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

const AccountPointsPage: React.FC = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const userPointService = serviceFactory.get<UserPointService>('UserPointService');
	const user = userService.getCurrentUser();
	const [filterBy, setFilterBy] = useState<Model.SelectOptions[]>([
		{ value: 1, text: 'Home Purchase', selected: false },
		{ value: 2, text: 'Rental', selected: false },
		{ value: 3, text: 'Point Redemption', selected: false },
		{ value: 4, text: 'Vacation Stay', selected: false }
	]);
	const [pointHistory, setPointHistory] = useState<Api.UserPoint.Res.Get[]>();

	useEffect(() => {
		async function getUserPoints() {
			try {
				if (user) {
					let res = await userPointService.getPointTransactionsByUserId();
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
		return pointHistory.map((point, index) => {});
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
						padding={'0 140px'}
					>
						<Label variant={'h1'}>Your Point History</Label>
						<MultiSelect
							onChange={(value) => console.log('multiSelect Value', value)}
							options={filterBy}
							showSelectedAsPlaceHolder
						/>
					</Box>
					<Paper className={'pointHistoryContainer'} backgroundColor={'#fbfcf8'} padding={'40px'} boxShadow>
						<div className={'pendingPointsContainer'}>
							<Label variant={'h2'}>Pending Points</Label>
							<Box className={'pending pointTableHeader'} display={'flex'}>
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
							<Box className={'completed pointTableHeader'} display={'flex'}>
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
