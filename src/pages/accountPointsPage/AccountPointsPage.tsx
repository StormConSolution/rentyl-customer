import React, { useEffect, useState } from 'react';
import './AccountPointsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserPointService from '../../services/userPoint/userPoint.service';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import router from '../../utils/router';
import LoadingPage from '../loadingPage/LoadingPage';
import Paper from '../../components/paper/Paper';
import globalState from '../../state/globalState';
import { useRecoilValue } from 'recoil';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { DateUtils, StringUtils, WebUtils } from '../../utils/utils';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import SubNavMenu from '../../components/subNavMenu/SubNavMenu';
import UserBasicInfoPaper from '../../components/userBasicInfoPaper/UserBasicInfoPaper';
import UserService from '../../services/user/user.service';

const AccountPointsPage: React.FC = () => {
	const size = useWindowResizeChange();
	const userService = serviceFactory.get<UserService>('UserService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const userPointService = serviceFactory.get<UserPointService>('UserPointService');
	const [pointHistory, setPointHistory] = useState<Api.UserPoint.Res.Verbose[]>();

	useEffect(() => {
		if (!user) router.navigate('/signup').catch(console.error);
		async function getUserPoints() {
			try {
				if (user) {
					let res = await userPointService.getPointTransactionsByUserId();
					setPointHistory(res);
				}
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Unable to get paints for user.'), 'Server Error');
			}
		}
		getUserPoints().catch(console.error);
	}, [user]);

	function getPointAmount(point: Api.UserPoint.Res.Verbose) {
		if (point.status === 'PENDING' || point.status === 'RECEIVED' || point.status === 'REFUNDED') {
			return StringUtils.addCommasToNumber(point.pointAmount);
		} else if (
			point.status === 'REVOKED' ||
			point.status === 'EXPIRED' ||
			point.status === 'CANCELED' ||
			point.status === 'REDEEMED'
		) {
			return `-${StringUtils.addCommasToNumber(point.pointAmount)}`;
		} else {
			return '';
		}
	}

	function renderPoints(type: string) {
		if (!pointHistory) return;
		return pointHistory.map((point, index) => {
			if (type === 'pending' && point.status !== 'PENDING') return false;
			if (type === 'completed' && point.status === 'PENDING') return false;
			return size !== 'small' ? (
				<Box key={index} className={'pointItemContainer pendingPointItemContainer'}>
					<Box className={'pendingPointsDetailsContainer'}>
						<Label variant={'subtitle1'}>{StringUtils.capitalizeFirst(point.title.toLowerCase())}</Label>
						<Label
							className={
								point.pointType.toLowerCase() === 'admin'
									? 'pinkChip pointTypeLabel'
									: 'blueChip pointTypeLabel'
							}
							variant={'customTwentyFive'}
						>
							{StringUtils.capitalizeFirst(point.pointType.toLowerCase())}
						</Label>
					</Box>
					<Label className={'date'} variant={'subtitle1'}>
						{DateUtils.formatDate(new Date(point.createdOn), 'MM-DD-YY')}
					</Label>
					<Label className={'points'} variant={'subtitle1'}>
						{getPointAmount(point)}
					</Label>
				</Box>
			) : (
				<Box key={index} className={'pointItemContainer pendingPointItemContainer'}>
					<div className={'pendingPointMobile'}>
						<Label variant={'customTwentySeven'}>Transaction Type</Label>
						<Label className={'pendingPointRight'} variant={'customTwentyEight'}>
							{StringUtils.capitalizeFirst(point.title)}
						</Label>
					</div>
					<div className={'pendingPointMobile'}>
						<Label variant={'customTwentySeven'}>Date</Label>
						<Label className={'pendingPointRight'} variant={'customTwentyEight'}>
							{DateUtils.formatDate(new Date(point.createdOn), 'MM-DD-YY')}
						</Label>
					</div>
					<div className={'pendingPointMobile'}>
						<Label variant={'customTwentySeven'}>Point amount</Label>
						<Label className={'pendingPointRight'} variant={'customTwentyEight'}>
							{getPointAmount(point)}
						</Label>
					</div>
					<div>
						<Label
							className={
								point.pointType.toLowerCase() === 'admin'
									? 'pinkChip pointTypeLabel'
									: 'blueChip pointTypeLabel'
							}
							variant={'customTwentyFive'}
						>
							{StringUtils.capitalizeFirst(point.pointType.toLowerCase())}
						</Label>
					</div>
				</Box>
			);
		});
	}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountPointsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<SubNavMenu title={'Account'} />
				<UserBasicInfoPaper
					userData={user}
					onLogOut={() => {
						userService.logout();
						router.navigate('/');
					}}
				/>

				<Paper
					className={'pointHistoryContainer'}
					backgroundColor={'#ffffff'}
					padding={size === 'small' ? '20px' : '40px'}
					boxShadow
				>
					<div className={'pendingPointsContainer'}>
						<Label
							className={'pendingPointsLabel'}
							variant={size === 'small' ? 'customTwentySix' : 'customTwentyThree'}
						>
							Pending Points
						</Label>
						{size === 'small' && <hr className={'mobilePendingPointsHr'} />}
						<Box className={'pending pointTableHeader'}>
							<Label className={'transactionType'} variant={'customTwentyFour'}>
								Transaction type
							</Label>
							<Label className={'dateReceived'} variant={'customTwentyFour'}>
								Date
							</Label>
							<Label className={'pointAmount'} variant={'customTwentyFour'}>
								Point amount
							</Label>
						</Box>
						<div className={'pending pointTableContainer'}>{renderPoints('pending')}</div>
					</div>
				</Paper>
				<Paper
					className={'pointHistoryContainer'}
					backgroundColor={'#ffffff'}
					padding={size === 'small' ? '10px' : '40px'}
					boxShadow
				>
					<div className={'completedTransactionsContainer'}>
						<Label variant={'h2'}>Completed Transactions</Label>
						{size === 'small' && <hr />}
						<Box className={'completed pointTableHeader'}>
							<Label className={'transactionType'} variant={'body1'}>
								Transaction type
							</Label>
							<Label className={'dateReceived'} variant={'body1'}>
								Date
							</Label>
							<Label className={'pointAmount'} variant={'body1'}>
								Point amount
							</Label>
						</Box>
						<div className={'completed pointTableContainer'}>{renderPoints('completed')}</div>
					</div>
				</Paper>
			</div>
		</Page>
	);
};

export default AccountPointsPage;
