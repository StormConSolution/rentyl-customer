import React, { useEffect, useState } from 'react';
import { Box, View } from '@bit/redsky.framework.rs.996';
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
import ComparisonDrawer from './popups/comparisonDrawer/ComparisonDrawer';
import useCompanyInfo from './customHooks/useCompanyInfo';
import { useSetCustomToast } from './customHooks/useSetCustomToast';
import { useUpdateExistingPages } from './customHooks/useUpdateExistingPages';
import { ToastContainer } from '@bit/redsky.framework.rs.toastify';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

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
		if (loginStatus === LoginStatus.UNKNOWN || !isCompanyLoaded) return;
		router.tryToLoadInitialPath();
	}, [loginStatus, isCompanyLoaded]);

	function renderViewsBasedOnLoginStatus() {
		if (!isCompanyLoaded) return <>Loading...</>; //TODO: need to adjust for spire vs rental
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
			<ToastContainer />
			<Box padding={'20px'}>
				<Label variant={'h1'}>testing text</Label>
				<Label variant={'h2'}>testing text</Label>
				<Label variant={'h3'}>testing text</Label>
				<Label variant={'h4'}>testing text</Label>
				<Label variant={'h5'}>testing text</Label>
				<Label variant={'body1'}>testing text</Label>
				<Label variant={'body2'}>testing text</Label>
				<Label variant={'body3'}>testing text</Label>
				<Label variant={'body4'}>testing text</Label>
				<Label variant={'italicBold'}>testing text</Label>
				<Label variant={'subtitle1'}>testing text</Label>
				<Label variant={'subtitle2'}>testing text</Label>
				<Label variant={'subtitle3'}>testing text</Label>
				<Label variant={'caption1'}>testing text</Label>
				<Label variant={'caption2'}>testing text</Label>
			</Box>
		</div>
	);
}

export default App;
