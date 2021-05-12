import * as React from 'react';
import './LoadingPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import rsToasts from '@bit/redsky.framework.toast';

const LoadingPage: React.FC = () => {
	setTimeout(() => {
		rsToasts.error('Request took too long. Navigating back...');
		router.navigate('/').catch(console.error);
	}, 10000);

	return (
		<Page className={'rsLoadingPage'}>
			<div className="loader" />
		</Page>
	);
};

export default LoadingPage;
