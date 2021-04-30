import React from 'react';
import './AccountPointsPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import PointsHeaderCard from './pointsHeaderCard/PointsHeaderCard';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';

const AccountPointsPage: React.FC = () => {
	return (
		<Page className={'rsAccountPointsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<div className={'heroImgTitle'}>
					<Label className={'pageTitle'} variant={'h1'}>
						Redeem Your Points
					</Label>
					<PointsHeaderCard
						pointsEarned={'14165'}
						pointsPending={'951'}
						tierToNextLevelAmount={45835}
						nextTierName={'Silver'}
						expPointsAmount={'1,342'}
						expPointsDate={'05/23/2021'}
					/>
				</div>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default AccountPointsPage;
