import { useEffect, useState } from 'react';
import globalState, { clearPersistentState } from '../models/globalState';
import serviceFactory from '../services/serviceFactory';
import UserService from '../services/user/user.service';
import { useRecoilState, useRecoilValue } from 'recoil';

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
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);

	useEffect(() => {
		// Determine if our token is valid or not
		if (loginStatus === LoginStatus.UNKNOWN) return;

		if (!user) {
			setLoginStatus(LoginStatus.LOGGED_OUT);
		} else {
			setLoginStatus(LoginStatus.LOGGED_IN);
			setUserToken(user.token);
		}
	}, [loginStatus, setUserToken, user]);

	useEffect(() => {
		async function initialStartup() {
			if (!userToken) {
				setLoginStatus(LoginStatus.LOGGED_OUT);
				return;
			}

			try {
				await userService.loginUserByToken(userToken);
				setLoginStatus(LoginStatus.LOGGED_IN);
			} catch (e) {
				clearPersistentState();
				setLoginStatus(LoginStatus.LOGGED_OUT);
			}
		}
		initialStartup().catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return loginStatus;
}
