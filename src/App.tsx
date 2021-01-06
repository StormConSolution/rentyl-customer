import React from 'react';
import { View } from '@bit/redsky.framework.rs.996';
import './App.scss';
import './icons/style.css';

// The following components need to be added to the top level dom since they are full screen overlays
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';
import rsToasts from '@bit/redsky.framework.toast';

import Menu from './components/menu/Menu';
import useLoginState, { LoginStatus } from './customHooks/useLoginState';
import { useRecoilValue } from 'recoil';
import globalState, { AvailableThemes } from './models/globalState';
import AppBar from './components/appBar/AppBar';
import Box from './components/box/Box';

function App() {
	const loginStatus = useLoginState();
	const theme = useRecoilValue<AvailableThemes>(globalState.theme);

	function renderViewsBasedOnLoginStatus() {
		switch (loginStatus) {
			case LoginStatus.UNKNOWN:
				return null;
			case LoginStatus.LOGGED_OUT:
				return (
					<>
						<View key="login" id="login" default initialPath="/" />
					</>
				);
			case LoginStatus.LOGGED_IN:
				return (
					<div className="loggedInView">
						<Box>
							<AppBar />
							<View key="admin" id="admin" default initialPath="/dashboard" />
						</Box>
					</div>
				);
		}
	}

	return (
		<div className={`App theme-${theme}`}>
			{renderViewsBasedOnLoginStatus()}
			{popupController.instance}
			{rsToasts.instance}
		</div>
	);
}

export default App;
