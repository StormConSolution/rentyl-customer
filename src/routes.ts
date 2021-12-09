import { RouteDetails } from '@bit/redsky.framework.rs.996';
import AccountAddressPage from './pages/accountAddressPage/AccountAddressPage';
import AccountLandingPage from './pages/accountLandingPage/AccountLandingPage';
import AccountPaymentMethodsPage from './pages/accountPaymentMethodsPage/AccountPaymentMethodsPage';
import AccountPersonalInfoPage from './pages/accountPersonalInfoPage/AccountPersonalInfoPage';
import AccountPointsPage from './pages/accountPointsPage/AccountPointsPage';
import BookingFlowAddPackagePage from './pages/bookingFlowAddPackagePage/BookingFlowAddPackagePage';
import CheckoutFlowPage from './pages/checkoutFlowPage/CheckoutFlowPage';
import DestinationDetailsPage from './pages/destinationDetailsPage/DestinationDetailsPage';
import ExistingItineraryPage from './pages/existingItineraryPage/ExistingItineraryPage';
import globalState, { getRecoilExternalValue } from './state/globalState';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import PrivacyPolicyPage from './pages/privacyPolicyPage/PrivacyPolicyPage';
import ResetPasswordPage from './pages/resetPasswordPage/ResetPasswordPage';
import ReservationAvailabilityPage from './pages/reservationAvailabilityPage/ReservationAvailabilityPage';
import ReservationDetailsPage from './pages/reservationDetailsPage/ReservationDetailsPage';
import TermsAndConditionsPage from './pages/termsAndConditionsPage/TermsAndConditionsPage';
import TermsOfUsePage from './pages/termsOfUsePage/TermsOfUsePage';

export const routes: RouteDetails[] = [
	{
		path: '/',
		page: ReservationAvailabilityPage,
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
		path: '/legal/terms-of-use',
		page: TermsOfUsePage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
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
		path: '/reservations/itinerary/reservation/details',
		page: ReservationDetailsPage,
		routeGuard: verifyRoute
	},
	{
		path: '/booking',
		page: CheckoutFlowPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/booking/checkout',
		page: CheckoutFlowPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/booking/checkout/pdf',
		page: CheckoutFlowPage,
		routeGuard: verifyRoute,
		options: {
			view: 'landingPage'
		}
	},
	{
		path: '/booking/packages',
		page: BookingFlowAddPackagePage,
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
		path: '/account',
		page: AccountLandingPage,
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
