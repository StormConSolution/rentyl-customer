import { RouteDetails } from '@bit/redsky.framework.rs.996';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import LoginPage from './pages/loginPage/LoginPage';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import LoadingPage from './pages/loadingPage/LoadingPage';

const routes: RouteDetails[] = [
	{
		path: '/',
		page: LoginPage,
		options: {
			view: 'login'
		}
	},
	{
		path: '/dashboard',
		page: DashboardPage,
		options: {
			view: 'admin'
		}
	},
	{
		path: '*',
		page: NotFoundPage,
		options: {
			view: 'home'
		}
	},
	{
		path: '/search',
		page: LoadingPage,
		options: {
			view: 'home'
		}
	}
];

export default routes;
(window as any).routes = routes;
