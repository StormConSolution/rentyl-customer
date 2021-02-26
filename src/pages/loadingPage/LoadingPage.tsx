import * as React from 'react';
import './LoadingPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';

const LoadingPage: React.FC = () => {
	return (
		<Page className={'rsLoadingPage'}>
			<div className="boxes">
				<div className="box">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<div className="box">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<div className="box">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<div className="box">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		</Page>
	);
};

export default LoadingPage;
