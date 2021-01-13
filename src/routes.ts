import { RouteDetails } from '@bit/redsky.framework.rs.996';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import LoginPage from './pages/loginPage/LoginPage';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import SearchPage from './pages/searchPage/SearchPage';

const routes: RouteDetails[] = [
	{
		path: '/',
		page: SearchPage,
		options: {
			view: 'home'
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
		path: '/login',
		page: LoginPage,
		options: {
			view: 'search'
		}
	},
	{
		path: '*',
		page: NotFoundPage,
		options: {
			view: 'home'
		}
	}
];

export default routes;
(window as any).routes = routes;
