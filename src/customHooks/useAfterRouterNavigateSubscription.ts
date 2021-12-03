import router from '../utils/router';
import { useEffect } from 'react';
import serviceFactory from '../services/serviceFactory';
import UserService from '../services/user/user.service';

export default function useAfterRouterNavigateSubscription() {
	const userService = serviceFactory.get<UserService>('UserService');
	useEffect(() => {
		router.subscribeToAfterRouterNavigate(async (newPath) => {
			switch (newPath) {
				case '/booking':
				case '/booking/checkout':
				case '/test':
					break;
				default:
					await userService.clearCheckoutUserFromLocalStorage();
					break;
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
