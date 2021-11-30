import * as React from 'react';
import './AccountLandingPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import UserBasicInfoPaper from '../../components/userBasicInfoPaper/UserBasicInfoPaper';
import LoadingPage from '../loadingPage/LoadingPage';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import AccountNavigationTile from '../../components/accountNavigationTile/AccountNavigationTile';
import { useEffect } from 'react';
import SubNavMenu from '../../components/subNavMenu/SubNavMenu';

interface MyAccountPageProps {}

const AccountLandingPage: React.FC<MyAccountPageProps> = () => {
	const userService = serviceFactory.get<UserService>('UserService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);

	useEffect(() => {
		let appBar = document.querySelector('.rsAppBar');
		if (!appBar) return;
	}, []);

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountLandingPage'}>
			<div className={'rs-page-content-wrapper'}>
				<SubNavMenu title={'Account'} />
				<UserBasicInfoPaper
					userData={user}
					onLogOut={() => {
						userService.logout();
						router.navigate('/');
					}}
				/>
				<Box className={'accountNavigationTileWrapper'} mt={30}>
					<AccountNavigationTile
						imgSrc={'id'}
						route={'/account/personal-info'}
						title={'Personal Information'}
					/>
					<AccountNavigationTile imgSrc={'house'} route={'/account/address'} title={'My Addresses'} />
					<AccountNavigationTile
						imgSrc={'credit'}
						route={'/account/payment-methods'}
						title={'Payment Methods'}
					/>
					<AccountNavigationTile imgSrc={'medal'} route={'/account/points'} title={'Manage Points'} />
				</Box>
			</div>
		</Page>
	);
};

export default AccountLandingPage;
