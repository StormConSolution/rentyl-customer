import React from 'react';
import './UnderConstructionPage.scss';
import { Box, Page } from '@bit/redsky.framework.rs.996';
import { FooterLinks } from '../../components/footer/FooterLinks';
import Footer from '../../components/footer/Footer';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelLink from '../../components/labelLink/LabelLink';

const UnderConstructionPage: React.FC = () => {
	function renderPoints() {
		return (
			<div className={'construction'}>
				<Label variant={'h1'}>Spire Loyalty</Label>
				<LabelLink path={'/'} label={'Home Page'} variant={'h1'} className={'homePage'} />
				<Box
					display={'flex'}
					flexDirection={'column'}
					alignItems={'center'}
					justifyContent={'center'}
					height={'50vh'}
				>
					<img
						src={
							'https://www.cityofharriman.net/media/Backgrounds/360_F_344171869_h3nxznW93zBoOLuMeIJ3Q3xzanFSN8vu.jpg'
						}
						alt={'under construction'}
					/>
				</Box>
			</div>
		);
	}

	return (
		<Page className={'rsUnderConstructionPage'}>
			<div className={'rs-page-content-wrapper'}>
				{renderPoints()}
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default UnderConstructionPage;
