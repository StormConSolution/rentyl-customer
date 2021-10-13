import React, { useEffect, useState } from 'react';
import './AccountPointsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import serviceFactory from '../../services/serviceFactory';
import UserPointService from '../../services/userPoint/userPoint.service';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import router from '../../utils/router';
import LoadingPage from '../loadingPage/LoadingPage';
import UserPointStatusBar from '../../components/userPointStatusBar/UserPointStatusBar';
import Paper from '../../components/paper/Paper';
import MultiSelect from '../../components/multiSelect/MultiSelect';
import { FooterLinks } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import globalState from '../../state/globalState';
import { useRecoilValue } from 'recoil';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { DateUtils, StringUtils, WebUtils } from '../../utils/utils';
import HeroImage from '../../components/heroImage/HeroImage';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import LinkButton from '../../components/linkButton/LinkButton';
import Select, { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';

const AccountPointsPage: React.FC = () => {
	const size = useWindowResizeChange();
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const userPointService = serviceFactory.get<UserPointService>('UserPointService');
	const [allPointHistory, setAllPointHistory] = useState<Api.UserPoint.Res.Verbose[]>();
	const [pointHistory, setPointHistory] = useState<Api.UserPoint.Res.Verbose[]>();
	const [filterBy, setFilterBy] = useState<RsFormGroup>(new RsFormGroup([new RsFormControl('filter', '', [])]));
	const pointTypeFilters: OptionType[] = [
		{ value: 'ACTION', label: 'Action' },
		{ value: 'CAMPAIGN', label: 'Campaign' },
		{ value: 'ADMIN', label: 'Admin' },
		{ value: 'ORDER', label: 'Order' },
		{ value: 'BOOKING', label: 'Booking' },
		{ value: 'RENTAL', label: 'Rental' },
		{ value: 'VACATION', label: 'Vacation' },
		{ value: 'VOUCHER', label: 'Voucher' }
	];

	useEffect(() => {
		if (!user) router.navigate('/signup').catch(console.error);
		async function getUserPoints() {
			try {
				if (user) {
					let res = await userPointService.getPointTransactionsByUserId();
					setAllPointHistory(res);
					setPointHistory(res);
				}
			} catch (e) {
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Unable to get paints for user.'), 'Server Error');
			}
		}
		getUserPoints().catch(console.error);
	}, [user]);

	useEffect(() => {
		function renderPointsWithFilter() {
			if (!allPointHistory) return;
			let filter = filterBy.get('filter').value as string[];
			if (filter.length > 0) {
				setPointHistory(allPointHistory.filter((point) => filter.includes(point.pointType)));
			} else {
				setPointHistory(allPointHistory);
			}
		}
		renderPointsWithFilter();
	}, [filterBy]);

	function getMedia(point: Api.UserPoint.Res.Verbose) {
		if (!point.media) return '';
		if (point.media.length === 1) return point.media[0].urls.imageKit;
		for (let i in point.media) {
			if (point.media[i].isPrimary === 1) return point.media[i].urls.imageKit;
		}
		return point.media[0].urls.imageKit;
	}
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
			return (
				<Box key={index} className={'pointItemContainer pendingPointItemContainer'}>
					<img className={'pointImage'} src={getMedia(point)} alt={''} />
					<Box className={'pendingPointsDetailsContainer'}>
						<Label variant={'h3'}>{StringUtils.capitalizeFirst(point.title)}</Label>
						<Label className={'pointType'} variant={'caption'}>
							{point.pointType}
						</Label>
					</Box>
					<Label className={'date'} variant={'h2'}>
						{DateUtils.displayUserDate(point.createdOn)}
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
						<LinkButton look={'containedPrimary'} label={'Purchase Points'} path={'/'} />
						<LinkButton
							look={'containedSecondary'}
							label={'Learn About Points'}
							path={'/about-spire-points'}
						/>
					</Box>
					<Box
						className={'headerAndFilterContainer'}
						display={'flex'}
						justifyContent={'space-between'}
						padding={size === 'small' ? '0 20px' : '0 140px'}
					>
						<Label variant={'h1'}>Your Point History</Label>
						<Select
							isMulti
							control={filterBy.get('filter')}
							updateControl={(control) => setFilterBy(filterBy.clone().update(control))}
							options={pointTypeFilters}
							placeholder={'Search by'}
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
					<Footer links={FooterLinks} />
				</div>
			</div>
		</Page>
	);
};

export default AccountPointsPage;
