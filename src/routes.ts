import { RouteDetails } from '@bit/redsky.framework.rs.996';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import LandingPage from './pages/landingPage/LandingPage';
import SignInPage from './pages/signInPage/SignInPage';
import SignUpPage from './pages/signUpPage/SignUpPage';
import ComparisonPage from './pages/comparisonPage/ComparisonPage';
import ReservationAvailabilityPage from './pages/reservationAvailabilityPage/ReservationAvailabilityPage';
import DestinationDetailsPage from './pages/destinationDetailsPage/DestinationDetailsPage';
import AccommodationDetailsPage from './pages/accommodationDetailsPage/AccommodationDetailsPage';
import RewardItemPage from './pages/rewardItemPage/RewardItemPage';
import AccountPersonalInfoPage from './pages/accountPersonalInfoPage/AccountPersonalInfoPage';
import AccountAddressPage from './pages/accountAddressPage/AccountAddressPage';
import AccountPaymentMethodsPage from './pages/accountPaymentMethodsPage/AccountPaymentMethodsPage';
import AccountNotificationPreferences from './pages/accountNotificationPreferences/AccountNotificationPreferences';
import RewardDetailPage from './pages/rewardDetailPage/RewardDetailPage';
import RewardPurchasePage from './pages/rewardPurchasePage/RewardPurchasePage';
import BookingFlowPage from './pages/bookingFlowPage/BookingFlowPage';
import FeaturesAndBenefitsPage from './pages/featuresAndBenefitsPage/FeaturesAndBenefitsPage';
import AboutSpirePointsPage from './pages/aboutSpirePointsPage/AboutSpirePointsPage';
import AboutSpirePage from './pages/aboutSpirePage/AboutSpirePage';
import AccountPointsPage from './pages/accountPointsPage/AccountPointsPage';
import SuccessPage from './pages/successPage/SuccessPage';
import ExistingReservationPage from './pages/existingReservationPage/ExistingReservationPage';
import ReservationDetailsPage from './pages/reservationDetailsPage/ReservationDetailsPage';
import BookFlowPage from './pages/bookingFlowPage/BookFlowPage';

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
		path: '/success',
		page: SuccessPage,
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
		path: '/reservation/availability',
		page: ReservationAvailabilityPage
	},
	{
		path: '/reservations',
		page: ExistingReservationPage
	},
	{
		path: '/reservation/details',
		page: ReservationDetailsPage
	},
	{
		path: '/compare',
		page: ComparisonPage
	},
	{
		path: '/booking',
		page: BookingFlowPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/book',
		page: BookFlowPage
	},
	{
		path: '/reward',
		page: RewardItemPage
	},
	{
		path: '/reward/details',
		page: RewardDetailPage
	},
	{
		path: '/reward/purchase',
		page: RewardPurchasePage
	},
	{
		path: '/destination/details',
		page: DestinationDetailsPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/account/personal-info',
		page: AccountPersonalInfoPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/account/address',
		page: AccountAddressPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/account/points',
		page: AccountPointsPage
	},
	{
		path: '/account/payment-methods',
		page: AccountPaymentMethodsPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/account/notification-preferences',
		page: AccountNotificationPreferences,
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
		path: '/about-spire-points',
		page: AboutSpirePointsPage
	},
	{
		path: '/about-spire',
		page: AboutSpirePage
	},
	{
		path: '/features-and-benefits',
		page: FeaturesAndBenefitsPage
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
