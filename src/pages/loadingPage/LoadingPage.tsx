import * as React from 'react';
import './LoadingPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import rsToasts from '@bit/redsky.framework.toast';
import { useEffect } from 'react';

const LoadingPage: React.FC = () => {
	useEffect(() => {
		let timerId = setTimeout(() => {
			router.back();
		}, 10000);
		return () => {
			clearTimeout(timerId);
		};
	}, []);

	return (
		<Page className={'rsLoadingPage'}>
			<div className="loader" />
		</Page>
	);
};

export default LoadingPage;
