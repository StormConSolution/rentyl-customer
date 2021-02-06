import { useEffect, useState } from 'react';
import globalState, { clearPersistentState } from '../models/globalState';
import rsToasts from '@bit/redsky.framework.toast';
import CustomToast from '../components/customToast/CustomToast';
import router from '../utils/router';
import serviceFactory from '../services/serviceFactory';
import UserService from '../services/user/user.service';
import { useRecoilState } from 'recoil';

export enum LoginStatus {
	UNKNOWN,
	LOGGED_OUT,
	LOGGED_IN
}

export default function useLoginState() {
	const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.UNKNOWN);
	const [adminToken, setAdminToken] = useRecoilState<string>(globalState.adminToken);
	const userService = serviceFactory.get<UserService>('UserService');

	useEffect(() => {
		userService.subscribeToLoggedIn((user) => {
			setLoginStatus(LoginStatus.LOGGED_IN);
			setAdminToken(user.token);
		});

		async function initialStartup() {
			if (!adminToken) {
				setLoginStatus(LoginStatus.LOGGED_OUT);
				return;
			}

			try {
				await userService.loginUserByToken(adminToken);
			} catch (e) {
				clearPersistentState();
				setLoginStatus(LoginStatus.LOGGED_OUT);
			}
		}
		initialStartup().catch(console.error);
		rsToasts.setRenderDelegate(CustomToast);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (loginStatus === LoginStatus.UNKNOWN) return;
		router.tryToLoadInitialPath();
	}, [loginStatus]);

	return loginStatus;
}
