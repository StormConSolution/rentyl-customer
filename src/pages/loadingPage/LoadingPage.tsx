import * as React from 'react';
import './LoadingPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';

const LoadingPage: React.FC = () => {
	return (
		<Page className={'rsLoadingPage'}>
			<div className="loader" />
		</Page>
	);
};

export default LoadingPage;
