import React from 'react';
import './DestinationSearchPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';

const DestinationSearchPage: React.FC = () => {
	return (
		<Page className={'rsDestinationSearchPage'}>
			<div className={'rs-page-content-wrapper'}>
				<HeroImage
					className={'heroImage'}
					image={require('../../images/destinationResultsPage/momDaughterHero.jpg')}
					height={'200px'}
					mobileHeight={'100px'}
				/>
			</div>
		</Page>
	);
};

export default DestinationSearchPage;
