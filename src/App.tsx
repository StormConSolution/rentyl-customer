import React, { useEffect, useState } from 'react';
import { View } from '@bit/redsky.framework.rs.996';
import './App.scss';
import './icons/siteIcons/style.css';
import './icons/cmsIcons/style.css';

// The following components need to be added to the top level dom since they are full screen overlays
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';
import rsToasts from '@bit/redsky.framework.toast';
import useLoginState, { LoginStatus } from './customHooks/useLoginState';
import CustomToast from './components/customToast/CustomToast';
import AppBar from './components/appBar/AppBar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useWindowResizeChange from './customHooks/useWindowResizeChange';
import router from './utils/router';
import AccountOverview from './popups/accountOverview/AccountOverview';
import ComparisonDrawer from './popups/comparisonDrawer/ComparisonDrawer';

function App() {
	const [showAccountOverview, setShowAccountOverview] = useState<boolean>(false);
	const loginStatus = useLoginState();
	const size = useWindowResizeChange();
	// Code to setup our toast delegates (Will render CustomToast when called)
	useEffect(() => {
		router.tryToLoadInitialPath();
		rsToasts.setRenderDelegate(CustomToast);
		AOS.init({
			duration: 1000
		});
		//remove nav-parent element from the dom
		document.querySelector('.nav-parent')!.remove();
	}, []);

	function renderViewsBasedOnLoginStatus() {
		switch (loginStatus) {
			case LoginStatus.UNKNOWN:
				return null;
			case LoginStatus.LOGGED_OUT:
				return (
					<>
						<AppBar />
						<View key="signIn" id="signIn" default initialPath="/" />
					</>
				);
			case LoginStatus.LOGGED_IN:
				return (
					<>
						<AppBar />
						<View key="landingPage" id="landingPage" default initialPath="/" />
						<AccountOverview
							isOpen={showAccountOverview}
							onToggle={() => {
								setShowAccountOverview(!showAccountOverview);
							}}
							onClose={() => {
								setShowAccountOverview(false);
							}}
						/>
					</>
				);
		}
	}

	return (
		<div className={`App ${size}`}>
			<AppBar />
			<View key="landingPage" id="landingPage" default initialPath="/" />
			{loginStatus === LoginStatus.LOGGED_IN && (
				<AccountOverview
					isOpen={showAccountOverview}
					onToggle={() => {
						setShowAccountOverview(!showAccountOverview);
					}}
					onClose={() => {
						setShowAccountOverview(false);
					}}
				/>
			)}
			<ComparisonDrawer />
			{popupController.instance}
			{rsToasts.instance}
		</div>
	);
}

export default App;
