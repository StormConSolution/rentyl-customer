import { useEffect, useState } from 'react';
import globalState, { clearPersistentState } from '../models/globalState';
import serviceFactory from '../services/serviceFactory';
import UserService from '../services/user/user.service';
import { useRecoilState } from 'recoil';
export enum LoginStatus {
	UNKNOWN,
	LOGGED_OUT,
	LOGGED_IN
}

/* Can only be used in App.tsx */
export default function useLoginState() {
	const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.UNKNOWN);
	const [userToken, setUserToken] = useRecoilState<string>(globalState.userToken);
	const userService = serviceFactory.get<UserService>('UserService');
	useEffect(() => {
		let loggedInSubscribeId = userService.subscribeToLoggedIn((user) => {
			setLoginStatus(LoginStatus.LOGGED_IN);
			setUserToken(user.token);
		});

		let loggedOutSubscribeId = userService.subscribeToLoggedOut(() => {
			setLoginStatus(LoginStatus.LOGGED_OUT);
			setUserToken('');
		});

		async function initialStartup() {
			if (!userToken) {
				setLoginStatus(LoginStatus.LOGGED_OUT);
				return;
			}
			try {
				await userService.loginUserByToken(userToken);
			} catch (e) {
				clearPersistentState();
				setLoginStatus(LoginStatus.LOGGED_OUT);
			}
		}

		initialStartup().catch(console.error);

		return () => {
			userService.unsubscribeToLoggedIn(loggedInSubscribeId);
			userService.unsubscribeToLoggedOut(loggedOutSubscribeId);
		};
	}, []);
	return loginStatus;
}
