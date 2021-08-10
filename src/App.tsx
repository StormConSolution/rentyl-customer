import React, { useEffect, useState } from 'react';
import { View } from '@bit/redsky.framework.rs.996';
import './App.scss';
import './icons/siteIcons/style.css';
import './icons/cmsIcons/style.css';

// The following components need to be added to the top level dom since they are full screen overlays
import popupController from '@bit/redsky.framework.rs.996/dist/popupController';
import rsToasts from '@bit/redsky.framework.toast';
import AppBar from './components/appBar/AppBar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useWindowResizeChange from './customHooks/useWindowResizeChange';
import router from './utils/router';
import AccountOverview from './popups/accountOverview/AccountOverview';
import ComparisonDrawer from './popups/comparisonDrawer/ComparisonDrawer';
import useCompanyInfo from './customHooks/useCompanyInfo';
import { useSetCustomToast } from './customHooks/useSetCustomToast';
import { useRecoilValue } from 'recoil';
import globalState from './models/globalState';

function App() {
	const [showAccountOverview, setShowAccountOverview] = useState<boolean>(false);
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	useSetCustomToast();
	const size = useWindowResizeChange();
	const isCompanyLoaded = useCompanyInfo();

	useEffect(() => {
		AOS.init({
			duration: 1000
		});
	}, []);

	useEffect(() => {
		if (!user || !isCompanyLoaded) return;
		router.tryToLoadInitialPath();
	}, [user, isCompanyLoaded]);

	function renderViewsBasedOnLoginStatus() {
		if (!isCompanyLoaded) return <>Loading...</>;
		return !user ? (
			<>
				<AppBar />
				<View key="landingPage" id="landingPage" default initialPath="/" />
				<ComparisonDrawer />
			</>
		) : (
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
				<ComparisonDrawer />
			</>
		);
	}
	return (
		<div className={`App ${size}`}>
			{renderViewsBasedOnLoginStatus()}
			{popupController.instance}
			{rsToasts.instance}
		</div>
	);
}

export default App;
