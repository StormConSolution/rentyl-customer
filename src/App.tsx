import React, { useEffect, useState } from 'react';
import { View } from '@bit/redsky.framework.rs.996';
import './App.scss';
import './icons/siteIcons/style.css';
import './icons/cmsIcons/style.css';

// The following components need to be added to the top level dom since they are full screen overlays
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';
import useLoginState, { LoginStatus } from './customHooks/useLoginState';
import AppBar from './components/appBar/AppBar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useWindowResizeChange from './customHooks/useWindowResizeChange';
import router from './utils/router';
import AccountOverview from './popups/accountOverview/AccountOverview';
import useCompanyInfo from './customHooks/useCompanyInfo';
import { useSetCustomToast } from './customHooks/useSetCustomToast';
import { useUpdateExistingPages } from './customHooks/useUpdateExistingPages';
import { ToastContainer } from '@bit/redsky.framework.rs.toastify';
import Footer from './components/footer/Footer';
import { FooterLinks } from './components/footer/FooterLinks';
import globalState, { setRecoilExternalValue } from './state/globalState';

function App() {
	const [showAccountOverview, setShowAccountOverview] = useState<boolean>(false);

	useSetCustomToast();
	const loginStatus = useLoginState();
	const size = useWindowResizeChange();
	const isCompanyLoaded = useCompanyInfo();
	useUpdateExistingPages();

	useEffect(() => {
		AOS.init({
			duration: 1000
		});
	}, []);

	useEffect(() => {
		let id = router.subscribeToBeforeRouterNavigate(() => {
			let urlPath = window.location.pathname + window.location.search;
			setRecoilExternalValue<string>(globalState.lastNavigationPath, urlPath);
		});
		return () => {
			router.unsubscribeFromBeforeRouterNavigate(id);
		};
	}, []);

	useEffect(() => {
		if (loginStatus === LoginStatus.UNKNOWN || !isCompanyLoaded) return;
		router.tryToLoadInitialPath();
	}, [loginStatus, isCompanyLoaded]);

	function renderViewsBasedOnLoginStatus() {
		if (!isCompanyLoaded) return null;
		switch (loginStatus) {
			case LoginStatus.UNKNOWN:
				return null;
			case LoginStatus.LOGGED_OUT:
				return (
					<>
						<AppBar />
						<View key="landingPage" id="landingPage" default initialPath="/" />
						<Footer links={FooterLinks} />
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
						<Footer links={FooterLinks} />
					</>
				);
		}
	}

	return (
		<div className={`App ${size}`}>
			{renderViewsBasedOnLoginStatus()}
			{popupController.instance}
			<ToastContainer />
		</div>
	);
}

export default App;
