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
import serviceFactory from './services/serviceFactory';
import CompanyService from './services/company/company.service';
import globalState, { setRecoilExternalValue } from './models/globalState';

function App() {
	const loginStatus = useLoginState();
	const size = useWindowResizeChange();
	const companyService = serviceFactory.get<CompanyService>('CompanyService');
	const [showAccountOverview, setShowAccountOverview] = useState<boolean>(false);

	// Code to setup our toast delegates (Will render CustomToast when called)
	useEffect(() => {
		rsToasts.setRenderDelegate(CustomToast);
		AOS.init({
			duration: 1000
		});
		async function getCompanyInfo() {
			let res = await companyService.getCompanyDetails();
			setRecoilExternalValue<Api.Company.Res.Get>(globalState.company, res);
		}
		getCompanyInfo().catch(console.error);
	}, []);

	useEffect(() => {
		if (loginStatus === LoginStatus.UNKNOWN) return;
		router.tryToLoadInitialPath();
	}, [loginStatus]);

	function renderViewsBasedOnLoginStatus() {
		switch (loginStatus) {
			case LoginStatus.UNKNOWN:
				return null;
			case LoginStatus.LOGGED_OUT:
				return (
					<>
						<AppBar />
						<View key="landingPage" id="landingPage" default initialPath="/" />
						<ComparisonDrawer />
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
						<ComparisonDrawer />
					</>
				);
		}
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
