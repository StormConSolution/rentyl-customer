import { RouteDetails } from '@bit/redsky.framework.rs.996';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import LandingPage from './pages/landingPage/LandingPage';
import SignInPage from './pages/signInPage/SignInPage';
import SignUpPage from './pages/signUpPage/SignUpPage';
import ResetPasswordPage from './pages/resetPasswordPage/ResetPasswordPage';
import ComparisonPage from './pages/comparisonPage/ComparisonPage';
import ReservationAvailabilityPage from './pages/reservationAvailabilityPage/ReservationAvailabilityPage';
import DestinationDetailsPage from './pages/destinationDetailsPage/DestinationDetailsPage';
import AccommodationDetailsPage from './pages/accommodationDetailsPage/AccommodationDetailsPage';
import RewardItemPage from './pages/rewardItemPage/RewardItemPage';
import AccountPersonalInfoPage from './pages/accountPersonalInfoPage/AccountPersonalInfoPage';
import AccountAddressPage from './pages/accountAddressPage/AccountAddressPage';
import AccountPaymentMethodsPage from './pages/accountPaymentMethodsPage/AccountPaymentMethodsPage';
import RewardDetailPage from './pages/rewardDetailPage/RewardDetailPage';
import RewardPurchasePage from './pages/rewardPurchasePage/RewardPurchasePage';
import FeaturesAndBenefitsPage from './pages/featuresAndBenefitsPage/FeaturesAndBenefitsPage';
import AboutSpirePointsPage from './pages/aboutSpirePointsPage/AboutSpirePointsPage';
import AboutSpirePage from './pages/aboutSpirePage/AboutSpirePage';
import AccountPointsPage from './pages/accountPointsPage/AccountPointsPage';
import SuccessPage from './pages/successPage/SuccessPage';
import ExistingItineraryPage from './pages/existingItineraryPage/ExistingItineraryPage';
import ReservationDetailsPage from './pages/reservationDetailsPage/ReservationDetailsPage';
import BookingFlowCheckoutPage from './pages/bookingFlowCheckoutPage/BookingFlowCheckoutPage';
import BookingFlowAddRoomPage from './pages/bookingFlowAddRoomPage/BookingFlowAddRoomPage';
import BookingFlowAddPackagePage from './pages/bookingFlowAddPackagePage/BookingFlowAddPackagePage';
import EditFlowModifyRoomPage from './pages/editFlowModifyRoomPage/EditFlowModifyRoomPage';
import ItineraryDetailsPage from './pages/itineraryDetailsPage/ItineraryDetailsPage';
import EditExistingPackagesPage from './pages/editExistingPackagesPage/EditExistingPackagesPage';
import OrderConfirmationPage from './pages/orderConfirmationPage/OrderConfirmationPage';
import globalState, { getRecoilExternalValue } from './models/globalState';

// const company = getRecoilExternalValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);

const routes: RouteDetails[] = [
	{
		path: '/',
		page: LandingPage,
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
		path: '/password-reset',
		page: ResetPasswordPage,
		routeGuard: verifyRoute
	},
	{
		path: '/reservation/availability',
		page: ReservationAvailabilityPage
	},
	{
		path: '/reservations',
		page: ExistingItineraryPage
	},
	{
		path: '/reservations/edit-room',
		page: EditFlowModifyRoomPage
	},
	{
		path: '/reservations/edit-services',
		page: EditExistingPackagesPage
	},
	{
		path: '/reservations/itinerary/details',
		page: ItineraryDetailsPage
	},
	{
		path: '/reservations/itinerary/reservation/details',
		page: ReservationDetailsPage
	},
	{
		path: '/compare',
		page: ComparisonPage
	},
	{
		path: '/booking',
		page: BookingFlowCheckoutPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/booking/checkout',
		page: BookingFlowCheckoutPage,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/booking/add-room',
		page: BookingFlowAddRoomPage
	},
	{
		path: '/booking/packages',
		page: BookingFlowAddPackagePage
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
		path: '/reward/confirm',
		page: OrderConfirmationPage
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

function verifyRoute() {
	routes.forEach((item) => {
		console.log(item.page);
	});
	if (window.location.hostname.includes('rentyl')) return '/not-found';
	return true;
}

export default routes;
(window as any).routes = routes;
