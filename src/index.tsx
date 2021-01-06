import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './routes';
import { Capacitor } from '@capacitor/core';
import { RecoilRoot } from 'recoil';
import { GlobalStateObserver } from './models/globalState';
import router from './utils/router';
import routes from './routes';
import modelFactory from './models/modelFactory';
import serviceFactory from './services/serviceFactory';

if (Capacitor.isNative) {
	window.screen.orientation.lock('portrait');
}

// Load our static routes in during startup
router.loadStaticRoutes(routes);

// Run our factory creation at the start
modelFactory.create(); // Make sure to create model first as services will use it
serviceFactory.create();

ReactDOM.render(
	<RecoilRoot>
		<App />
		<GlobalStateObserver />
	</RecoilRoot>,
	document.getElementById('root')
);

serviceWorker.unregister();
