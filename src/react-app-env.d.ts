/// <reference types="react-scripts" />
declare module 'Banner';
declare module 'window';

interface Spreedly {
	reload: () => void;
}

interface Window {
	firstSearch: any;
	firstPath: any;
	utils: any;
	myToasts: any;
	doneLoading: () => {};
	models: any;
	popupController: any;
	codePush: any;
	toasts: any;
	PushNotification: any;
	browserNavigation: any;
	sf: any;
	Spreedly: Spreedly | any;
}

interface packageJson {
	appId: string;
}

declare namespace JSX {
	interface IntrinsicElements {
		rsButton: any;
		div: any;
		Banner: any;
		Button: any;
		label: any;
		button: any;
		img: any;
		span: any;
	}
}
declare module 'Litepicker';
