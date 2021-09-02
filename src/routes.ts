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
import globalState, { getRecoilExternalValue } from './state/globalState';
import DestinationReviewPage from './pages/destinationReviewPage/DestinationReviewPage';
import PrivacyPolicyPage from './pages/privacyPolicyPage/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/termsAndConditionsPage/TermsAndConditionsPage';

export const routes: RouteDetails[] = [
	{
		path: '/',
		page: LandingPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/legal/privacy',
		page: PrivacyPolicyPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/legal/terms-and-conditions',
		page: TermsAndConditionsPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/success',
		page: SuccessPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/signin',
		page: SignInPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/signup',
		page: SignUpPage,
		routeGuard: verifyRoute
	},
	{
		path: '/password-reset',
		page: ResetPasswordPage,
		routeGuard: verifyRoute
	},
	{
		path: '/reservation/availability',
		page: ReservationAvailabilityPage,
		routeGuard: verifyRoute
	},
	{
		path: '/reservations',
		page: ExistingItineraryPage,
		routeGuard: verifyRoute
	},
	{
		path: '/reservations/edit-room',
		page: EditFlowModifyRoomPage,
		routeGuard: verifyRoute
	},
	{
		path: '/reservations/edit-services',
		page: EditExistingPackagesPage,
		routeGuard: verifyRoute
	},
	{
		path: '/reservations/itinerary/details',
		page: ItineraryDetailsPage,
		routeGuard: verifyRoute
	},
	{
		path: '/reservations/itinerary/reservation/details',
		page: ReservationDetailsPage,
		routeGuard: verifyRoute
	},
	{
		path: '/compare',
		page: ComparisonPage,
		routeGuard: verifyRoute
	},
	{
		path: '/booking',
		page: BookingFlowCheckoutPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/booking/checkout',
		page: BookingFlowCheckoutPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/booking/add-room',
		page: BookingFlowAddRoomPage,
		routeGuard: verifyRoute
	},
	{
		path: '/booking/packages',
		page: BookingFlowAddPackagePage,
		routeGuard: verifyRoute
	},
	{
		path: '/reward',
		page: RewardItemPage,
		routeGuard: verifyRoute
	},
	{
		path: '/reward/details',
		page: RewardDetailPage,
		routeGuard: verifyRoute
	},
	{
		path: '/reward/purchase',
		page: RewardPurchasePage,
		routeGuard: verifyRoute
	},
	{
		path: '/reward/confirm',
		page: OrderConfirmationPage,
		routeGuard: verifyRoute
	},
	{
		path: '/destination/details',
		page: DestinationDetailsPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/destination/reviews',
		page: DestinationReviewPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/account/personal-info',
		page: AccountPersonalInfoPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/account/address',
		page: AccountAddressPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/account/points',
		page: AccountPointsPage,
		routeGuard: verifyRoute
	},
	{
		path: '/account/payment-methods',
		page: AccountPaymentMethodsPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/accommodation/details',
		page: AccommodationDetailsPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/about-spire-points',
		page: AboutSpirePointsPage,
		routeGuard: verifyRoute
	},
	{
		path: '/about-spire',
		page: AboutSpirePage,
		routeGuard: verifyRoute
	},
	{
		path: '/features-and-benefits',
		page: FeaturesAndBenefitsPage,
		routeGuard: verifyRoute
	},
	{
		path: '*',
		page: NotFoundPage,
		routeGuard: verifyRoute,
		options: {
			view: 'home'
		}
	}
];

function verifyRoute(path: string): boolean | string {
	const company = getRecoilExternalValue<Api.Company.Res.GetCompanyAndClientVariables | undefined>(
		globalState.company
	);
	if (!company) return true;
	let isUnauthorized = company.unauthorizedPages.find((item) => item.route === path);
	if (!!isUnauthorized) return isUnauthorized.reRoute;
	else return true;
}

export default routes;
(window as any).routes = routes;
