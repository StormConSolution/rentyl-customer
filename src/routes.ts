import { RouteDetails } from '@bit/redsky.framework.rs.996';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import LandingPage from './pages/landingPage/LandingPage';
import SignupPage from './pages/signupPage/SignupPage';

const routes: RouteDetails[] = [
	{
		path: '/',
		page: LandingPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/signup',
		page: SignupPage
	},
	{
		path: '/dashboard',
		page: DashboardPage
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
