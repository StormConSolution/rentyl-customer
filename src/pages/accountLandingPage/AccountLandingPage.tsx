import * as React from 'react';
import './AccountLandingPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import UserBasicInfoPaper from '../../components/userBasicInfoPaper/UserBasicInfoPaper';
import LoadingPage from '../loadingPage/LoadingPage';
import router from '../../utils/router';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';

interface MyAccountPageProps {}

const AccountLandingPage: React.FC<MyAccountPageProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountLandingPage'}>
			<UserBasicInfoPaper
				userData={user}
				onLogOut={() => {
					userService.logout();
					router.navigate('/');
				}}
			/>
			<Footer links={FooterLinks} />
		</Page>
	);
};

export default AccountLandingPage;
