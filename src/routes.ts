import { RouteDetails } from '@bit/redsky.framework.rs.996';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import LandingPage from './pages/landingPage/LandingPage';
import SignInPage from './pages/signInPage/SignInPage';
import SignUpPage from './pages/signUpPage/SignUpPage';
import ComparisonPage from './pages/comparisonPage/ComparisonPage';
import DestinationDetailsPage from './pages/destinationDetailsPage/DestinationDetailsPage';
import AccommodationDetailsPage from './pages/accommodationDetailsPage/AccommodationDetailsPage';
import ReservationSearchPage from './pages/reservationSearchPage/ReservationSearchPage';

const routes: RouteDetails[] = [
	{
		path: '/',
		page: LandingPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/dashboard',
		page: DashboardPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/signin',
		page: SignInPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/signup',
		page: SignUpPage
	},
	{
		path: '/reservation-search',
		page: ReservationSearchPage
	},
	{
		path: '/compare',
		page: ComparisonPage
	},
	{
		path: '/destination/details',
		page: DestinationDetailsPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/accommodation/details',
		page: AccommodationDetailsPage,
		options: {
			view: 'landingPage'
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
